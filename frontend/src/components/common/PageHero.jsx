import { motion } from 'framer-motion'

export function PageHero({ title, subtitle, badge, accent = 'from-[#c7e5e8] via-[#d8eeee] to-[#f8f2e8]' }) {
  return (
    <div className={`bg-gradient-to-br ${accent} px-6 py-12 md:py-16`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          {badge ? (
            <div className="inline-flex items-center rounded-full bg-white/35 px-3 py-1 text-xs font-semibold text-brand-deep/70 mb-4 backdrop-blur-xl">
              {badge}
            </div>
          ) : null}
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-deep">{title}</h1>
          <p className="text-brand-deep/70 text-lg mt-3 max-w-2xl">{subtitle}</p>
        </motion.div>
      </div>
    </div>
  )
}
