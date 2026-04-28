import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'
import useStore from '@/store/useStore'
import { CHECKLIST_GROUPS } from '@/data/checklist'
import { PageHero } from '@/components/common/PageHero'

export default function Checklist() {
  const language = useStore(s => s.language)
  const [completed, setCompleted] = useState({})

  const totals = useMemo(() => {
    const total = CHECKLIST_GROUPS.reduce((sum, group) => sum + group.items.length, 0)
    const done = Object.values(completed).filter(Boolean).length
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 }
  }, [completed])

  return (
    <div className="min-h-screen">
      <PageHero
        badge={language === 'BN' ? 'ফেজ ১ চেকলিস্ট' : 'Phase 1 checklist'}
        title={language === 'BN' ? 'যাওয়ার আগে কী কী প্রস্তুত?' : 'What should be ready before you move?'}
        subtitle={language === 'BN'
          ? 'আপনার প্রি-ডিপার্চার কাজগুলো বিভাগ অনুযায়ী দেখে নিন। পরে এটি ইউজার-ভিত্তিক ট্র্যাকিং-এ যাবে, এখন এটি পরিকল্পনার রেফারেন্স হিসেবে রাখা হয়েছে।'
          : 'Review the pre-departure tasks by category. This will later become user-specific progress tracking; for now it works as a planning reference.'}
        accent="from-brand-deep via-[#4C1D95] to-brand"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="bg-white rounded-2xl border border-brand-mid p-6 shadow-brand-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-sm text-gray-400">
                {language === 'BN' ? 'মোট অগ্রগতি' : 'Overall progress'}
              </p>
              <h2 className="font-serif text-2xl font-bold text-brand-deep mt-1">
                {totals.done} / {totals.total} {language === 'BN' ? 'সম্পন্ন' : 'completed'}
              </h2>
            </div>
            <div className="flex-1">
              <div className="h-3 rounded-full bg-brand-mid overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand to-brand-soft"
                  animate={{ width: `${totals.percent}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {language === 'BN'
                  ? `এই চেকলিস্টটি প্রিন্ট করে বা নিজের মতো কাস্টমাইজ করে ব্যবহার করতে পারবেন।`
                  : 'You can use this as a printable planning checklist or customize it later in the product.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {CHECKLIST_GROUPS.map((group, idx) => {
            const title = language === 'BN' ? group.titleBN : group.titleEN
            const done = group.items.filter(item => completed[item.id]).length
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-brand-mid p-5 shadow-brand-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{done} / {group.items.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand font-bold">
                    {done}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {group.items.map(item => {
                    const checked = !!completed[item.id]
                    const text = item.text
                    return (
                      <button
                        key={item.id}
                        onClick={() => setCompleted(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className="w-full text-left flex items-start gap-3 rounded-xl border border-brand-mid px-4 py-3 hover:bg-brand-light/50 transition-colors"
                      >
                        <span className="mt-0.5 text-brand shrink-0">
                          {checked ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </span>
                        <span className={checked ? 'text-gray-500 line-through' : 'text-gray-700'}>{text}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
