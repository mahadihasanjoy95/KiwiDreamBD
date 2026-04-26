import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/utils/cn'

const ALERT_STYLES = {
  info: {
    wrap: 'border-sky-100 bg-sky-50/90 text-sky-900',
    icon: 'bg-sky-100 text-sky-700',
    Icon: Info,
  },
  success: {
    wrap: 'border-emerald-100 bg-emerald-50/90 text-emerald-900',
    icon: 'bg-emerald-100 text-emerald-700',
    Icon: CheckCircle2,
  },
  warning: {
    wrap: 'border-amber-100 bg-amber-50/90 text-amber-900',
    icon: 'bg-amber-100 text-amber-700',
    Icon: TriangleAlert,
  },
  error: {
    wrap: 'border-red-100 bg-red-50/90 text-red-900',
    icon: 'bg-red-100 text-red-700',
    Icon: AlertCircle,
  },
}

export function Alert({
  tone = 'info',
  title,
  children,
  action,
  onDismiss,
  className = '',
}) {
  const styles = ALERT_STYLES[tone] || ALERT_STYLES.info
  const Icon = styles.Icon

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex gap-3 rounded-2xl border p-4 shadow-[0_16px_38px_rgba(20,35,52,0.07)] backdrop-blur-xl',
        styles.wrap,
        className
      )}
    >
      <span className={cn('mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl', styles.icon)}>
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-black">{title}</p> : null}
        {children ? <div className="mt-1 text-sm font-semibold leading-relaxed opacity-75">{children}</div> : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 opacity-70 hover:opacity-100"
          aria-label="Dismiss alert"
        >
          <X size={15} />
        </button>
      ) : null}
    </div>
  )
}
