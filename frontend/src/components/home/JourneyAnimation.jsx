import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '@/store/useStore'
import soloStudentSvg from '@/assets/svg/solo-student.svg'
import aucklandSvg from '@/assets/svg/auckland.svg'
import comfortableSoloSvg from '@/assets/svg/comfortable-solo.svg'
import familyPlanningSvg from '@/assets/svg/family-planning.svg'
import heroCharactersSvg from '@/assets/svg/hero-characters.svg'

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const STEPS = [
  { id: 1, titleEN: "Who's Moving?", titleBN: 'কে কে যাচ্ছেন?', subEN: 'Solo · couple · family', subBN: 'একা · দম্পতি · পরিবার', color: '#7C5CDB', icon: soloStudentSvg, iconBg: '#E9F0FF' },
  { id: 2, titleEN: 'Where To?', titleBN: 'কোথায় থাকবেন?', subEN: 'Auckland · Wellington', subBN: 'অকল্যান্ড · ওয়েলিংটন', color: '#0095A1', icon: aucklandSvg, iconBg: '#E7F8F6' },
  { id: 3, titleEN: 'Discover Costs', titleBN: 'খরচের হিসাব', subEN: 'Monthly + moving costs', subBN: 'মাসিক + যাওয়ার খরচ', color: '#C07A10', icon: comfortableSoloSvg, iconBg: '#FFF3DA' },
  { id: 4, titleEN: 'Secure Your Fund', titleBN: 'ফান্ড নিশ্চিত করুন', subEN: 'Survival window calc', subBN: 'টিকে থাকার হিসাব', color: '#159D72', icon: familyPlanningSvg, iconBg: '#EAF6FF' },
  { id: 5, titleEN: 'Master Your Move', titleBN: 'সফলতার পথে', subEN: 'Score + savings plan', subBN: 'স্কোর + সঞ্চয় পরিকল্পনা', color: '#C0359A', icon: heroCharactersSvg, iconBg: '#FCEAF4' },
]

const NODE_POS = [
  { x: 108, y: 448 },
  { x: 272, y: 336 },
  { x: 404, y: 222 },
  { x: 198, y: 124 },
  { x: 410, y: 78 },
]

// Which side the label sits for each node
const LABEL_CFG = [
  { side: 'right', dx: 52, dy: 0 },
  { side: 'right', dx: 52, dy: -4 },
  { side: 'left', dx: -52, dy: 0 },
  { side: 'left', dx: -52, dy: 0 },
  { side: 'left', dx: -52, dy: 0 },
]

const MOBILE_NODE_POS = [
  { x: 82, y: 55 },
  { x: 272, y: 145 },
  { x: 82, y: 235 },
  { x: 272, y: 325 },
  { x: 82, y: 415 },
]

const MOBILE_LABEL_CFG = [
  { side: 'right', dx: 52, dy: 4 },
  { side: 'left', dx: -52, dy: 4 },
  { side: 'right', dx: 52, dy: 4 },
  { side: 'left', dx: -52, dy: 4 },
  { side: 'right', dx: 52, dy: 4 },
]

function buildPath(pts) {
  if (pts.length < 2) return ''
  return pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')
}

const eio = t => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

const STEP_DURATION = 2000
const TRAIL_LEN = 80

// Direct angle from node[i] to node[i+1]
function angleTo(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI
}

export function JourneyAnimation() {
  const language = useStore(s => s.language)
  const resetPlan = useStore(s => s.resetPlan)
  const navigate = useNavigate()
  const startFreshPlan = () => {
    resetPlan()
    navigate('/plan')
  }

  const [current, setCurrent] = useState(0)
  const [arrived, setArrived] = useState(false)
  const [progressLen, setProgressLen] = useState(0)
  const [plane, setPlane] = useState({ x: NODE_POS[0].x, y: NODE_POS[0].y, angle: angleTo(NODE_POS[0], NODE_POS[1]) })
  const [breath, setBreath] = useState(0)
  const [nodeLengths, setNodeLengths] = useState([])
  const [totalLen, setTotalLen] = useState(0)

  const pathRef = useRef(null)
  const animRef = useRef(null)
  const pathD = useMemo(() => buildPath(NODE_POS), [])

  // Gentle breathing tick for node pulse
  useEffect(() => {
    let raf
    const t0 = performance.now()
    const tick = now => { setBreath((now - t0) / 900); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Measure path once rendered
  useEffect(() => {
    if (!pathRef.current) return
    const total = pathRef.current.getTotalLength()
    setTotalLen(total)
    const lengths = NODE_POS.map(pt => {
      let best = 0, bestD = Infinity
      for (let i = 0; i <= 800; i++) {
        const l = total * i / 800
        const p = pathRef.current.getPointAtLength(l)
        const d = Math.hypot(p.x - pt.x, p.y - pt.y)
        if (d < bestD) { bestD = d; best = l }
      }
      return best
    })
    setNodeLengths(lengths)
    const p0 = pathRef.current.getPointAtLength(lengths[0])
    setPlane({ x: p0.x, y: p0.y, angle: angleTo(NODE_POS[0], NODE_POS[1]) })
    setProgressLen(lengths[0])
  }, [])

  // Plane travels along the path — no orbit
  useEffect(() => {
    if (!pathRef.current || nodeLengths.length === 0) return
    cancelAnimationFrame(animRef.current)

    if (current === 0) {
      const p = pathRef.current.getPointAtLength(nodeLengths[0])
      setPlane({ x: p.x, y: p.y, angle: angleTo(NODE_POS[0], NODE_POS[1]) })
      setProgressLen(nodeLengths[0])
      setArrived(false)
      return
    }

    const fromLen = nodeLengths[current - 1]
    const toLen = nodeLengths[current]
    const segLen = Math.abs(toLen - fromLen)
    const avgLen = totalLen / (STEPS.length - 1)
    const travelMs = STEP_DURATION * (0.5 + 0.82 * segLen / avgLen)
    const t0 = performance.now()
    setArrived(false)

    const tick = now => {
      const raw = Math.min(1, (now - t0) / travelMs)
      const t = eio(raw)
      const len = fromLen + (toLen - fromLen) * t

      const p = pathRef.current.getPointAtLength(len)
      const angle = angleTo(NODE_POS[current - 1], NODE_POS[current])

      setPlane({ x: p.x, y: p.y, angle })
      setProgressLen(len)

      if (raw < 1) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        // At the node — point toward the next node
        const restAngle = current < STEPS.length - 1
          ? angleTo(NODE_POS[current], NODE_POS[current + 1])
          : angleTo(NODE_POS[current - 1], NODE_POS[current])
        setPlane({ x: NODE_POS[current].x, y: NODE_POS[current].y, angle: restAngle })
        setArrived(true)
      }
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [current, nodeLengths, totalLen])

  // Auto-advance through steps, loops
  useEffect(() => {
    if (nodeLengths.length === 0) return
    const delay = current === 0 ? 850 : STEP_DURATION * 1.28 + 850
    const id = setTimeout(() => setCurrent(c => (c + 1) % STEPS.length), delay)
    return () => clearTimeout(id)
  }, [current, nodeLengths])

  // Dot trail along the path
  const dots = useMemo(() => {
    if (!pathRef.current || totalLen === 0) return []
    const rand = mulberry32(77)
    const arr = []
    let l = 0
    while (l <= totalLen) {
      const p = pathRef.current.getPointAtLength(l)
      arr.push({ x: p.x + (rand() - 0.5) * 1.0, y: p.y + (rand() - 0.5) * 1.0, l, r: 1.6 + rand() * 1.1 })
      l += 8 + rand() * 7
    }
    return arr
  }, [totalLen])

  const jX = Math.sin(breath * 2.1) * 0.4
  const jY = Math.cos(breath * 1.7) * 0.4

  return (
    <div className="relative w-full max-w-[540px] select-none">
      <div className="absolute inset-0 rounded-3xl bg-white/24 backdrop-blur-[1px]" />

      <svg viewBox="0 0 520 520" className="relative w-full h-auto overflow-visible" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="jGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <filter id="jNodeShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.22" />
          </filter>
          <mask id="jPathReveal">
            <path
              d={pathD}
              fill="none"
              stroke="#fff"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${progressLen} ${totalLen || 1}`}
            />
          </mask>
          <style>{`
            @keyframes jpulse   { 0%,100%{opacity:.15;r:52} 50%{opacity:0;r:64} }
            @keyframes jbadge   { 0%,100%{opacity:.85} 50%{opacity:1} }
          `}</style>
        </defs>

        {/* Hidden measurement path */}
        <path ref={pathRef} d={pathD} fill="none" stroke="transparent" strokeWidth="1" />

        {/* Revealed path — from start to plane position */}
        {totalLen > 0 && progressLen > 0 && (
          <path
            d={pathD}
            fill="none"
            stroke="rgba(0,149,161,0.86)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="1 10"
            mask="url(#jPathReveal)"
          />
        )}

        {/* Dot trail */}
        {dots.map((dot, i) => {
          const behind = progressLen - dot.l
          const inTrail = behind >= 0 && behind < TRAIL_LEN
          const trailT = inTrail ? 1 - behind / TRAIL_LEN : 0
          const revealed = dot.l <= progressLen
          if (!revealed) return null

          const op = inTrail ? 0.82 + trailT * 0.18 : 0.7
          const r = dot.r + trailT * 2.4
          const fill = inTrail
            ? `rgba(255,220,100,${0.7 + trailT * 0.3})`
            : 'rgba(0,149,161,0.82)'
          return (
            <circle key={i} cx={dot.x} cy={dot.y} r={r} fill={fill} opacity={op}
              style={inTrail ? { filter: `drop-shadow(0 0 ${4 + trailT * 6}px rgba(255,200,60,${0.35 + trailT * 0.5}))` } : undefined}
            />
          )
        })}

        {/* Nodes */}
        {STEPS.map((step, i) => {
          const { x, y } = NODE_POS[i]
          const isCur = i === current
          const isDone = i < current || (i === current && arrived)
          const scale = isCur ? 1.24 : isDone ? 1.04 : 0.96
          const op = i > current ? 0.72 : isDone ? 0.9 : 1
          const pulse = isCur ? 1 : 1 + Math.sin(breath * 1.4 + i * 1.1) * 0.008
          const cfg = LABEL_CFG[i]
          const anchor = cfg.side === 'right' ? 'start' : 'end'
          const labelOp = i > current ? 0.72 : isCur ? 1 : 0.82
          const title = language === 'BN' ? step.titleBN : step.titleEN
          const sub = language === 'BN' ? step.subBN : step.subEN

          return (
            <g
              key={step.id}
              transform={`translate(${x} ${y})`}
              role={i === 0 ? 'button' : undefined}
              tabIndex={i === 0 ? 0 : undefined}
              aria-label={i === 0 ? title : undefined}
              onClick={i === 0 ? startFreshPlan : undefined}
              onKeyDown={i === 0 ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  startFreshPlan()
                }
              } : undefined}
              style={{ cursor: i === 0 ? 'pointer' : 'default' }}
            >
              {/* Node circle group */}
              <g style={{
                transform: `scale(${scale * pulse})`,
                transformOrigin: '0 0',
                transition: 'transform 450ms cubic-bezier(0.34,1.56,0.64,1), opacity 350ms ease',
                opacity: op,
              }}>
                {/* Active glow ring */}
                {isCur && (
                  <circle r="52" fill={step.color} opacity="0.14"
                    style={{ animation: 'jpulse 2.4s ease-in-out infinite', transformOrigin: '0 0' }}
                  />
                )}
                {isCur && <circle r="42" fill={step.color} opacity="0.20" />}

                {/* Outer ring */}
                <circle r={36} fill="rgba(255,255,255,0.96)" stroke={step.color}
                  strokeWidth={isCur ? 3 : 2}
                  filter="url(#jNodeShadow)"
                />
                {/* Icon base */}
                <circle r={isCur ? 25 : 22} fill={step.iconBg} opacity={i > current ? 0.78 : 1} />
                {/* Icon */}
                <image
                  href={step.icon}
                  x={isCur ? -18 : -16}
                  y={isCur ? -18 : -16}
                  width={isCur ? 36 : 32}
                  height={isCur ? 36 : 32}
                  preserveAspectRatio="xMidYMid meet"
                />

                {/* Step number badge */}
                <g transform="translate(24,-24)">
                  <circle r="11" fill="#fff" stroke={step.color} strokeWidth="1.6" />
                  <text textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="800" fill={step.color}
                    style={{ animation: isCur ? 'jbadge 1.6s ease-in-out infinite' : undefined }}>
                    {isDone ? '✓' : step.id}
                  </text>
                </g>
              </g>

              {/* Label */}
              <g transform={`translate(${cfg.dx} ${cfg.dy})`}
                style={{ opacity: labelOp, transition: 'opacity 350ms ease', pointerEvents: 'none' }}>
                <text textAnchor={anchor} y="-1" fontSize={isCur ? 17 : 12.5} fontWeight={isCur ? '850' : '700'}
                  fill="#0e1b24"
                  style={{
                    fontFamily: "'DM Sans','Noto Sans Bengali',system-ui,sans-serif",
                    filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.9))',
                    transition: 'font-size 320ms ease',
                  }}>
                  {title}
                </text>
                <text textAnchor={anchor} y={isCur ? 21 : 15} fontSize={isCur ? 13.2 : 10.5}
                  fill="#243746"
                  style={{
                    fontFamily: "'DM Sans','Noto Sans Bengali',system-ui,sans-serif",
                    filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.86))',
                    transition: 'font-size 320ms ease, y 320ms ease',
                  }}>
                  {sub}
                </text>
              </g>
            </g>
          )
        })}

        {/* Plane — vector shape so the nose always follows the segment angle */}
        <g transform={`translate(${plane.x + jX} ${plane.y + jY})`} style={{ pointerEvents: 'none' }}>
          <circle r="26" fill="url(#jGlow)" />
          <g transform={`rotate(${plane.angle})`}>
            <path
              d="M 23 0 L -17 -12 L -9 -2 L -21 0 L -9 2 L -17 12 Z"
              fill="#f8fbff"
              stroke="#147d86"
              strokeWidth="2.2"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.28))' }}
            />
            <path
              d="M -5 -2 L 8 0 L -5 2"
              fill="none"
              stroke="#ffd45c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g opacity="0.42">
              <path d="M -25 -4 H -36" fill="none" stroke="#147d86" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M -23 5 H -31" fill="none" stroke="#147d86" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

export function MobileJourneyAnimation() {
  const language = useStore(s => s.language)
  const resetPlan = useStore(s => s.resetPlan)
  const navigate = useNavigate()
  const startFreshPlan = () => {
    resetPlan()
    navigate('/plan')
  }
  const [current, setCurrent] = useState(0)
  const [arrived, setArrived] = useState(false)
  const [progressLen, setProgressLen] = useState(0)
  const [plane, setPlane] = useState({
    x: MOBILE_NODE_POS[0].x,
    y: MOBILE_NODE_POS[0].y,
    angle: angleTo(MOBILE_NODE_POS[0], MOBILE_NODE_POS[1]),
  })
  const [nodeLengths, setNodeLengths] = useState([])
  const [totalLen, setTotalLen] = useState(0)
  const [breath, setBreath] = useState(0)
  const pathRef = useRef(null)
  const animRef = useRef(null)
  const pathD = useMemo(() => buildPath(MOBILE_NODE_POS), [])

  useEffect(() => {
    let raf
    const t0 = performance.now()
    const tick = now => {
      setBreath((now - t0) / 900)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!pathRef.current) return
    const total = pathRef.current.getTotalLength()
    setTotalLen(total)
    const lengths = MOBILE_NODE_POS.map(pt => {
      let best = 0
      let bestD = Infinity
      for (let i = 0; i <= 800; i++) {
        const l = total * i / 800
        const p = pathRef.current.getPointAtLength(l)
        const d = Math.hypot(p.x - pt.x, p.y - pt.y)
        if (d < bestD) {
          bestD = d
          best = l
        }
      }
      return best
    })
    setNodeLengths(lengths)
    setProgressLen(lengths[0])
    setPlane({
      x: MOBILE_NODE_POS[0].x,
      y: MOBILE_NODE_POS[0].y,
      angle: angleTo(MOBILE_NODE_POS[0], MOBILE_NODE_POS[1]),
    })
  }, [])

  useEffect(() => {
    if (!pathRef.current || nodeLengths.length === 0) return
    cancelAnimationFrame(animRef.current)

    if (current === 0) {
      setProgressLen(nodeLengths[0])
      setPlane({
        x: MOBILE_NODE_POS[0].x,
        y: MOBILE_NODE_POS[0].y,
        angle: angleTo(MOBILE_NODE_POS[0], MOBILE_NODE_POS[1]),
      })
      setArrived(false)
      return
    }

    const fromLen = nodeLengths[current - 1]
    const toLen = nodeLengths[current]
    const segLen = Math.abs(toLen - fromLen)
    const avgLen = totalLen / (STEPS.length - 1)
    const travelMs = STEP_DURATION * (0.62 + 0.78 * segLen / avgLen)
    const t0 = performance.now()
    setArrived(false)

    const tick = now => {
      const raw = Math.min(1, (now - t0) / travelMs)
      const t = eio(raw)
      const len = fromLen + (toLen - fromLen) * t
      const p = pathRef.current.getPointAtLength(len)
      const angle = angleTo(MOBILE_NODE_POS[current - 1], MOBILE_NODE_POS[current])

      setProgressLen(len)
      setPlane({ x: p.x, y: p.y, angle })

      if (raw < 1) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        const restAngle = current < STEPS.length - 1
          ? angleTo(MOBILE_NODE_POS[current], MOBILE_NODE_POS[current + 1])
          : angleTo(MOBILE_NODE_POS[current - 1], MOBILE_NODE_POS[current])
        setPlane({ x: MOBILE_NODE_POS[current].x, y: MOBILE_NODE_POS[current].y, angle: restAngle })
        setArrived(true)
      }
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [current, nodeLengths, totalLen])

  useEffect(() => {
    if (nodeLengths.length === 0) return
    const delay = current === 0 ? 750 : STEP_DURATION * 1.24 + 800
    const id = setTimeout(() => setCurrent(c => (c + 1) % STEPS.length), delay)
    return () => clearTimeout(id)
  }, [current, nodeLengths])

  const dots = useMemo(() => {
    if (!pathRef.current || totalLen === 0) return []
    const rand = mulberry32(88)
    const arr = []
    let l = 0
    while (l <= totalLen) {
      const p = pathRef.current.getPointAtLength(l)
      arr.push({ x: p.x + (rand() - 0.5) * 1.2, y: p.y + (rand() - 0.5) * 1.2, l, r: 1.8 + rand() * 1.1 })
      l += 10 + rand() * 8
    }
    return arr
  }, [])

  return (
    <section className="relative overflow-hidden bg-white px-5 py-12 md:hidden">
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,#d8eeee_0%,rgba(255,255,255,0)_100%)]" />
      <div className="relative mx-auto max-w-sm">
        <div className="mb-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand">
            {language === 'BN' ? 'কীভাবে কাজ করে' : 'How it works'}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-brand-deep">
            {language === 'BN' ? 'পরিকল্পনা থেকে প্রস্তুতি' : 'From planning to readiness'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#51666b]">
            {language === 'BN' ? '৫টি ধাপে — কোনো login ছাড়াই শুরু করুন' : 'Five steps. No login needed to start.'}
          </p>
        </div>

        <svg viewBox="0 0 360 460" className="relative mt-2 h-auto w-full overflow-visible" preserveAspectRatio="xMidYMin meet">
          <defs>
            <radialGradient id="mGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <filter id="mNodeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#005960" floodOpacity="0.18" />
            </filter>
            <mask id="mPathReveal">
              <path
                d={pathD}
                fill="none"
                stroke="#fff"
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray={`${progressLen} ${totalLen || 1}`}
              />
            </mask>
          </defs>

          <path ref={pathRef} d={pathD} fill="none" stroke="transparent" strokeWidth="1" />
          {totalLen > 0 && progressLen > 0 ? (
            <path
              d={pathD}
              fill="none"
              stroke="rgba(0,149,161,0.88)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray="1 10"
              mask="url(#mPathReveal)"
            />
          ) : null}

          {dots.map((dot, i) => {
            const behind = progressLen - dot.l
            const inTrail = behind >= 0 && behind < TRAIL_LEN
            const trailT = inTrail ? 1 - behind / TRAIL_LEN : 0
            if (dot.l > progressLen) return null
            return (
              <circle
                key={i}
                cx={dot.x}
                cy={dot.y}
                r={dot.r + trailT * 2.3}
                fill={inTrail ? '#ffd45c' : '#0095a1'}
                opacity={inTrail ? 0.9 : 0.58}
              />
            )
          })}

          {STEPS.map((step, index) => {
            const { x, y } = MOBILE_NODE_POS[index]
            const cfg = MOBILE_LABEL_CFG[index]
            const isActive = index === current
            const isDone = index < current || (index === current && arrived)
            const title = language === 'BN' ? step.titleBN : step.titleEN
            const sub = language === 'BN' ? step.subBN : step.subEN
            const anchor = cfg.side === 'right' ? 'start' : 'end'
            const nodeScale = isActive ? 1.28 : isDone ? 1.02 : 0.94

            return (
              <g
                key={step.id}
                transform={`translate(${x} ${y})`}
                role={index === 0 ? 'button' : undefined}
                tabIndex={index === 0 ? 0 : undefined}
                aria-label={index === 0 ? title : undefined}
                onClick={index === 0 ? startFreshPlan : undefined}
                onKeyDown={index === 0 ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    startFreshPlan()
                  }
                } : undefined}
                style={{ cursor: index === 0 ? 'pointer' : 'default' }}
              >
                {isActive ? <circle r="50" fill={step.color} opacity="0.12" /> : null}
                <g style={{
                  transform: `scale(${nodeScale})`,
                  transformOrigin: '0 0',
                  transition: 'transform 420ms cubic-bezier(0.34,1.56,0.64,1), opacity 300ms ease',
                  opacity: index > current ? 0.74 : 1,
                }}>
                  <circle r={isActive ? 29 : 26} fill="#fff" stroke={step.color} strokeWidth={isActive ? 3 : 2.2} filter="url(#mNodeShadow)" />
                  <circle r={isActive ? 19 : 17} fill={step.iconBg} />
                  <image
                    href={step.icon}
                    x={isActive ? -12.5 : -11}
                    y={isActive ? -12.5 : -11}
                    width={isActive ? 25 : 22}
                    height={isActive ? 25 : 22}
                    preserveAspectRatio="xMidYMid meet"
                  />
                  <g transform="translate(20,-20)">
                    <circle r="9.5" fill="#fff" stroke={step.color} strokeWidth="1.5" />
                    <text textAnchor="middle" dominantBaseline="central" fontSize="8.8" fontWeight="900" fill={step.color}>
                      {isDone ? '✓' : step.id}
                    </text>
                  </g>
                </g>
                <g transform={`translate(${cfg.dx} ${cfg.dy})`}>
                  <text textAnchor={anchor} y="-6" fontSize={isActive ? 17.5 : 13} fontWeight={isActive ? '900' : '850'} fill="#0e1b24"
                    style={{ fontFamily: "'DM Sans','Noto Sans Bengali',system-ui,sans-serif", transition: 'font-size 320ms ease' }}>
                    {title}
                  </text>
                  <text textAnchor={anchor} y={isActive ? 19 : 14} fontSize={isActive ? 13 : 10.5} fill="#51666b"
                    style={{ fontFamily: "'DM Sans','Noto Sans Bengali',system-ui,sans-serif", transition: 'font-size 320ms ease, y 320ms ease' }}>
                    {sub}
                  </text>
                </g>
              </g>
            )
          })}

          <g transform={`translate(${plane.x} ${plane.y})`} style={{ pointerEvents: 'none' }}>
            <circle r="20" fill="url(#mGlow)" />
            <g transform={`rotate(${plane.angle})`}>
              <path d="M 19 0 L -14 -10 L -7 -1.5 L -17 0 L -7 1.5 L -14 10 Z" fill="#f8fbff" stroke="#147d86" strokeWidth="1.9" strokeLinejoin="round" />
              <path d="M -4 -1.5 L 7 0 L -4 1.5" fill="none" stroke="#ffd45c" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M -21 -3 H -30" fill="none" stroke="#147d86" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
              <path d="M -19 4 H -26" fill="none" stroke="#147d86" strokeWidth="1.1" strokeLinecap="round" opacity="0.38" />
            </g>
          </g>
        </svg>
      </div>
    </section>
  )
}
