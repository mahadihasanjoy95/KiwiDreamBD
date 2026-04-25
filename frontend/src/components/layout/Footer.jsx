import { Link } from 'react-router-dom'
import useStore from '@/store/useStore'
import { useTranslation } from 'react-i18next'
import logoTigerNew from '@/assets/images/logo_tiger_new.png'
import logoTextNew  from '@/assets/images/logo_text_new.png'

export function Footer() {
  const { t } = useTranslation()
  const rate = useStore(s => s.exchangeRate)

  return (
    <footer className="hidden md:block bg-[linear-gradient(180deg,#021e20_0%,#032628_100%)] text-white/55 mt-20 relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* ── Logo block ── */}
          <Link to="/" className="flex items-center gap-0 shrink-0 group">
            <span className="relative block h-[52px] w-[52px] overflow-hidden">
              <img
                src={logoTigerNew}
                alt="KiwiDream BD"
                className="absolute left-1/2 top-1/2 h-[65px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </span>
            <span className="relative -ml-1 block h-[42px] w-[175px] overflow-hidden">
              <img
                src={logoTextNew}
                alt="KiwiDream BD"
                className="absolute left-1/2 top-1/2 h-[88px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 opacity-80 group-hover:opacity-95 transition-opacity brightness-0 invert"
              />
            </span>
          </Link>

          {/* ── Nav links ── */}
          <div className="flex flex-wrap gap-x-7 gap-y-2 text-sm">
            <Link to="/plan"      className="hover:text-white transition-colors">{t('footer.planner')}</Link>
            <Link to="/compare"   className="hover:text-white transition-colors">{t('footer.compare')}</Link>
            <Link to="/jobs"      className="hover:text-white transition-colors">{t('footer.jobs')}</Link>
            <Link to="/checklist" className="hover:text-white transition-colors">{t('footer.checklist')}</Link>
            <Link to="/essentials"className="hover:text-white transition-colors">{t('footer.essentials')}</Link>
            <Link to="/converter" className="hover:text-white transition-colors">{t('footer.converter')}</Link>
          </div>

          {/* ── Exchange rate pill ── */}
          <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs backdrop-blur-sm shrink-0">
            <span>🇧🇩</span>
            <span className="text-white/25">→</span>
            <span>🇳🇿</span>
            <span className="ml-1 text-white/60">{t('footer.rate', { rate })}</span>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/35">
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.phase')}</p>
        </div>
      </div>
    </footer>
  )
}
