import { Link } from 'react-router-dom'
import { NZFernIcon } from '@/components/common/NZFernIcon'
import useStore from '@/store/useStore'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const rate = useStore(s => s.exchangeRate)

  return (
    <footer className="hidden md:block mt-20 border-t border-[#e8ddd0] bg-[#f3ede3] text-[#6d6257]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <NZFernIcon className="h-6 w-6" color="#166534" />
            <div>
              <p className="font-serif text-lg font-bold text-[#173526]">KiwiDream BD</p>
              <p className="mt-0.5 text-xs">Plan your new life in New Zealand</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <Link to="/plan" className="transition-colors hover:text-[#173526]">{t('footer.planner')}</Link>
            <Link to="/compare" className="transition-colors hover:text-[#173526]">{t('footer.compare')}</Link>
            <Link to="/jobs" className="transition-colors hover:text-[#173526]">{t('footer.jobs')}</Link>
            <Link to="/checklist" className="transition-colors hover:text-[#173526]">{t('footer.checklist')}</Link>
            <Link to="/essentials" className="transition-colors hover:text-[#173526]">{t('footer.essentials')}</Link>
            <Link to="/converter" className="transition-colors hover:text-[#173526]">{t('footer.converter')}</Link>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span>🇧🇩</span>
            <span className="text-[#c9bba9]">→</span>
            <span>🇳🇿</span>
            <span className="ml-2">{t('footer.rate', { rate })}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[#e8ddd0] pt-6 text-xs sm:flex-row">
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.phase')}</p>
        </div>
      </div>
    </footer>
  )
}
