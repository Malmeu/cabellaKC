import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Loader2, Package, Clock, CheckCircle, Truck, Eye, X } from 'lucide-react'
import Toast from '../../components/Toast'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])

  const statusConfig = {
    pending: {
      label: 'En attente',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
      next: 'processing'
    },
    processing: {
      label: 'En préparation',
      color: 'bg-blue-100 text-blue-800',
      icon: Package,
      next: 'ready_for_pickup'
    },
    ready_for_pickup: {
      label: 'Prêt à retirer',
      color: 'bg-green-100 text-green-800',
      icon: Truck,
      next: 'completed'
    },
    completed: {
      label: 'Terminée',
      color: 'bg-slate-100 text-slate-800',
      icon: CheckCircle,
      next: null
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Erreur:', error)
      setToast({ message: 'Erreur lors du chargement', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderItems = async (orderId) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (name, price, image_url)
        `)
        .eq('order_id', orderId)

      if (error) throw error
      setOrderItems(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const updateOrderStatus = async (order, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id)

      if (error) throw error

      // Créer une notification pour le client
      const notificationMessages = {
        processing: {
          title: 'Commande en préparation',
          message: `Votre commande #${order.id.slice(0, 8)} est en cours de préparation. Nous vous préviendrons quand elle sera prête.`
        },
        ready_for_pickup: {
          title: '🎉 Commande prête !',
          message: `Votre commande #${order.id.slice(0, 8)} est prête ! Venez la récupérer en magasin et procéder au paiement.`
        },
        completed: {
          title: 'Commande terminée',
          message: `Merci pour votre achat ! Votre commande #${order.id.slice(0, 8)} a été récupérée. À bientôt chez Cabella KC !`
        }
      }

      // Envoyer notification si le client est lié
      if (order.client_id && notificationMessages[newStatus]) {
        await supabase
          .from('notifications')
          .insert({
            client_id: order.client_id,
            order_id: order.id,
            title: notificationMessages[newStatus].title,
            message: notificationMessages[newStatus].message
          })
      }

      // Simuler l'envoi d'email quand la commande est prête
      if (newStatus === 'ready_for_pickup') {
        console.log(`📧 Email envoyé à ${order.customer_email}:`)
        console.log(`Bonjour ${order.customer_name}, votre commande est prête !`)
        console.log(`Veuillez venir au magasin pour payer et récupérer votre commande.`)
        
        setToast({
          message: `Notification envoyée à ${order.customer_name} - Commande prête !`,
          type: 'success'
        })
      } else {
        setToast({
          message: 'Statut mis à jour et client notifié',
          type: 'success'
        })
      }

      fetchOrders()
    } catch (error) {
      console.error('Erreur:', error)
      setToast({ message: 'Erreur lors de la mise à jour', type: 'error' })
    }
  }

  const openOrderDetails = async (order) => {
    setSelectedOrder(order)
    await fetchOrderItems(order.id)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Grouper les commandes par statut pour la vue Kanban
  const ordersByStatus = {
    pending: orders.filter(o => o.status === 'pending'),
    processing: orders.filter(o => o.status === 'processing'),
    ready_for_pickup: orders.filter(o => o.status === 'ready_for_pickup'),
    completed: orders.filter(o => o.status === 'completed')
  }

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Gestion des Commandes</h1>
        <p className="text-slate-500 mt-1">{orders.length} commandes au total</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : orders.length > 0 ? (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(ordersByStatus).map(([status, statusOrders]) => {
            const config = statusConfig[status]
            const StatusIcon = config.icon

            return (
              <div key={status} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <StatusIcon className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-800">{config.label}</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {statusOrders.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {statusOrders.map(order => (
                    <div
                      key={order.id}
                      className="bg-background rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openOrderDetails(order)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-slate-800">{order.customer_name}</p>
                          <p className="text-xs text-slate-500">{order.customer_email}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">{formatDate(order.created_at)}</span>
                        <span className="font-semibold text-primary">{formatPrice(order.total_price)}</span>
                      </div>

                      {config.next && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateOrderStatus(order, config.next)
                          }}
                          className="w-full mt-3 py-2 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary hover:text-white transition-colors"
                        >
                          → {statusConfig[config.next].label}
                        </button>
                      )}
                    </div>
                  ))}

                  {statusOrders.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      Aucune commande
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl">
          <div className="w-24 h-24 mx-auto bg-cream rounded-full flex items-center justify-center mb-4">
            <Package className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Aucune commande</h3>
          <p className="text-slate-500">Les commandes apparaîtront ici</p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-slate-800">
                Détails de la commande
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Client Info */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Client</h3>
                <p className="font-semibold text-slate-800">{selectedOrder.customer_name}</p>
                <p className="text-slate-600">{selectedOrder.customer_email}</p>
              </div>

              {/* Status */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Statut</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${statusConfig[selectedOrder.status].color}`}>
                  {statusConfig[selectedOrder.status].label}
                </span>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 mb-2">Articles</h3>
                <div className="space-y-2">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-cream rounded-lg overflow-hidden">
                          {item.products?.image_url ? (
                            <img
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm">📦</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{item.products?.name}</p>
                          <p className="text-sm text-slate-500">Qté: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-800">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl mb-6">
                <span className="font-semibold text-slate-800">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(selectedOrder.total_price)}</span>
              </div>

              {/* Date */}
              <div className="text-sm text-slate-500 text-center">
                Commande passée le {formatDate(selectedOrder.created_at)}
              </div>

              {/* Action Button */}
              {statusConfig[selectedOrder.status].next && (
                <button
                  onClick={() => {
                    updateOrderStatus(selectedOrder, statusConfig[selectedOrder.status].next)
                    setSelectedOrder(null)
                  }}
                  className="w-full mt-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Passer à : {statusConfig[statusConfig[selectedOrder.status].next].label}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
