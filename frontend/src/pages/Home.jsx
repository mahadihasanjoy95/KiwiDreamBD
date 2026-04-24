import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CheckCircle, MapPin, Briefcase, Heart, ListChecks, Landmark, Coins, X, Mail, Send } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { TigerBlinkLogo } from '@/components/common/TigerBlinkLogo'
import { NZFernIcon } from '@/components/common/NZFernIcon'
import { CITIES } from '@/data/cities'
import cloud1 from '@/assets/images/cloud_1.png'
import cloud3 from '@/assets/images/cloud_3.png'
import cloud4 from '@/assets/images/cloud_4.png'
import tigerSilver from '@/assets/images/logo_tiger_silver.png'
import poosInBoots from '@/assets/images/poos_in_boots.png'
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

/* ── PNG clouds — Aotearoa: Land of the Long White Cloud ── */
const CLOUDS = [
  { src: cloud1, top: '3%',  w: 580, op: 0.16, dur: 132, delay: '0s'    },
  { src: cloud3, top: '15%', w: 760, op: 0.12, dur: 164, delay: '-58s'  },
  { src: cloud4, top: '1%',  w: 420, op: 0.14, dur: 118, delay: '-34s'  },
  { src: cloud1, top: '26%', w: 660, op: 0.10, dur: 178, delay: '-96s'  },
  { src: cloud3, top: '10%', w: 500, op: 0.13, dur: 146, delay: '-112s' },
  { src: cloud4, top: '21%', w: 360, op: 0.10, dur: 126, delay: '-76s'  },
  { src: cloud1, top: '7%',  w: 300, op: 0.09, dur: 154, delay: '-45s'  },
]

function CloudDrift() {
  return (
    <div className="absolute top-0 left-0 w-full h-[70%] pointer-events-none overflow-hidden">
      {CLOUDS.map((c, i) => (
        <img
          key={i}
          src={c.src}
          alt=""
          style={{
            position: 'absolute',
            top: c.top,
            left: 0,
            width: c.w,
            opacity: c.op,
            animation: `cloudDrift ${c.dur}s ease-in-out ${c.delay} infinite`,
            userSelect: 'none',
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </div>
  )
}

function AnimateDonationModal({ open, onClose }) {
  const { t } = useTranslation()

  return open ? (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-deep/45 px-5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/35 bg-white/90 p-6 text-center shadow-[0_28px_70px_rgba(48,31,86,0.28)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t('home.donation_close')}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand transition-colors hover:bg-brand-mid"
        >
          <X size={17} />
        </button>

        <motion.img
          src={poosInBoots}
          alt=""
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto h-36 w-auto"
        />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand/65">
          {t('home.donation_modal_badge')}
        </p>
        <h3 className="mt-2 font-serif text-2xl font-bold text-brand-deep">
          {t('home.donation_modal_title')}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {t('home.donation_copy')}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-deep"
        >
          {t('home.donation_modal_cta')}
        </button>
      </motion.div>
    </div>
  ) : null
}

export default function Home() {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const { format } = useCurrency()
  const currency = useStore(s => s.currency)
  const [donationOpen, setDonationOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] md:min-h-[80vh] bg-gradient-to-br from-brand-deep via-[#5B21B6] to-[#7C3AED] flex items-center overflow-hidden">
        {/* BD stripe accent at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-bd via-transparent to-nz" />

        <MountainSilhouette />
        <CloudDrift />

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
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-brand-soft text-base mb-3 font-medium"
                  >
                    Start clear. Go deeper when you are ready.
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

      {/* ── Brand story ─────────────────────────────────────────── */}
      <section className="border-y border-brand-mid bg-brand-light py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex justify-center md:justify-start"
          >
            <div className="relative flex h-64 w-64 items-center justify-center md:hidden">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <TigerBlinkLogo
                  size={168}
                  artSize={292}
                  alt="KiwiDream BD tiger logo"
                  interactive
                />
              </motion.div>
            </div>
            <img
              src={tigerSilver}
              alt="KiwiDream BD tiger logo"
              className="hidden h-64 w-auto max-w-full drop-shadow-[0_24px_45px_rgba(69,38,119,0.22)] md:block md:h-80"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/65">
              {t('home.mascot_badge')}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-brand-deep md:text-4xl">
              {t('home.mascot_title')}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
              {t('home.mascot_copy')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-16" id="contact">
        <div className="mx-auto grid max-w-6xl items-stretch gap-8 px-6 md:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-[30px] border border-brand-mid bg-[linear-gradient(135deg,#fbf8ff_0%,#f0ebff_100%)] p-6 shadow-brand-sm md:p-8"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-mid bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand/65">
              <Mail size={14} />
              {t('home.contact_badge')}
            </p>
            <h2 className="mt-5 font-serif text-3xl font-bold text-brand-deep md:text-4xl">
              {t('home.contact_title')}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
              {t('home.contact_copy')}
            </p>

            <form className="mt-7 grid gap-4" onSubmit={event => event.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-brand-deep">
                  {t('home.contact_name')}
                  <input
                    type="text"
                    placeholder={t('home.contact_name_placeholder')}
                    className="h-12 rounded-2xl border border-brand-mid bg-white/80 px-4 text-sm font-medium text-brand-deep outline-none transition-colors placeholder:text-gray-400 focus:border-brand"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-brand-deep">
                  {t('home.contact_email')}
                  <input
                    type="email"
                    placeholder={t('home.contact_email_placeholder')}
                    className="h-12 rounded-2xl border border-brand-mid bg-white/80 px-4 text-sm font-medium text-brand-deep outline-none transition-colors placeholder:text-gray-400 focus:border-brand"
                  />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-brand-deep">
                {t('home.contact_message')}
                <textarea
                  rows={4}
                  placeholder={t('home.contact_message_placeholder')}
                  className="resize-none rounded-2xl border border-brand-mid bg-white/80 px-4 py-3 text-sm font-medium text-brand-deep outline-none transition-colors placeholder:text-gray-400 focus:border-brand"
                />
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3 font-bold text-white opacity-80 shadow-[0_18px_40px_rgba(124,58,237,0.18)] sm:w-fit"
                aria-disabled="true"
              >
                <Send size={17} />
                {t('home.contact_cta')}
              </button>
              <p className="text-xs font-medium text-gray-500">
                {t('home.contact_soon')}
              </p>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="relative overflow-hidden rounded-[30px] border border-brand-mid bg-white p-6 shadow-brand-sm md:p-8"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[90px] bg-brand-light/70" />
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative mx-auto flex w-full max-w-xs justify-center"
            >
              <img
                src={poosInBoots}
                alt={t('home.donation_cat_alt')}
                className="h-52 w-auto drop-shadow-[0_24px_48px_rgba(76,29,149,0.18)] md:h-60"
              />
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-2 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-nz text-white shadow-[0_10px_24px_rgba(22,163,74,0.25)]"
              >
                <Heart size={17} fill="currentColor" />
              </motion.div>
            </motion.div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand/65">
              {t('home.donation_badge')}
            </p>
            <h3 className="mt-3 font-serif text-2xl font-bold text-brand-deep md:text-3xl">
              {t('home.donation_title')}
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
              {t('home.donation_copy')}
            </p>
            <button
              type="button"
              onClick={() => setDonationOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3 font-bold text-white shadow-[0_18px_40px_rgba(124,58,237,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-brand-deep"
            >
              <Heart size={18} fill="currentColor" />
              {t('home.donation_cta')}
            </button>
          </motion.div>
        </div>
      </section>

      <AnimateDonationModal open={donationOpen} onClose={() => setDonationOpen(false)} />

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
