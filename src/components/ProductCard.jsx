import { ShoppingCart, Eye } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [showDetails, setShowDetails] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 bg-cream overflow-hidden">
          {product.image_url && !imageError ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-secondary/30 rounded-2xl flex items-center justify-center mb-2">
                  📦
                </div>
                <span className="text-sm">Image non disponible</span>
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 rounded-full">
            {product.category}
          </span>

          {/* Quick View Button */}
          <button
            onClick={() => setShowDetails(true)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-white"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-slate-800 mb-1 truncate">{product.name}</h3>
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors duration-300"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">Ajouter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Details */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetails(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Image */}
            <div className="h-64 bg-cream">
              {product.image_url && !imageError ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <div className="text-6xl">📦</div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="px-3 py-1 bg-secondary/30 text-xs font-medium text-slate-700 rounded-full">
                    {product.category}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800 mt-2">{product.name}</h2>
                </div>
                <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
              </div>

              <p className="text-slate-600 mb-6">{product.description}</p>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleAddToCart()
                    setShowDetails(false)
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors duration-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Ajouter au panier</span>
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-3 bg-cream text-slate-700 rounded-xl hover:bg-slate-200 transition-colors duration-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
