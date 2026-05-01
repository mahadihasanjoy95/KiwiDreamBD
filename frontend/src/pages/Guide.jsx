import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Clock3,
  FileText,
  HeartHandshake,
  Home,
  Mail,
  MapPin,
  MessageSquareText,
  Send,
  Share2,
  Sparkles,
  WalletCards,
} from 'lucide-react'
import useStore from '@/store/useStore'
import { GUIDES_DATA } from '@/data/guides'
import { sendContactMessage } from '@/api/contact'
import { useToast } from '@/components/common/ToastProvider'
import { sharePageLink } from '@/utils/share'
import logoTigerNew from '@/assets/images/main_logo.png'

const guideTopics = [
  {
    icon: WalletCards,
    titleEn: 'Money and first-month setup',
    titleBn: 'টাকা ও প্রথম মাসের সেটআপ',
    copyEn: 'Living fund, rent bond, groceries, transport cards, SIM, and early spending choices.',
    copyBn: 'Living fund, rent bond, grocery, transport card, SIM এবং শুরুতে কী খরচ হবে।',
  },
  {
    icon: Home,
    titleEn: 'Flat, suburb, and daily life',
    titleBn: 'বাসা, suburb এবং daily life',
    copyEn: 'How students find rooms, what to check before paying bond, and which suburbs feel manageable.',
    copyBn: 'রুম খোঁজা, bond দেওয়ার আগে কী দেখবেন, কোন suburb manage করা সহজ।',
  },
  {
    icon: FileText,
    titleEn: 'IRD, bank, work, and paperwork',
    titleBn: 'IRD, bank, কাজ ও paperwork',
    copyEn: 'The practical admin tasks that make work, study, and settling easier after landing.',
    copyBn: 'পৌঁছানোর পর কাজ, পড়াশোনা ও settle করার practical admin কাজগুলো।',
  },
]

const contributionIdeas = [
  {
    titleEn: 'Arrival story',
    titleBn: 'পৌঁছানোর অভিজ্ঞতা',
    copyEn: 'Airport, first night, temporary stay, SIM, transport, and what surprised you.',
    copyBn: 'Airport, প্রথম রাত, temporary stay, SIM, transport এবং কোন জিনিস surprise করেছে।',
  },
  {
    titleEn: 'Budget reality',
    titleBn: 'বাস্তব বাজেট',
    copyEn: 'Rent, food, setup costs, hidden expenses, and what you would budget differently.',
    copyBn: 'Rent, food, setup cost, hidden expense এবং এখন হলে কীভাবে budget করতেন।',
  },
  {
    titleEn: 'Flat or suburb review',
    titleBn: 'Flat বা suburb review',
    copyEn: 'Area feel, transport, safety, groceries, halal options, and student convenience.',
    copyBn: 'এলাকার feel, transport, safety, grocery, halal option এবং student convenience।',
  },
  {
    titleEn: 'Part-time work lesson',
    titleBn: 'Part-time কাজের শিক্ষা',
    copyEn: 'How you searched, interview tips, rights, CV mistakes, and first-job advice.',
    copyBn: 'কীভাবে খুঁজেছেন, interview tips, rights, CV mistake এবং first-job advice।',
  },
]

function localize(isBn, en, bn) {
  return isBn ? bn : en
}

function GuidePage() {
  const language = useStore(state => state.language)
  const isBn = language === 'BN'
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const articles = useMemo(() => [GUIDES_DATA.featured, ...GUIDES_DATA.articles], [])
  const featured = GUIDES_DATA.featured

  const handleSubmission = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const topic = String(formData.get('topic') || '').trim()
    const message = String(formData.get('message') || '').trim()

    const fullMessage = [
      'Guide / NZ journey submission',
      topic ? `Topic: ${topic}` : null,
      '',
      message,
    ].filter(Boolean).join('\n')

    setIsSubmitting(true)
    try {
      await sendContactMessage({ name, email, message: fullMessage })
      form.reset()
      showToast({
        tone: 'success',
        title: localize(isBn, 'Story sent', 'স্টোরি পাঠানো হয়েছে'),
        message: localize(
          isBn,
          'Thanks for sharing. We received your note and can follow up by email.',
          'ধন্যবাদ। আমরা আপনার লেখা পেয়েছি এবং ইমেইলে follow up করতে পারব।'
        ),
      })
    } catch (error) {
      showToast({
        tone: 'error',
        title: localize(isBn, 'Could not send', 'পাঠানো যায়নি'),
        message: error?.message || localize(isBn, 'Please try again in a moment.', 'একটু পরে আবার চেষ্টা করুন।'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSharePage = async () => {
    try {
      const result = await sharePageLink({
        title: localize(isBn, 'Plan For Abroad NZ Essentials', 'Plan For Abroad NZ এসেনশিয়ালস'),
        text: localize(
          isBn,
          'Guides for Bangladeshi students planning New Zealand.',
          'New Zealand planning করা Bangladeshi students-দের জন্য guide.'
        ),
      })
      if (result === 'copied') {
        showToast({
          tone: 'success',
          title: localize(isBn, 'Link copied', 'লিঙ্ক কপি হয়েছে'),
          message: localize(isBn, 'Paste it into Facebook, Messenger, messages, or anywhere else.', 'Facebook, Messenger বা message-এ paste করতে পারবেন।'),
        })
      }
    } catch {
      showToast({
        tone: 'error',
        title: localize(isBn, 'Could not share', 'শেয়ার করা যায়নি'),
        message: localize(isBn, 'Please try again in a moment.', 'একটু পরে আবার চেষ্টা করুন।'),
      })
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eaf6f5_0%,#f8f2e8_42%,#eaf6f5_100%)] text-brand-deep">
      <section className="relative border-b border-white/70 bg-[linear-gradient(135deg,#c7e5e8_0%,#f8f2e8_58%,#b6dadd_100%)]">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#eaf6f5] to-transparent" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pb-14 pt-24 md:grid-cols-[1fr_0.82fr] md:items-end md:pb-20 md:pt-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/45 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand shadow-sm backdrop-blur">
              <BookOpenText size={15} />
              {localize(isBn, 'NZ Essentials', 'NZ এসেনশিয়ালস')}
            </div>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-brand-deep md:text-6xl">
              {localize(isBn, 'Clear guides for the Bangladesh to New Zealand journey.', 'বাংলাদেশ থেকে নিউজিল্যান্ড যাত্রার পরিষ্কার গাইড।')}
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-[#334d52] md:text-lg">
              {localize(
                isBn,
                'Read practical articles about money, suburbs, jobs, paperwork, and the first few months after landing.',
                'টাকা, suburb, job, paperwork এবং পৌঁছানোর পর প্রথম কয়েক মাস নিয়ে practical article পড়ুন।'
              )}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#articles"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_18px_42px_rgba(0,149,161,0.22)] transition-colors hover:bg-brand-deep"
              >
                {localize(isBn, 'Browse articles', 'Article দেখুন')}
                <ArrowRight size={17} />
              </a>
              <a
                href="#share-story"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand/25 bg-white/70 px-6 py-3 text-sm font-bold text-brand-deep shadow-sm backdrop-blur transition-colors hover:bg-white"
              >
                <MessageSquareText size={17} />
                {localize(isBn, 'Share your NZ journey', 'আপনার NZ journey শেয়ার করুন')}
              </a>
              <button
                type="button"
                onClick={handleSharePage}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand/25 bg-white/70 px-6 py-3 text-sm font-bold text-brand-deep shadow-sm backdrop-blur transition-colors hover:bg-white"
              >
                <Share2 size={17} />
                {localize(isBn, 'Share this page', 'এই পেজ শেয়ার করুন')}
              </button>
            </div>
          </div>

          <Link
            to={`/guide/${featured.id}`}
            className="group block overflow-hidden rounded-[28px] border border-white/80 bg-white/70 shadow-[0_24px_70px_rgba(0,89,96,0.16)] backdrop-blur"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={featured.image}
                alt={localize(isBn, featured.titleEn, featured.titleBn)}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">
                {localize(isBn, 'Featured guide', 'Featured guide')}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-brand-deep">
                {localize(isBn, featured.titleEn, featured.titleBn)}
              </h2>
              <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-brand-deep/50">
                <span>{localize(isBn, featured.readTimeEn, featured.readTimeBn)}</span>
                <span className="inline-flex items-center gap-1 text-brand">
                  {localize(isBn, 'Read', 'পড়ুন')}
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="border-y border-white/70 bg-brand-deep text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-hidden px-6 py-3">
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#d8eeee]">
            <Sparkles size={13} />
            {localize(isBn, 'Articles', 'Article')}
          </span>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="guide-article-marquee inline-flex gap-6 whitespace-nowrap text-sm font-semibold text-white/78 hover:[animation-play-state:paused]">
              {[...articles, ...articles].map((article, index) => (
                <Link key={`${article.id}-${index}`} to={`/guide/${article.id}`} className="inline-flex items-center gap-2 hover:text-white">
                  <span>{localize(isBn, article.titleEn, article.titleBn)}</span>
                  <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <section className="grid gap-4 md:grid-cols-3">
          {guideTopics.map(topic => {
            const Icon = topic.icon
            return (
              <div key={topic.titleEn} className="rounded-[24px] border border-white/80 bg-white/72 p-6 shadow-[0_16px_42px_rgba(0,89,96,0.08)] backdrop-blur">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-light text-brand">
                  <Icon size={20} />
                </span>
                <h2 className="mt-4 font-serif text-2xl font-bold text-brand-deep">
                  {localize(isBn, topic.titleEn, topic.titleBn)}
                </h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[#51666b]">
                  {localize(isBn, topic.copyEn, topic.copyBn)}
                </p>
              </div>
            )
          })}
        </section>

        <section id="articles" className="pt-14 md:pt-20">
          <div className="flex flex-col justify-between gap-4 border-b border-brand/15 pb-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">
                {localize(isBn, 'Latest guidance', 'Latest guidance')}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-brand-deep md:text-4xl">
                {localize(isBn, 'Articles that answer real pre-departure questions', 'Pre-departure প্রশ্নের practical article')}
              </h2>
            </div>
            <Link to="/plan" className="inline-flex items-center gap-2 text-sm font-black text-brand hover:text-brand-deep">
              {localize(isBn, 'Open planner', 'Planner খুলুন')}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map(article => (
              <Link
                key={article.id}
                to={`/guide/${article.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_14px_38px_rgba(0,89,96,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(0,89,96,0.14)]"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={article.image}
                    alt={localize(isBn, article.titleEn, article.titleBn)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-brand-light px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-brand">
                      {localize(isBn, article.tagEn, article.tagBn)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-deep/45">
                      <Clock3 size={13} />
                      {localize(isBn, article.readTimeEn, article.readTimeBn)}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-bold leading-tight text-brand-deep group-hover:text-brand">
                    {localize(isBn, article.titleEn, article.titleBn)}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm font-medium leading-relaxed text-[#51666b]">
                    {localize(isBn, article.descriptionEn, article.descriptionBn)}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-brand/10 pt-4 text-xs font-black uppercase tracking-[0.12em] text-brand-deep/45">
                    <span>{article.author}</span>
                    <span className="inline-flex items-center gap-1 text-brand">
                      {localize(isBn, 'Read guide', 'গাইড পড়ুন')}
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="share-story" className="pt-14 md:pt-20">
          <div className="overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(135deg,#f8fdfd_0%,#eaf6f5_54%,#f8f2e8_100%)] shadow-[0_24px_70px_rgba(0,89,96,0.14)]">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-brand/10 p-6 md:p-9 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-3">
                  <span className="relative block h-[48px] w-[48px] shrink-0 overflow-hidden rounded-2xl bg-white/70">
                    <img
                      src={logoTigerNew}
                      alt="Plan For Abroad"
                      className="absolute left-1/2 top-1/2 h-[58px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
                    />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">
                      {localize(isBn, 'Community stories', 'Community stories')}
                    </p>
                    <h2 className="font-serif text-3xl font-bold text-brand-deep">
                      {localize(isBn, 'Share your NZ journey', 'আপনার NZ journey শেয়ার করুন')}
                    </h2>
                  </div>
                </div>
                <p className="mt-5 text-sm font-medium leading-relaxed text-[#51666b] md:text-base">
                  {localize(
                    isBn,
                    'Your real experience can help another Bangladeshi student avoid confusion, plan better, and feel less alone before they fly.',
                    'আপনার real experience আরেকজন Bangladeshi student-কে confusion কমাতে, ভালো plan করতে এবং যাওয়ার আগে confident হতে সাহায্য করতে পারে।'
                  )}
                </p>

                <div className="mt-6 grid gap-3">
                  {contributionIdeas.map(item => (
                    <div key={item.titleEn} className="rounded-2xl border border-brand/10 bg-white/70 p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={18} />
                        <div>
                          <h3 className="text-sm font-black text-brand-deep">
                            {localize(isBn, item.titleEn, item.titleBn)}
                          </h3>
                          <p className="mt-1 text-sm font-medium leading-relaxed text-[#51666b]">
                            {localize(isBn, item.copyEn, item.copyBn)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmission} className="p-6 md:p-9">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-brand">
                      {localize(isBn, 'Your name', 'আপনার নাম')}
                    </span>
                    <input
                      name="name"
                      required
                      className="home-modal-input bg-white"
                      placeholder={localize(isBn, 'Your name', 'আপনার নাম')}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-brand">
                      {localize(isBn, 'Reply email', 'Reply email')}
                    </span>
                    <input
                      name="email"
                      type="email"
                      required
                      className="home-modal-input bg-white"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-brand">
                    {localize(isBn, 'What are you sharing?', 'আপনি কী শেয়ার করছেন?')}
                  </span>
                  <select name="topic" required className="home-modal-input bg-white">
                    <option value="">{localize(isBn, 'Choose a topic', 'Topic বেছে নিন')}</option>
                    {contributionIdeas.map(item => (
                      <option key={item.titleEn} value={item.titleEn}>
                        {localize(isBn, item.titleEn, item.titleBn)}
                      </option>
                    ))}
                    <option value="Other">{localize(isBn, 'Other helpful experience', 'অন্য helpful experience')}</option>
                  </select>
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-brand">
                    {localize(isBn, 'Your story or idea', 'আপনার story বা idea')}
                  </span>
                  <textarea
                    name="message"
                    rows="8"
                    required
                    className="home-modal-input resize-none bg-white"
                    placeholder={localize(
                      isBn,
                      'Write the story, advice, costs, mistakes, links, or article idea you want to share with us.',
                      'আপনার story, advice, cost, mistake, link বা article idea লিখুন।'
                    )}
                  />
                </label>

                <div className="mt-5 rounded-2xl border border-brand/10 bg-white/65 p-4">
                  <div className="flex items-start gap-3">
                    <HeartHandshake className="mt-0.5 shrink-0 text-brand" size={19} />
                    <p className="text-sm font-medium leading-relaxed text-[#51666b]">
                      {localize(
                        isBn,
                        'Please avoid private documents, passport numbers, visa numbers, or anyone else’s personal details. We may email you before publishing anything.',
                        'Private document, passport number, visa number বা অন্য কারও personal detail দেবেন না। কিছু publish করার আগে আমরা আপনাকে email করতে পারি।'
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-black text-white shadow-[0_18px_42px_rgba(0,149,161,0.22)] transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Mail size={17} />
                      {localize(isBn, 'Sending...', 'পাঠানো হচ্ছে...')}
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      {localize(isBn, 'Send to Plan For Abroad', 'Plan For Abroad-এ পাঠান')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pt-12 md:grid-cols-3">
          <Link to="/compare" className="rounded-[24px] border border-white/80 bg-white/70 p-5 shadow-sm transition-colors hover:bg-white">
            <MapPin className="text-brand" size={22} />
            <h3 className="mt-3 font-serif text-2xl font-bold text-brand-deep">
              {localize(isBn, 'Compare cities', 'City compare করুন')}
            </h3>
            <p className="mt-2 text-sm font-medium text-[#51666b]">
              {localize(isBn, 'See cost and lifestyle differences before choosing a city.', 'City বেছে নেওয়ার আগে cost ও lifestyle পার্থক্য দেখুন।')}
            </p>
          </Link>
          <Link to="/jobs" className="rounded-[24px] border border-white/80 bg-white/70 p-5 shadow-sm transition-colors hover:bg-white">
            <WalletCards className="text-brand" size={22} />
            <h3 className="mt-3 font-serif text-2xl font-bold text-brand-deep">
              {localize(isBn, 'Job guide', 'Job guide')}
            </h3>
            <p className="mt-2 text-sm font-medium text-[#51666b]">
              {localize(isBn, 'Understand student work rights and realistic earning expectations.', 'Student work rights ও realistic earning expectation বুঝুন।')}
            </p>
          </Link>
          <Link to="/checklist" className="rounded-[24px] border border-white/80 bg-white/70 p-5 shadow-sm transition-colors hover:bg-white">
            <CheckCircle2 className="text-brand" size={22} />
            <h3 className="mt-3 font-serif text-2xl font-bold text-brand-deep">
              {localize(isBn, 'Pre-departure checklist', 'Pre-departure checklist')}
            </h3>
            <p className="mt-2 text-sm font-medium text-[#51666b]">
              {localize(isBn, 'Track documents, money, accommodation, health, and communication tasks.', 'Document, money, accommodation, health ও communication task track করুন।')}
            </p>
          </Link>
        </section>
      </main>
    </div>
  )
}

export default GuidePage
