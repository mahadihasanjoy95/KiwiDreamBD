import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'

export function AppLoader({
  show = true,
  label = 'Preparing your plan',
  sublabel = 'Fetching the latest details',
  fullScreen = true,
  className = '',
}) {
  const prefersReducedMotion = useReducedMotion()

  const loader = (
    <AnimatePresence>
      {show ? (
        <motion.div
          className={cn(
            fullScreen
              ? 'fixed inset-0 z-[90] bg-brand-deep/30 px-5 backdrop-blur-md'
              : 'absolute inset-0 z-20 rounded-[inherit] bg-white/80 backdrop-blur-md',
            'flex items-center justify-center',
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="relative flex w-full max-w-[22rem] flex-col items-center overflow-hidden rounded-[28px] border border-white/70 bg-[#f8fdfd] px-6 py-7 text-center shadow-[0_28px_70px_rgba(0,89,96,0.22)]">
            <div className="absolute inset-x-8 top-16 h-px border-t border-dashed border-brand/30" />
            <motion.div
              className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light shadow-[inset_0_0_0_1px_rgba(0,149,161,0.12)]"
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.04, 1] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.svg
                viewBox="0 0 64 64"
                className="h-12 w-12"
                animate={prefersReducedMotion ? undefined : { x: [-17, 17, -17], y: [5, -8, 5], rotate: [-9, 11, -9] }}
                transition={{ duration: 1.55, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
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

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-brand">Please wait</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-brand-deep">{label}</h2>
            <p className="mt-2 max-w-xs text-sm font-medium leading-relaxed text-[#51666b]">{sublabel}</p>

            <div className="mt-5 flex gap-1.5" aria-hidden="true">
              {[0, 1, 2].map(dot => (
                <motion.span
                  key={dot}
                  className="h-2 w-2 rounded-full bg-brand"
                  animate={prefersReducedMotion ? undefined : { opacity: [0.32, 1, 0.32], y: [0, -3, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.14 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  if (fullScreen && typeof document !== 'undefined') {
    return createPortal(loader, document.body)
  }

  return loader
}
