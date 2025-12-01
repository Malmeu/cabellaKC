import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useClientAuth } from '../context/ClientAuthContext'
import { supabase } from '../lib/supabaseClient'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2, User } from 'lucide-react'
import Toast from '../components/Toast'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const { client, isAuthenticated } = useClientAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const handleSubmitOrder = async () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/cart' } })
      return
    }

    setLoading(true)

    try {
      // Créer la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          client_id: client.id,
          customer_name: client.name,
          customer_email: client.email,
          status: 'pending',
          total_price: cartTotal
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Créer les items de la commande
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Créer une notification pour le client
      await supabase
        .from('notifications')
        .insert({
          client_id: client.id,
          order_id: order.id,
          title: 'Commande confirmée',
          message: `Votre commande #${order.id.slice(0, 8)} d'un montant de ${formatPrice(cartTotal)} a été reçue. Nous vous tiendrons informé de son avancement.`
        })

      // Simuler l'envoi d'email
      console.log(`📧 Email envoyé à ${client.email}:`)
      console.log(`Bonjour ${client.name}, votre commande #${order.id} a été reçue!`)
      console.log(`Total: ${formatPrice(cartTotal)}`)

      // Vider le panier et afficher le toast
      clearCart()
      setToast({
        message: 'Commande confirmée ! Suivez son état dans "Mes commandes".',
        type: 'success'
      })

      // Rediriger vers mes commandes après 2 secondes
      setTimeout(() => {
        navigate('/my-orders')
      }, 2000)

    } catch (error) {
      console.error('Erreur lors de la commande:', error)
      setToast({
        message: 'Erreur lors de la commande. Veuillez réessayer.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto bg-cream rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">Votre panier est vide</h2>
        <p className="text-slate-500 mb-6">Découvrez notre collection de meubles</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Continuer mes achats</span>
        </Link>
      </div>
    )
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

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Mon Panier</h1>
        <Link
          to="/"
          className="flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Continuer mes achats</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center space-x-4">
              {/* Image */}
              <div className="w-24 h-24 bg-cream rounded-xl overflow-hidden flex-shrink-0">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.category}</p>
                <p className="text-primary font-semibold mt-1">{formatPrice(item.price)}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2 bg-cream rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 bg-cream rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Récapitulatif</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Livraison</span>
                <span className="text-green-600">Gratuite</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-slate-800">
                <span>Total</span>
                <span className="text-primary">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {isAuthenticated ? (
              <>
                {/* Info client connecté */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">{client?.name}</p>
                      <p className="text-sm text-green-600">{client?.email}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Traitement...</span>
                    </>
                  ) : (
                    <span>Confirmer la commande</span>
                  )}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-amber-800 text-sm">
                    Connectez-vous pour finaliser votre commande et suivre son état.
                  </p>
                </div>
                <Link
                  to="/auth"
                  state={{ from: '/cart' }}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>Se connecter pour commander</span>
                </Link>
                <p className="text-center text-sm text-slate-500">
                  Pas encore de compte ?{' '}
                  <Link to="/auth" state={{ from: '/cart' }} className="text-primary hover:underline">
                    Inscrivez-vous
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
