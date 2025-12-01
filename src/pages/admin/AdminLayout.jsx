import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { Package, ShoppingBag, LayoutDashboard, LogOut, Store } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAdminAuth()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/admin/dashboard', label: 'Produits', icon: Package },
    { path: '/admin/orders', label: 'Commandes', icon: ShoppingBag }
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">Cabella KC Admin</h1>
                <p className="text-xs text-slate-400">Tableau de bord</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                className="flex items-center space-x-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
              >
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Voir la boutique</span>
              </a>
              <div className="h-6 w-px bg-slate-700"></div>
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{admin?.name}</p>
                  <p className="text-xs text-slate-400">{admin?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  )
}
