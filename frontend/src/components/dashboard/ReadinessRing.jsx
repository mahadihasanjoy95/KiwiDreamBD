import { motion } from 'framer-motion'

const radius = 54
const circumference = 2 * Math.PI * radius

function getColor(score) {
  if (score >= 70) return '#2B8A5A'
  if (score >= 50) return '#C78039'
  return '#C95F4A'
}

export function ReadinessRing({ score = 72, size = 152 }) {
  const offset = circumference - (score / 100) * circumference
  const color = getColor(score)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#E7DCCF"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="text-4xl font-bold"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-xs font-medium text-[#8f8274]">/ 100</span>
      </div>
    </div>
  )
}
