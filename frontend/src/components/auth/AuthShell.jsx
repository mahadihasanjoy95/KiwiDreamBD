import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function AuthShell({ title, subtitle, badge, children, footer }) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#e4f4f4_0%,#f7fbf8_100%)]">
      <div className="bg-[linear-gradient(180deg,#c7e5e8_0%,#d8eeee_58%,#f8f2e8_100%)] px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center rounded-full bg-white/35 px-3 py-1 text-xs font-semibold text-brand-deep/70 mb-4 backdrop-blur-xl">
              {badge}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-deep">{title}</h1>
            <p className="text-brand-deep/70 text-lg mt-3">{subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white/75 p-6 shadow-[0_18px_42px_rgba(0,89,96,0.08)] backdrop-blur-xl md:p-8"
          >
            {children}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="rounded-3xl bg-white/70 p-6 shadow-[0_18px_42px_rgba(0,89,96,0.08)] backdrop-blur-xl"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('auth.why_title')}</p>
            <div className="space-y-3 mt-4">
              {['why_1', 'why_2', 'why_3'].map((key) => (
                <div key={key} className="rounded-2xl bg-brand-light/80 px-4 py-3">
                  <p className="text-sm text-gray-700">{t(`auth.${key}`)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 pt-5 text-sm">
              <Link to="/plan" className="block text-brand font-semibold hover:text-brand-deep transition-colors">
                {t('auth.back_to_plan')}
              </Link>
              <Link to="/dashboard" className="block text-gray-500 hover:text-gray-700 transition-colors">
                {t('auth.explore_demo')}
              </Link>
            </div>

            {footer ? <div className="mt-5">{footer}</div> : null}
          </motion.aside>
        </div>
      </div>
    </div>
  )
}
