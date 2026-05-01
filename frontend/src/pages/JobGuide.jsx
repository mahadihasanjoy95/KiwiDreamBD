import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BriefcaseBusiness, Calculator, Clock3, Coffee, Info, ShieldCheck, WalletCards } from 'lucide-react'
import useStore from '@/store/useStore'
import { JOB_INFO } from '@/data/jobInfo'
import { formatCurrency } from '@/utils/currency'
import { Link } from 'react-router-dom'

function localize(language, en, bn) {
  return language === 'BN' ? bn : en
}

export default function JobGuide() {
  const language = useStore(s => s.language)
  const rate = useStore(s => s.exchangeRate)
  const currency = useStore(s => s.currency)
  const [hours, setHours] = useState(20)
  const [hourlyRate, setHourlyRate] = useState(24)

  const boundedHours = Math.min(Math.max(hours, 0), 40)
  const monthlyNZD = Math.round(boundedHours * hourlyRate * 4.33)
  const weeklyNZD = Math.round(boundedHours * hourlyRate)
  const monthlyDisplay = formatCurrency(monthlyNZD, currency, rate)
  const weeklyDisplay = formatCurrency(weeklyNZD, currency, rate)
  const percentOfTypicalMonthly = Math.min(100, Math.round((monthlyNZD / 1600) * 100))

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eaf6f5_0%,#f8f2e8_42%,#eaf6f5_100%)] text-brand-deep">
      <section className="relative border-b border-white/70 bg-[linear-gradient(135deg,#c7e5e8_0%,#f8f2e8_58%,#b6dadd_100%)]">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#eaf6f5] to-transparent" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-6 pb-14 pt-24 md:grid-cols-[1fr_0.78fr] md:items-end md:pb-20 md:pt-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/45 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand shadow-sm backdrop-blur">
              <BriefcaseBusiness size={15} />
              {localize(language, 'Student Work Guide', 'Student Work Guide')}
            </div>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-brand-deep md:text-6xl">
              {localize(language, 'Part-time income is helpful. It is not your arrival fund.', 'Part-time income helpful, কিন্তু arrival fund নয়।')}
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-[#334d52] md:text-lg">
              {localize(
                language,
                'Use this page to estimate student earnings, compare common jobs, and understand why your first few months still need a safe living fund.',
                'Student earning estimate করুন, common job compare করুন, এবং কেন প্রথম কয়েক মাসের জন্য safe living fund দরকার বুঝুন।'
              )}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_18px_42px_rgba(0,149,161,0.22)] transition-colors hover:bg-brand-deep"
              >
                {localize(language, 'Estimate earnings', 'আয় হিসাব করুন')}
                <ArrowRight size={17} />
              </a>
              <Link
                to="/plan"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand/25 bg-white/70 px-6 py-3 text-sm font-bold text-brand-deep shadow-sm backdrop-blur transition-colors hover:bg-white"
              >
                <WalletCards size={17} />
                {localize(language, 'Open budget planner', 'Budget planner খুলুন')}
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/75 p-6 shadow-[0_24px_70px_rgba(0,89,96,0.16)] backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">
              {localize(language, 'Current planning snapshot', 'Current planning snapshot')}
            </p>
            <div className="mt-5 grid gap-3">
              <MetricCard icon={WalletCards} label={localize(language, 'Minimum wage', 'Minimum wage')} value={`NZ$${JOB_INFO.minimumWageNZD}/hr`} />
              <MetricCard icon={Clock3} label={localize(language, 'During study', 'পড়ার সময়')} value={`${JOB_INFO.weeklyHoursAllowedDuringStudy} ${localize(language, 'hrs/week', 'ঘণ্টা/সপ্তাহ')}`} />
              <MetricCard icon={ShieldCheck} label={localize(language, 'Semester break', 'Semester break')} value={localize(language, JOB_INFO.weeklyHoursAllowedBreak, 'Full-time')} />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <section id="calculator" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-white/80 bg-white/78 p-6 shadow-[0_18px_48px_rgba(0,89,96,0.1)] backdrop-blur md:p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand">
                <Calculator size={22} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">
                  {localize(language, 'Earnings calculator', 'আয় ক্যালকুলেটর')}
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-brand-deep">
                  {localize(language, 'Estimate the monthly help, not the whole plan', 'মাসিক সাহায্য হিসাব করুন, পুরো plan নয়')}
                </h2>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-brand">
                  {localize(language, 'Hours per week', 'সপ্তাহে ঘণ্টা')}
                </span>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value) || 0)}
                  className="home-modal-input bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-brand">
                  {localize(language, 'Hourly rate NZD', 'ঘণ্টাপ্রতি রেট NZD')}
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
                  className="home-modal-input bg-white"
                />
              </label>
            </div>

            <div className="mt-6 rounded-3xl border border-brand/10 bg-brand-light/65 p-5">
              <p className="text-sm font-bold text-[#51666b]">
                {localize(language, 'Estimated monthly earnings', 'আনুমানিক মাসিক আয়')}
              </p>
              <h3 className="mt-2 font-serif text-4xl font-bold text-brand-deep">{monthlyDisplay}</h3>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-brand-soft"
                  animate={{ width: `${percentOfTypicalMonthly}%` }}
                />
              </div>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#51666b]">
                {localize(
                  language,
                  `${weeklyDisplay} per week before tax, based on ${boundedHours} hours. Treat this as support for rent and food, not a replacement for savings.`,
                  `Tax-এর আগে সপ্তাহে ${weeklyDisplay}, ${boundedHours} ঘণ্টা ধরে। এটাকে rent/food support ভাবুন, savings-এর replacement নয়।`
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {JOB_INFO.examples.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="rounded-[24px] border border-white/80 bg-white/78 p-5 shadow-[0_14px_38px_rgba(0,89,96,0.08)] backdrop-blur transition-all hover:-translate-y-1 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand">
                      <Coffee size={19} />
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl font-bold leading-tight text-brand-deep">
                        {language === 'BN' ? job.titleBN : job.titleEN}
                      </h3>
                      <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-brand-deep/50">
                        {language === 'BN' ? job.cityBN : job.cityEN}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-full bg-brand px-3 py-1 text-sm font-black text-white">
                    NZ${job.rateNZD}/hr
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium leading-relaxed text-[#51666b]">
                  {language === 'BN' ? job.noteBN : job.noteEN}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[28px] border border-amber-200 bg-amber-50/80 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700">
              <Info size={20} />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-deep">
                {localize(language, 'Plan before you rely on a job', 'Job-এর উপর depend করার আগে plan করুন')}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-amber-900/80">
                {localize(
                  language,
                  'It can take weeks to find the first job. Your budget should survive the first stretch even if income starts late.',
                  'First job পেতে কয়েক সপ্তাহ লাগতে পারে। Income late শুরু হলেও যেন প্রথম stretch survive করা যায়, budget সেভাবে রাখুন।'
                )}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-brand/10 bg-white/72 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light text-brand">
          <Icon size={18} />
        </span>
        <p className="min-w-0 text-sm font-bold text-[#51666b]">{label}</p>
      </div>
      <p className="font-serif text-2xl font-bold leading-none text-brand-deep sm:text-right sm:text-xl">{value}</p>
    </div>
  )
}
