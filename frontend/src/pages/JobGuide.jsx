import { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import { JOB_INFO } from '@/data/jobInfo'
import { PageHero } from '@/components/common/PageHero'
import { formatCurrency } from '@/utils/currency'

export default function JobGuide() {
  const language = useStore(s => s.language)
  const rate = useStore(s => s.exchangeRate)
  const currency = useStore(s => s.currency)
  const [hours, setHours] = useState(20)
  const [hourlyRate, setHourlyRate] = useState(24)

  const monthlyNZD = Math.round(hours * hourlyRate * 4.33)
  const monthlyDisplay = formatCurrency(monthlyNZD, currency, rate)

  return (
    <div className="min-h-screen">
      <PageHero
        badge={language === 'BN' ? 'পার্ট-টাইম চাকরি' : 'Part-time jobs'}
        title={language === 'BN' ? 'ছাত্র হিসেবে কত আয় করা বাস্তবসম্মত?' : 'How much can you realistically earn as a student?'}
        subtitle={language === 'BN'
          ? '২০ ঘণ্টা/সপ্তাহ সীমার মধ্যে কোন কাজগুলো সাধারণ, কী রেট পাওয়া যায়, এবং এই আয়ে আপনার বাজেটে কতটা সাহায্য হবে তা এখানে দেখুন।'
          : 'See the common student jobs, typical hourly rates, and how much those earnings can realistically help your budget within the 20-hour/week limit.'}
        accent="from-brand-deep via-[#14532D] to-[#16A34A]"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <InfoCard title={language === 'BN' ? 'ন্যূনতম মজুরি' : 'Minimum wage'} value={`NZ$${JOB_INFO.minimumWageNZD}/hr`} />
          <InfoCard title={language === 'BN' ? 'পড়ার সময়' : 'During study'} value={`${JOB_INFO.weeklyHoursAllowedDuringStudy} ${language === 'BN' ? 'ঘণ্টা/সপ্তাহ' : 'hrs/week'}`} />
          <InfoCard title={language === 'BN' ? 'বিরতিতে' : 'Semester break'} value={language === 'BN' ? 'ফুল-টাইম' : JOB_INFO.weeklyHoursAllowedBreak} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-brand-mid p-6 shadow-brand-sm">
            <h2 className="font-serif text-2xl font-bold text-brand-deep">
              {language === 'BN' ? 'আয় ক্যালকুলেটর' : 'Earnings calculator'}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {language === 'BN'
                ? 'একজন ছাত্র হিসেবে বাস্তবে কত আয় হতে পারে তা বুঝতে এই ক্যালকুলেটর ব্যবহার করুন।'
                : 'Use this to estimate realistic monthly earnings for a student schedule.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">{language === 'BN' ? 'সপ্তাহে ঘণ্টা' : 'Hours per week'}</span>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value) || 0)}
                  className="mt-2 w-full rounded-xl border border-brand-mid px-4 py-3 outline-none focus:border-brand"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">{language === 'BN' ? 'ঘণ্টাপ্রতি রেট (NZD)' : 'Hourly rate (NZD)'}</span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
                  className="mt-2 w-full rounded-xl border border-brand-mid px-4 py-3 outline-none focus:border-brand"
                />
              </label>
            </div>

            <div className="mt-6 rounded-2xl bg-brand-light border border-brand-mid p-5">
              <p className="text-sm text-gray-500">{language === 'BN' ? 'আনুমানিক মাসিক আয়' : 'Estimated monthly earnings'}</p>
              <h3 className="font-serif text-3xl font-bold text-brand-deep mt-2">{monthlyDisplay}</h3>
              <p className="text-sm text-gray-500 mt-2">
                {language === 'BN'
                  ? 'এটি আপনার বাজেটের একটি অংশ কাভার করতে পারে, কিন্তু Day 1 fund-এর বিকল্প নয়।'
                  : 'This can cover part of your monthly budget, but it should not replace your Day 1 fund.'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {JOB_INFO.examples.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white rounded-2xl border border-brand-mid p-5 shadow-brand-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{language === 'BN' ? job.titleBN : job.titleEN}</h3>
                    <p className="text-sm text-gray-400 mt-1">{language === 'BN' ? job.cityBN : job.cityEN}</p>
                  </div>
                  <div className="rounded-full bg-brand-light px-3 py-1 text-sm font-bold text-brand">
                    NZ${job.rateNZD}/hr
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                  {language === 'BN' ? job.noteBN : job.noteEN}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-mid p-5 shadow-brand-sm">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className="font-serif text-2xl font-bold text-brand-deep mt-2">{value}</h2>
    </div>
  )
}
