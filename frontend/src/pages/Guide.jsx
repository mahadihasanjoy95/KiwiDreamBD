import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Landmark, FileText, ShoppingCart, Briefcase,
  Heart, Users, ChevronDown,
} from 'lucide-react'
import useStore from '@/store/useStore'
import { GUIDE_CARDS } from '@/data/guideContent'
import { cn } from '@/utils/cn'

const ICON_MAP = {
  Landmark, FileText, ShoppingCart, Briefcase, Heart, Users,
}

const CATEGORY_COLORS = {
  Finance:     'bg-violet-100 text-brand',
  'Tax & Legal': 'bg-blue-100 text-blue-700',
  'Daily Life':  'bg-amber-100 text-amber-700',
  'Work & Income': 'bg-green-100 text-green-700',
  Health:      'bg-red-100 text-red-700',
  Community:   'bg-pink-100 text-pink-700',
}

function GuideCard({ card, language }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const Icon = ICON_MAP[card.icon] || Landmark

  const title = language === 'BN' ? card.titleBN : card.titleEN
  const category = language === 'BN' ? card.categoryBN : card.categoryEN
  const body = language === 'BN' ? card.bodyBN : card.bodyEN

  const colorCls = CATEGORY_COLORS[card.categoryEN] || 'bg-brand-mid text-brand'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-brand-mid shadow-brand-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-brand-light/50 transition-colors"
      >
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', colorCls)}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-gray-900 text-base">{title}</h3>
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', colorCls)}>
              {category}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {card.tags.map(tag => (
              <span key={tag} className="text-[10px] bg-brand-mid text-brand px-2 py-0.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 shrink-0 mt-0.5"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-brand-mid">
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed mt-4
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-strong:text-gray-900 prose-li:text-gray-600"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {body.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-bold text-gray-900 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>
                  }
                  if (line.startsWith('- **')) {
                    const parts = line.slice(2).split('** — ')
                    return (
                      <p key={i} className="flex gap-1 text-sm mb-1">
                        <span className="text-gray-300">·</span>
                        <span><strong className="text-gray-900">{parts[0].replace(/\*\*/g, '')}</strong>{parts[1] ? ` — ${parts[1]}` : ''}</span>
                      </p>
                    )
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <p key={i} className="flex gap-1 text-sm mb-1">
                        <span className="text-gray-300 shrink-0">·</span>
                        <span>{line.slice(2)}</span>
                      </p>
                    )
                  }
                  if (line.trim() === '') return <div key={i} className="h-2" />
                  return <p key={i} className="text-sm mb-1">{line}</p>
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Guide() {
  const { t } = useTranslation()
  const language = useStore(s => s.language)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-deep to-brand px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              {t('guide.title')}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              {t('guide.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GUIDE_CARDS.map(card => (
            <GuideCard key={card.id} card={card} language={language} />
          ))}
        </div>
      </div>
    </div>
  )
}
