import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { FloatingPrefs } from '@/components/layout/FloatingPrefs'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import Home from '@/pages/Home'
import BudgetPlanner from '@/pages/BudgetPlanner'
import Dashboard from '@/pages/Dashboard'
import Guide from '@/pages/Guide'

export default function App() {
  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <Navbar />
      <FloatingPrefs />
      <main className="pb-20 md:pb-0">
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/plan"      element={<BudgetPlanner />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/guide"     element={<Guide />} />
        </Routes>
      </main>
      <BottomNav />
      <Footer />
    </div>
  )
}
