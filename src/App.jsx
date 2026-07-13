import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ProviderRegister from './pages/ProviderRegister.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import Services from './pages/Services.jsx'
import ServiceDetails from './pages/ServiceDetails.jsx'
import Booking from './pages/Booking.jsx'
import PublicDashboard from './pages/Dashboard.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import AdminDashboard from './dashboards/Admin/Dashboard.jsx'
import AdminUsers from './dashboards/Admin/Users.jsx'
import AdminProviders from './dashboards/Admin/Providers.jsx'
import AdminServices from './dashboards/Admin/Services.jsx'
import AdminBookings from './dashboards/Admin/Bookings.jsx'
import AdminPayments from './dashboards/Admin/Payments.jsx'
import AdminReviews from './dashboards/Admin/Reviews.jsx'
import AdminReports from './dashboards/Admin/Reports.jsx'
import AdminSettings from './dashboards/Admin/Settings.jsx'
import AdminProfile from './dashboards/Admin/AdminProfile.jsx'
import CustomerDashboard from './dashboards/Customer/Dashboard.jsx'
import CustomerProfile from './dashboards/Customer/Profile.jsx'
import CustomerBookings from './dashboards/Customer/Bookings.jsx'
import CustomerBookingHistory from './dashboards/Customer/BookingHistory.jsx'
import CustomerFavorites from './dashboards/Customer/Favorites.jsx'
import CustomerReviews from './dashboards/Customer/Reviews.jsx'
import CustomerNotifications from './dashboards/Customer/Notifications.jsx'
import CustomerPayments from './dashboards/Customer/Payments.jsx'
import CustomerSettings from './dashboards/Customer/Settings.jsx'
import ProviderDashboard from './dashboards/Provider/Dashboard.jsx'
import ProviderProfile from './dashboards/Provider/Profile.jsx'
import ProviderMyServices from './dashboards/Provider/MyServices.jsx'
import ProviderAddService from './dashboards/Provider/AddService.jsx'
import ProviderEditService from './dashboards/Provider/EditService.jsx'
import ProviderBookings from './dashboards/Provider/Bookings.jsx'
import ProviderEarnings from './dashboards/Provider/Earnings.jsx'
import ProviderReviews from './dashboards/Provider/Reviews.jsx'
import ProviderNotifications from './dashboards/Provider/Notifications.jsx'
import ProviderSettings from './dashboards/Provider/Settings.jsx'

const publicRoutes = {
  '#home': Home, '#login': Login, '#register': Register, '#provider-register': ProviderRegister, '#admin-login': AdminLogin,
  '#services': Services, '#service-details': ServiceDetails, '#booking': Booking, '#dashboard': PublicDashboard, '#about': About, '#contact': Contact,
}

const adminRoutes = {
  '#admin-dashboard': AdminDashboard, '#admin-users': AdminUsers, '#admin-providers': AdminProviders,
  '#admin-services': AdminServices, '#admin-bookings': AdminBookings, '#admin-payments': AdminPayments,
  '#admin-reviews': AdminReviews, '#admin-reports': AdminReports, '#admin-settings': AdminSettings, '#admin-profile': AdminProfile,
}

const customerRoutes = {
  '#customer-dashboard': CustomerDashboard, '#customer-profile': CustomerProfile, '#customer-bookings': CustomerBookings,
  '#customer-booking-history': CustomerBookingHistory, '#customer-favorites': CustomerFavorites, '#customer-reviews': CustomerReviews,
  '#customer-notifications': CustomerNotifications, '#customer-payments': CustomerPayments, '#customer-settings': CustomerSettings,
}

const providerRoutes = {
  '#provider-dashboard': ProviderDashboard, '#provider-profile': ProviderProfile, '#provider-my-services': ProviderMyServices,
  '#provider-add-service': ProviderAddService, '#provider-edit-service': ProviderEditService, '#provider-bookings': ProviderBookings,
  '#provider-earnings': ProviderEarnings, '#provider-reviews': ProviderReviews, '#provider-notifications': ProviderNotifications,
  '#provider-settings': ProviderSettings,
}

const allRoutes = { ...publicRoutes, ...adminRoutes, ...customerRoutes, ...providerRoutes }

function Router() {
  const { isAuthenticated, user, loading } = useAuth()
  const [hash, setHash] = useState(window.location.hash || '#home')

  useEffect(() => {
    const updateRoute = () => setHash(window.location.hash || '#home')
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  // Wait for auth check before rendering protected routes
  if (loading) return null

  const Page = allRoutes[hash]

  if (!Page) {
    window.location.hash = '#home'
    return null
  }

  // Public routes - always accessible
  if (publicRoutes[hash]) return <Page />

  // Protected routes - check authentication
  if (!isAuthenticated) {
    window.location.hash = '#login'
    return null
  }

  // Admin routes - require admin role
  if (adminRoutes[hash] && user?.role !== 'admin') {
    window.location.hash = '#home'
    return null
  }

  // Customer routes - require customer role
  if (customerRoutes[hash] && user?.role !== 'customer') {
    window.location.hash = '#home'
    return null
  }

  // Provider routes - require provider role
  if (providerRoutes[hash] && user?.role !== 'provider') {
    window.location.hash = '#home'
    return null
  }

  return <Page />
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}

export default App