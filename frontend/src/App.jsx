import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { FloatingPrefs } from '@/components/layout/FloatingPrefs'
import Home from '@/pages/Home'
import BudgetPlanner from '@/pages/BudgetPlanner'
import Dashboard from '@/pages/Dashboard'
import Guide from '@/pages/Guide'
import Checklist from '@/pages/Checklist'
import CityCompare from '@/pages/CityCompare'
import JobGuide from '@/pages/JobGuide'
import CurrencyConverter from '@/pages/CurrencyConverter'
import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Profile from '@/pages/Profile'

export default function App() {
  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/plan"      element={<BudgetPlanner />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/guide"     element={<Guide />} />
          <Route path="/essentials" element={<Guide />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/compare" element={<CityCompare />} />
          <Route path="/jobs" element={<JobGuide />} />
          <Route path="/converter" element={<CurrencyConverter />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <FloatingPrefs />
      <BottomNav />
      <Footer />
    </div>
  )
}
