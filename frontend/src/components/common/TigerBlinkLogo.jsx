import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import tigerOpen from '@/assets/images/logo_tiger_new.png'
import tigerClosed from '@/assets/images/logo_tiger_new.png'

export function TigerBlinkLogo({
  size = 64,
  artSize = 112,
  className = '',
  alt = 'KiwiDream BD',
  interactive = false,
}) {
  const [closed, setClosed] = useState(false)
  const timeoutRef = useRef(null)
  const doubleBlinkTimeoutRef = useRef(null)
  const reopenTimeoutRef = useRef(null)
  const mountedRef = useRef(false)
  const imageStyle = useMemo(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: artSize,
    width: 'auto',
    maxWidth: 'none',
    transform: 'translate(-50%, -49%)',
  }), [artSize])

  useEffect(() => {
    mountedRef.current = true

    const blink = () => {
      if (!mountedRef.current) return
      setClosed(true)
      reopenTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) setClosed(false)
      }, 520)
    }

    const scheduleBlink = (delay = 1200) => {
      timeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return
        blink()

        if (Math.random() > 0.68) {
          doubleBlinkTimeoutRef.current = setTimeout(() => {
            if (!mountedRef.current) return
            blink()
            scheduleBlink(2400 + Math.random() * 1500)
          }, 720)
          return
        }

        scheduleBlink(2400 + Math.random() * 1700)
      }, delay)
    }

    scheduleBlink()
    return () => {
      mountedRef.current = false
      clearTimeout(timeoutRef.current)
      clearTimeout(doubleBlinkTimeoutRef.current)
      clearTimeout(reopenTimeoutRef.current)
    }
  }, [])

  return (
    <motion.div
      whileTap={interactive ? { scale: 0.96, rotate: -2 } : undefined}
      whileHover={interactive ? { scale: 1.03 } : undefined}
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <img
        src={tigerOpen}
        alt={alt}
        style={imageStyle}
      />
      <motion.img
        src={tigerClosed}
        alt=""
        initial={{ opacity: 0 }}
        animate={{ opacity: closed ? 1 : 0 }}
        transition={{ duration: closed ? 0.26 : 0.36, ease: 'easeInOut' }}
        style={imageStyle}
      />
    </motion.div>
  )
}
