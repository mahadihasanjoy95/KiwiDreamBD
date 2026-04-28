import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Home } from 'lucide-react'
import { Alert } from '@/components/common/Alert'

export default function NotFound() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="min-h-[72vh] bg-[linear-gradient(180deg,#eaf6f5_0%,#f8fbf6_58%,#eef7f6_100%)] px-4 py-10 sm:px-6 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/72 p-6 shadow-[0_24px_70px_rgba(0,89,96,0.10)] backdrop-blur-2xl sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand/60">
            {t('not_found.kicker')}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-brand-deep md:text-6xl">
            {t('not_found.title')}
          </h1>
          <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-brand-deep/62">
            {t('not_found.copy')}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(0,149,161,0.22)] hover:bg-brand-deep"
            >
              <Home size={17} />
              {t('not_found.home')}
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-mid bg-white/76 px-5 text-sm font-extrabold text-brand-deep hover:border-brand"
            >
              <ArrowLeft size={17} />
              {t('not_found.back')}
            </button>
          </div>

          <div className="relative mt-7 flex h-32 items-center justify-center overflow-hidden sm:h-36">
            <div className="absolute left-1/2 top-1/2 h-20 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/18" />
            <div className="absolute left-1/2 top-1/2 h-14 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/28" />
            <motion.div
              className="absolute left-1/2 top-1/2 h-24 w-48 -translate-x-1/2 -translate-y-1/2"
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 2.9, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            >
              <DizzyStar className="absolute left-1 top-7 h-8 w-8" />
              <DizzyStar className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2" delay />
              <DizzyStar className="absolute right-2 top-8 h-9 w-9" />
            </motion.div>

            <motion.div
              className="relative z-10"
              animate={prefersReducedMotion ? undefined : {
                y: [0, -4, 3, -2, 0],
                rotate: [-6, 7, -9, 5, -6],
              }}
              transition={{ duration: 1.45, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              <motion.svg
                viewBox="0 0 64 64"
                className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_14px_16px_rgba(0,119,127,0.14)]"
                animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 0.98, 1] }}
                transition={{ duration: 1.45, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path
                  d="M55 10 9 30.2l18.6 6.2L34 55l21-45Z"
                  fill="#ffffff"
                  stroke="#00777f"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path d="m27.6 36.4 13.8-12.8" fill="none" stroke="#ffd45c" strokeWidth="3" strokeLinecap="round" />
                <path d="M12 42h12M7 50h17" fill="none" stroke="#0095a1" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
              </motion.svg>
            </motion.div>
          </div>

          <Alert tone="warning" title={t('not_found.alert_title')} className="mt-5">
            <p>{t('not_found.alert_copy', { path: location.pathname })}</p>
          </Alert>
        </div>
      </div>
    </div>
  )
}

function DizzyStar({ className = '', delay = false }) {
  return (
    <motion.svg
      viewBox="0 0 48 48"
      className={className}
      animate={{ scale: [1, 1.12, 0.96, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: delay ? 0.18 : 0 }}
      aria-hidden="true"
    >
      <path
        d="m24 4 5.1 12.1 13.1 1.1-10 8.6 3 12.8L24 31.8 12.8 38.6l3-12.8-10-8.6 13.1-1.1L24 4Z"
        fill="#FFD45C"
        stroke="#F5A623"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="m24 10 3.3 7.8 8.5.7-6.5 5.6 2 8.3L24 28l-7.3 4.4 2-8.3-6.5-5.6 8.5-.7L24 10Z"
        fill="#FFE16F"
        opacity="0.72"
      />
    </motion.svg>
  )
}
