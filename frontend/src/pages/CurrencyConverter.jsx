import { useEffect, useMemo, useRef, useState } from 'react'
import useStore from '@/store/useStore'
import { PageHero } from '@/components/common/PageHero'
import { AppLoader } from '@/components/common/AppLoader'
import { convertBDTtoNZD, convertNZDtoBDT, formatBDT } from '@/utils/currency'

export default function CurrencyConverter() {
  const language = useStore(s => s.language)
  const rate = useStore(s => s.exchangeRate)
  const [sourceCurrency, setSourceCurrency] = useState('BDT')
  const [sourceAmount, setSourceAmount] = useState(50000)
  const [conversionLoading, setConversionLoading] = useState(false)
  const conversionTimerRef = useRef(null)

  const sourceValue = Number(sourceAmount) || 0
  const bdtAmount = sourceCurrency === 'BDT' ? sourceValue : convertNZDtoBDT(sourceValue, rate)
  const nzdAmount = sourceCurrency === 'NZD' ? sourceValue : convertBDTtoNZD(sourceValue, rate)

  const avgSalaryBDT = 25000
  const salaryDays = useMemo(() => ((Number(bdtAmount) || 0) / avgSalaryBDT * 30).toFixed(1), [bdtAmount])

  const queueConversion = (callback) => {
    callback()
    setConversionLoading(true)
    window.clearTimeout(conversionTimerRef.current)
    conversionTimerRef.current = window.setTimeout(() => setConversionLoading(false), 520)
  }

  useEffect(() => () => window.clearTimeout(conversionTimerRef.current), [])

  return (
    <div className="min-h-screen">
      <PageHero
        badge={language === 'BN' ? 'কারেন্সি কনভার্টার' : 'Currency converter'}
        title={language === 'BN' ? 'BDT থেকে NZD, প্রসঙ্গসহ' : 'BDT to NZD, with real-world context'}
        subtitle={language === 'BN'
          ? 'শুধু কনভার্ট নয়, বাংলাদেশের আয়-বাস্তবতার তুলনায় এই পরিমাণ টাকার ওজনও বোঝার চেষ্টা করুন।'
          : 'Not just conversion. Use this to understand what an amount means relative to Bangladeshi earning reality and New Zealand arrival costs.'}
        accent="from-brand-deep via-[#7C2D12] to-[#F59E0B]"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative overflow-hidden bg-white rounded-2xl border border-brand-mid p-6 shadow-brand-sm">
          <AppLoader
            show={conversionLoading}
            fullScreen={false}
            label={sourceCurrency === 'BDT' ? 'BDT to NZD' : 'NZD to BDT'}
            sublabel={language === 'BN' ? 'নতুন মান হিসাব করা হচ্ছে' : 'Calculating the converted value'}
          />
          <h2 className="font-serif text-2xl font-bold text-brand-deep">
            {language === 'BN' ? 'লাইভ-স্টাইল কনভার্সন' : 'Conversion'}
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            {language === 'BN'
              ? `বর্তমান রেফারেন্স রেট: ১ NZD ≈ ${rate} BDT`
              : `Current reference rate: 1 NZD ≈ ${rate} BDT`}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-brand-light p-1">
            {['BDT', 'NZD'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => queueConversion(() => {
                  setSourceCurrency(option)
                  setSourceAmount(option === 'BDT' ? Math.round(bdtAmount) : Number(nzdAmount.toFixed(2)))
                })}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                  sourceCurrency === option ? 'bg-brand text-white shadow-brand-sm' : 'text-brand hover:bg-white/70'
                }`}
              >
                {option} → {option === 'BDT' ? 'NZD' : 'BDT'}
              </button>
            ))}
          </div>

          <label className="block mt-5">
            <span className="text-sm font-semibold text-gray-700">
              {language === 'BN'
                ? `${sourceCurrency} পরিমাণ`
                : `Amount in ${sourceCurrency}`}
            </span>
            <input
              type="number"
              min="0"
              max="100000000"
              value={sourceAmount}
              onChange={(e) => queueConversion(() => setSourceAmount(e.target.value))}
              className="mt-2 w-full rounded-xl border border-brand-mid px-4 py-3 outline-none focus:border-brand"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <ConverterCard label="BDT" value={formatBDT(bdtAmount || 0)} />
            <ConverterCard label="NZD" value={`NZ$${nzdAmount.toLocaleString('en-NZ')}`} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-brand-mid p-6 shadow-brand-sm">
            <p className="text-sm text-gray-500">
              {language === 'BN' ? 'আয়ের প্রসঙ্গ' : 'Purchasing-power context'}
            </p>
            <h3 className="font-serif text-3xl font-bold text-brand-deep mt-2">
              {language === 'BN'
                ? `${salaryDays} দিনের গড় বাংলাদেশি বেতনের সমান`
                : `≈ ${salaryDays} days of average Bangladeshi salary`}
            </h3>
            <p className="text-sm text-gray-600 mt-3">
              {language === 'BN'
                ? 'এটি সঠিক সরকারি হিসাব নয়, বরং পরিকল্পনা বোঝার জন্য একটি মানবিক রেফারেন্স।'
                : 'This is not an official economic benchmark. It is a human planning reference to make the amount feel more concrete.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-brand-mid p-6 shadow-brand-sm">
            <p className="text-sm text-gray-500">{language === 'BN' ? 'দ্রুত রেফারেন্স' : 'Quick planning reference'}</p>
            <div className="space-y-3 mt-4">
              {[
                { labelEN: 'NZ$200 groceries buffer', labelBN: 'NZ$200 মুদি বাফার', nzd: 200 },
                { labelEN: 'NZ$500 emergency top-up', labelBN: 'NZ$500 জরুরি টপ-আপ', nzd: 500 },
                { labelEN: 'NZ$1,200 shared-room month', labelBN: 'NZ$1,200 শেয়ার রুম মাসিক ভাড়া', nzd: 1200 },
              ].map((item) => (
                <div key={item.nzd} className="flex items-center justify-between rounded-xl bg-brand-light px-4 py-3">
                  <span className="text-sm text-gray-700">{language === 'BN' ? item.labelBN : item.labelEN}</span>
                  <span className="font-bold text-brand">{formatBDT(convertNZDtoBDT(item.nzd, rate))}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConverterCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-brand-light border border-brand-mid p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <h3 className="font-serif text-2xl font-bold text-brand-deep mt-2">{value}</h3>
    </div>
  )
}
