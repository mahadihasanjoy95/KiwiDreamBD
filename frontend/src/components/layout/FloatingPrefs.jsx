import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings2 } from 'lucide-react'
import useStore from '@/store/useStore'

export function FloatingPrefs() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const currency = useStore(s => s.currency)
  const setCurrency = useStore(s => s.setCurrency)
  const language = useStore(s => s.language)
  const setLanguage = useStore(s => s.setLanguage)

  // Close panel on outside tap
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [open])

  return (
    <div ref={containerRef} className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2 md:hidden">

      {/* Glass card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="mb-2"
            style={{
              borderRadius: 16,
              background: 'rgba(52, 25, 92, 0.50)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.24)',
              boxShadow: '0 18px 46px rgba(52,25,92,0.26)',
            }}
          >
            <div className="min-w-[168px] space-y-3 px-4 py-3">
              {/* Language */}
              <div>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2">Language</p>
                <div className="flex gap-1">
                  {[{ id: 'EN', label: 'EN' }, { id: 'BN', label: 'বাং' }].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setLanguage(opt.id)}
                      className="relative flex-1 py-2 rounded-xl text-sm font-semibold overflow-hidden"
                    >
                      {language === opt.id && (
                        <motion.span
                          layoutId="fab-lang-active"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.24)' }}
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        />
                      )}
                      <span className={[
                        'relative',
                        opt.id === 'BN' ? 'font-bengali' : '',
                        language === opt.id ? 'text-white' : 'text-white/40',
                      ].join(' ')}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px" style={{ background: 'rgba(255,255,255,0.10)' }} />

              {/* Currency */}
              <div>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2">Currency</p>
                <div className="flex gap-1">
                  {['NZD', 'BDT'].map(c => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className="relative flex-1 py-2 rounded-xl text-sm font-semibold overflow-hidden"
                    >
                      {currency === c && (
                        <motion.span
                          layoutId="fab-curr-active"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.24)' }}
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        />
                      )}
                      <span className={`relative ${currency === c ? 'text-white' : 'text-white/40'}`}>
                        {c}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile preferences FAB */}
      <motion.button
        type="button"
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.90 }}
        whileHover={{ scale: 1.04 }}
        aria-label="Open language and currency settings"
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          background: open ? 'rgba(124,58,237,0.72)' : 'rgba(255,255,255,0.16)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: '1px solid rgba(255,255,255,0.28)',
          boxShadow: open
            ? '0 14px 34px rgba(124,58,237,0.34)'
            : '0 14px 34px rgba(48,31,86,0.22)',
        }}
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Settings2 size={19} strokeWidth={2} className="text-white" />
        </motion.span>
      </motion.button>

    </div>
  )
}
