import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Home,
  MessageCircle,
  PlaneTakeoff,
  RotateCcw,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import useStore from '@/store/useStore'
import { CHECKLIST_GROUPS } from '@/data/checklist'

const groupIcons = {
  documents: FileText,
  financial: Banknote,
  accommodation: Home,
  communication: MessageCircle,
  health: HeartPulse,
}

function localize(language, en, bn) {
  return language === 'BN' ? bn : en
}

export default function Checklist() {
  const language = useStore(s => s.language)
  const [completed, setCompleted] = useState({})

  const totals = useMemo(() => {
    const total = CHECKLIST_GROUPS.reduce((sum, group) => sum + group.items.length, 0)
    const done = Object.values(completed).filter(Boolean).length
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 }
  }, [completed])

  const resetChecklist = () => setCompleted({})

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eaf6f5_0%,#f8f2e8_42%,#eaf6f5_100%)] text-brand-deep">
      <section className="relative border-b border-white/70 bg-[linear-gradient(135deg,#c7e5e8_0%,#f8f2e8_58%,#b6dadd_100%)]">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#eaf6f5] to-transparent" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 pb-14 pt-24 md:grid-cols-[1fr_0.76fr] md:items-end md:pb-20 md:pt-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/45 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand shadow-sm backdrop-blur">
              <ClipboardCheck size={15} />
              {localize(language, 'Pre-departure checklist', 'Pre-departure checklist')}
            </div>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-brand-deep md:text-6xl">
              {localize(language, 'Know what must be ready before you fly.', 'উড়ার আগে কী কী ready থাকতে হবে জানুন।')}
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-[#334d52] md:text-lg">
              {localize(
                language,
                'Use this as a practical starter checklist for documents, money, accommodation, communication, and health preparation.',
                'Document, money, accommodation, communication এবং health preparation-এর practical starter checklist হিসেবে ব্যবহার করুন।'
              )}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#checklist-groups"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_18px_42px_rgba(0,149,161,0.22)] transition-colors hover:bg-brand-deep"
              >
                {localize(language, 'Start checking', 'চেক করা শুরু করুন')}
                <ArrowRight size={17} />
              </a>
              <Link
                to="/plan"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand/25 bg-white/70 px-6 py-3 text-sm font-bold text-brand-deep shadow-sm backdrop-blur transition-colors hover:bg-white"
              >
                <PlaneTakeoff size={17} />
                {localize(language, 'Create a plan', 'Plan তৈরি করুন')}
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/75 p-6 shadow-[0_24px_70px_rgba(0,89,96,0.16)] backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">
              {localize(language, 'Readiness snapshot', 'Readiness snapshot')}
            </p>
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full bg-brand-light">
                <div className="absolute inset-3 rounded-full bg-white" />
                <div className="relative text-center">
                  <p className="font-serif text-3xl font-bold text-brand-deep">{totals.percent}%</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-brand">Done</p>
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-3xl font-bold text-brand-deep">
                  {totals.done} / {totals.total}
                </h2>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-[#51666b]">
                  {localize(language, 'Completed in this browser session.', 'এই browser session-এ completed।')}
                </p>
                <button
                  type="button"
                  onClick={resetChecklist}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-black text-brand hover:bg-brand-light"
                >
                  <RotateCcw size={14} />
                  {localize(language, 'Reset', 'Reset')}
                </button>
              </div>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand to-brand-soft"
                animate={{ width: `${totals.percent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <section className="mb-8 rounded-[28px] border border-amber-200 bg-amber-50/80 p-6">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700">
              <PlaneTakeoff size={20} />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-deep">
                {localize(language, 'Keep this as a planning reference', 'এটি planning reference হিসেবে রাখুন')}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-amber-900/80">
                {localize(
                  language,
                  'This page currently tracks progress locally. Saved per-plan checklist tracking belongs inside the dashboard flow.',
                  'এই page এখন local progress track করে। Per-plan saved checklist dashboard flow-এর মধ্যে থাকবে।'
                )}
              </p>
            </div>
          </div>
        </section>

        <section id="checklist-groups" className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {CHECKLIST_GROUPS.map((group, idx) => {
            const title = language === 'BN' ? group.titleBN : group.titleEN
            const done = group.items.filter(item => completed[item.id]).length
            const Icon = groupIcons[group.id] || ClipboardCheck
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-[28px] border border-white/80 bg-white/78 p-5 shadow-[0_16px_44px_rgba(0,89,96,0.08)] backdrop-blur md:p-6"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand">
                      <Icon size={21} />
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-brand-deep">{title}</h3>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-brand-deep/45">
                        {done} / {group.items.length} {localize(language, 'ready', 'ready')}
                      </p>
                    </div>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-lg font-black text-white">
                    {done}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {group.items.map(item => {
                    const checked = !!completed[item.id]
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCompleted(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className="w-full rounded-2xl border border-brand/10 bg-white px-4 py-3 text-left transition-colors hover:bg-brand-light/55"
                      >
                        <span className="flex items-start gap-3">
                          <span className="mt-0.5 shrink-0 text-brand">
                            {checked ? <CheckCircle2 size={19} /> : <Circle size={19} />}
                          </span>
                          <span className={checked ? 'font-semibold leading-relaxed text-[#8a9b9f] line-through' : 'font-semibold leading-relaxed text-[#334d52]'}>
                            {item.text}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </section>
      </main>
    </div>
  )
}
