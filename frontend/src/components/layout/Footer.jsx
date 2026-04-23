import { Link } from 'react-router-dom'
import { NZFernIcon } from '@/components/common/NZFernIcon'
import useStore from '@/store/useStore'

export function Footer() {
  const { t } = { t: (k) => k }

  return (
    <footer className="hidden md:block bg-brand-deep text-white/60 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <NZFernIcon className="w-6 h-6" color="#16A34A" />
            <div>
              <p className="font-serif font-bold text-white text-lg">KiwiDream BD</p>
              <p className="text-xs mt-0.5">Plan your new life in New Zealand</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <Link to="/plan" className="hover:text-white transition-colors">Budget Planner</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/guide" className="hover:text-white transition-colors">NZ Guide</Link>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span>🇧🇩</span>
            <span className="text-white/30">→</span>
            <span>🇳🇿</span>
            <span className="ml-2">Rate: 1 NZD ≈ 83.2 BDT</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© 2026 KiwiDream BD. Built for Bangladeshi students moving to New Zealand.</p>
          <p>Phase 1 · Data updated April 2026</p>
        </div>
      </div>
    </footer>
  )
}
