import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { FloatingPrefs } from '@/components/layout/FloatingPrefs'
import Home from '@/pages/Home'
import BudgetPlanner from '@/pages/BudgetPlanner'
import Dashboard from '@/pages/Dashboard'
import Guide from '@/pages/Guide'
import ArticleDetail from '@/pages/ArticleDetail'
import Checklist from '@/pages/Checklist'
import CityCompare from '@/pages/CityCompare'
import JobGuide from '@/pages/JobGuide'
import CurrencyConverter from '@/pages/CurrencyConverter'
import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Profile from '@/pages/Profile'
import OAuthCallback from '@/pages/OAuthCallback'
import AdminLogin from '@/pages/AdminLogin'
import AdminInviteActivation from '@/pages/AdminInviteActivation'
import NotFound from '@/pages/NotFound'
import { ToastProvider } from '@/components/common/ToastProvider'
import useStore from '@/store/useStore'

function normalizeRole(role) {
  return String(role || '').replace('ROLE_', '')
}

// AdminOnlyRoute is no longer needed — AdminLogin handles its own auth guard.
// It shows a login form to anyone without admin access, and renders AdminPanel directly for admins.

function PublicOnlyForNonAdmins({ children }) {
  const user = useStore(s => s.user)
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const role = normalizeRole(user?.role)

  if (isAuthenticated && (role === 'ADMIN' || role === 'SUPER_ADMIN')) {
    return <Navigate to="/admin/Joy&Priota" replace state={{ blockedWebsite: true }} />
  }

  return children
}

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin/')

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#eaf6f5] font-sans">
        {!isAdminRoute && <Navbar />}
        <main className={isAdminRoute ? '' : 'pb-20 md:pb-0'}>
          <Routes>
            <Route path="/"          element={<PublicOnlyForNonAdmins><Home /></PublicOnlyForNonAdmins>} />
            <Route path="/plan"      element={<PublicOnlyForNonAdmins><BudgetPlanner /></PublicOnlyForNonAdmins>} />
            <Route path="/dashboard" element={<PublicOnlyForNonAdmins><Dashboard /></PublicOnlyForNonAdmins>} />
            <Route path="/guide"     element={<PublicOnlyForNonAdmins><Guide /></PublicOnlyForNonAdmins>} />
            <Route path="/guide/:id" element={<PublicOnlyForNonAdmins><ArticleDetail /></PublicOnlyForNonAdmins>} />
            <Route path="/essentials" element={<PublicOnlyForNonAdmins><Guide /></PublicOnlyForNonAdmins>} />
            <Route path="/checklist" element={<PublicOnlyForNonAdmins><Checklist /></PublicOnlyForNonAdmins>} />
            <Route path="/compare" element={<PublicOnlyForNonAdmins><CityCompare /></PublicOnlyForNonAdmins>} />
            <Route path="/jobs" element={<PublicOnlyForNonAdmins><JobGuide /></PublicOnlyForNonAdmins>} />
            <Route path="/converter" element={<PublicOnlyForNonAdmins><CurrencyConverter /></PublicOnlyForNonAdmins>} />
            <Route path="/signin" element={<PublicOnlyForNonAdmins><SignIn /></PublicOnlyForNonAdmins>} />
            <Route path="/signup" element={<PublicOnlyForNonAdmins><SignUp /></PublicOnlyForNonAdmins>} />
            <Route path="/oauth2/callback" element={<PublicOnlyForNonAdmins><OAuthCallback /></PublicOnlyForNonAdmins>} />
            <Route path="/forgot-password" element={<PublicOnlyForNonAdmins><ForgotPassword /></PublicOnlyForNonAdmins>} />
            <Route path="/reset-password" element={<PublicOnlyForNonAdmins><ResetPassword /></PublicOnlyForNonAdmins>} />
            <Route path="/profile" element={<PublicOnlyForNonAdmins><Profile /></PublicOnlyForNonAdmins>} />
            <Route path="/admin/activate" element={<AdminInviteActivation />} />
            <Route path="/admin/Joy&Priota" element={<AdminLogin />} />
            <Route path="*" element={<PublicOnlyForNonAdmins><NotFound /></PublicOnlyForNonAdmins>} />
          </Routes>
        </main>
        {!isAdminRoute && <FloatingPrefs />}
        {!isAdminRoute && <BottomNav />}
        {!isAdminRoute && <Footer />}
      </div>
    </ToastProvider>
  )
}
