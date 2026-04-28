import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  Camera,
  Globe,
  Info,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Settings2,
  Sparkles,
  UserRound,
  Wallet,
} from 'lucide-react'
import useStore from '@/store/useStore'
import devTeam from '@/assets/images/dev_team.png'
import smallFlowers from '@/assets/svg/small-flowers.svg'
import i18n from 'i18next'

export default function Profile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const user = useStore(s => s.user)
  const updateProfile = useStore(s => s.updateProfile)
  const updateProfilePicture = useStore(s => s.updateProfilePicture)
  const changePassword = useStore(s => s.changePassword)
  const logout = useStore(s => s.logout)
  const language = useStore(s => s.language)
  const currency = useStore(s => s.currency)
  const setLanguage = useStore(s => s.setLanguage)
  const setCurrency = useStore(s => s.setCurrency)
  const [form, setForm] = useState(user || {})
  const [saving, setSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  useEffect(() => {
    setForm(user || {})
  }, [user])

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eaf6f5_0%,#f8fbf6_50%,#eef7f6_100%)] px-4 py-6 sm:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[30px] border border-white/70 bg-white/58 p-5 shadow-[0_24px_70px_rgba(0,89,96,0.10)] backdrop-blur-2xl sm:p-7 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/55 px-3 py-1.5 text-xs font-bold text-brand-deep/70">
                <Settings2 size={14} />
                {t('auth.more_badge')}
              </div>
              <h1 className="mt-4 max-w-2xl font-serif text-3xl font-bold leading-tight text-brand-deep md:text-4xl">
                {isAuthenticated ? t('auth.more_title_signedin') : t('auth.more_title_guest')}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-deep/64 md:text-base">
                {isAuthenticated ? t('auth.more_subtitle_signedin') : t('auth.more_subtitle_guest')}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <SettingCard
                icon={<Globe size={17} />}
                label={t('auth.language_pref')}
                helper={t('auth.language_help')}
              >
                <SegmentedControl
                  value={language}
                  onChange={(value) => {
                    setLanguage(value)
                    i18n.changeLanguage(value.toLowerCase())
                  }}
                  options={[
                    { value: 'EN', label: 'EN' },
                    { value: 'BN', label: 'বাংলা', className: 'font-bengali' },
                  ]}
                />
              </SettingCard>

              <SettingCard
                icon={<Wallet size={17} />}
                label={t('auth.currency_pref')}
                helper={t('auth.currency_help')}
              >
                <SegmentedControl
                  value={currency}
                  onChange={setCurrency}
                  options={[
                    { value: 'NZD', label: 'NZD' },
                    { value: 'BDT', label: 'BDT' },
                  ]}
                />
              </SettingCard>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/68 p-5 shadow-[0_18px_54px_rgba(0,89,96,0.08)] backdrop-blur-xl sm:p-6">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[26px] bg-brand text-2xl font-extrabold text-white shadow-[0_18px_42px_rgba(0,149,161,0.22)]">
                      {(form.name || 'G').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/60">{t('auth.profile_badge')}</p>
                      <h2 className="mt-1 truncate font-serif text-2xl font-bold text-brand-deep">{form.name || t('auth.guest_user')}</h2>
                      <p className="mt-1 truncate text-sm text-brand-deep/55">{form.email}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <InfoCard label={t('auth.provider')} value={form.provider || 'LOCAL'} />
                    <InfoCard label={t('auth.language_pref')} value={form.preferredLanguage || language} />
                    <InfoCard label={t('auth.currency_pref')} value={form.preferredCurrency || currency} />
                  </div>

                  <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-mid bg-white/72 px-4 py-3 text-sm font-bold text-brand-deep hover:bg-brand-light">
                    <Camera size={16} />
                    {t('auth.change_avatar')}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand">
                    <UserRound size={21} />
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-brand/60">
                    {t('auth.account_section_label')}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-brand-deep">{t('auth.guest_card_title')}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-brand-deep/60">{t('auth.guest_card_copy')}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <Link
                      to="/signin"
                      state={{ next: '/profile' }}
                      className="rounded-full bg-brand px-5 py-3 text-center font-bold text-white shadow-[0_16px_36px_rgba(0,149,161,0.22)] hover:bg-brand-deep"
                    >
                      {t('auth.signin_inline')}
                    </Link>
                    <Link
                      to="/signup"
                      className="rounded-full border border-brand-mid bg-white/72 px-5 py-3 text-center font-bold text-brand-deep hover:bg-brand-light"
                    >
                      {t('auth.signup_inline')}
                    </Link>
                  </div>
                </>
              )}
            </div>

            <QuickLink to="/dashboard" icon={LayoutDashboard} title={t('nav.dashboard')} copy={t('auth.dashboard_quick_copy')} />
            <QuickLink to="/guide" icon={BookOpen} title={t('tools.essentials_title')} copy={t('tools.essentials_desc')} />
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/68 p-5 shadow-[0_18px_54px_rgba(0,89,96,0.08)] backdrop-blur-xl sm:p-6">
              {isAuthenticated && user ? (
                <>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-light text-brand">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/60">{t('auth.profile_section_label')}</p>
                      <h3 className="text-lg font-extrabold text-brand-deep">{t('auth.profile_edit_title')}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label={t('auth.full_name')}>
                      <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="profile-input" />
                    </Field>
                    <Field label={t('auth.email')}>
                      <input value={form.email || ''} disabled className="profile-input cursor-not-allowed opacity-70" />
                    </Field>
                    <Field label={t('auth.phone')}>
                      <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="profile-input" />
                    </Field>
                    <Field label={t('auth.target_move_date')}>
                      <input type="date" value={form.targetMoveDate || ''} onChange={(e) => setForm({ ...form, targetMoveDate: e.target.value })} className="profile-input" />
                    </Field>
                    <Field label={t('auth.current_savings_bdt')}>
                      <input type="number" min="0" value={form.currentSavingsBdt || ''} onChange={(e) => setForm({ ...form, currentSavingsBdt: e.target.value })} className="profile-input" />
                    </Field>
                    <Field label={t('auth.monthly_income_bdt')}>
                      <input type="number" min="0" value={form.monthlyIncomeBdt || ''} onChange={(e) => setForm({ ...form, monthlyIncomeBdt: e.target.value })} className="profile-input" />
                    </Field>
                    <Field label={t('auth.profile_picture_url')}>
                      <input value={form.profilePicture || ''} onChange={(e) => setForm({ ...form, profilePicture: e.target.value })} className="profile-input" placeholder="https://..." />
                    </Field>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={async () => {
                        setSaving(true)
                        setProfileError('')
                        setProfileSuccess('')
                        try {
                          await updateProfile({
                            ...form,
                            preferredCurrency: currency,
                            preferredLanguage: language,
                          })
                          if (form.profilePicture) {
                            await updateProfilePicture(form.profilePicture)
                          }
                          setProfileSuccess(t('auth.profile_saved'))
                        } catch (err) {
                          setProfileError(err.message || 'Unable to save profile')
                        } finally {
                          setSaving(false)
                        }
                      }}
                      disabled={saving}
                      className="rounded-full bg-brand px-5 py-3 font-bold text-white shadow-[0_16px_36px_rgba(0,149,161,0.20)] hover:bg-brand-deep disabled:cursor-wait disabled:opacity-70"
                    >
                      {t('auth.save_profile')}
                    </button>
                    <Link to="/dashboard" className="rounded-full border border-brand-mid bg-white/72 px-5 py-3 text-center font-bold text-brand-deep hover:bg-brand-light">
                      {t('auth.go_dashboard')}
                    </Link>
                  </div>
                  {profileError ? (
                    <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                      {profileError}
                    </p>
                  ) : null}
                  {profileSuccess ? (
                    <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                      {profileSuccess}
                    </p>
                  ) : null}
                </>
              ) : (
                <div className="rounded-[24px] border border-dashed border-brand-mid bg-brand-light/52 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/60">
                    {t('auth.profile_section_label')}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold text-brand-deep">{t('auth.profile_guest_title')}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-deep/60">{t('auth.profile_guest_copy')}</p>
                </div>
              )}
            </div>

            {isAuthenticated && user ? (
              <div className="rounded-[28px] border border-white/70 bg-white/68 p-5 shadow-[0_18px_54px_rgba(0,89,96,0.08)] backdrop-blur-xl sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-light text-brand">
                    <KeyRound size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/60">{t('auth.security_section_label')}</p>
                    <h3 className="text-lg font-extrabold text-brand-deep">{t('auth.password_edit_title')}</h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Field label={t('auth.current_password')}>
                    <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="profile-input" />
                  </Field>
                  <Field label={t('auth.new_password')}>
                    <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="profile-input" />
                  </Field>
                  <Field label={t('auth.confirm_password')}>
                    <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="profile-input" />
                  </Field>
                </div>
                <button
                  type="button"
                  disabled={passwordSaving}
                  onClick={async () => {
                    setProfileError('')
                    setProfileSuccess('')
                    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                      setProfileError(t('auth.password_mismatch'))
                      return
                    }
                    setPasswordSaving(true)
                    try {
                      await changePassword(passwordForm)
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      setProfileSuccess(t('auth.password_saved'))
                    } catch (err) {
                      setProfileError(err.message || t('auth.password_error'))
                    } finally {
                      setPasswordSaving(false)
                    }
                  }}
                  className="mt-5 inline-flex rounded-full bg-brand-deep px-5 py-3 font-bold text-white shadow-[0_16px_36px_rgba(20,35,52,0.18)] hover:bg-brand disabled:cursor-wait disabled:opacity-70"
                >
                  {passwordSaving ? t('common.loading') : t('auth.reset_cta')}
                </button>
              </div>
            ) : null}

            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,#ffffff_0%,#effafa_100%)] p-5 shadow-[0_18px_54px_rgba(0,89,96,0.08)] sm:p-6">
              <img
                src={smallFlowers}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 bottom-0 hidden w-44 opacity-70 sm:block md:w-56"
              />
              <div className="relative max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-light text-brand">
                    <Info size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/60">
                      {t('auth.about_title')}
                    </p>
                    <h3 className="text-lg font-extrabold text-brand-deep">{t('auth.about_heading')}</h3>
                  </div>
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-[190px_1fr]">
                  <img
                    src={devTeam}
                    alt={t('auth.dev_team_alt')}
                    className="h-52 w-full rounded-[24px] object-cover object-center shadow-[0_18px_42px_rgba(0,89,96,0.16)] md:h-full"
                  />
                  <div>
                    <p className="text-sm leading-relaxed text-brand-deep/63">{t('auth.about_copy')}</p>
                    <p className="mt-3 text-sm font-bold text-brand">{t('auth.dev_team_caption')}</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
                      <InfoTile label={t('auth.about_phase_label')} value={t('auth.about_phase_value')} />
                      <InfoTile label={t('auth.about_region_label')} value={t('auth.about_region_value')} />
                      <InfoTile label={t('auth.about_focus_label')} value={t('auth.about_focus_value')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                onClick={async () => {
                  await logout()
                  navigate('/')
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 hover:border-red-300 hover:bg-red-100"
              >
                <LogOut size={16} />
                {t('auth.logout')}
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-brand-deep/70">{label}</span>
      {children}
    </label>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-brand-mid/55 bg-brand-light/60 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-brand/58">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-brand-deep">{value || '-'}</p>
    </div>
  )
}

function SettingCard({ icon, label, helper, children }) {
  return (
    <div className="rounded-[24px] border border-brand-mid/55 bg-white/68 p-4 shadow-[0_14px_34px_rgba(0,89,96,0.06)] backdrop-blur-sm">
      <div className="flex items-start gap-3 text-brand-deep">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold">{label}</p>
          <p className="text-xs leading-snug text-brand-deep/52">{helper}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-brand-light p-1.5">
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              'rounded-xl px-4 py-2.5 text-sm font-bold transition-all',
              active ? 'bg-brand text-white shadow-brand-sm' : 'text-brand-deep/52 hover:bg-white/65 hover:text-brand-deep',
              option.className || '',
            ].join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-brand-mid/55 bg-white/82 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-brand/58">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-brand-deep">{value}</p>
    </div>
  )
}

function QuickLink({ to, icon: Icon, title, copy }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-[24px] border border-brand-mid/55 bg-white/64 p-4 shadow-[0_14px_38px_rgba(0,89,96,0.06)] backdrop-blur-xl hover:bg-white"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand group-hover:bg-brand group-hover:text-white">
        <Icon size={18} />
      </span>
      <span>
        <span className="block font-extrabold text-brand-deep">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-brand-deep/55">{copy}</span>
      </span>
    </Link>
  )
}
