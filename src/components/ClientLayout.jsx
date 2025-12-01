import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Home, Package, User, LogOut, ClipboardList } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useClientAuth } from '../context/ClientAuthContext'
import NotificationDropdown from './NotificationDropdown'

export default function ClientLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const { client, isAuthenticated, logout } = useClientAuth()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-800">Cabella KC</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                  isActive('/') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Accueil</span>
              </Link>
              {isAuthenticated && (
                <Link
                  to="/my-orders"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                    isActive('/my-orders') 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Mes commandes</span>
                </Link>
              )}
            </div>

            {/* Right Side - Auth, Notifications, Cart */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <NotificationDropdown />

                  {/* User Menu */}
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-xl">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700 max-w-24 truncate">{client?.name}</span>
                    <button
                      onClick={handleLogout}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Déconnexion"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-1 px-4 py-2 text-slate-600 hover:text-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className={`relative flex items-center space-x-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                  isActive('/cart')
                    ? 'bg-primary text-white'
                    : 'bg-cream text-slate-700 hover:bg-primary hover:text-white'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Panier</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-slate-800 text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-100">
          <div className="flex justify-around py-2">
            <Link
              to="/"
              className={`flex flex-col items-center px-4 py-2 rounded-xl ${
                isActive('/') ? 'text-primary' : 'text-slate-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">Accueil</span>
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-orders"
                className={`flex flex-col items-center px-4 py-2 rounded-xl ${
                  isActive('/my-orders') ? 'text-primary' : 'text-slate-600'
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                <span className="text-xs mt-1">Commandes</span>
              </Link>
            )}
            {!isAuthenticated && (
              <Link
                to="/auth"
                className="flex flex-col items-center px-4 py-2 rounded-xl text-slate-600"
              >
                <User className="w-5 h-5" />
                <span className="text-xs mt-1">Connexion</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-500">
            <p>© 2024 Cabella KC - Meubles de Qualité</p>
            <p className="text-sm mt-2">Fait avec ❤️ pour votre intérieur</p>
            <Link 
              to="/admin" 
              className="inline-block mt-4 text-xs text-slate-400 hover:text-primary transition-colors"
            >
              Espace Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
