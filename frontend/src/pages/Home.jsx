import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CheckCircle, MapPin, Briefcase, Heart, ListChecks, Landmark, Coins } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { NZFernIcon } from '@/components/common/NZFernIcon'
import { CITIES } from '@/data/cities'
import { HowItWorks } from '@/components/home/HowItWorks'

function MountainSilhouette() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox="0 0 1440 240"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M0,240 L0,140 L80,100 L160,120 L240,75 L320,108 L400,55 L480,88 L560,42 L640,70 L720,30 L800,62 L880,22 L960,56 L1040,35 L1120,72 L1200,44 L1280,82 L1360,60 L1440,95 L1440,240 Z"
        fill="rgba(255,255,255,0.05)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.3 }}
      />
      <motion.path
        d="M0,240 L0,165 L100,132 L200,152 L320,108 L440,138 L560,98 L680,124 L800,88 L920,116 L1040,90 L1160,128 L1280,100 L1400,136 L1440,142 L1440,240 Z"
        fill="rgba(255,255,255,0.07)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.5 }}
      />
      <motion.path
        d="M0,240 L0,185 L160,158 L280,172 L400,148 L520,165 L640,138 L760,158 L880,130 L1000,154 L1120,132 L1240,162 L1360,140 L1440,168 L1440,240 Z"
        fill="rgba(255,255,255,0.10)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.7 }}
      />
    </svg>
  )
}

/* Cloud data — Aotearoa: Land of the Long White Cloud */
const CLOUDS = [
  { top: '6%',  w: 440, h: 48, op: 0.10, dur: 52, delay: '0s',    blur: 20 },
  { top: '13%', w: 620, h: 58, op: 0.07, dur: 68, delay: '-22s',  blur: 26 },
  { top: '3%',  w: 300, h: 38, op: 0.09, dur: 40, delay: '-12s',  blur: 14 },
  { top: '20%', w: 500, h: 65, op: 0.06, dur: 60, delay: '-38s',  blur: 28 },
  { top: '10%', w: 360, h: 44, op: 0.08, dur: 48, delay: '-48s',  blur: 16 },
  { top: '17%', w: 260, h: 36, op: 0.07, dur: 44, delay: '-30s',  blur: 18 },
]

function CloudDrift() {
  return (
    <div className="absolute top-0 left-0 w-full h-2/3 pointer-events-none overflow-hidden">
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: c.top,
            left: 0,
            width: c.w,
            height: c.h,
            borderRadius: '50%',
            background: `rgba(255,255,255,${c.op})`,
            filter: `blur(${c.blur}px)`,
            animation: `cloudDrift ${c.dur}s linear ${c.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}


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
        <CloudDrift />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-nz/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 w-full">
          <div className="max-w-3xl">
            <div>
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
                  {t('home.flag_badge')}
                </span>
              </motion.div>

              {/* Bengali-forward headline */}
              {language === 'BN' ? (
                <>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="font-bengali text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-tight"
                  >
                    {t('home.hero_title_bn_primary')}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-bengali text-white/65 text-base md:text-lg mt-5 leading-relaxed max-w-lg"
                  >
                    {t('home.hero_subtitle_bn')}
                  </motion.p>
                </>
              ) : (
                <>
                  {/* EN: decorative Bengali sub-tagline + punchy English headline */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-bengali text-brand-soft text-base mb-3 font-medium"
                  >
                    শুরুটা হোক পরিষ্কার, গভীরে যান পরে।
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-tight text-balance"
                  >
                    {t('home.hero_title')}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="text-white/70 text-lg mt-5 leading-relaxed max-w-lg"
                  >
                    {t('home.hero_subtitle')}
                  </motion.p>
                </>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 mt-8"
              >
                <Link
                  to="/plan"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand font-bold rounded-xl hover:bg-brand-light transition-colors shadow-brand-lg text-base"
                >
                  {t('home.cta_start')}
                  <ArrowRight size={18} />
                </Link>
              </motion.div>

              {/* Trust signals */}
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
        </div>
      </section>

      {/* ── How it works (animated steps) ────────────────────────── */}
      <HowItWorks />

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
