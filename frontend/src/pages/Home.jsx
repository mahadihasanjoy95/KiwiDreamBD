import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CheckCircle, Heart, X, Mail } from 'lucide-react'
import useStore from '@/store/useStore'
import logoTigerNew from '@/assets/images/logo_tiger_new.png'
import cloud1 from '@/assets/images/cloud_1.png'
import cloud3 from '@/assets/images/cloud_3.png'
import cloud4 from '@/assets/images/cloud_4.png'
import devTeamImg from '@/assets/images/dev_team.png'
import fernBushSvg from '@/assets/svg/fern-bush.svg'
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
        fill="rgba(33,88,93,0.16)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.3 }}
      />
      <motion.path
        d="M0,240 L0,165 L100,132 L200,152 L320,108 L440,138 L560,98 L680,124 L800,88 L920,116 L1040,90 L1160,128 L1280,100 L1400,136 L1440,142 L1440,240 Z"
        fill="rgba(0,149,161,0.28)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.5 }}
      />
      <motion.path
        d="M0,240 L0,185 L160,158 L280,172 L400,148 L520,165 L640,138 L760,158 L880,130 L1000,154 L1120,132 L1240,162 L1360,140 L1440,168 L1440,240 Z"
        fill="rgba(0,120,124,0.36)"
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
            opacity: Math.min(c.op + 0.30, 0.52),
            animation: `cloudDrift ${c.dur}s ease-in-out ${c.delay} infinite`,
            userSelect: 'none',
            mixBlendMode: 'normal',
          }}
        />
      ))}
    </div>
  )
}

function HomeActionModal({ type, onClose }) {
  const { t } = useTranslation()
  const isTalk = type === 'talk'

  return type ? (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-deep/45 px-5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/55 bg-white/92 p-6 shadow-[0_28px_70px_rgba(0,89,96,0.26)] backdrop-blur-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t('home.modal_close')}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand transition-colors hover:bg-brand-mid"
        >
          <X size={17} />
        </button>

        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-brand-md">
          {isTalk ? <Mail size={20} /> : <Heart size={20} fill="currentColor" />}
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand/65">
          {isTalk ? t('home.talk_badge') : t('home.coffee_badge')}
        </p>
        <h3 className="mt-2 font-serif text-2xl font-bold text-brand-deep md:text-3xl">
          {isTalk ? t('home.talk_title') : t('home.coffee_title')}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#4e6567]">
          {isTalk ? t('home.talk_copy') : t('home.coffee_copy')}
        </p>
        {isTalk ? (
          <div className="mt-5 rounded-3xl border border-brand-mid bg-brand-light/70 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/70">
              {t('home.contact_email_label')}
            </p>
            <a
              href="mailto:hello@kiwidreambd.com"
              className="mt-2 inline-flex rounded-full border border-brand/35 bg-white/70 px-4 py-2 font-bold text-brand-deep glass-pill-hover"
            >
              hello@kiwidreambd.com
            </a>
          </div>
        ) : null}
      </motion.div>
    </div>
  ) : null
}

export default function Home() {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const [modalType, setModalType] = useState(null)

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] md:min-h-[86vh] flex items-center overflow-hidden bg-[linear-gradient(180deg,#c7e5e8_0%,#d8eeee_42%,#f8f2e8_68%,#b6dadd_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.88),transparent_30%),radial-gradient(circle_at_74%_34%,rgba(255,255,255,0.36),transparent_28%)]" />

        <MountainSilhouette />
        <CloudDrift />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24 pt-36 md:pb-28 md:pt-48 w-full">
          <div className="max-w-3xl">
            <div>
              {/* Flag badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/55 bg-white/28 px-4 py-2 mb-8 text-brand-deep shadow-[0_12px_34px_rgba(0,89,96,0.10)] backdrop-blur-xl"
              >
                <span className="text-lg">🇧🇩</span>
                <span className="text-brand/70 text-sm">→</span>
                <span className="text-lg">🇳🇿</span>
                <span className="text-brand-deep/80 text-sm font-semibold ml-1">
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
                    className="font-bengali text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-brand-deep leading-tight"
                  >
                    {t('home.hero_title_bn_primary')}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-bengali text-brand-deep/72 text-base md:text-lg mt-5 leading-relaxed max-w-lg"
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
                    className="text-brand text-base mb-3 font-semibold"
                  >
                    Start clear. Go deeper when you are ready.
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-brand-deep leading-tight text-balance"
                  >
                    {t('home.hero_title')}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="text-brand-deep/72 text-lg mt-5 leading-relaxed max-w-lg"
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
                  className="inline-flex w-auto self-start items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-bold text-white shadow-[0_18px_42px_rgba(0,149,161,0.28)] transition-colors hover:bg-brand-deep glass-pill-hover-dark sm:px-8 sm:py-4"
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
                  <div key={s} className="flex items-center gap-1.5 text-brand-deep/65 text-sm">
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

      {/* ── About ───────────────────────────────────────────────── */}
      <section id="about" className="relative overflow-hidden bg-[linear-gradient(180deg,#eaf6f5_0%,#d8eeee_100%)] py-16 md:py-24">

        {/* Fern bush — bottom-left, responsive */}
        <img
          src={fernBushSvg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 w-[90px] opacity-40 sm:w-[140px] md:w-[220px] md:opacity-50"
        />

        <div className="relative mx-auto max-w-6xl px-6">

          <div className="grid items-center gap-10 md:grid-cols-[0.95fr_1.05fr]">

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="relative flex justify-center md:justify-start"
            >
              <img
                src={devTeamImg}
                alt={t('auth.dev_team_alt')}
                className="h-64 w-auto max-w-[280px] rounded-2xl object-cover shadow-[0_24px_56px_rgba(0,89,96,0.20)] md:h-80 md:max-w-[340px]"
              />
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={logoTigerNew}
                  alt="KiwiDream BD"
                  className="h-10 w-auto shrink-0 drop-shadow-[0_8px_18px_rgba(0,89,96,0.14)] sm:h-12"
                />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/65">
                  {t('home.mascot_badge')}
                </p>
              </div>
              <h2 className="mt-3 font-serif text-3xl font-bold text-brand-deep md:text-4xl">
                {t('home.mascot_title')}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
                {t('home.mascot_copy')}
              </p>
              <p className="mt-2 text-sm font-medium text-brand/70">
                {t('auth.dev_team_caption')}
              </p>

              {/* Contact email — always visible */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-white/60 px-4 py-2 backdrop-blur-sm">
                <Mail size={14} className="text-brand" />
                <a
                  href="mailto:hello@kiwidreambd.com"
                  className="text-sm font-semibold text-brand-deep transition-colors hover:text-brand"
                >
                  hello@kiwidreambd.com
                </a>
              </div>

              {/* Donate button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setModalType('coffee')}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-bold text-white shadow-[0_18px_42px_rgba(0,149,161,0.22)] transition-all hover:bg-brand-deep hover:shadow-[0_22px_48px_rgba(0,149,161,0.32)] active:scale-95"
                >
                  <span>☕</span>
                  {t('home.buy_coffee')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ready to plan CTA — bottom of page ────────────────── */}
      <section className="bg-brand-deep py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Ready to plan your move?
          </h2>
          <p className="mt-4 text-base text-white/65 md:text-lg">
            It takes 2 minutes. No account required.
          </p>
          <Link
            to="/plan"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand-deep shadow-[0_18px_42px_rgba(0,0,0,0.18)] transition-colors hover:bg-brand-light"
          >
            {t('home.cta_start')}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <HomeActionModal type={modalType} onClose={() => setModalType(null)} />
    </div>
  )
}
