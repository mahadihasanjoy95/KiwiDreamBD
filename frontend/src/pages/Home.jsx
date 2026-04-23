import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CheckCircle, MapPin, Briefcase, Heart, ListChecks, Landmark, Coins } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { NZFernIcon } from '@/components/common/NZFernIcon'
import { CITIES } from '@/data/cities'

function MountainSilhouette() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      fill="rgba(255,255,255,0.06)"
    >
      <path d="M0,200 L0,120 L80,80 L160,100 L240,60 L320,90 L400,40 L480,70 L560,30 L640,55 L720,20 L800,50 L880,15 L960,45 L1040,25 L1120,60 L1200,35 L1280,70 L1360,50 L1440,80 L1440,200 Z" />
      <path d="M0,200 L0,150 L120,110 L240,130 L360,90 L480,120 L600,80 L720,105 L840,70 L960,100 L1080,75 L1200,110 L1320,85 L1440,120 L1440,200 Z" fill="rgba(255,255,255,0.04)" />
    </svg>
  )
}

const STEPS = [
  {
    icon: '🎒',
    key: 'step1',
    color: 'from-violet-500 to-brand',
  },
  {
    icon: '🏙️',
    key: 'step2',
    color: 'from-emerald-500 to-nz',
  },
  {
    icon: '📊',
    key: 'step3',
    color: 'from-amber-400 to-orange-500',
  },
]

export default function Home() {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const { format } = useCurrency()
  const currency = useStore(s => s.currency)

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] md:min-h-[80vh] bg-gradient-to-br from-brand-deep via-[#5B21B6] to-[#7C3AED] flex items-center overflow-hidden">
        {/* BD stripe accent at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-bd via-transparent to-nz" />

        <MountainSilhouette />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-nz/10 blur-2xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 w-full">
          <div className="max-w-3xl">
            {/* Flag badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            >
              <span className="text-lg">🇧🇩</span>
              <span className="text-white/60 text-sm">→</span>
              <span className="text-lg">🇳🇿</span>
              <span className="text-white/80 text-sm font-medium ml-1">
                {language === 'BN' ? t('home.flag_badge') : t('home.flag_badge')}
              </span>
            </motion.div>

            {/* Bengali tagline (always shown as design element) */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-bengali text-brand-soft text-lg mb-3 font-medium"
            >
              আপনার নতুন জীবন পরিকল্পনা করুন
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance"
            >
              {t('home.hero_title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-white/70 text-lg md:text-xl mt-5 leading-relaxed max-w-xl"
            >
              {t('home.hero_subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 mt-8"
            >
              <Link
                to="/plan"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-brand font-bold rounded-xl hover:bg-brand-light transition-colors shadow-brand-lg text-base"
              >
                {t('home.cta_start')}
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/essentials"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 transition-colors text-base"
              >
                {t('home.explore_guide')}
              </Link>
            </motion.div>

            {/* Quick trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-x-6 gap-y-2 mt-8"
            >
              {[t('home.signal_free'), t('home.signal_currency'), t('home.signal_language')].map(s => (
                <div key={s} className="flex items-center gap-1.5 text-white/60 text-sm">
                  <CheckCircle size={14} className="text-nz" />
                  <span>{s}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3 Steps ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-deep">
            How it works
          </h2>
          <p className="text-gray-500 mt-3">Three steps. No login required.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-brand-mid via-brand-soft to-brand-mid" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-white rounded-2xl border border-brand-mid p-6 shadow-brand-sm text-center"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl mx-auto mb-4 shadow-brand-sm`}>
                {step.icon}
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-brand-mid rounded-full flex items-center justify-center text-xs font-bold text-brand">
                {i + 1}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{t(`home.${step.key}_title`)}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t(`home.${step.key}_desc`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── City strip ───────────────────────────────────────────── */}
      <section className="py-12 bg-white border-y border-brand-mid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-deep">{t('home.city_strip_title')}</h2>
              <p className="text-gray-400 text-sm mt-1">{t('home.city_strip_subtitle')}</p>
            </div>
            <Link to="/compare" className="text-brand text-sm font-semibold hover:text-brand-deep flex items-center gap-1 shrink-0">
              {t('home.compare_cities')} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CITIES.map((city, i) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(124,58,237,0.14)' }}
                className="bg-brand-light rounded-2xl p-4 border border-brand-mid text-center transition-shadow cursor-pointer"
              >
                <div className="text-3xl mb-2">{city.emoji}</div>
                <p className="font-bold text-gray-900 text-sm">{language === 'BN' ? city.nameBN : city.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{language === 'BN' ? city.taglineBN : city.taglineEN}</p>
                <div className="mt-3 pt-2 border-t border-brand-mid">
                  <motion.p
                    key={`${currency}-${city.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-bold text-brand"
                  >
                    {t('home.from_label')} {format(city.weeklyRentHint)}/wk
                  </motion.p>
                  <p className="text-[10px] text-gray-400">{t('home.shared_room')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white border-y border-brand-mid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-deep">
              {t('home.tools_title')}
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl">{t('home.tools_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {[
              { to: '/checklist', icon: <ListChecks size={22} className="text-brand" />, title: t('tools.checklist_title'), desc: t('tools.checklist_desc') },
              { to: '/compare', icon: <MapPin size={22} className="text-sky-600" />, title: t('tools.compare_title'), desc: t('tools.compare_desc') },
              { to: '/jobs', icon: <Briefcase size={22} className="text-emerald-600" />, title: t('tools.jobs_title'), desc: t('tools.jobs_desc') },
              { to: '/essentials', icon: <Landmark size={22} className="text-amber-600" />, title: t('tools.essentials_title'), desc: t('tools.essentials_desc') },
              { to: '/converter', icon: <Coins size={22} className="text-rose-600" />, title: t('tools.converter_title'), desc: t('tools.converter_desc') },
            ].map((tool, i) => (
              <motion.div
                key={tool.to}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={tool.to}
                  className="block h-full bg-brand-light rounded-2xl border border-brand-mid p-5 shadow-brand-sm hover:-translate-y-1 transition-transform"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                    {tool.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mt-4">{tool.title}</h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{tool.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature highlights ───────────────────────────────────── */}
      <section className="py-16 md:py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <MapPin className="text-brand" size={24} />,
              titleEN: 'City & suburb insights',
              titleBN: 'শহর ও উপশহরের তথ্য',
              descEN: 'Compare Auckland, Wellington, Christchurch, Hamilton, and Dunedin — rent, transport, job market.',
              descBN: 'পাঁচটি প্রধান শহর তুলনা করুন — ভাড়া, পরিবহন, চাকরির বাজার।',
            },
            {
              icon: <Briefcase className="text-nz" size={24} />,
              titleEN: 'Part-time job guide',
              titleBN: 'খণ্ডকালীন চাকরির গাইড',
              descEN: 'Know your work rights, typical wages, and how much you can earn at 20 hours/week.',
              descBN: 'আপনার কাজের অধিকার, সাধারণ মজুরি এবং সপ্তাহে ২০ ঘণ্টায় কত আয় হবে জানুন।',
            },
            {
              icon: <Heart className="text-bd" size={24} />,
              titleEN: 'BD community map',
              titleBN: 'বাংলাদেশী কমিউনিটি',
              descEN: 'Halal stores, mosques, Bengali community groups, and trusted local networks per city.',
              descBN: 'হালাল দোকান, মসজিদ, বাংলাদেশী কমিউনিটি গ্রুপ এবং বিশ্বস্ত স্থানীয় নেটওয়ার্ক।',
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4"
            >
              <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center shrink-0 shadow-brand-sm">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1">
                  {language === 'BN' ? f.titleBN : f.titleEN}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {language === 'BN' ? f.descBN : f.descEN}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────── */}
      <section className="py-14 bg-gradient-to-br from-brand-deep to-brand mx-6 md:mx-auto max-w-6xl rounded-3xl mb-10 text-white text-center px-6 relative overflow-hidden">
        <div className="absolute top-4 right-8 opacity-20">
          <NZFernIcon className="w-24 h-24" color="white" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Ready to plan your move?</h2>
          <p className="text-white/70 text-lg mb-7">It takes 2 minutes. No account required.</p>
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand font-bold rounded-xl hover:bg-brand-light transition-colors shadow-brand-lg text-base"
          >
            {t('home.cta_start')}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
