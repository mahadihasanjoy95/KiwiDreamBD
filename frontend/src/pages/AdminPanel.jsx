import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Archive,
  BadgeCheck,
  BookOpenText,
  Building2,
  Check,
  FilePlus2,
  Globe2,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Newspaper,
  Pencil,
  Plus,
  Save,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCog,
  UserCircle2,
  Users,
  WalletCards,
  X,
} from 'lucide-react'
import logoTigerNew from '@/assets/images/logo_tiger_new.png'
import {
  activateUser, createAdminUser, deactivateUser, listAdminUsers,
  listCountries, createCountry, updateCountry, toggleCountryActive, deleteCountry,
  listAllCities, listCitiesByCountry, createCity, updateCity, toggleCityActive, deleteCity,
  listProfiles, createProfile, updateProfile, toggleProfileActive, deleteProfile,
} from '@/api/admin'
import useStore from '@/store/useStore'
import { cn } from '@/utils/cn'

const INITIAL_MASTER_PLANS = [
  {
    id: 'mp-wlg-student',
    title: 'Wellington Student Plan',
    country: 'New Zealand',
    city: 'Wellington',
    profile: 'Student',
    monthlyCost: 1640,
    movingCost: 4850,
    checklistItems: 14,
    status: 'PUBLISHED',
    updatedAt: '2026-04-12',
  },
  {
    id: 'mp-akl-couple',
    title: 'Auckland Student Couple',
    country: 'New Zealand',
    city: 'Auckland',
    profile: 'Student with spouse',
    monthlyCost: 3180,
    movingCost: 7150,
    checklistItems: 16,
    status: 'DRAFT',
    updatedAt: '2026-04-18',
  },
  {
    id: 'mp-chc-worker',
    title: 'Christchurch Worker Starter',
    country: 'New Zealand',
    city: 'Christchurch',
    profile: 'Worker',
    monthlyCost: 2290,
    movingCost: 5450,
    checklistItems: 12,
    status: 'PUBLISHED',
    updatedAt: '2026-04-20',
  },
]

const INITIAL_CONTENT = [
  { id: 'ird-guide', title: 'IRD number guide', type: 'Essentials', status: 'PUBLISHED', updatedAt: '2026-04-14' },
  { id: 'banking', title: 'Bank account setup', type: 'Banking', status: 'PUBLISHED', updatedAt: '2026-04-16' },
  { id: 'halal-food', title: 'Halal food areas', type: 'City guide', status: 'DRAFT', updatedAt: '2026-04-19' },
]

const INITIAL_COUNTRIES = []


const INITIAL_CITIES = [
  { id: 'wlg', name: 'Wellington', country: 'New Zealand', weeklyCost: 'NZD 360-520', rent: 330, transport: 45, status: 'ACTIVE' },
  { id: 'akl', name: 'Auckland', country: 'New Zealand', weeklyCost: 'NZD 420-650', rent: 410, transport: 60, status: 'ACTIVE' },
  { id: 'chc', name: 'Christchurch', country: 'New Zealand', weeklyCost: 'NZD 310-470', rent: 285, transport: 38, status: 'ACTIVE' },
  { id: 'dun', name: 'Dunedin', country: 'New Zealand', weeklyCost: 'NZD 280-430', rent: 260, transport: 32, status: 'ACTIVE' },
  { id: 'ham', name: 'Hamilton', country: 'New Zealand', weeklyCost: 'NZD 300-455', rent: 275, transport: 36, status: 'ACTIVE' },
]

const INITIAL_PROFILES = [
  { id: 'student', name: 'Student', budgetRange: 'NZD 1,350-1,950', status: 'ACTIVE', templates: 5 },
  { id: 'spouse', name: 'Student with spouse', budgetRange: 'NZD 2,600-3,500', status: 'ACTIVE', templates: 3 },
  { id: 'worker', name: 'Worker', budgetRange: 'NZD 2,100-3,000', status: 'ACTIVE', templates: 2 },
  { id: 'family', name: 'Family', budgetRange: 'NZD 3,800-5,200', status: 'DRAFT', templates: 1 },
]

const INITIAL_TEMPLATES = [
  { id: 'living-cost', name: 'Monthly living cost', items: 8, owner: 'Master plans', status: 'ACTIVE' },
  { id: 'moving-cost', name: 'Moving / initial cost', items: 9, owner: 'Master plans', status: 'ACTIVE' },
  { id: 'checklist', name: 'Pre-departure checklist', items: 14, owner: 'Master plans', status: 'ACTIVE' },
  { id: 'living-fund', name: 'Living fund recommendation', items: 3, owner: 'Master plans', status: 'ACTIVE' },
]

const CATALOG_ITEMS = [
  { id: 'countries', labelKey: 'countries', Icon: Globe2 },
  { id: 'cities', labelKey: 'cities', Icon: Building2 },
  { id: 'profiles', labelKey: 'profiles', Icon: BadgeCheck },
  { id: 'templates', labelKey: 'templates', Icon: ListChecks },
]

// Curated swatch palette for country / city / profile color pickers
const COLOR_PALETTE = [
  '#0095A1', '#00C9BD', '#142334', '#4C1D95',
  '#7C3AED', '#A78BFA', '#2563EB', '#0EA5E9',
  '#10B981', '#059669', '#F59E0B', '#EF4444',
  '#EC4899', '#F97316', '#64748B', '#0F172A',
]

const TABS = [
  { id: 'overview', labelKey: 'overview', Icon: LayoutDashboard },
  { id: 'countries', labelKey: 'countries', Icon: Globe2 },
  { id: 'cities', labelKey: 'cities', Icon: MapPin },
  { id: 'profiles', labelKey: 'profiles', Icon: BadgeCheck },
  { id: 'plans', labelKey: 'master_plans', Icon: FilePlus2 },
  { id: 'templates', labelKey: 'templates', Icon: WalletCards },
  { id: 'content', labelKey: 'content', Icon: Newspaper },
  { id: 'users', labelKey: 'users', Icon: Users },
  { id: 'admins', labelKey: 'admins', Icon: UserCog },
  { id: 'account', labelKey: 'account', Icon: UserCircle2 },
]

function formatNZD(value) {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Reusable color picker: curated palette swatches + custom hex input.
 * Props: value (hex string), onChange (hex => void)
 */
function ColorPicker({ value, onChange }) {
  return (
    <div className="space-y-2">
      {/* Palette swatches */}
      <div className="flex flex-wrap gap-1.5">
        {COLOR_PALETTE.map(color => (
          <button
            key={color}
            type="button"
            title={color}
            onClick={() => onChange(color)}
            className="h-7 w-7 rounded-lg border-2 transition-all hover:scale-110"
            style={{
              backgroundColor: color,
              borderColor: value?.toUpperCase() === color.toUpperCase() ? '#142334' : 'transparent',
              boxShadow: value?.toUpperCase() === color.toUpperCase() ? '0 0 0 2px #fff, 0 0 0 4px #142334' : undefined,
            }}
          />
        ))}
      </div>
      {/* Custom hex + preview */}
      <div className="flex items-center gap-2">
        <span
          className="h-9 w-9 shrink-0 rounded-lg border border-brand-mid/60 shadow-sm"
          style={{ backgroundColor: value || '#0095A1' }}
        />
        <input
          maxLength={7}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="#0095A1"
          className="h-9 flex-1 rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-mono font-bold text-brand-deep outline-none focus:border-brand"
        />
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const { t } = useTranslation()
  const isPublished = status === 'PUBLISHED'
  const isActive = status === 'ACTIVE'
  const isDraft = status === 'DRAFT'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-extrabold',
        isPublished || isActive
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
          : isDraft
            ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
            : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
      )}
    >
      {t(`admin.status.${status.toLowerCase()}`)}
    </span>
  )
}

function AdminStat({ Icon, label, value, hint, tone = 'brand' }) {
  const toneClass = {
    brand: 'bg-brand-light text-brand',
    blue: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  }[tone]

  return (
    <div className="rounded-2xl border border-white/70 bg-white/74 p-4 shadow-[0_16px_44px_rgba(20,35,52,0.07)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-deep/45">{label}</p>
          <p className="mt-3 text-3xl font-black text-brand-deep">{value}</p>
        </div>
        <span className={cn('inline-flex h-11 w-11 items-center justify-center rounded-2xl', toneClass)}>
          <Icon size={21} />
        </span>
      </div>
      <p className="mt-3 text-sm font-medium leading-relaxed text-brand-deep/55">{hint}</p>
    </div>
  )
}

function SectionTitle({ kicker, title, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand/60">{kicker}</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-brand-deep">{title}</h2>
      </div>
      {action}
    </div>
  )
}

function normalizeUserRole(role) {
  return String(role || 'APPLICANT').replace('ROLE_', '')
}

function toAdminUserRow(user) {
  const isActive = user.isActive ?? user.active
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: normalizeUserRole(user.role),
    status: isActive ? 'ACTIVE' : 'INACTIVE',
    plans: user.savedPlansCount || user.plansCount || 0,
  }
}

export default function AdminPanel() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useStore(s => s.user)
  const logout = useStore(s => s.logout)
  // Renamed to avoid shadowing the admin API's updateProfile import from admin.js
  const updateMyAccountProfile = useStore(s => s.updateProfile)
  const updateProfilePicture = useStore(s => s.updateProfilePicture)
  const changePassword = useStore(s => s.changePassword)
  const accessToken = useStore(s => s.accessToken)
  const [activeTab, setActiveTab] = useState('overview')
  const [search, setSearch] = useState('')
  const [plans, setPlans] = useState(INITIAL_MASTER_PLANS)
  const [contents, setContents] = useState(INITIAL_CONTENT)
  const [countries, setCountries] = useState([])
  const [countriesLoading, setCountriesLoading] = useState(true)
  const [countriesError, setCountriesError] = useState('')
  const [countryPage, setCountryPage] = useState(0)
  const COUNTRY_PAGE_SIZE = 20
  const [countryModal, setCountryModal] = useState(null) // null | { mode: 'add'|'edit', data?: {} }
  const [countryForm, setCountryForm] = useState({})
  const [countrySubmitting, setCountrySubmitting] = useState(false)
  const [countryFormError, setCountryFormError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null) // countryId | null
  const [cities, setCities] = useState([])
  const [citiesLoading, setCitiesLoading] = useState(true)
  const [citiesError, setCitiesError] = useState('')
  const [cityPage, setCityPage] = useState(0)
  const [cityTotalPages, setCityTotalPages] = useState(0)
  const [cityTotalElements, setCityTotalElements] = useState(0)
  const CITY_PAGE_SIZE = 20
  const [cityModal, setCityModal] = useState(null)   // null | { mode:'add'|'edit', countryId, cityId? }
  const [cityForm, setCityForm] = useState({})
  const [citySubmitting, setCitySubmitting] = useState(false)
  const [cityFormError, setCityFormError] = useState('')
  const [deleteCityConfirm, setDeleteCityConfirm] = useState(null) // { countryId, cityId } | null
  const [profiles, setProfiles] = useState([])
  const [profilesLoading, setProfilesLoading] = useState(true)
  const [profilesError, setProfilesError] = useState('')
  const [profilePage, setProfilePage] = useState(0)
  const PROFILE_PAGE_SIZE = 20
  const [profileModal, setProfileModal] = useState(null) // null | { mode:'add'|'edit', id? }
  const [profileForm, setProfileForm] = useState({})
  const [profileSubmitting, setProfileSubmitting] = useState(false)
  const [profileFormError, setProfileFormError] = useState('')
  const [deleteProfileConfirm, setDeleteProfileConfirm] = useState(null) // profileId | null
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState('')
  const [inviteForm, setInviteForm] = useState({ name: '', email: '' })
  const [inviteSubmitting, setInviteSubmitting] = useState(false)
  const [inviteFeedback, setInviteFeedback] = useState(null)
  const [accountForm, setAccountForm] = useState(user || {})
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [accountSaving, setAccountSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [accountFeedback, setAccountFeedback] = useState(null)

  // ── Load countries from API on mount ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    async function loadCountries() {
      setCountriesLoading(true)
      setCountriesError('')
      try {
        const data = await listCountries()
        if (!cancelled) setCountries(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!cancelled) setCountriesError(err.message || 'Failed to load countries')
      } finally {
        if (!cancelled) setCountriesLoading(false)
      }
    }
    loadCountries()
    return () => { cancelled = true }
  }, [])

  // Sync accountForm when user changes (e.g. after profile save)
  useEffect(() => {
    setAccountForm(user || {})
  }, [user])

  // ── Load all cities via admin endpoint (paginated, includes inactive) ────────
  useEffect(() => {
    let cancelled = false
    async function loadCities() {
      if (!accessToken) return
      setCitiesLoading(true)
      setCitiesError('')
      try {
        const page = await listAllCities(accessToken, { page: cityPage, size: CITY_PAGE_SIZE })
        if (!cancelled) {
          // page is a Spring Page: { content, totalElements, totalPages, number, size }
          setCities(page?.content || [])
          setCityTotalPages(page?.totalPages || 0)
          setCityTotalElements(page?.totalElements || 0)
        }
      } catch (err) {
        if (!cancelled) setCitiesError(err.message || 'Failed to load cities')
      } finally {
        if (!cancelled) setCitiesLoading(false)
      }
    }
    loadCities()
    return () => { cancelled = true }
  }, [accessToken, cityPage]) // re-fetch when page changes

  // ── Load all planning profiles ────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    async function load() {
      setProfilesLoading(true)
      setProfilesError('')
      try {
        const data = await listProfiles(accessToken)
        if (!cancelled) setProfiles(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!cancelled) setProfilesError(err.message || 'Failed to load profiles')
      } finally {
        if (!cancelled) setProfilesLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const applicantUsers = users.filter(user => user.role === 'APPLICANT')
  const adminUsers = users.filter(user => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
  const activeUsers = applicantUsers.filter(user => user.status === 'ACTIVE').length
  const draftContent = contents.filter(item => item.status === 'DRAFT').length
  const publishedPlans = plans.filter(plan => plan.status === 'PUBLISHED').length

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      if (!accessToken) return
      setUsersLoading(true)
      setUsersError('')
      try {
        const page = await listAdminUsers(accessToken)
        const rows = (page?.content || []).map(toAdminUserRow)
        if (!cancelled) {
          setUsers(rows)
        }
      } catch (error) {
        if (!cancelled) {
          setUsersError(error.message || t('admin.users_load_error'))
          if (error.status === 401 || error.status === 403) {
            await logout()
            navigate('/signin', { replace: true })
          }
        }
      } finally {
        if (!cancelled) {
          setUsersLoading(false)
        }
      }
    }

    loadUsers()
    return () => {
      cancelled = true
    }
  }, [accessToken, logout, navigate, t])

  const filterRows = (rows, fields) => {
    const term = search.trim().toLowerCase()
    if (!term) return rows
    return rows.filter(row => fields.map(field => row[field]).join(' ').toLowerCase().includes(term))
  }

  const filteredPlans = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return plans
    return plans.filter(plan =>
      [plan.title, plan.country, plan.city, plan.profile, plan.status]
        .join(' ')
        .toLowerCase()
        .includes(term)
    )
  }, [plans, search])

  const filteredContent = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return contents
    return contents.filter(item =>
      [item.title, item.type, item.status].join(' ').toLowerCase().includes(term)
    )
  }, [contents, search])

  const filteredUsers = useMemo(() => {
    return filterRows(applicantUsers, ['name', 'email', 'role', 'status'])
  }, [applicantUsers, search])

  const filteredAdmins = useMemo(() => {
    return filterRows(adminUsers, ['name', 'email', 'role', 'status'])
  }, [adminUsers, search])

  const filteredCountries = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return countries
    return countries.filter(c =>
      [c.nameEn, c.nameBn, c.code, c.currencyCode].join(' ').toLowerCase().includes(term)
    )
  }, [countries, search])

  const filteredCities = useMemo(() => {
    // Cities come paginated from backend — search filters current page client-side
    // For full cross-page search, change the cityPage + pass search to backend
    const term = search.trim().toLowerCase()
    if (!term) return cities
    return cities.filter(c =>
      [c.nameEn, c.nameBn, c.code, c.countryCode, c.taglineEn].join(' ').toLowerCase().includes(term)
    )
  }, [cities, search])

  const filteredProfiles = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return profiles
    return profiles.filter(p =>
      [p.nameEn, p.nameBn, p.code].join(' ').toLowerCase().includes(term)
    )
  }, [profiles, search])

  const filteredTemplates = useMemo(() => {
    return filterRows(templates, ['name', 'owner', 'status'])
  }, [templates, search])

  const addPlan = () => {
    const nextPlanNumber = plans.length + 1
    setPlans(current => [
      {
        id: `mp-draft-${Date.now()}`,
        title: `${t('admin.new_master_plan')} ${nextPlanNumber}`,
        country: 'New Zealand',
        city: 'Hamilton',
        profile: 'Student',
        monthlyCost: 1750,
        movingCost: 4200,
        checklistItems: 10,
        status: 'DRAFT',
        updatedAt: '2026-04-26',
      },
      ...current,
    ])
    setActiveTab('plans')
  }

  const addContent = () => {
    setContents(current => [
      {
        id: `content-${Date.now()}`,
        title: t('admin.new_article'),
        type: 'Essentials',
        status: 'DRAFT',
        updatedAt: '2026-04-26',
      },
      ...current,
    ])
    setActiveTab('content')
  }

  const togglePlanStatus = (id) => {
    setPlans(current => current.map(plan => (
      plan.id === id
        ? { ...plan, status: plan.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED', updatedAt: '2026-04-26' }
        : plan
    )))
  }

  const removePlan = (id) => {
    setPlans(current => current.filter(plan => plan.id !== id))
  }

  const toggleContentStatus = (id) => {
    setContents(current => current.map(item => (
      item.id === id
        ? { ...item, status: item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED', updatedAt: '2026-04-26' }
        : item
    )))
  }

  const toggleUserStatus = async (id) => {
    const currentUser = users.find(user => user.id === id)
    if (!currentUser || !accessToken) return

    const nextStatus = currentUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setUsers(current => current.map(user => (
      user.id === id ? { ...user, status: nextStatus } : user
    )))

    try {
      const updated = currentUser.status === 'ACTIVE'
        ? await deactivateUser(accessToken, id)
        : await activateUser(accessToken, id)
      setUsers(current => current.map(user => (
        user.id === id ? toAdminUserRow(updated) : user
      )))
      setUsersError('')
    } catch (error) {
      setUsers(current => current.map(user => (
        user.id === id ? currentUser : user
      )))
      setUsersError(error.message || t('admin.user_status_error'))
      if (error.status === 401 || error.status === 403) {
        await logout()
        navigate('/signin', { replace: true })
      }
    }
  }

  const toggleCountryStatus = async (id) => {
    if (!accessToken) return
    try {
      const updated = await toggleCountryActive(accessToken, id)
      setCountries(current => current.map(c => c.id === id ? updated : c))
    } catch (err) {
      setCountriesError(err.message || 'Failed to toggle country status')
    }
  }

  const openAddCountry = () => {
    setCountryForm({ code: '', nameEn: '', nameBn: '', currencyCode: '', flagEmoji: '', colorHex: '#0095A1', displayOrder: 1 })
    setCountryFormError('')
    setCountryModal({ mode: 'add' })
  }

  const openEditCountry = (country) => {
    setCountryForm({
      code: country.code,
      nameEn: country.nameEn,
      nameBn: country.nameBn,
      currencyCode: country.currencyCode,
      flagEmoji: country.flagEmoji || '',
      colorHex: country.colorHex || '#0095A1',
      descriptionEn: country.descriptionEn || '',
      descriptionBn: country.descriptionBn || '',
      displayOrder: country.displayOrder ?? 1,
    })
    setCountryFormError('')
    setCountryModal({ mode: 'edit', id: country.id })
  }

  const handleCountrySubmit = async (e) => {
    e.preventDefault()
    setCountryFormError('')
    setCountrySubmitting(true)
    try {
      if (countryModal.mode === 'add') {
        const created = await createCountry(accessToken, countryForm)
        setCountries(current => [created, ...current])
      } else {
        const updated = await updateCountry(accessToken, countryModal.id, countryForm)
        setCountries(current => current.map(c => c.id === countryModal.id ? updated : c))
      }
      setCountryModal(null)
    } catch (err) {
      setCountryFormError(err.message || 'Failed to save country')
    } finally {
      setCountrySubmitting(false)
    }
  }

  const handleDeleteCountry = async (id) => {
    if (!accessToken) return
    try {
      await deleteCountry(accessToken, id)
      setCountries(current => current.filter(c => c.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setCountriesError(err.message || 'Failed to delete country')
      setDeleteConfirm(null)
    }
  }

  const toggleCityStatus = async (countryId, cityId) => {
    if (!accessToken) return
    try {
      const updated = await toggleCityActive(accessToken, countryId, cityId)
      setCities(current => current.map(c => c.id === cityId ? updated : c))
    } catch (err) {
      setCitiesError(err.message || 'Failed to toggle city status')
    }
  }

  const openAddCity = (preCountryId = '') => {
    setCityForm({
      code: '', nameEn: '', nameBn: '', countryId: preCountryId,
      taglineEn: '', colorHex: '#0095A1',
      weeklyRangeMinNzd: '', weeklyRangeMaxNzd: '',
      roomRentHintNzd: '', transportHintNzd: '', groceriesHintNzd: '',
      costIndex: 100, displayOrder: 1,
    })
    setCityFormError('')
    setCityModal({ mode: 'add' })
  }

  const openEditCity = (city) => {
    setCityForm({
      code: city.code,
      nameEn: city.nameEn,
      nameBn: city.nameBn,
      countryId: city.countryId,
      taglineEn: city.taglineEn || '',
      taglineBn: city.taglineBn || '',
      colorHex: city.colorHex || '#0095A1',
      weeklyRangeMinNzd: city.weeklyRangeMinNzd ?? '',
      weeklyRangeMaxNzd: city.weeklyRangeMaxNzd ?? '',
      roomRentHintNzd: city.roomRentHintNzd ?? '',
      transportHintNzd: city.transportHintNzd ?? '',
      groceriesHintNzd: city.groceriesHintNzd ?? '',
      costIndex: city.costIndex ?? 100,
      displayOrder: city.displayOrder ?? 1,
      shortDescriptionEn: city.shortDescriptionEn || '',
      shortDescriptionBn: city.shortDescriptionBn || '',
    })
    setCityFormError('')
    setCityModal({ mode: 'edit', countryId: city.countryId, cityId: city.id })
  }

  const handleCitySubmit = async (e) => {
    e.preventDefault()
    setCityFormError('')
    setCitySubmitting(true)
    const { countryId, ...payload } = cityForm
    try {
      if (cityModal.mode === 'add') {
        const created = await createCity(accessToken, countryId, payload)
        setCities(current => [created, ...current])
      } else {
        const updated = await updateCity(accessToken, cityModal.countryId, cityModal.cityId, payload)
        setCities(current => current.map(c => c.id === cityModal.cityId ? updated : c))
      }
      setCityModal(null)
    } catch (err) {
      setCityFormError(err.message || 'Failed to save city')
    } finally {
      setCitySubmitting(false)
    }
  }

  const handleDeleteCity = async ({ countryId, cityId }) => {
    if (!accessToken) return
    try {
      await deleteCity(accessToken, countryId, cityId)
      setCities(current => current.filter(c => c.id !== cityId))
      setDeleteCityConfirm(null)
    } catch (err) {
      setCitiesError(err.message || 'Failed to delete city')
      setDeleteCityConfirm(null)
    }
  }

  const toggleProfileStatus = async (id) => {
    if (!accessToken) return
    try {
      const updated = await toggleProfileActive(accessToken, id)
      setProfiles(current => current.map(p => p.id === id ? updated : p))
    } catch (err) {
      setProfilesError(err.message || 'Failed to toggle profile status')
    }
  }

  const openAddProfile = () => {
    setProfileForm({
      code: '', nameEn: '', nameBn: '', shortDetailsEn: '', shortDetailsBn: '',
      colorHex: '#7C3AED', monthlyBudgetRangeMinNzd: '', monthlyBudgetRangeMaxNzd: '',
      defaultPersonCount: 1, displayOrder: 1, tags: [],
    })
    setProfileFormError('')
    setProfileModal({ mode: 'add' })
  }

  const openEditProfile = (profile) => {
    setProfileForm({
      code: profile.code,
      nameEn: profile.nameEn,
      nameBn: profile.nameBn,
      shortDetailsEn: profile.shortDetailsEn || '',
      shortDetailsBn: profile.shortDetailsBn || '',
      colorHex: profile.colorHex || '#7C3AED',
      monthlyBudgetRangeMinNzd: profile.monthlyBudgetRangeMinNzd ?? '',
      monthlyBudgetRangeMaxNzd: profile.monthlyBudgetRangeMaxNzd ?? '',
      defaultPersonCount: profile.defaultPersonCount ?? 1,
      displayOrder: profile.displayOrder ?? 1,
      tags: profile.tags || [],
      iconSvgUrl: profile.iconSvgUrl || '',
    })
    setProfileFormError('')
    setProfileModal({ mode: 'edit', id: profile.id })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileFormError('')
    setProfileSubmitting(true)
    try {
      if (profileModal.mode === 'add') {
        const created = await createProfile(accessToken, profileForm)
        setProfiles(current => [created, ...current])
      } else {
        const { code, ...updatePayload } = profileForm // code immutable
        const updated = await updateProfile(accessToken, profileModal.id, updatePayload)
        setProfiles(current => current.map(p => p.id === profileModal.id ? updated : p))
      }
      setProfileModal(null)
    } catch (err) {
      setProfileFormError(err.message || 'Failed to save profile')
    } finally {
      setProfileSubmitting(false)
    }
  }

  const handleDeleteProfile = async (id) => {
    if (!accessToken) return
    try {
      await deleteProfile(accessToken, id)
      setProfiles(current => current.filter(p => p.id !== id))
      setDeleteProfileConfirm(null)
    } catch (err) {
      setProfilesError(err.message || 'Failed to delete profile')
      setDeleteProfileConfirm(null)
    }
  }

  const toggleTemplateStatus = (id) => {
    setTemplates(current => current.map(template => (
      template.id === id
        ? { ...template, status: template.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE' }
        : template
    )))
  }

  const handleInviteAdmin = async (event) => {
    event.preventDefault()
    setInviteFeedback(null)

    if (!accessToken) {
      setInviteFeedback({ type: 'error', message: t('admin.invite_not_signed_in') })
      return
    }

    setInviteSubmitting(true)
    try {
      const invited = await createAdminUser(accessToken, {
        name: inviteForm.name.trim(),
        email: inviteForm.email.trim(),
      })
      const nextAdmin = toAdminUserRow(invited)
      setUsers(current => [nextAdmin, ...current.filter(existing => existing.id !== nextAdmin.id)])
      setInviteForm({ name: '', email: '' })
      setInviteFeedback({ type: 'success', message: t('admin.invite_success') })
    } catch (error) {
      setInviteFeedback({ type: 'error', message: error.message || t('admin.invite_error') })
    } finally {
      setInviteSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleSaveAdminAccount = async (event) => {
    event.preventDefault()
    setAccountFeedback(null)
    setAccountSaving(true)
    try {
      await updateMyAccountProfile(accountForm)
      if (accountForm.profilePicture) {
        await updateProfilePicture(accountForm.profilePicture)
      }
      setAccountFeedback({ type: 'success', message: t('admin.account_saved') })
    } catch (error) {
      setAccountFeedback({ type: 'error', message: error.message || t('admin.account_error') })
    } finally {
      setAccountSaving(false)
    }
  }

  const handleChangeAdminPassword = async (event) => {
    event.preventDefault()
    setAccountFeedback(null)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAccountFeedback({ type: 'error', message: t('admin.password_mismatch') })
      return
    }

    setPasswordSaving(true)
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setAccountFeedback({ type: 'success', message: t('admin.password_saved') })
    } catch (error) {
      setAccountFeedback({ type: 'error', message: error.message || t('admin.password_error') })
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eaf6f5_0%,#f8fbf6_48%,#eef7f6_100%)]">
      <header className="sticky top-0 z-40 border-b border-brand-mid/35 bg-white/82 px-4 py-3 shadow-[0_12px_34px_rgba(0,89,96,0.08)] backdrop-blur-2xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/admin/Joy&Priota" className="flex shrink-0 items-center gap-1">
            <span className="relative block h-11 w-11 overflow-hidden">
              <img
                src={logoTigerNew}
                alt="KiwiDream BD"
                className="absolute left-1/2 top-1/2 h-[58px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
              />
            </span>
            <span className="hidden font-logo text-lg font-semibold leading-none tracking-[0.24em] text-brand-deep sm:block">
              B K W I
            </span>
            <span className="ml-3 hidden rounded-full bg-brand-light px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-brand md:inline-flex">
              {t('admin.private_panel')}
            </span>
          </Link>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-3 rounded-full border border-brand-mid/60 bg-white/76 px-3 py-2 md:flex">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-brand">
                <UserCircle2 size={18} />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-black text-brand-deep">{user?.name || 'Joy & Priota'}</p>
                <p className="text-[11px] font-bold text-brand-deep/45">{t('admin.role_badge')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 text-sm font-extrabold text-red-600 hover:border-red-200 sm:px-4"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8">
        <section className="rounded-[30px] border border-white/70 bg-white/70 p-5 shadow-[0_24px_70px_rgba(0,89,96,0.10)] backdrop-blur-2xl sm:p-7">
          {location.state?.blockedWebsite ? (
            <div className="mb-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
              <ShieldAlert className="mt-0.5 shrink-0" size={18} />
              <p className="text-sm font-bold leading-relaxed">
                {t('admin.website_blocked_message')}
              </p>
            </div>
          ) : null}
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand/60">
                {t('admin.kicker')}
              </p>
              <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-tight text-brand-deep md:text-5xl">
                {t('admin.title')}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-deep/62 md:text-base">
                {t('admin.subtitle')}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addContent}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-mid bg-white/76 px-5 text-sm font-extrabold text-brand-deep shadow-sm hover:border-brand"
              >
                <BookOpenText size={17} />
                {t('admin.add_content')}
              </button>
              <button
                type="button"
                onClick={addPlan}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(0,149,161,0.22)] hover:bg-brand-deep"
              >
                <Plus size={17} />
                {t('admin.add_master_plan')}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStat
            Icon={FilePlus2}
            label={t('admin.stats.master_plans')}
            value={plans.length}
            hint={t('admin.stats.master_plans_hint', { count: publishedPlans })}
          />
          <AdminStat
            Icon={Users}
            label={t('admin.stats.users')}
            value={applicantUsers.length}
            hint={t('admin.stats.users_hint', { count: activeUsers })}
            tone="blue"
          />
          <AdminStat
            Icon={Newspaper}
            label={t('admin.stats.content')}
            value={contents.length}
            hint={t('admin.stats.content_hint', { count: draftContent })}
            tone="amber"
          />
          <AdminStat
            Icon={UserCog}
            label={t('admin.stats.admins')}
            value={adminUsers.length}
            hint={t('admin.stats.admins_hint')}
            tone="slate"
          />
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-[28px] border border-white/70 bg-white/66 p-3 shadow-[0_18px_54px_rgba(0,89,96,0.08)] backdrop-blur-xl">
            <div className="grid gap-2">
              {TABS.map(({ id, labelKey, Icon }) => {
                const isActive = activeTab === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-extrabold transition-colors',
                      isActive
                        ? 'bg-brand text-white shadow-[0_14px_30px_rgba(0,149,161,0.20)]'
                        : 'text-brand-deep/70 hover:bg-white hover:text-brand-deep'
                    )}
                  >
                    <Icon size={18} />
                    {t(`admin.tabs.${labelKey}`)}
                  </button>
                )
              })}
            </div>
          </aside>

          <div className="min-w-0 rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-[0_18px_54px_rgba(0,89,96,0.08)] backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-deep/38" size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t('admin.search_placeholder')}
                  className="h-12 w-full rounded-full border border-brand-mid/70 bg-white/80 pl-11 pr-4 text-sm font-semibold text-brand-deep outline-none transition-colors placeholder:text-brand-deep/38 focus:border-brand focus:bg-white"
                />
              </div>
              <div className="flex items-center gap-2 rounded-full bg-brand-light px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand">
                <ShieldCheck size={15} />
                {t('admin.role_badge')}
              </div>
            </div>

            {activeTab === 'overview' && (
              <OverviewPanel
                t={t}
                plans={plans}
                users={users}
                contents={contents}
                countries={countries}
                cities={cities}
                profiles={profiles}
              />
            )}

            {activeTab === 'countries' && (
              <CountriesPanel
                t={t}
                countries={filteredCountries}
                loading={countriesLoading}
                error={countriesError}
                onToggleStatus={toggleCountryStatus}
                onAdd={openAddCountry}
                onEdit={openEditCountry}
                onDelete={(id) => setDeleteConfirm(id)}
                modal={countryModal}
                form={countryForm}
                onFormChange={setCountryForm}
                onSubmit={handleCountrySubmit}
                submitting={countrySubmitting}
                formError={countryFormError}
                onCloseModal={() => setCountryModal(null)}
                deleteConfirm={deleteConfirm}
                onConfirmDelete={handleDeleteCountry}
                onCancelDelete={() => setDeleteConfirm(null)}
                page={countryPage}
                pageSize={COUNTRY_PAGE_SIZE}
                onPageChange={setCountryPage}
              />
            )}

            {activeTab === 'cities' && (
              <CitiesPanel
                t={t}
                cities={filteredCities}
                countries={countries}
                loading={citiesLoading}
                error={citiesError}
                totalElements={cityTotalElements}
                totalPages={cityTotalPages}
                page={cityPage}
                pageSize={CITY_PAGE_SIZE}
                onPageChange={setCityPage}
                onToggleStatus={toggleCityStatus}
                onAdd={openAddCity}
                onEdit={openEditCity}
                onDelete={(countryId, cityId) => setDeleteCityConfirm({ countryId, cityId })}
                modal={cityModal}
                form={cityForm}
                onFormChange={setCityForm}
                onSubmit={handleCitySubmit}
                submitting={citySubmitting}
                formError={cityFormError}
                onCloseModal={() => setCityModal(null)}
                deleteCityConfirm={deleteCityConfirm}
                onConfirmDeleteCity={handleDeleteCity}
                onCancelDeleteCity={() => setDeleteCityConfirm(null)}
              />
            )}

            {activeTab === 'profiles' && (
              <ProfilesPanel
                t={t}
                profiles={filteredProfiles}
                loading={profilesLoading}
                error={profilesError}
                page={profilePage}
                pageSize={PROFILE_PAGE_SIZE}
                onPageChange={setProfilePage}
                onToggleStatus={toggleProfileStatus}
                onAdd={openAddProfile}
                onEdit={openEditProfile}
                onDelete={(id) => setDeleteProfileConfirm(id)}
                modal={profileModal}
                form={profileForm}
                onFormChange={setProfileForm}
                onSubmit={handleProfileSubmit}
                submitting={profileSubmitting}
                formError={profileFormError}
                onCloseModal={() => setProfileModal(null)}
                deleteConfirm={deleteProfileConfirm}
                onConfirmDelete={handleDeleteProfile}
                onCancelDelete={() => setDeleteProfileConfirm(null)}
              />
            )}

            {activeTab === 'plans' && (
              <PlansPanel
                t={t}
                plans={filteredPlans}
                onToggleStatus={togglePlanStatus}
                onRemove={removePlan}
              />
            )}

            {activeTab === 'templates' && (
              <TemplatesPanel t={t} templates={filteredTemplates} onToggleStatus={toggleTemplateStatus} />
            )}

            {activeTab === 'content' && (
              <ContentPanel
                t={t}
                contents={filteredContent}
                onToggleStatus={toggleContentStatus}
              />
            )}

            {activeTab === 'users' && (
              <UsersPanel
                t={t}
                users={filteredUsers}
                onToggleStatus={toggleUserStatus}
                mode="users"
                loading={usersLoading}
                error={usersError}
              />
            )}

            {activeTab === 'admins' && (
              <UsersPanel
                t={t}
                users={filteredAdmins}
                onToggleStatus={toggleUserStatus}
                mode="admins"
                inviteForm={inviteForm}
                onInviteChange={setInviteForm}
                onInviteSubmit={handleInviteAdmin}
                inviteSubmitting={inviteSubmitting}
                inviteFeedback={inviteFeedback}
                loading={usersLoading}
                error={usersError}
              />
            )}

            {activeTab === 'account' && (
              <AdminAccountPanel
                t={t}
                form={accountForm}
                onFormChange={setAccountForm}
                onSaveProfile={handleSaveAdminAccount}
                savingProfile={accountSaving}
                passwordForm={passwordForm}
                onPasswordChange={setPasswordForm}
                onSavePassword={handleChangeAdminPassword}
                savingPassword={passwordSaving}
                feedback={accountFeedback}
              />
            )}
          </div>
        </section>
      </div>

      <footer className="mt-4 border-t border-brand-mid/35 bg-white/62 px-4 py-5 text-center text-xs font-semibold text-brand-deep/48 sm:px-6">
        {t('admin.footer_note')}
      </footer>
    </div>
  )
}

// ─── Shared Pagination Bar ────────────────────────────────────────────────────
// Works in two modes:
//  1. Backend pagination: pass totalPages + page + onPageChange (cities)
//  2. Client pagination:  pass rows + pageSize + page + onPageChange (countries, profiles)
function PaginationBar({ page, totalPages, pageSize, rows, onPageChange, label = 'items' }) {
  const resolvedTotal = totalPages ?? (rows ? Math.ceil(rows.length / pageSize) : 0)
  if (resolvedTotal <= 1) return null

  const start = rows ? page * pageSize + 1 : null
  const end   = rows ? Math.min((page + 1) * pageSize, rows.length) : null
  const total = rows ? rows.length : null

  return (
    <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-xs font-semibold text-brand-deep/50">
        {rows
          ? `Showing ${start}–${end} of ${total} ${label}`
          : `Page ${page + 1} of ${resolvedTotal}`}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(0)}
          disabled={page === 0}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-brand-mid bg-white text-brand text-xs font-bold hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
        >
          «
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-brand-mid bg-white text-brand text-xs font-bold hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          ‹
        </button>
        {/* Page number buttons (show up to 5 around current) */}
        {Array.from({ length: resolvedTotal }, (_, i) => i)
          .filter(i => Math.abs(i - page) <= 2)
          .map(i => (
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-bold transition-colors ${
                i === page
                  ? 'border-brand bg-brand text-white shadow-sm'
                  : 'border-brand-mid bg-white text-brand hover:bg-brand-light'
              }`}
            >
              {i + 1}
            </button>
          ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= resolvedTotal - 1}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-brand-mid bg-white text-brand text-xs font-bold hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          ›
        </button>
        <button
          onClick={() => onPageChange(resolvedTotal - 1)}
          disabled={page >= resolvedTotal - 1}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-brand-mid bg-white text-brand text-xs font-bold hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </div>
  )
}

function OverviewPanel({ t, plans, users, contents, countries, cities, profiles }) {
  const latestPlans = [...plans].slice(0, 4)
  const _countries = countries || []
  const _cities = cities || []
  const _profiles = profiles || []

  const catalogCounts = [
    { id: 'countries', Icon: Globe2, value: _countries.length, labelKey: 'countries', activeCount: _countries.filter(c => c.active !== false).length },
    { id: 'cities', Icon: Building2, value: _cities.length, labelKey: 'cities', activeCount: _cities.filter(c => c.active !== false).length },
    { id: 'profiles', Icon: BadgeCheck, value: _profiles.length, labelKey: 'profiles', activeCount: _profiles.filter(p => p.active !== false).length },
    { id: 'templates', Icon: ListChecks, value: plans.length, labelKey: 'templates', activeCount: plans.filter(p => p.status === 'PUBLISHED').length },
  ]

  const applicantCount = users.filter(u => u.role === 'APPLICANT').length
  const activeUserCount = users.filter(u => u.role === 'APPLICANT' && u.status === 'ACTIVE').length
  const draftPlans = plans.filter(p => p.status === 'DRAFT').length
  const draftContent = contents.filter(c => c.status === 'DRAFT').length
  const inactiveUsers = users.filter(u => u.status === 'INACTIVE' || u.status === 'DEACTIVATED').length

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand/60">System snapshot</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-brand-deep">Overview</h2>
      </div>

      {/* Catalog count cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {catalogCounts.map(({ id, Icon, value, labelKey, activeCount }) => (
          <div key={id} className="rounded-2xl border border-brand-mid/40 bg-white p-4 hover:shadow-[0_4px_20px_rgba(0,149,161,0.08)] transition-shadow">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light text-brand">
                <Icon size={18} />
              </span>
              <span className="text-3xl font-black text-brand-deep">{value}</span>
            </div>
            <p className="mt-3 text-sm font-extrabold text-brand-deep">{t(`admin.catalog.${labelKey}`)}</p>
            <p className="mt-0.5 text-xs font-semibold text-brand-deep/50">{activeCount} active</p>
          </div>
        ))}
      </div>

      {/* Activity queue + latest plans */}
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Latest plans */}
        <div className="rounded-2xl border border-white/80 bg-white p-5">
          <h3 className="text-base font-black text-brand-deep">{t('admin.latest_master_plans')}</h3>
          <div className="mt-4 grid gap-3">
            {latestPlans.length === 0 ? (
              <p className="py-6 text-center text-sm font-semibold text-brand-deep/40">No master plans yet.</p>
            ) : latestPlans.map(plan => (
              <div key={plan.id} className="flex flex-col gap-3 rounded-2xl border border-brand-mid/35 bg-brand-light/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-extrabold text-brand-deep text-sm">{plan.title || plan.nameEn}</p>
                  <p className="mt-0.5 text-xs font-semibold text-brand-deep/55">
                    {[plan.city, plan.profile, plan.monthlyCost ? formatNZD(plan.monthlyCost) : null].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <StatusBadge status={plan.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Admin queue */}
        <div className="rounded-2xl border border-white/80 bg-white p-5">
          <h3 className="text-base font-black text-brand-deep">{t('admin.admin_queue')}</h3>
          <div className="mt-4 grid gap-3">
            <QueueItem Icon={FilePlus2} label={t('admin.queue.master_drafts')} value={draftPlans} />
            <QueueItem Icon={Newspaper} label={t('admin.queue.content_drafts')} value={draftContent} />
            <QueueItem Icon={Users} label={t('admin.queue.inactive_users')} value={inactiveUsers} />
          </div>
          <div className="mt-4 grid gap-3 border-t border-brand-mid/30 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-brand-deep/60">Total applicants</span>
              <span className="text-sm font-black text-brand-deep">{applicantCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-brand-deep/60">Active applicants</span>
              <span className="text-sm font-black text-safe">{activeUserCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Country / city quick summary */}
      {(_countries.length > 0 || _cities.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Countries */}
          <div className="rounded-2xl border border-brand-mid/40 bg-white p-5">
            <h3 className="text-sm font-black text-brand-deep mb-3">Countries</h3>
            <div className="grid gap-2">
              {_countries.map(country => (
                <div key={country.id} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: country.colorHex || '#0095A1' }} />
                  <span className="text-sm font-semibold text-brand-deep">{country.flagEmoji} {country.nameEn}</span>
                  <StatusBadge status={country.active !== false ? 'ACTIVE' : 'INACTIVE'} />
                </div>
              ))}
            </div>
          </div>
          {/* Cities distribution */}
          <div className="rounded-2xl border border-brand-mid/40 bg-white p-5">
            <h3 className="text-sm font-black text-brand-deep mb-3">Cities ({_cities.length} total)</h3>
            <div className="grid gap-2">
              {_cities.slice(0, 6).map(city => (
                <div key={city.id} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: city.colorHex || '#0095A1' }} />
                  <span className="text-sm font-semibold text-brand-deep flex-1">{city.nameEn}</span>
                  <StatusBadge status={city.active !== false ? 'ACTIVE' : 'INACTIVE'} />
                </div>
              ))}
              {_cities.length > 6 && (
                <p className="text-xs font-semibold text-brand-deep/40">+{_cities.length - 6} more</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function QueueItem({ Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-brand-mid/35 bg-white/78 p-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light text-brand">
          <Icon size={18} />
        </span>
        <span className="text-sm font-extrabold text-brand-deep">{label}</span>
      </div>
      <span className="text-xl font-black text-brand-deep">{value}</span>
    </div>
  )
}

function CatalogActions({ id, onToggleStatus, t }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onToggleStatus(id)}
        title={t('admin.toggle_status')}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-mid bg-white text-brand hover:border-brand"
      >
        <Archive size={16} />
      </button>
      <button
        type="button"
        title={t('admin.edit')}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-mid bg-white text-brand hover:border-brand"
      >
        <Pencil size={16} />
      </button>
    </div>
  )
}

function CountriesPanel({
  t, countries, loading, error,
  onToggleStatus, onAdd, onEdit, onDelete,
  modal, form, onFormChange, onSubmit, submitting, formError, onCloseModal,
  deleteConfirm, onConfirmDelete, onCancelDelete,
  page = 0, pageSize = 20, onPageChange,
}) {
  const role = useStore(s => s.user?.role)
  // Any admin can delete content entities (countries, cities, profiles, plans, content)
  // Only super admin can delete other admins or users
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].includes(String(role || ''))

  const field = (key, value) => onFormChange(prev => ({ ...prev, [key]: value }))

  // Client-side pagination for countries (few rows, all loaded at once)
  const pagedCountries = countries.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand/60">Destination Setup</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-brand-deep">
            Country management
            {!loading && countries.length > 0 && (
              <span className="ml-2 text-sm font-semibold text-brand-deep/40">({countries.length})</span>
            )}
          </h2>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(0,149,161,0.22)] hover:bg-brand-deep transition-colors"
        >
          <Plus size={16} /> Add country
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <ShieldAlert size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="mt-5 overflow-x-auto rounded-2xl border border-brand-mid/40 bg-white">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-brand">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm font-semibold">Loading countries…</span>
          </div>
        ) : countries.length === 0 ? (
          <div className="py-16 text-center text-sm font-semibold text-brand-deep/50">
            No countries found. Add your first destination country.
          </div>
        ) : (
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-brand-light/80 text-xs uppercase tracking-[0.14em] text-brand">
              <tr>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Currency</th>
                <th className="px-4 py-3">Theme</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-mid/35">
              {pagedCountries.map(country => (
                <tr key={country.id} className="hover:bg-brand-light/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {country.flagEmoji && <span className="text-xl">{country.flagEmoji}</span>}
                      <div>
                        <p className="font-extrabold text-brand-deep">{country.nameEn}</p>
                        {country.nameBn && <p className="text-xs text-brand-deep/50">{country.nameBn}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-black text-brand-deep">{country.code}</td>
                  <td className="px-4 py-3 font-semibold text-brand-deep/70">{country.currencyCode}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 font-semibold text-brand-deep/70">
                      <span
                        className="h-4 w-4 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: country.colorHex || '#0095A1' }}
                      />
                      {country.colorHex || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-deep/70">{country.displayOrder ?? '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={country.active ? 'ACTIVE' : 'INACTIVE'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(country.id)}
                        title={country.active ? 'Deactivate' : 'Activate'}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-mid bg-white text-brand hover:border-brand transition-colors"
                      >
                        <Archive size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(country)}
                        title="Edit"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-mid bg-white text-brand hover:border-brand transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => onDelete(country.id)}
                          title="Delete"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 hover:border-red-400 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination (client-side) */}
      {!loading && (
        <PaginationBar
          rows={countries}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
          label="countries"
        />
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/70 bg-white shadow-[0_32px_80px_rgba(0,89,96,0.18)] overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-mid/30">
              <h3 className="font-serif text-xl font-bold text-brand-deep">
                {modal.mode === 'add' ? 'Add new country' : 'Edit country'}
              </h3>
              <button onClick={onCloseModal} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-mid hover:bg-brand-light text-brand-deep">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={onSubmit} className="px-6 py-5 grid gap-4">
              {formError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  <ShieldAlert size={15} className="shrink-0" /> {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Code *</label>
                  <input
                    required
                    maxLength={10}
                    value={form.code || ''}
                    onChange={e => field('code', e.target.value.toUpperCase())}
                    disabled={modal.mode === 'edit'}
                    placeholder="NZ"
                    className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand disabled:bg-brand-light/40 disabled:text-brand-deep/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Currency Code *</label>
                  <input
                    required
                    maxLength={5}
                    value={form.currencyCode || ''}
                    onChange={e => field('currencyCode', e.target.value.toUpperCase())}
                    placeholder="NZD"
                    className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Name (English) *</label>
                <input
                  required
                  maxLength={100}
                  value={form.nameEn || ''}
                  onChange={e => field('nameEn', e.target.value)}
                  placeholder="New Zealand"
                  className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-semibold text-brand-deep outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Name (Bengali) *</label>
                <input
                  required
                  maxLength={200}
                  value={form.nameBn || ''}
                  onChange={e => field('nameBn', e.target.value)}
                  placeholder="নিউজিল্যান্ড"
                  className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-semibold text-brand-deep outline-none focus:border-brand"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Flag Emoji</label>
                  <input
                    maxLength={10}
                    value={form.flagEmoji || ''}
                    onChange={e => field('flagEmoji', e.target.value)}
                    placeholder="🇳🇿"
                    className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-xl outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Theme Color</label>
                  <ColorPicker value={form.colorHex || '#0095A1'} onChange={v => field('colorHex', v)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={form.displayOrder || ''}
                    onChange={e => field('displayOrder', parseInt(e.target.value) || 1)}
                    className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Description (English)</label>
                <textarea
                  rows={2}
                  value={form.descriptionEn || ''}
                  onChange={e => field('descriptionEn', e.target.value)}
                  className="w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 py-2 text-sm font-semibold text-brand-deep outline-none focus:border-brand resize-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Description (Bengali)</label>
                <textarea
                  rows={2}
                  value={form.descriptionBn || ''}
                  onChange={e => field('descriptionBn', e.target.value)}
                  className="w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 py-2 text-sm font-semibold text-brand-deep outline-none focus:border-brand resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={onCloseModal} className="h-10 px-5 rounded-full border border-brand-mid text-sm font-extrabold text-brand-deep hover:bg-brand-light transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-extrabold text-white hover:bg-brand-deep disabled:opacity-60 transition-colors"
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  {modal.mode === 'add' ? 'Create country' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/70 bg-white p-6 shadow-[0_32px_80px_rgba(0,89,96,0.18)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 size={22} />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-brand-deep">Delete country?</h3>
            <p className="mt-2 text-sm font-semibold text-brand-deep/60">
              This action cannot be undone. The country will be permanently removed. This will fail if cities are linked to it.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={onCancelDelete} className="flex-1 h-10 rounded-full border border-brand-mid text-sm font-extrabold text-brand-deep hover:bg-brand-light">
                Cancel
              </button>
              <button onClick={() => onConfirmDelete(deleteConfirm)} className="flex-1 h-10 rounded-full bg-red-500 text-sm font-extrabold text-white hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CitiesPanel({
  t, cities, countries, loading, error,
  totalElements = 0, totalPages = 0, page = 0, pageSize = 20, onPageChange,
  onToggleStatus, onAdd, onEdit, onDelete,
  modal, form, onFormChange, onSubmit, submitting, formError, onCloseModal,
  deleteCityConfirm, onConfirmDeleteCity, onCancelDeleteCity,
}) {
  const role = useStore(s => s.user?.role)
  // Any admin can delete content entities
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].includes(String(role || ''))
  const field = (key, value) => onFormChange(prev => ({ ...prev, [key]: value }))

  // Build country name lookup (from the countries list for the country selector in modal)
  const countryMap = Object.fromEntries((countries || []).map(c => [c.id, c]))

  // cities is already the current page's content from backend
  const startItem = page * pageSize + 1
  const endItem   = Math.min((page + 1) * pageSize, totalElements || cities.length)

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand/60">Destination Setup</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-brand-deep">
            City management
            {!loading && totalElements > 0 && (
              <span className="ml-2 text-sm font-semibold text-brand-deep/40">({totalElements} total)</span>
            )}
          </h2>
          {!loading && totalElements > pageSize && (
            <p className="text-xs text-brand-deep/40 mt-0.5">
              Showing {startItem}–{endItem} of {totalElements} cities
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onAdd('')}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(0,149,161,0.22)] hover:bg-brand-deep transition-colors"
        >
          <Plus size={16} /> Add city
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <ShieldAlert size={16} className="shrink-0" /> {error}
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-2xl border border-brand-mid/40 bg-white">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-brand">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm font-semibold">Loading cities…</span>
          </div>
        ) : cities.length === 0 ? (
          <div className="py-16 text-center text-sm font-semibold text-brand-deep/50">
            No cities found. Add your first city under a country.
          </div>
        ) : (
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="bg-brand-light/80 text-xs uppercase tracking-[0.14em] text-brand">
              <tr>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Weekly Range (NZD)</th>
                <th className="px-4 py-3">Rent hint</th>
                <th className="px-4 py-3">Transport</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-mid/35">
              {cities.map(city => (
                <tr key={city.id} className="hover:bg-brand-light/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {city.colorHex && (
                        <span className="h-3 w-3 rounded-full shrink-0 border border-white shadow-sm" style={{ backgroundColor: city.colorHex }} />
                      )}
                      <div>
                        <p className="font-extrabold text-brand-deep">{city.nameEn}</p>
                        {city.nameBn && <p className="text-xs text-brand-deep/50">{city.nameBn}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-deep/70">
                    {countryMap[city.countryId]?.nameEn || city.countryCode || city.countryId}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-deep/70">
                    {city.weeklyRangeMinNzd && city.weeklyRangeMaxNzd
                      ? `${formatNZD(city.weeklyRangeMinNzd)} – ${formatNZD(city.weeklyRangeMaxNzd)}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 font-black text-brand-deep">
                    {city.roomRentHintNzd ? formatNZD(city.roomRentHintNzd) : '—'}
                  </td>
                  <td className="px-4 py-3 font-black text-brand-deep">
                    {city.transportHintNzd ? formatNZD(city.transportHintNzd) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={city.active ? 'ACTIVE' : 'INACTIVE'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(city.countryId, city.id)}
                        title={city.active ? 'Deactivate' : 'Activate'}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-mid bg-white text-brand hover:border-brand transition-colors"
                      >
                        <Archive size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(city)}
                        title="Edit"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-mid bg-white text-brand hover:border-brand transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => onDelete(city.countryId, city.id)}
                          title="Delete"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 hover:border-red-400 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Backend-paginated pagination bar */}
      {!loading && totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          label="cities"
        />
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-3xl border border-white/70 bg-white shadow-[0_32px_80px_rgba(0,89,96,0.18)] overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-mid/30">
              <h3 className="font-serif text-xl font-bold text-brand-deep">
                {modal.mode === 'add' ? 'Add new city' : 'Edit city'}
              </h3>
              <button onClick={onCloseModal} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-mid hover:bg-brand-light text-brand-deep">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={onSubmit} className="px-6 py-5 grid gap-4">
              {formError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  <ShieldAlert size={15} className="shrink-0" /> {formError}
                </div>
              )}

              {/* Country selector */}
              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Country *</label>
                <select
                  required
                  value={form.countryId || ''}
                  onChange={e => field('countryId', e.target.value)}
                  disabled={modal.mode === 'edit'}
                  className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-semibold text-brand-deep outline-none focus:border-brand disabled:bg-brand-light/40 disabled:text-brand-deep/40"
                >
                  <option value="">Select a country…</option>
                  {(countries || []).map(c => (
                    <option key={c.id} value={c.id}>{c.flagEmoji} {c.nameEn} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Code *</label>
                  <input
                    required maxLength={20}
                    value={form.code || ''}
                    onChange={e => field('code', e.target.value.toUpperCase())}
                    disabled={modal.mode === 'edit'}
                    placeholder="AKL"
                    className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand disabled:bg-brand-light/40 disabled:text-brand-deep/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Theme Color</label>
                  <ColorPicker value={form.colorHex || '#0095A1'} onChange={v => field('colorHex', v)} />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Name (English) *</label>
                <input required maxLength={150} value={form.nameEn || ''} onChange={e => field('nameEn', e.target.value)} placeholder="Auckland" className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-semibold text-brand-deep outline-none focus:border-brand" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Name (Bengali) *</label>
                <input required maxLength={300} value={form.nameBn || ''} onChange={e => field('nameBn', e.target.value)} placeholder="অকল্যান্ড" className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-semibold text-brand-deep outline-none focus:border-brand" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Tagline (English)</label>
                <input maxLength={255} value={form.taglineEn || ''} onChange={e => field('taglineEn', e.target.value)} placeholder="New Zealand's largest city" className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-semibold text-brand-deep outline-none focus:border-brand" />
              </div>

              {/* Cost hints */}
              <p className="text-xs font-extrabold uppercase tracking-wide text-brand-deep/40 -mb-2">Weekly Cost Range (NZD)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-deep/60">Min/week</label>
                  <input type="number" min={0} value={form.weeklyRangeMinNzd || ''} onChange={e => field('weeklyRangeMinNzd', e.target.value)} placeholder="350" className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-deep/60">Max/week</label>
                  <input type="number" min={0} value={form.weeklyRangeMaxNzd || ''} onChange={e => field('weeklyRangeMaxNzd', e.target.value)} placeholder="550" className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand" />
                </div>
              </div>

              <p className="text-xs font-extrabold uppercase tracking-wide text-brand-deep/40 -mb-2">Monthly Cost Hints (NZD)</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-deep/60">Room rent</label>
                  <input type="number" min={0} value={form.roomRentHintNzd || ''} onChange={e => field('roomRentHintNzd', e.target.value)} placeholder="800" className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-deep/60">Transport</label>
                  <input type="number" min={0} value={form.transportHintNzd || ''} onChange={e => field('transportHintNzd', e.target.value)} placeholder="200" className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-deep/60">Groceries</label>
                  <input type="number" min={0} value={form.groceriesHintNzd || ''} onChange={e => field('groceriesHintNzd', e.target.value)} placeholder="300" className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Cost Index</label>
                  <input type="number" min={1} max={200} value={form.costIndex || 100} onChange={e => field('costIndex', parseInt(e.target.value) || 100)} className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Display Order</label>
                  <input type="number" min={1} value={form.displayOrder || 1} onChange={e => field('displayOrder', parseInt(e.target.value) || 1)} className="h-10 w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Short Description (English)</label>
                <textarea rows={2} value={form.shortDescriptionEn || ''} onChange={e => field('shortDescriptionEn', e.target.value)} className="w-full rounded-xl border border-brand-mid/60 bg-white/80 px-3 py-2 text-sm font-semibold text-brand-deep outline-none focus:border-brand resize-none" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={onCloseModal} className="h-10 px-5 rounded-full border border-brand-mid text-sm font-extrabold text-brand-deep hover:bg-brand-light transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-extrabold text-white hover:bg-brand-deep disabled:opacity-60 transition-colors">
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  {modal.mode === 'add' ? 'Create city' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteCityConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/70 bg-white p-6 shadow-[0_32px_80px_rgba(0,89,96,0.18)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500"><Trash2 size={22} /></div>
            <h3 className="mt-4 font-serif text-lg font-bold text-brand-deep">Delete city?</h3>
            <p className="mt-2 text-sm font-semibold text-brand-deep/60">
              This is permanent and will fail if master plans are linked to this city.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={onCancelDeleteCity} className="flex-1 h-10 rounded-full border border-brand-mid text-sm font-extrabold text-brand-deep hover:bg-brand-light">Cancel</button>
              <button onClick={() => onConfirmDeleteCity(deleteCityConfirm)} className="flex-1 h-10 rounded-full bg-red-500 text-sm font-extrabold text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Default person silhouette SVG shown when no iconSvgUrl is provided
const DEFAULT_PROFILE_ICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E`

/** Format a CODE-style string: uppercase, spaces → underscores, only A-Z 0-9 _ */
function formatCode(raw) {
  return raw.toUpperCase().replace(/ /g, '_').replace(/[^A-Z0-9_]/g, '')
}

/** Normalise a hex color: ensure it starts with # and uppercases letters */
function normalizeHex(raw) {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  return withHash.toUpperCase()
}

function ProfilesPanel({
  t, profiles, loading, error,
  page = 0, pageSize = 20, onPageChange,
  onToggleStatus, onAdd, onEdit, onDelete,
  modal, form, onFormChange, onSubmit, submitting, formError, onCloseModal,
  deleteConfirm, onConfirmDelete, onCancelDelete,
}) {
  const role = useStore(s => s.user?.role)
  const accessToken = useStore(s => s.accessToken)
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].includes(String(role || ''))
  const field = (key, value) => onFormChange(prev => ({ ...prev, [key]: value }))

  // Client-side pagination
  const pagedProfiles = profiles.slice(page * pageSize, (page + 1) * pageSize)

  // ── Tag pill input ─────────────────────────────────────────────────────────
  const [tagInput, setTagInput] = useState('')
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  const currentTags = Array.isArray(form.tags) ? form.tags : []

  const commitTag = (raw) => {
    const trimmed = raw.trim().replace(/,+$/, '').trim()
    if (!trimmed) return
    if (!currentTags.includes(trimmed)) {
      field('tags', [...currentTags, trimmed])
    }
    setTagInput('')
  }

  const removeTag = (tag) => field('tags', currentTags.filter(t => t !== tag))

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commitTag(tagInput) }
    if (e.key === 'Backspace' && !tagInput && currentTags.length > 0) {
      field('tags', currentTags.slice(0, -1))
    }
  }

  const handleTagChange = (e) => {
    const val = e.target.value
    if (val.endsWith(',')) { commitTag(val); return }
    setTagInput(val)
  }

  // ── Icon upload ─────────────────────────────────────────────────────────────
  const handleIconFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploadingIcon(true)
    try {
      const { uploadIcon } = await import('@/api/admin')
      const result = await uploadIcon(accessToken, file)
      if (result?.url) field('iconSvgUrl', result.url)
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Check your file and try again.')
    } finally {
      setUploadingIcon(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Live preview values
  const previewColor = form.colorHex || '#7C3AED'
  const previewIcon  = form.iconSvgUrl || DEFAULT_PROFILE_ICON
  const previewName  = form.nameEn || 'Profile Name'
  const previewCode  = form.code || 'CODE'

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand/60">Audience setup</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-brand-deep">Planning profile management</h2>
          <p className="mt-1 text-sm text-brand-deep/50">Only active profiles are shown to applicants on the planner.</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(0,149,161,0.22)] hover:bg-brand-deep transition-colors"
        >
          <Plus size={16} /> Add profile
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <ShieldAlert size={16} className="shrink-0" /> {error}
        </div>
      )}

      {/* Profile Cards Grid */}
      <div className="mt-5">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-brand">
            <Loader2 size={22} className="animate-spin" />
            <span className="text-sm font-semibold">Loading profiles…</span>
          </div>
        ) : profiles.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand">
              <Plus size={24} />
            </div>
            <p className="text-sm font-bold text-brand-deep/60">No planning profiles yet</p>
            <p className="mt-1 text-xs text-brand-deep/40">Add your first profile to let applicants start planning</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pagedProfiles.map(profile => {
              const color = profile.colorHex || '#7C3AED'
              const icon  = profile.iconSvgUrl || DEFAULT_PROFILE_ICON
              return (
                <div
                  key={profile.id}
                  className="group relative overflow-hidden rounded-2xl border border-brand-mid/30 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(124,58,237,0.12)] transition-shadow"
                >
                  {/* Gradient header strip */}
                  <div
                    className="flex items-center gap-3 px-4 py-4"
                    style={{ background: `linear-gradient(135deg, ${color}ee 0%, ${color}99 100%)` }}
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md"
                      style={{ backgroundColor: `${color}cc` }}
                    >
                      <img
                        src={icon}
                        alt=""
                        className="h-7 w-7 object-contain"
                        onError={e => { e.currentTarget.src = DEFAULT_PROFILE_ICON }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-sm text-white leading-tight drop-shadow">{profile.nameEn}</p>
                      {profile.nameBn && (
                        <p className="truncate text-[11px] text-white/70 mt-0.5">{profile.nameBn}</p>
                      )}
                    </div>
                    <StatusBadge status={profile.active ? 'ACTIVE' : 'INACTIVE'} />
                  </div>

                  {/* Body */}
                  <div className="px-4 py-3">
                    {/* Code pill */}
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-black tracking-wider text-white"
                        style={{ backgroundColor: color }}
                      >
                        {profile.code}
                      </span>
                    </div>

                    {profile.shortDetailsEn && (
                      <p className="text-xs font-semibold text-brand-deep/60 line-clamp-2 leading-relaxed">{profile.shortDetailsEn}</p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold text-brand-deep/60">
                      {profile.monthlyBudgetRangeMinNzd && profile.monthlyBudgetRangeMaxNzd && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5">
                          NZD {Number(profile.monthlyBudgetRangeMinNzd).toLocaleString()}–{Number(profile.monthlyBudgetRangeMaxNzd).toLocaleString()}/mo
                        </span>
                      )}
                      {profile.defaultPersonCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5">
                          {profile.defaultPersonCount} person{profile.defaultPersonCount > 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5">
                        Order {profile.displayOrder ?? 0}
                      </span>
                    </div>

                    {Array.isArray(profile.tags) && profile.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {profile.tags.slice(0, 4).map(tag => (
                          <span
                            key={tag}
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{ backgroundColor: `${color}18`, color }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2 border-t border-brand-mid/25 pt-3">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(profile.id)}
                        title={profile.active ? 'Deactivate (hides from applicants)' : 'Activate (shows to applicants)'}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                          profile.active
                            ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        <Archive size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(profile)}
                        title="Edit profile"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-mid bg-white text-brand hover:border-brand hover:bg-brand-light transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => onDelete(profile.id)}
                          title="Delete profile"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 hover:border-red-400 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <span className="ml-auto text-[10px] font-semibold text-brand-deep/30">
                        {profile.active ? 'Visible to applicants' : 'Hidden from applicants'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination (client-side) */}
      {!loading && (
        <PaginationBar
          rows={profiles}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
          label="profiles"
        />
      )}

      {/* ── Add / Edit Modal ────────────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-2xl rounded-t-3xl sm:rounded-3xl border border-white/70 bg-white shadow-[0_32px_80px_rgba(0,89,96,0.22)] flex flex-col max-h-[96vh] sm:max-h-[92vh]">

            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between px-6 pt-6 pb-4 border-b border-brand-mid/30">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand/50">
                  {modal.mode === 'add' ? 'Create new' : 'Edit'}
                </p>
                <h3 className="font-serif text-xl font-bold text-brand-deep leading-tight">
                  Planning Profile
                </h3>
              </div>
              <button
                onClick={onCloseModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-mid hover:bg-brand-light text-brand-deep transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Live Preview Banner */}
            <div
              className="shrink-0 mx-6 mt-5 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              style={{ background: `linear-gradient(135deg, ${previewColor}f0 0%, ${previewColor}a0 100%)` }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md"
                  style={{ backgroundColor: `${previewColor}cc` }}
                >
                  <img
                    src={previewIcon}
                    alt=""
                    className="h-8 w-8 object-contain"
                    onError={e => { e.currentTarget.src = DEFAULT_PROFILE_ICON }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-white/60 mb-0.5">Live preview</p>
                  <p className="font-black text-base text-white leading-tight truncate">{previewName}</p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider text-white/90"
                  style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
                >
                  {previewCode}
                </span>
              </div>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={onSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
              {formError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  <ShieldAlert size={15} className="shrink-0" /> {formError}
                </div>
              )}

              {/* ── IDENTITY ── */}
              <section>
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-deep/40">Identity</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Code */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">
                      Code
                      <span className="text-red-500">*</span>
                      {modal.mode === 'edit' && (
                        <span className="ml-auto rounded-full bg-brand-light px-2 py-0.5 text-[9px] font-bold text-brand-deep/50 normal-case tracking-normal">Locked</span>
                      )}
                    </label>
                    <input
                      required
                      maxLength={50}
                      value={form.code || ''}
                      onChange={e => field('code', formatCode(e.target.value))}
                      disabled={modal.mode === 'edit'}
                      placeholder="SOLO_STUDENT"
                      className="h-11 w-full rounded-xl border border-brand-mid/60 bg-white px-3 text-sm font-black text-brand-deep font-mono outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 disabled:bg-brand-light/50 disabled:text-brand-deep/35 transition"
                    />
                    <p className="mt-1 text-[10px] text-brand-deep/35">Auto-uppercase. Spaces become underscores.</p>
                  </div>

                  {/* Theme Color */}
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Theme Color</label>
                    <ColorPicker value={form.colorHex || '#7C3AED'} onChange={v => field('colorHex', v)} />
                  </div>
                </div>
              </section>

              {/* ── ICON ── */}
              <section>
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-deep/40">Icon</p>
                <div className="rounded-2xl border border-brand-mid/40 bg-brand-light/30 p-4 space-y-3">
                  <div className="flex items-center gap-4">
                    {/* Live icon preview */}
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-md"
                      style={{ background: `linear-gradient(135deg, ${previewColor} 0%, ${previewColor}99 100%)` }}
                    >
                      {uploadingIcon ? (
                        <Loader2 size={22} className="animate-spin text-white/80" />
                      ) : (
                        <img
                          src={previewIcon}
                          alt="Icon preview"
                          className="h-10 w-10 object-contain"
                          onError={e => { e.currentTarget.src = DEFAULT_PROFILE_ICON }}
                        />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      {/* Upload from file */}
                      <div>
                        <p className="mb-1.5 text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">
                          Upload file <span className="normal-case font-semibold text-brand-deep/35">— SVG, PNG, JPG, WebP, ICO (max 5 MB)</span>
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/svg+xml,image/png,image/jpeg,image/webp,image/x-icon,image/gif"
                          className="hidden"
                          onChange={handleIconFileChange}
                        />
                        <button
                          type="button"
                          disabled={uploadingIcon}
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex h-9 items-center gap-2 rounded-xl border border-brand-mid bg-white px-4 text-xs font-extrabold text-brand hover:bg-brand-light disabled:opacity-50 transition-colors shadow-sm"
                        >
                          {uploadingIcon ? (
                            <><Loader2 size={13} className="animate-spin" /> Uploading…</>
                          ) : (
                            <><Plus size={13} /> Choose file</>
                          )}
                        </button>
                        {uploadError && (
                          <p className="mt-1 text-[10px] font-semibold text-red-600">{uploadError}</p>
                        )}
                      </div>

                      {/* OR: Paste public URL */}
                      <div>
                        <p className="mb-1.5 text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">
                          Or paste public URL
                        </p>
                        <input
                          type="url"
                          maxLength={1000}
                          value={form.iconSvgUrl || ''}
                          onChange={e => { field('iconSvgUrl', e.target.value); setUploadError('') }}
                          placeholder="https://example.com/icon.svg"
                          className="h-9 w-full rounded-xl border border-brand-mid/60 bg-white px-3 text-xs font-semibold text-brand-deep outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {form.iconSvgUrl && (
                    <div className="flex items-center justify-between rounded-xl border border-brand-mid/40 bg-white px-3 py-2">
                      <p className="truncate text-[10px] font-semibold text-brand-deep/50 mr-2">{form.iconSvgUrl}</p>
                      <button
                        type="button"
                        onClick={() => { field('iconSvgUrl', ''); setUploadError('') }}
                        className="shrink-0 rounded-full p-1 text-brand-deep/40 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Remove icon"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {!form.iconSvgUrl && (
                    <p className="text-[10px] text-brand-deep/35 leading-relaxed">
                      No icon set — the default person silhouette will be used on the client.
                    </p>
                  )}
                </div>
              </section>

              {/* ── CONTENT ── */}
              <section>
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-deep/40">Content</p>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Name (English) <span className="text-red-500">*</span></label>
                      <input
                        required maxLength={150}
                        value={form.nameEn || ''}
                        onChange={e => field('nameEn', e.target.value)}
                        placeholder="Solo Student"
                        className="h-11 w-full rounded-xl border border-brand-mid/60 bg-white px-3 text-sm font-semibold text-brand-deep outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Name (Bengali) <span className="text-red-500">*</span></label>
                      <input
                        required maxLength={300}
                        value={form.nameBn || ''}
                        onChange={e => field('nameBn', e.target.value)}
                        placeholder="একক শিক্ষার্থী"
                        className="h-11 w-full rounded-xl border border-brand-mid/60 bg-white px-3 text-sm font-semibold text-brand-deep outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Short Details (English)</label>
                    <textarea
                      rows={2}
                      value={form.shortDetailsEn || ''}
                      onChange={e => field('shortDetailsEn', e.target.value)}
                      placeholder="Tight budget, survival mode — one person"
                      className="w-full rounded-xl border border-brand-mid/60 bg-white px-3 py-2.5 text-sm font-semibold text-brand-deep outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 resize-none transition"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Short Details (Bengali)</label>
                    <textarea
                      rows={2}
                      value={form.shortDetailsBn || ''}
                      onChange={e => field('shortDetailsBn', e.target.value)}
                      placeholder="টাইট বাজেট, একা বেঁচে থাকার পরিকল্পনা"
                      className="w-full rounded-xl border border-brand-mid/60 bg-white px-3 py-2.5 text-sm font-semibold text-brand-deep outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 resize-none transition"
                    />
                  </div>
                </div>
              </section>

              {/* ── SETTINGS ── */}
              <section>
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-deep/40">Settings & Budget</p>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Min NZD/month</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-deep/40">NZ$</span>
                        <input
                          type="number" min={0}
                          value={form.monthlyBudgetRangeMinNzd || ''}
                          onChange={e => field('monthlyBudgetRangeMinNzd', e.target.value)}
                          placeholder="1200"
                          className="h-11 w-full rounded-xl border border-brand-mid/60 bg-white pl-9 pr-3 text-sm font-bold text-brand-deep outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Max NZD/month</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-deep/40">NZ$</span>
                        <input
                          type="number" min={0}
                          value={form.monthlyBudgetRangeMaxNzd || ''}
                          onChange={e => field('monthlyBudgetRangeMaxNzd', e.target.value)}
                          placeholder="1800"
                          className="h-11 w-full rounded-xl border border-brand-mid/60 bg-white pl-9 pr-3 text-sm font-bold text-brand-deep outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">People covered</label>
                      <input
                        type="number" min={1}
                        value={form.defaultPersonCount || 1}
                        onChange={e => field('defaultPersonCount', parseInt(e.target.value) || 1)}
                        className="h-11 w-full rounded-xl border border-brand-mid/60 bg-white px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">Display order</label>
                      <input
                        type="number" min={1}
                        value={form.displayOrder || 1}
                        onChange={e => field('displayOrder', parseInt(e.target.value) || 1)}
                        className="h-11 w-full rounded-xl border border-brand-mid/60 bg-white px-3 text-sm font-bold text-brand-deep outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-brand-deep/60">
                      Tags
                      <span className="ml-1.5 normal-case font-semibold text-brand-deep/35">— type then press comma or Enter to add</span>
                    </label>
                    {/* Pill container + input field together */}
                    <div
                      className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-xl border border-brand-mid/60 bg-white px-3 py-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 transition cursor-text"
                      onClick={() => document.getElementById('tag-input-field')?.focus()}
                    >
                      {currentTags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                          style={{ backgroundColor: `${previewColor}18`, color: previewColor }}
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
                            className="ml-0.5 rounded-full hover:opacity-60 transition-opacity"
                            aria-label={`Remove ${tag}`}
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      <input
                        id="tag-input-field"
                        type="text"
                        value={tagInput}
                        onChange={handleTagChange}
                        onKeyDown={handleTagKeyDown}
                        onBlur={() => commitTag(tagInput)}
                        placeholder={currentTags.length === 0 ? 'student, solo, budget…' : ''}
                        className="min-w-[120px] flex-1 bg-transparent text-sm font-semibold text-brand-deep outline-none placeholder:text-brand-deep/30"
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-brand-deep/35">Press comma, Enter, or click away to add a tag. Backspace removes the last tag.</p>
                  </div>
                </div>
              </section>
            </form>

            {/* Modal Footer */}
            <div className="shrink-0 flex items-center justify-between gap-3 border-t border-brand-mid/30 px-6 py-4">
              <p className="text-[11px] text-brand-deep/35 hidden sm:block">
                {modal.mode === 'add' ? 'Profile will be active immediately after creation.' : 'Changes take effect immediately on the client.'}
              </p>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="h-10 px-5 rounded-full border border-brand-mid text-sm font-extrabold text-brand-deep hover:bg-brand-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="profile-form-inner"
                  onClick={onSubmit}
                  disabled={submitting}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-6 text-sm font-extrabold text-white hover:bg-brand-deep disabled:opacity-60 transition-colors shadow-[0_4px_14px_rgba(0,149,161,0.25)]"
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  {modal.mode === 'add' ? 'Create profile' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/70 bg-white p-6 shadow-[0_32px_80px_rgba(0,89,96,0.22)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash2 size={22} />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-brand-deep">Delete this profile?</h3>
            <p className="mt-2 text-sm font-semibold text-brand-deep/60 leading-relaxed">
              This is permanent. The delete will be blocked if any master plans are linked to this profile.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={onCancelDelete}
                className="flex-1 h-10 rounded-full border border-brand-mid text-sm font-extrabold text-brand-deep hover:bg-brand-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirmDelete(deleteConfirm)}
                className="flex-1 h-10 rounded-full bg-red-500 text-sm font-extrabold text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PlansPanel({ t, plans, onToggleStatus, onRemove }) {
  return (
    <div>
      <SectionTitle
        kicker={t('admin.master_plan_kicker')}
        title={t('admin.master_plan_title')}
      />
      <div className="mt-5 overflow-x-auto rounded-2xl border border-brand-mid/40 bg-white">
        <table className="min-w-[860px] w-full text-left text-sm">
          <thead className="bg-brand-light/80 text-xs uppercase tracking-[0.14em] text-brand">
            <tr>
              <th className="px-4 py-3">{t('admin.table.plan')}</th>
              <th className="px-4 py-3">{t('admin.table.city_profile')}</th>
              <th className="px-4 py-3">{t('admin.table.monthly')}</th>
              <th className="px-4 py-3">{t('admin.table.moving')}</th>
              <th className="px-4 py-3">{t('admin.table.checklist')}</th>
              <th className="px-4 py-3">{t('admin.table.status')}</th>
              <th className="px-4 py-3">{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-mid/35">
            {plans.map(plan => (
              <tr key={plan.id} className="align-middle">
                <td className="px-4 py-4">
                  <p className="font-extrabold text-brand-deep">{plan.title}</p>
                  <p className="mt-1 text-xs font-semibold text-brand-deep/45">{t('admin.updated_at', { date: plan.updatedAt })}</p>
                </td>
                <td className="px-4 py-4 font-semibold text-brand-deep/68">
                  {plan.city} · {plan.profile}
                </td>
                <td className="px-4 py-4 font-black text-brand-deep">{formatNZD(plan.monthlyCost)}</td>
                <td className="px-4 py-4 font-black text-brand-deep">{formatNZD(plan.movingCost)}</td>
                <td className="px-4 py-4 font-semibold text-brand-deep/68">{plan.checklistItems}</td>
                <td className="px-4 py-4"><StatusBadge status={plan.status} /></td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(plan.id)}
                      title={t('admin.toggle_status')}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-mid bg-white text-brand hover:border-brand"
                    >
                      <Archive size={16} />
                    </button>
                    <button
                      type="button"
                      title={t('admin.edit')}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-mid bg-white text-brand hover:border-brand"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(plan.id)}
                      title={t('admin.delete')}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600 hover:border-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ContentPanel({ t, contents, onToggleStatus }) {
  return (
    <div>
      <SectionTitle
        kicker={t('admin.content_kicker')}
        title={t('admin.content_title')}
      />
      <div className="mt-5 grid gap-3">
        {contents.map(item => (
          <div key={item.id} className="grid gap-3 rounded-2xl border border-brand-mid/40 bg-white/80 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-black text-brand-deep">{item.title}</h3>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-1 text-sm font-semibold text-brand-deep/52">
                {item.type} · {t('admin.updated_at', { date: item.updatedAt })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onToggleStatus(item.id)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-brand-mid bg-white px-4 text-sm font-extrabold text-brand hover:border-brand"
              >
                <Archive size={16} />
                {t('admin.toggle_status')}
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand px-4 text-sm font-extrabold text-white hover:bg-brand-deep"
              >
                <Pencil size={16} />
                {t('admin.edit')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TemplatesPanel({ t, templates, onToggleStatus }) {
  return (
    <div>
      <SectionTitle
        kicker={t('admin.templates_kicker')}
        title={t('admin.templates_title')}
      />
      <div className="mt-5 grid gap-3">
        {templates.map(template => (
          <div key={template.id} className="grid gap-3 rounded-2xl border border-brand-mid/40 bg-white/80 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-black text-brand-deep">{template.name}</h3>
                <StatusBadge status={template.status} />
              </div>
              <p className="mt-1 text-sm font-semibold text-brand-deep/52">
                {template.owner} · {t('admin.template_item_count', { count: template.items })}
              </p>
            </div>
            <CatalogActions id={template.id} onToggleStatus={onToggleStatus} t={t} />
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminAccountPanel({
  t,
  form,
  onFormChange,
  onSaveProfile,
  savingProfile,
  passwordForm,
  onPasswordChange,
  onSavePassword,
  savingPassword,
  feedback,
}) {
  return (
    <div className="grid gap-5">
      <SectionTitle kicker={t('admin.account_kicker')} title={t('admin.account_title')} />

      {feedback && (
        <p
          className={cn(
            'rounded-2xl px-4 py-3 text-sm font-bold',
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
              : 'bg-red-50 text-red-700 ring-1 ring-red-100'
          )}
        >
          {feedback.message}
        </p>
      )}

      <form onSubmit={onSaveProfile} className="rounded-2xl border border-brand-mid/40 bg-white/78 p-4">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light text-brand">
            <UserCircle2 size={18} />
          </span>
          <div>
            <h3 className="font-black text-brand-deep">{t('admin.account_profile_title')}</h3>
            <p className="text-sm font-medium text-brand-deep/54">{t('admin.account_profile_copy')}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label={t('auth.full_name')}>
            <input
              value={form.name || ''}
              onChange={(event) => onFormChange(current => ({ ...current, name: event.target.value }))}
              className="profile-input"
            />
          </AdminField>
          <AdminField label={t('auth.email')}>
            <input value={form.email || ''} disabled className="profile-input cursor-not-allowed opacity-70" />
          </AdminField>
          <AdminField label={t('auth.phone')}>
            <input
              value={form.phone || form.phoneNumber || ''}
              onChange={(event) => onFormChange(current => ({ ...current, phone: event.target.value }))}
              className="profile-input"
            />
          </AdminField>
          <AdminField label={t('auth.profile_picture_url')}>
            <input
              value={form.profilePicture || ''}
              onChange={(event) => onFormChange(current => ({ ...current, profilePicture: event.target.value }))}
              className="profile-input"
              placeholder="https://..."
            />
          </AdminField>
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(0,149,161,0.22)] hover:bg-brand-deep disabled:cursor-wait disabled:opacity-70"
        >
          {savingProfile ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
          {t('admin.save_account')}
        </button>
      </form>

      <form onSubmit={onSavePassword} className="rounded-2xl border border-brand-mid/40 bg-white/78 p-4">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light text-brand">
            <KeyRound size={18} />
          </span>
          <div>
            <h3 className="font-black text-brand-deep">{t('admin.password_title')}</h3>
            <p className="text-sm font-medium text-brand-deep/54">{t('admin.password_copy')}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <AdminField label={t('auth.current_password')}>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) => onPasswordChange(current => ({ ...current, currentPassword: event.target.value }))}
              className="profile-input"
            />
          </AdminField>
          <AdminField label={t('auth.new_password')}>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) => onPasswordChange(current => ({ ...current, newPassword: event.target.value }))}
              minLength={8}
              required
              className="profile-input"
            />
          </AdminField>
          <AdminField label={t('auth.confirm_password')}>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) => onPasswordChange(current => ({ ...current, confirmPassword: event.target.value }))}
              minLength={8}
              required
              className="profile-input"
            />
          </AdminField>
        </div>

        <button
          type="submit"
          disabled={savingPassword}
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-deep px-5 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(20,35,52,0.18)] hover:bg-brand disabled:cursor-wait disabled:opacity-70"
        >
          {savingPassword ? <Loader2 size={17} className="animate-spin" /> : <KeyRound size={17} />}
          {t('admin.save_password')}
        </button>
      </form>
    </div>
  )
}

function AdminField({ label, children }) {
  return (
    <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand/70">
      {label}
      {children}
    </label>
  )
}

function UsersPanel({
  t,
  users,
  onToggleStatus,
  mode,
  inviteForm,
  onInviteChange,
  onInviteSubmit,
  inviteSubmitting,
  inviteFeedback,
  loading,
  error,
}) {
  const isAdmins = mode === 'admins'
  const [usersPage, setUsersPage] = useState(0)
  const USERS_PAGE_SIZE = 20
  const pagedUsers = users.slice(usersPage * USERS_PAGE_SIZE, (usersPage + 1) * USERS_PAGE_SIZE)

  return (
    <div>
      <SectionTitle
        kicker={isAdmins ? t('admin.admins_kicker') : t('admin.users_kicker')}
        title={isAdmins ? t('admin.admins_title') : t('admin.users_title')}
      />
      {isAdmins && (
        <form
          onSubmit={onInviteSubmit}
          className="mt-5 rounded-2xl border border-brand-mid/45 bg-brand-light/34 p-4"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <label className="grid flex-1 gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand/70">
              {t('admin.invite_name')}
              <input
                value={inviteForm.name}
                onChange={(event) => onInviteChange(current => ({ ...current, name: event.target.value }))}
                required
                maxLength={255}
                placeholder={t('admin.invite_name_placeholder')}
                className="h-12 rounded-full border border-brand-mid/70 bg-white/88 px-4 text-sm font-semibold normal-case tracking-normal text-brand-deep outline-none transition-colors placeholder:text-brand-deep/34 focus:border-brand"
              />
            </label>
            <label className="grid flex-1 gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand/70">
              {t('admin.invite_email')}
              <input
                type="email"
                value={inviteForm.email}
                onChange={(event) => onInviteChange(current => ({ ...current, email: event.target.value }))}
                required
                maxLength={255}
                placeholder={t('admin.invite_email_placeholder')}
                className="h-12 rounded-full border border-brand-mid/70 bg-white/88 px-4 text-sm font-semibold normal-case tracking-normal text-brand-deep outline-none transition-colors placeholder:text-brand-deep/34 focus:border-brand"
              />
            </label>
            <button
              type="submit"
              disabled={inviteSubmitting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(0,149,161,0.22)] transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-70"
            >
              {inviteSubmitting ? <Loader2 size={17} className="animate-spin" /> : <Mail size={17} />}
              {inviteSubmitting ? t('admin.invite_sending') : t('admin.invite_admin')}
            </button>
          </div>
          {inviteFeedback && (
            <p
              className={cn(
                'mt-3 rounded-2xl px-4 py-3 text-sm font-bold',
                inviteFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                  : 'bg-red-50 text-red-700 ring-1 ring-red-100'
              )}
            >
              {inviteFeedback.message}
            </p>
          )}
        </form>
      )}
      {error && (
        <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-100">
          {error}
        </p>
      )}
      <div className="mt-5 overflow-x-auto rounded-2xl border border-brand-mid/40 bg-white">
        <table className="min-w-[760px] w-full text-left text-sm">
          <thead className="bg-brand-light/80 text-xs uppercase tracking-[0.14em] text-brand">
            <tr>
              <th className="px-4 py-3">{t('admin.table.user')}</th>
              <th className="px-4 py-3">{t('admin.table.role')}</th>
              <th className="px-4 py-3">{t('admin.table.plans')}</th>
              <th className="px-4 py-3">{t('admin.table.status')}</th>
              <th className="px-4 py-3">{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-mid/35">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center">
                  <span className="inline-flex items-center gap-2 text-sm font-extrabold text-brand">
                    <Loader2 size={17} className="animate-spin" />
                    {t('admin.users_loading')}
                  </span>
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm font-bold text-brand-deep/52">
                  {t('admin.users_empty')}
                </td>
              </tr>
            )}
            {!loading && pagedUsers.map(user => (
              <tr key={user.id}>
                <td className="px-4 py-4">
                  <p className="font-extrabold text-brand-deep">{user.name}</p>
                  <p className="mt-1 text-xs font-semibold text-brand-deep/45">{user.email}</p>
                </td>
                <td className="px-4 py-4 font-black text-brand-deep">{user.role}</td>
                <td className="px-4 py-4 font-semibold text-brand-deep/68">{user.plans}</td>
                <td className="px-4 py-4"><StatusBadge status={user.status} /></td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(user.id)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-brand-mid bg-white px-4 text-sm font-extrabold text-brand hover:border-brand"
                  >
                    <ShieldCheck size={16} />
                    {user.status === 'ACTIVE' ? t('admin.deactivate') : t('admin.activate')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && (
        <PaginationBar
          rows={users}
          page={usersPage}
          pageSize={USERS_PAGE_SIZE}
          onPageChange={setUsersPage}
          label={isAdmins ? 'admins' : 'users'}
        />
      )}
    </div>
  )
}
