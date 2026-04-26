import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CheckCircle, ChevronDown, Heart, X, Mail, Send } from 'lucide-react'
import useStore from '@/store/useStore'
import logoTigerNew from '@/assets/images/logo_tiger_new.png'
import cloud1 from '@/assets/images/cloud_1.png'
import cloud3 from '@/assets/images/cloud_3.png'
import cloud4 from '@/assets/images/cloud_4.png'
import devTeamImg from '@/assets/images/dev_team.png'
import fernBushSvg from '@/assets/svg/fern-bush.svg'
import smallFlowersSvg from '@/assets/svg/small-flowers.svg'
import { HowItWorks } from '@/components/home/HowItWorks'
import { JourneyAnimation, MobileJourneyAnimation } from '@/components/home/JourneyAnimation'

function MountainSilhouette() {
  return (
    <svg
      className="absolute bottom-[4.75rem] left-0 w-full md:bottom-0"
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
  const isContact = type === 'contact'
  const isCoffee = type === 'coffee'

  return type ? (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-deep/50 px-5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/80 bg-[#f7fbfb] p-6 shadow-[0_28px_70px_rgba(0,89,96,0.26)]"
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
          {isContact ? <Mail size={20} /> : <Heart size={20} fill="currentColor" />}
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          {isContact ? t('home.contact_badge') : t('home.coffee_badge')}
        </p>
        <h3 className="mt-2 font-serif text-2xl font-bold text-brand-deep md:text-3xl">
          {isContact ? t('home.contact_title') : t('home.coffee_title')}
        </h3>
        <p className="mt-3 text-sm font-medium leading-relaxed text-[#334d52]">
          {isContact ? t('home.contact_copy') : t('home.coffee_copy')}
        </p>
        {isContact ? (
          <form
            className="mt-5 space-y-3"
            onSubmit={(event) => {
              event.preventDefault()
              const formData = new FormData(event.currentTarget)
              const subject = encodeURIComponent(`KiwiDream BD message from ${formData.get('name') || 'student'}`)
              const body = encodeURIComponent(`${formData.get('message') || ''}\n\nReply to: ${formData.get('email') || ''}`)
              window.location.href = `mailto:hello@kiwidreambd.com?subject=${subject}&body=${body}`
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-brand">
                  {t('home.contact_name')}
                </span>
                <input name="name" className="home-modal-input" placeholder={t('home.contact_name_placeholder')} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-brand">
                  {t('home.contact_email')}
                </span>
                <input name="email" type="email" className="home-modal-input" placeholder={t('home.contact_email_placeholder')} />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-brand">
                {t('home.contact_message')}
              </span>
              <textarea name="message" rows="4" className="home-modal-input resize-none" placeholder={t('home.contact_message_placeholder')} />
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_16px_36px_rgba(0,149,161,0.22)] hover:bg-brand-deep"
            >
              <Send size={16} />
              {t('home.contact_cta')}
            </button>
          </form>
        ) : null}
        {isCoffee ? (
          <div className="mt-5 grid gap-3 rounded-3xl border border-brand-mid bg-brand-light p-4">
            <button
              type="button"
              onClick={() => window.open('https://www.buymeacoffee.com/', '_blank', 'noopener,noreferrer')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_16px_36px_rgba(0,149,161,0.22)] hover:bg-brand-deep"
            >
              <Heart size={16} fill="currentColor" />
              {t('home.coffee_cta')}
            </button>
            <a
              href="mailto:hello@kiwidreambd.com?subject=KiwiDream%20BD%20support"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand/30 bg-white/70 px-5 py-3 text-sm font-bold text-brand-deep hover:bg-white"
            >
              <Mail size={16} />
              {t('home.coffee_email_cta')}
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
  const resetPlan = useStore(s => s.resetPlan)
  const [modalType, setModalType] = useState(null)
  const [heroInView, setHeroInView] = useState(true)
  const [triangleHiddenByClick, setTriangleHiddenByClick] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 80) setTriangleHiddenByClick(false)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToHowItWorks = () => {
    setTriangleHiddenByClick(true)
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const startFreshPlan = () => {
    resetPlan()
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-start overflow-hidden bg-[linear-gradient(180deg,#c7e5e8_0%,#d8eeee_42%,#f8f2e8_68%,#b6dadd_100%)] md:min-h-[86vh] md:items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.88),transparent_30%),radial-gradient(circle_at_74%_34%,rgba(255,255,255,0.36),transparent_28%)]" />

        <MountainSilhouette />
        <CloudDrift />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-28 pt-24 sm:pt-28 md:pb-16 md:pt-28 w-full">
          <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-4 md:gap-8 items-center">
            <div className="max-w-xl">
            <div>
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
                  onClick={startFreshPlan}
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

            {/* Journey animation — desktop right column */}
            <div className="hidden md:flex justify-center items-center">
              <JourneyAnimation />
            </div>

          </div>
        </div>

        {/* ── Curved wave: hero → how it works ── */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-[15] pointer-events-none">
          <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="block w-full h-[22px] md:h-[72px]">
            <path d="M0,72 L0,52 C360,8 720,40 1080,18 C1200,10 1320,28 1440,20 L1440,72 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Triangle scroll button — desktop disabled because hero journey now serves this purpose.
      {heroInView && !triangleHiddenByClick ? (
        <div
          className="relative hidden justify-center transition-opacity duration-500 md:flex"
          style={{ marginTop: '-40px', zIndex: 25 }}
        >
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ delay: 0.95, type: 'spring', stiffness: 260, damping: 20 }}
          onClick={scrollToHowItWorks}
          className="group flex flex-col items-center outline-none"
          aria-label={t('home.see_how_it_works')}
        >
          <span className="relative flex h-16 w-20 items-center justify-center sm:h-[4.6rem] sm:w-24">
            <motion.span
              aria-hidden="true"
              animate={{ scale: [1, 1.12, 1], opacity: [0.42, 0.12, 0.42] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-brand/35"
              style={{ clipPath: 'polygon(50% 100%, 4% 12%, 96% 12%)' }}
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-2 bottom-1 top-2 bg-white/72 shadow-[0_20px_46px_rgba(0,89,96,0.22)] backdrop-blur-xl transition-colors group-hover:bg-white/88"
              style={{ clipPath: 'polygon(50% 100%, 2% 0%, 98% 0%)' }}
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-5 bottom-4 top-5 bg-brand"
              style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
            />
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.05, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 mt-1 text-white"
            >
              <ChevronDown size={22} strokeWidth={3} />
            </motion.span>
          </span>
        </motion.button>
        </div>
      ) : (
        <div className="relative hidden h-0 md:block" style={{ marginTop: '-40px' }} />
      )}
      */}

      {/* ── Mobile journey animation ─────────────────────────────── */}
      <MobileJourneyAnimation />

      {/* ── Old How it works section — desktop disabled, retained for reference.
      <HowItWorks />
      */}

      {/* ── Wave divider: how it works → about ── */}
      <div className="relative overflow-hidden bg-white h-[52px] md:h-[72px]">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="absolute bottom-0 block w-full h-full">
          <path d="M0,30 C360,72 900,20 1200,52 C1300,60 1380,42 1440,48 L1440,72 L0,72 Z" fill="#eaf6f5" />
        </svg>
      </div>

      {/* ── About ───────────────────────────────────────────────── */}
      <section id="about" className="relative overflow-hidden bg-[linear-gradient(180deg,#eaf6f5_0%,#d8eeee_100%)] py-16 md:py-24">

        {/* Fern bush — bottom-left, responsive */}
        <img
          src={fernBushSvg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 w-[90px] opacity-40 sm:w-[140px] md:w-[220px] md:opacity-50"
        />
        <img
          src={smallFlowersSvg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-10 hidden w-[150px] opacity-55 sm:block md:right-6 md:top-16 md:w-[220px]"
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
              <div className="flex items-center gap-2">
                <span className="relative block h-[44px] w-[44px] overflow-hidden shrink-0">
                  <img
                    src={logoTigerNew}
                    alt="KiwiDream BD"
                    className="absolute left-1/2 top-1/2 h-[55px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_6px_14px_rgba(0,89,96,0.14)]"
                  />
                </span>
                <span className="font-logo text-xl font-semibold tracking-[0.22em] text-brand-deep leading-none">
                  B K W I
                </span>
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

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalType('contact')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand/30 bg-white/80 px-6 py-3 font-bold text-brand-deep shadow-[0_14px_34px_rgba(0,89,96,0.08)] backdrop-blur-sm transition-all hover:bg-white active:scale-95"
                >
                  <Mail size={16} className="text-brand" />
                  {t('home.contact_title')}
                </button>
                <button
                  type="button"
                  onClick={() => setModalType('coffee')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-bold text-white shadow-[0_18px_42px_rgba(0,149,161,0.22)] transition-all hover:bg-brand-deep hover:shadow-[0_22px_48px_rgba(0,149,161,0.32)] active:scale-95"
                >
                  <Heart size={16} fill="currentColor" />
                  {t('home.buy_coffee')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ready to plan CTA — bottom of page ────────────────── */}
      <section className="bg-[linear-gradient(180deg,#b9d8d8_0%,#9fc8c8_100%)] py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-brand-deep md:text-4xl lg:text-5xl">
            Ready to plan your move?
          </h2>
          <p className="mt-4 text-base font-medium text-brand-deep/80 md:text-lg">
            It takes 2 minutes. No account required.
          </p>
          <Link
            to="/plan"
            onClick={startFreshPlan}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-[0_18px_42px_rgba(0,89,96,0.24)] transition-colors hover:bg-brand-deep"
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
