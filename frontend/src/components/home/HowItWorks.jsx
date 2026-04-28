import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import soloStudentSvg from '@/assets/svg/solo-student.svg'
import aucklandSvg from '@/assets/svg/auckland.svg'
import comfortableSoloSvg from '@/assets/svg/comfortable-solo.svg'
import familyPlanningSvg from '@/assets/svg/family-planning.svg'
import heroCharactersSvg from '@/assets/svg/hero-characters.svg'

const STEPS = [
  {
    icon: soloStudentSvg,
    borderColor: '#7C8FF4',
    glow: '#7C8FF433',
    iconBg: '#E9F0FF',
    titleEN: "Who's Moving?",
    titleBN: 'কে কে যাচ্ছেন?',
    subEN: 'Solo · couple · family',
    subBN: 'একা · দম্পতি · পরিবার',
  },
  {
    icon: aucklandSvg,
    borderColor: '#2FB9B1',
    glow: '#2FB9B133',
    iconBg: '#E7F8F6',
    titleEN: 'Where To?',
    titleBN: 'কোথায় থাকবেন?',
    subEN: 'Auckland · Wellington',
    subBN: 'অকল্যান্ড · ওয়েলিংটন',
  },
  {
    icon: comfortableSoloSvg,
    borderColor: '#D2A44F',
    glow: '#D2A44F33',
    iconBg: '#FFF3DA',
    titleEN: 'Discover Costs',
    titleBN: 'খরচের হিসাব',
    subEN: 'Monthly + moving costs',
    subBN: 'মাসিক + যাওয়ার খরচ',
  },
  {
    icon: familyPlanningSvg,
    borderColor: '#4BAEEA',
    glow: '#4BAEEA33',
    iconBg: '#EAF6FF',
    titleEN: 'Secure Your Fund',
    titleBN: 'ফান্ড নিশ্চিত করুন',
    subEN: 'Survival window calc',
    subBN: 'টিকে থাকার হিসাব',
  },
  {
    icon: heroCharactersSvg,
    borderColor: '#D86FA1',
    glow: '#D86FA133',
    iconBg: '#FCEAF4',
    titleEN: 'Master Your Move',
    titleBN: 'সফলতার পথে',
    subEN: 'Score + savings plan',
    subBN: 'স্কোর + সঞ্চয় পরিকল্পনা',
  },
]

const STEP_GAP = 0.82

function nodeV(delay) {
  return {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay, type: 'spring', stiffness: 280, damping: 18 },
    },
  }
}

function labelV(delay) {
  return {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: delay + 0.22, duration: 0.3 },
    },
  }
}

function hLineV(delay) {
  return {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { delay, duration: 0.48, ease: [0.4, 0, 0.2, 1] },
    },
  }
}

function vLineV(delay) {
  return {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { delay, duration: 0.48, ease: [0.4, 0, 0.2, 1] },
    },
  }
}

const containerV = { hidden: {}, visible: {} }

export function HowItWorks() {
  const language = useStore(s => s.language)

  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section heading ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-brand bg-brand-light px-4 py-1.5 rounded-full mb-4 border border-brand-mid">
            {language === 'BN' ? 'কীভাবে কাজ করে' : 'How it works'}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brand-deep leading-tight">
            {language === 'BN'
              ? 'পরিকল্পনা থেকে প্রস্তুতি'
              : 'From planning to readiness'}
          </h2>
          <p className="text-gray-400 mt-3 text-base md:text-lg">
            {language === 'BN'
              ? '৫টি ধাপে — কোনো login ছাড়াই শুরু করুন'
              : 'Five steps. No login needed to start.'}
          </p>
        </motion.div>

        {/* ── Desktop: horizontal steps ─────────────────── */}
        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="hidden md:flex items-start"
        >
          {STEPS.map((step, i) => (
            <Fragment key={i}>
              {/* Step node */}
              <div className="flex flex-col items-center text-center" style={{ width: 132, flexShrink: 0 }}>
                <motion.div
                  variants={nodeV(i * STEP_GAP)}
                  className="relative"
                  whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400 } }}
                >
                  <StepNode step={step} index={i} />
                </motion.div>

                <motion.div variants={labelV(i * STEP_GAP)}>
                  <div className="mt-4">
                    <p className="font-bold text-gray-900 text-sm leading-snug">
                      {language === 'BN' ? step.titleBN : step.titleEN}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                      {language === 'BN' ? step.subBN : step.subEN}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Animated connector */}
              {i < STEPS.length - 1 && (
                <div className="mt-12 flex flex-1 items-center px-2">
                  <motion.svg
                    variants={hLineV(i * STEP_GAP + 0.42)}
                    className="h-4 w-full origin-left overflow-visible"
                    viewBox="0 0 120 16"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 8 H110"
                      fill="none"
                      stroke={step.borderColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M110 3 L120 8 L110 13 Z"
                      fill={step.borderColor}
                    />
                  </motion.svg>
                </div>
              )}
            </Fragment>
          ))}
        </motion.div>

        {/* ── Mobile: vertical steps ────────────────────── */}
        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex md:hidden flex-col items-center gap-0"
        >
          {STEPS.map((step, i) => (
            <div key={i} className="w-full max-w-xs">
              {/* Step row */}
              <div className="flex items-start gap-5">
                {/* Circle column */}
                <div className="flex flex-col items-center shrink-0">
                  <motion.div
                    variants={nodeV(i * STEP_GAP)}
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    <StepNode step={step} index={i} mobile />
                  </motion.div>
                </div>

                {/* Text */}
                <motion.div variants={labelV(i * STEP_GAP)} className="pt-3 pb-4">
                  <p className="font-bold text-gray-900 text-base leading-snug">
                    {language === 'BN' ? step.titleBN : step.titleEN}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {language === 'BN' ? step.subBN : step.subEN}
                  </p>
                </motion.div>
              </div>

              {/* Vertical connector — ml-[31px] aligns with circle center (w-16/2 - 1px) */}
              {i < STEPS.length - 1 && (
                <div className="ml-[26px] -my-0.5">
                  <motion.svg
                    variants={vLineV(i * STEP_GAP + 0.42)}
                    className="h-11 w-3 origin-top overflow-visible"
                    viewBox="0 0 12 44"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 1 V34"
                      fill="none"
                      stroke={step.borderColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M1 34 L6 44 L11 34 Z"
                      fill={step.borderColor}
                    />
                  </motion.svg>
                </div>
              )}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

function StepNode({ step, index, mobile = false }) {
  const size = mobile ? 'w-16 h-16' : 'w-24 h-24'
  const iconWrap = mobile ? 'h-10 w-10 rounded-xl' : 'h-14 w-14 rounded-2xl'
  const iconSize = mobile ? 'h-8 w-8' : 'h-11 w-11'
  const badge = mobile
    ? 'absolute -top-2 -right-2 w-6 h-6 text-[10px]'
    : 'absolute -top-2.5 -right-2.5 w-7 h-7 text-xs'

  return (
    <Link
      to={index === 0 ? '/plan' : '#'}
      onClick={(event) => {
        if (index !== 0) event.preventDefault()
      }}
      className={index === 0 ? 'block cursor-pointer' : 'block cursor-default'}
      aria-label={index === 0 ? 'Start planning' : undefined}
    >
      <motion.div
        className={`${size} rounded-full flex items-center justify-center bg-white`}
        animate={index === 0 ? { boxShadow: [`0 0 0 6px ${step.glow}, 0 10px 36px ${step.glow}`, `0 0 0 11px ${step.glow}, 0 16px 42px ${step.glow}`, `0 0 0 6px ${step.glow}, 0 10px 36px ${step.glow}`] } : undefined}
        transition={index === 0 ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
        style={{
          border: `${mobile ? 2 : 2.5}px solid ${step.borderColor}`,
          boxShadow: `0 0 0 ${mobile ? 4 : 6}px ${step.glow}, 0 ${mobile ? 6 : 10}px ${mobile ? 20 : 36}px ${step.glow}`,
        }}
      >
        <div
          className={`flex ${iconWrap} items-center justify-center overflow-hidden shadow-inner`}
          style={{ backgroundColor: step.iconBg }}
        >
          <img src={step.icon} alt="" aria-hidden="true" className={`${iconSize} object-contain`} />
        </div>
      </motion.div>
      <div
        className={`${badge} rounded-full flex items-center justify-center font-bold text-white shadow-lg`}
        style={{ background: step.borderColor }}
      >
        {index + 1}
      </div>
    </Link>
  )
}
