import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { Globe } from 'lucide-react'
import useStore from '@/store/useStore'
import i18n from 'i18next'

function loadPos() {
  try {
    const raw = localStorage.getItem('kiwi-fab-pos')
    return raw ? JSON.parse(raw) : { x: 0, y: 0 }
  } catch { return { x: 0, y: 0 } }
}

export function FloatingPrefs() {
  const [open, setOpen] = useState(false)
  const [nearTop, setNearTop] = useState(false)
  const containerRef = useRef(null)
  const fabRef = useRef(null)

  const saved = useRef(loadPos())
  const x = useMotionValue(saved.current.x)
  const y = useMotionValue(saved.current.y)

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

  const handleLanguage = (l) => {
    setLanguage(l)
    i18n.changeLanguage(l.toLowerCase())
  }

  const handleDragEnd = () => {
    localStorage.setItem('kiwi-fab-pos', JSON.stringify({ x: x.get(), y: y.get() }))
    if (fabRef.current) {
      const rect = fabRef.current.getBoundingClientRect()
      setNearTop(rect.top < window.innerHeight / 2)
    }
  }

  const dragBounds = {
    left:   typeof window !== 'undefined' ? -(window.innerWidth - 56 - 16) : -300,
    right:  0,
    top:    typeof window !== 'undefined' ? -(window.innerHeight - 200)     : -500,
    bottom: 0,
  }

  return (
    <div ref={containerRef} className="md:hidden fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">

      {/* Glass card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: nearTop ? -8 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className={nearTop ? 'order-last mt-2' : 'mb-2'}
            style={{
              borderRadius: 16,
              background: 'rgba(76, 29, 149, 0.55)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 8px 32px rgba(76,29,149,0.35)',
            }}
          >
            <div className="px-4 py-3 min-w-[156px] space-y-3">
              {/* Language */}
              <div>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2">Language</p>
                <div className="flex gap-1">
                  {[{ id: 'EN', label: 'EN' }, { id: 'BN', label: 'বাং' }].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleLanguage(opt.id)}
                      className="relative flex-1 py-2 rounded-xl text-sm font-semibold overflow-hidden"
                    >
                      {language === opt.id && (
                        <motion.span
                          layoutId="fab-lang-active"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.20)' }}
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
                          style={{ background: 'rgba(255,255,255,0.20)' }}
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

      {/* Draggable FAB — drag and onTap on the SAME element so Framer Motion
          auto-discriminates: tap fires only if pointer didn't move */}
      <motion.div
        ref={fabRef}
        drag
        dragMomentum={false}
        dragElastic={0.06}
        dragConstraints={dragBounds}
        onDragEnd={handleDragEnd}
        onTap={() => setOpen(v => !v)}
        whileDrag={{ scale: 1.15, cursor: 'grabbing' }}
        whileTap={{ scale: 0.90 }}
        className="touch-none w-11 h-11 rounded-full flex items-center justify-center cursor-grab"
        style={{
          x, y,
          background: open ? 'rgba(124,58,237,0.80)' : 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: open
            ? '0 4px 20px rgba(124,58,237,0.45)'
            : '0 4px 20px rgba(0,0,0,0.18)',
        }}
      >
        <motion.span
          animate={{ rotate: open ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Globe size={18} strokeWidth={1.8} className={open ? 'text-white' : 'text-white/80'} />
        </motion.span>
      </motion.div>

    </div>
  )
}
