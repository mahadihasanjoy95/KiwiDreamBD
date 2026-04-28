import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/utils/cn'

const ToastContext = createContext(null)

const TOAST_STYLES = {
  info: {
    wrap: 'border-sky-100 bg-white text-sky-950',
    icon: 'bg-sky-50 text-sky-700',
    Icon: Info,
  },
  success: {
    wrap: 'border-emerald-100 bg-white text-emerald-950',
    icon: 'bg-emerald-50 text-emerald-700',
    Icon: CheckCircle2,
  },
  warning: {
    wrap: 'border-amber-100 bg-white text-amber-950',
    icon: 'bg-amber-50 text-amber-700',
    Icon: TriangleAlert,
  },
  error: {
    wrap: 'border-red-100 bg-white text-red-950',
    icon: 'bg-red-50 text-red-700',
    Icon: AlertCircle,
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismissToast = useCallback((id) => {
    const timer = timers.current.get(id)
    if (timer) window.clearTimeout(timer)
    timers.current.delete(id)
    setToasts(current => current.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((toast) => {
    const id = toast.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const duration = toast.duration ?? 3600
    const nextToast = { ...toast, id, tone: toast.tone || 'info' }

    setToasts(current => [nextToast, ...current].slice(0, 4))

    if (duration > 0) {
      const timer = window.setTimeout(() => dismissToast(id), duration)
      timers.current.set(id, timer)
    }

    return id
  }, [dismissToast])

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[90] grid w-[min(380px,calc(100vw-2rem))] gap-3">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }
  return context
}

function ToastItem({ toast, onDismiss }) {
  const styles = TOAST_STYLES[toast.tone] || TOAST_STYLES.info
  const Icon = styles.Icon

  return (
    <div
      role={toast.tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'pointer-events-auto flex gap-3 rounded-2xl border p-3 shadow-[0_18px_48px_rgba(20,35,52,0.14)] backdrop-blur-2xl animate-fade-up',
        styles.wrap
      )}
    >
      <span className={cn('inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl', styles.icon)}>
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black">{toast.title}</p>
        {toast.message ? <p className="mt-0.5 text-sm font-semibold leading-relaxed text-slate-500">{toast.message}</p> : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-700"
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </div>
  )
}
