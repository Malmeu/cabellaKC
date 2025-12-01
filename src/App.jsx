import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { ClientAuthProvider } from './context/ClientAuthContext'
import ClientLayout from './components/ClientLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import AuthPage from './pages/AuthPage'
import MyOrdersPage from './pages/MyOrdersPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'

function App() {
  return (
    <CartProvider>
      <ClientAuthProvider>
        <AdminAuthProvider>
          <Router>
            <Routes>
              {/* Client Routes - avec ClientLayout */}
              <Route path="/" element={<ClientLayout><HomePage /></ClientLayout>} />
              <Route path="/cart" element={<ClientLayout><CartPage /></ClientLayout>} />
              <Route path="/my-orders" element={<ClientLayout><MyOrdersPage /></ClientLayout>} />
              
              {/* Auth Page - page séparée */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Admin Login - page séparée */}
              <Route path="/admin" element={<AdminLogin />} />
              
              {/* Admin Protected Routes - avec AdminLayout */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>
            </Routes>
          </Router>
        </AdminAuthProvider>
      </ClientAuthProvider>
    </CartProvider>
  )
}

export default App
