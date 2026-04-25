import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const PHASES = [
  {
    key: 'week1',
    color: '#0095A1',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    items: [
      { en: 'Bond payment', bn: 'বন্ড পেমেন্ট', nzd: '4× rent' },
      { en: 'Bedding set', bn: 'বিছানার সেট', nzd: '~NZD 180' },
      { en: 'Kitchen basics', bn: 'রান্নাঘরের জিনিস', nzd: '~NZD 150' },
      { en: 'SIM card', bn: 'সিম কার্ড', nzd: '~NZD 30' },
      { en: 'Grocery run', bn: 'মুদির দোকান', nzd: '~NZD 80' },
    ],
    rangeEN: 'NZD 2,200–2,800',
    rangeBN: 'NZD ২,২০০–২,৮০০',
  },
  {
    key: 'month1',
    color: '#16A34A',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    items: [
      { en: 'Secondhand furniture', bn: 'পুরনো আসবাব', nzd: '~NZD 200' },
      { en: 'AT HOP / bus card', bn: 'বাস কার্ড', nzd: '~NZD 10' },
      { en: 'Internet setup', bn: 'ইন্টারনেট সেটআপ', nzd: '~NZD 70' },
      { en: 'Warm jacket', bn: 'গরম জ্যাকেট', nzd: '~NZD 80' },
    ],
    rangeEN: 'NZD 400–700',
    rangeBN: 'NZD ৪০০–৭০০',
  },
  {
    key: 'month3',
    color: '#F59E0B',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    items: [
      { en: 'Extra kitchen items', bn: 'অতিরিক্ত রান্নাঘরের জিনিস', nzd: '~NZD 100' },
      { en: 'Bicycle', bn: 'সাইকেল', nzd: '~NZD 150' },
      { en: 'Clothing upgrade', bn: 'পোশাক আপগ্রেড', nzd: 'variable' },
      { en: 'Vehicle savings', bn: 'গাড়ির সঞ্চয়', nzd: 'ongoing' },
    ],
    rangeEN: 'NZD 200–400',
    rangeBN: 'NZD ২০০–৪০০',
  },
]

export function Timeline({ language = 'EN' }) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PHASES.map((phase, i) => (
        <motion.div
          key={phase.key}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12 }}
          className={`rounded-2xl border p-5 ${phase.bgColor} ${phase.borderColor}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: phase.color }}
            >
              {i + 1}
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">
                {language === 'BN' ? t(`dashboard.${phase.key}`) : t(`dashboard.${phase.key}`)}
              </h4>
              <p className="text-xs font-semibold" style={{ color: phase.color }}>
                {language === 'BN' ? phase.rangeBN : phase.rangeEN}
              </p>
            </div>
          </div>
          <ul className="space-y-2">
            {phase.items.map((item, j) => (
              <li key={j} className="flex items-center justify-between text-xs">
                <span className="text-gray-700">
                  {language === 'BN' ? item.bn : item.en}
                </span>
                <span className="text-gray-400 shrink-0 ml-2">{item.nzd}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}
