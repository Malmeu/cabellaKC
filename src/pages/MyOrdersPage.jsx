import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useClientAuth } from '../context/ClientAuthContext'
import { Package, Clock, Truck, CheckCircle, Loader2, ShoppingBag, Eye, X } from 'lucide-react'

export default function MyOrdersPage() {
  const { client } = useClientAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])

  const statusConfig = {
    pending: {
      label: 'En attente',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
      description: 'Votre commande a été reçue'
    },
    processing: {
      label: 'En préparation',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Package,
      description: 'Nous préparons votre commande'
    },
    ready_for_pickup: {
      label: 'Prêt à retirer',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: Truck,
      description: 'Venez récupérer votre commande en magasin'
    },
    completed: {
      label: 'Terminée',
      color: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: CheckCircle,
      description: 'Commande récupérée'
    }
  }

  useEffect(() => {
    if (client) {
      fetchOrders()
    }
  }, [client])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Erreur:', error)
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
          products (name, price, image_url, category)
        `)
        .eq('order_id', orderId)

      if (error) throw error
      setOrderItems(data || [])
    } catch (error) {
      console.error('Erreur:', error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-3 text-slate-600">Chargement de vos commandes...</span>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Mes Commandes</h1>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => {
            const config = statusConfig[order.status]
            const StatusIcon = config.icon

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${config.color}`}>
                      <StatusIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Commande #{order.id.slice(0, 8)}</p>
                      <p className="font-semibold text-slate-800 mt-1">{formatPrice(order.total_price)}</p>
                      <p className="text-sm text-slate-500 mt-1">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className={`px-4 py-2 rounded-xl border ${config.color}`}>
                      <p className="font-medium text-sm">{config.label}</p>
                      <p className="text-xs opacity-75">{config.description}</p>
                    </div>
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="flex items-center space-x-2 px-4 py-2 bg-cream text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Détails</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    {Object.entries(statusConfig).map(([key, value], index) => {
                      const isActive = Object.keys(statusConfig).indexOf(order.status) >= index
                      const Icon = value.icon
                      return (
                        <div key={key} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-xs mt-1 hidden sm:block ${
                            isActive ? 'text-primary font-medium' : 'text-slate-400'
                          }`}>
                            {value.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: `${((Object.keys(statusConfig).indexOf(order.status) + 1) / 4) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl">
          <div className="w-24 h-24 mx-auto bg-cream rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Aucune commande</h3>
          <p className="text-slate-500 mb-6">Vous n'avez pas encore passé de commande</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            <span>Découvrir nos meubles</span>
          </Link>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Détails de la commande</h2>
                <p className="text-sm text-slate-500">#{selectedOrder.id.slice(0, 8)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Status */}
              <div className="mb-6">
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl ${statusConfig[selectedOrder.status].color}`}>
                  {(() => {
                    const Icon = statusConfig[selectedOrder.status].icon
                    return <Icon className="w-5 h-5" />
                  })()}
                  <span className="font-medium">{statusConfig[selectedOrder.status].label}</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {statusConfig[selectedOrder.status].description}
                </p>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 mb-3">Articles commandés</h3>
                <div className="space-y-3">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-14 h-14 bg-cream rounded-lg overflow-hidden flex-shrink-0">
                        {item.products?.image_url ? (
                          <img
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{item.products?.name}</p>
                        <p className="text-sm text-slate-500">Qté: {item.quantity}</p>
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
              <p className="text-sm text-slate-500 text-center">
                Commande passée le {formatDate(selectedOrder.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
