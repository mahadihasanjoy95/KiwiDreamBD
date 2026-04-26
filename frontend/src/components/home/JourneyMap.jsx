import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useStore from '@/store/useStore'

const STEPS = [
  { x: 65, y: 155, icon: '🎒', labelKey: 'journey_step1_title', subKey: 'journey_step1_sub', color: '#A78BFA' },
  { x: 200, y: 90, icon: '🏙️', labelKey: 'journey_step2_title', subKey: 'journey_step2_sub', color: '#34D399' },
  { x: 335, y: 148, icon: '📊', labelKey: 'journey_step3_title', subKey: 'journey_step3_sub', color: '#FBBF24' },
]

const PATH = 'M 65,155 C 120,60 145,160 200,90 C 255,20 280,148 335,148'

function AnimatedDashedPath() {
  return (
    <motion.path
      d={PATH}
      stroke="rgba(255,255,255,0.35)"
      strokeWidth="2"
      strokeDasharray="6 5"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.6 }}
    />
  )
}

export function JourneyMap() {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const [activeStep, setActiveStep] = useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 200, damping: 28 }}
      className="w-full max-w-md mx-auto lg:mx-0"
    >
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1E1148]/90 border-b border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">🗺️</span>
            <span className="text-white font-semibold text-sm">
              {language === 'BN' ? t('home.journey_map_title') : 'Your Journey Map'}
            </span>
          </div>
          <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full px-2.5 py-0.5">
            3 Steps
          </span>
        </div>

        {/* SVG island map */}
        <div className="bg-gradient-to-br from-[#2D1B69] via-[#1E1050] to-[#0F0830] px-2 pt-2 pb-0">
          <svg
            viewBox="0 0 400 220"
            className="w-full"
            style={{ display: 'block' }}
          >
            {/* Ocean texture lines */}
            {[40, 80, 120, 160, 200].map(y => (
              <motion.line
                key={y}
                x1="0" y1={y} x2="400" y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
            ))}

            {/* Animated dashed path */}
            <AnimatedDashedPath />

            {/* Islands */}
            {STEPS.map((step, i) => (
              <g
                key={i}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Island glow */}
                <motion.circle
                  cx={step.x} cy={step.y} r="36"
                  fill={step.color}
                  opacity="0.08"
                  initial={{ scale: 0 }}
                  animate={{ scale: activeStep === i ? 1.3 : 1 }}
                  transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 300 }}
                />
                {/* Island base */}
                <motion.circle
                  cx={step.x} cy={step.y} r="26"
                  fill={`${step.color}22`}
                  stroke={step.color}
                  strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 300, damping: 20 }}
                />
                {/* Icon */}
                <motion.text
                  x={step.x} y={step.y + 7}
                  textAnchor="middle"
                  fontSize="18"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.15 }}
                >
                  {step.icon}
                </motion.text>
                {/* Step number badge */}
                <motion.circle
                  cx={step.x + 18} cy={step.y - 18} r="10"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.15, type: 'spring', stiffness: 400 }}
                />
                <motion.text
                  x={step.x + 18} y={step.y - 14}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#4C1D95"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.15 }}
                >
                  {i + 1}
                </motion.text>

                {/* Label below island */}
                <motion.text
                  x={step.x} y={step.y + 44}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="rgba(255,255,255,0.85)"
                  initial={{ opacity: 0, y: step.y + 50 }}
                  animate={{ opacity: 1, y: step.y + 44 }}
                  transition={{ delay: 0.9 + i * 0.15 }}
                >
                  {t(`home.${step.labelKey}`)}
                </motion.text>
                <motion.text
                  x={step.x} y={step.y + 57}
                  textAnchor="middle"
                  fontSize="8.5"
                  fill="rgba(255,255,255,0.45)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 + i * 0.15 }}
                >
                  {t(`home.${step.subKey}`)}
                </motion.text>
              </g>
            ))}

            {/* Compass rose */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 1.2 }}
            >
              <circle cx="375" cy="200" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <text x="375" y="195" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.6)" fontWeight="600">N</text>
              <text x="375" y="210" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.6)" fontWeight="600">S</text>
              <text x="367" y="204" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.6)" fontWeight="600">W</text>
              <text x="384" y="204" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.6)" fontWeight="600">E</text>
            </motion.g>
          </svg>
        </div>

        {/* Step bar */}
        <div className="grid grid-cols-3 bg-[#160D3E] border-t border-white/10">
          {STEPS.map((step, i) => (
            <button
              key={i}
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
              className={`py-3 px-2 text-center transition-colors border-r last:border-r-0 border-white/10 ${
                activeStep === i ? 'bg-amber-400/10' : 'hover:bg-white/5'
              }`}
            >
              <p className={`text-[11px] font-semibold transition-colors ${
                activeStep === i ? 'text-amber-300' : 'text-white/70'
              }`}>
                {t(`home.journey_step${i + 1}_title`)}
              </p>
              <p className="text-[9px] text-white/35 mt-0.5 leading-tight">
                {t(`home.journey_step${i + 1}_sub`)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
