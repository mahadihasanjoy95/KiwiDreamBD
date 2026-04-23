import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CheckCircle2, MapPin, Briefcase, Wallet } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { CITIES } from '@/data/cities'

const HERO_IMAGE =
  'https://images.pexels.com/photos/28970672/pexels-photo-28970672.jpeg?cs=srgb&dl=pexels-azizico-28970672.jpg&fm=jpg'

const CITY_IMAGES = {
  AUCKLAND: 'https://images.pexels.com/photos/29724796/pexels-photo-29724796.jpeg?cs=srgb&dl=pexels-diego-silveira-675020766-29724796.jpg&fm=jpg',
  WELLINGTON: 'https://images.pexels.com/photos/1350560/pexels-photo-1350560.jpeg?cs=srgb&dl=pexels-brett-sayles-1350560.jpg&fm=jpg',
  CHRISTCHURCH: 'https://images.pexels.com/photos/552785/pexels-photo-552785.jpeg?cs=srgb&dl=pexels-pixabay-552785.jpg&fm=jpg',
}

const QUICK_STEPS = [
  { key: 'step1', Icon: MapPin },
  { key: 'step2', Icon: Wallet },
  { key: 'step3', Icon: Briefcase },
]

export default function Home() {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const { format } = useCurrency()

  return (
    <div className="min-h-screen bg-[#f7f2ea]">
      <section className="relative overflow-hidden px-4 pb-12 pt-6 sm:px-6 md:pb-16 md:pt-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] bg-[#f4ecdf] p-6 shadow-[0_20px_60px_rgba(57,42,22,0.08)] md:p-8 lg:p-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6b6258] shadow-sm">
              <span>🇧🇩</span>
              <span className="text-[#c7b7a4]">→</span>
              <span>🇳🇿</span>
              <span>{t('home.flag_badge')}</span>
            </div>

            <p className="mt-5 font-bengali text-base font-medium text-[#b66a48] md:text-lg">
              {t('home.hero_bengali')}
            </p>

            <h1 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-tight text-[#173526] md:text-5xl lg:text-6xl">
              {t('home.hero_simple_title')}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#6d6257] md:text-lg">
              {t('home.hero_simple_subtitle')}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/plan"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#173526] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f281c]"
              >
                {t('home.cta_start')}
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#dfd2c3] bg-white px-6 py-3.5 text-sm font-semibold text-[#173526] transition-colors hover:bg-[#fffaf3]"
              >
                {t('home.view_dashboard')}
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[t('home.signal_free'), t('home.signal_currency'), t('home.signal_language')].map(item => (
                <div key={item} className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 text-sm text-[#5e564d] shadow-sm">
                  <CheckCircle2 size={16} className="text-[#2b8a5a]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="relative overflow-hidden rounded-[32px] min-h-[360px] shadow-[0_20px_60px_rgba(57,42,22,0.14)]"
          >
            <img src={HERO_IMAGE} alt={t('home.visual_alt_nature')} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,53,38,0.08),rgba(23,53,38,0.78))]" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="max-w-sm rounded-[28px] bg-[#fffaf3]/92 p-5 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b66a48]">
                  {t('home.hero_card_eyebrow')}
                </p>
                <h2 className="mt-2 font-serif text-2xl leading-tight text-[#173526]">
                  {t('home.hero_card_title')}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#6d6257]">
                  {t('home.hero_card_body')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b66a48]">{t('home.quick_steps_eyebrow')}</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#173526] md:text-3xl">{t('home.quick_steps_title')}</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {QUICK_STEPS.map(({ key, Icon }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[28px] border border-[#e7dccf] bg-white p-5 shadow-[0_14px_34px_rgba(57,42,22,0.06)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ef] text-[#173526]">
                  <Icon size={18} />
                </div>
                <p className="mt-5 text-sm font-semibold text-[#173526]">{t(`home.${key}_title`)}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#6d6257]">{t(`home.${key}_desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b66a48]">{t('home.city_eyebrow')}</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#173526] md:text-3xl">{t('home.city_title')}</h2>
            </div>
            <Link to="/compare" className="inline-flex items-center gap-1 text-sm font-semibold text-[#173526] hover:text-[#0f281c]">
              {t('home.compare_cities')} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {CITIES.slice(0, 3).map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative overflow-hidden rounded-[28px] min-h-[260px] shadow-[0_18px_40px_rgba(57,42,22,0.12)]"
              >
                <img
                  src={CITY_IMAGES[city.id] || HERO_IMAGE}
                  alt={language === 'BN' ? city.nameBN : city.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,31,24,0.1),rgba(18,31,24,0.8))]" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-2xl">{city.emoji}</p>
                  <h3 className="mt-2 font-serif text-2xl font-bold">{language === 'BN' ? city.nameBN : city.name}</h3>
                  <p className="mt-1 text-sm text-white/80">{language === 'BN' ? city.taglineBN : city.taglineEN}</p>
                  <div className="mt-4 inline-flex rounded-full bg-white/14 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                    {t('home.from_label')} {format(city.weeklyRentHint)} /wk
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 pt-8 sm:px-6 md:pb-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-[#173526] px-6 py-10 text-center text-white shadow-[0_26px_70px_rgba(23,53,38,0.18)] md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7b29d]">{t('home.cta_eyebrow')}</p>
          <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">{t('home.cta_banner_title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/72 md:text-base">
            {t('home.cta_banner_subtitle')}
          </p>
          <Link
            to="/plan"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-semibold text-[#173526] transition-colors hover:bg-[#fff6eb]"
          >
            {t('home.cta_start')}
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  )
}
