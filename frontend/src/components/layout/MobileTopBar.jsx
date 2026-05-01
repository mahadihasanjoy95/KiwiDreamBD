import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import logoTigerNew from '@/assets/images/main_logo.png'
import { cn } from '@/utils/cn'

export function MobileTopBar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className={cn(
        'md:hidden flex items-center px-4 h-12 z-50 w-full',
        isHome
          ? 'absolute left-0 right-0 top-0 bg-transparent'
          : 'sticky top-0 border-b border-[#0095A1]/12 bg-white/70 backdrop-blur-xl'
      )}
    >
      <Link to="/" className="flex items-center">
        <div className="relative h-[26px] w-[110px] overflow-hidden">
          <img
            src={logoTigerNew}
            alt="Plan For Abroad"
            className="absolute w-[200%] h-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%]"
          />
        </div>
      </Link>
    </motion.div>
  )
}
