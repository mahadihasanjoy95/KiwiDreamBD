import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, Copy, Share2 } from 'lucide-react';
import useStore from '@/store/useStore';
import { GUIDES_DATA } from '@/data/guides';
import { useToast } from '@/components/common/ToastProvider';
import { sharePageLink } from '@/utils/share';

const ArticleDetail = () => {
  const { id } = useParams();
  const language = useStore(state => state.language);
  const isBn = language === 'BN';
  const [article, setArticle] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    // Check if it's the featured article
    if (id === '1') {
      setArticle(GUIDES_DATA.featured);
    } else {
      // Find in articles array
      const found = GUIDES_DATA.articles.find(a => a.id === parseInt(id));
      if (found) {
        setArticle(found);
      }
    }
    // Scroll to top when loading new article
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = async () => {
    const title = isBn ? article.titleBn : article.titleEn;
    try {
      const result = await sharePageLink({
        title,
        text: isBn ? 'Plan For Abroad থেকে এই গাইডটি দেখুন।' : 'Read this Plan For Abroad guide.',
      });
      if (result === 'copied') {
        showToast({
          tone: 'success',
          title: isBn ? 'লিঙ্ক কপি হয়েছে' : 'Link copied',
          message: isBn ? 'এখন Facebook, Messenger বা message-এ paste করতে পারবেন।' : 'Paste it into Facebook, Messenger, messages, or anywhere else.',
        });
      }
    } catch {
      showToast({
        tone: 'error',
        title: isBn ? 'শেয়ার করা যায়নি' : 'Could not share',
        message: isBn ? 'একটু পরে আবার চেষ্টা করুন।' : 'Please try again in a moment.',
      });
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    showToast({
      tone: 'success',
      title: isBn ? 'লিঙ্ক কপি হয়েছে' : 'Link copied',
      message: isBn ? 'যেখানে দরকার paste করুন।' : 'Paste it wherever you want to share it.',
    });
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-[#D7DBD4] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-serif text-[#142334] mb-4">{isBn ? 'আর্টিকেল পাওয়া যায়নি' : 'Article Not Found'}</h2>
        <Link to="/guide" className="text-[#0095A1] hover:text-[#142334] font-bold underline">
          {isBn ? 'গাইড পেজে ফিরে যান' : 'Return to Guides'}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eaf6f5_0%,#f8f2e8_45%,#eaf6f5_100%)] text-brand-deep font-sans selection:bg-brand-mid/50 pb-20">
      
      {/* Top Navigation */}
      <div className="w-full bg-[#eaf6f5]/88 backdrop-blur-md border-b border-white/70 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/guide" className="text-brand font-bold hover:text-brand-deep flex items-center gap-2 transition-colors">
            <ArrowLeft size={18} />
            {isBn ? 'ফিরে যান' : 'Back to Guides'}
          </Link>
          <div className="text-sm font-bold text-brand-deep/60 uppercase tracking-widest">
            {isBn ? article.tagBn : article.tagEn}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        
        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-deep mb-6 leading-tight drop-shadow-sm">
            {isBn ? article.titleBn : article.titleEn}
          </h1>
          
          <div className="flex flex-wrap items-center text-brand-deep/60 text-sm md:text-base gap-4 md:gap-6 font-bold uppercase tracking-wider border-b border-brand/15 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-deep flex items-center justify-center text-brand-mid font-bold shadow-md">
                {article.author.charAt(0)}
              </div>
              <span className="text-brand-deep">{article.author}</span>
            </div>
            <span className="hidden md:inline text-brand-mid">•</span>
            <span className="flex items-center gap-1">
              <CalendarDays size={16} />
              {isBn ? article.dateBn : article.dateEn}
            </span>
            <span className="hidden md:inline text-brand-mid">•</span>
            <span className="flex items-center gap-1">
              <Clock3 size={16} />
              {isBn ? article.readTimeBn : article.readTimeEn}
            </span>
          </div>
        </header>

        {/* HERO IMAGE */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-xl mb-12 bg-brand-mid/20 border border-white/80">
          <img 
            src={article.image} 
            alt={isBn ? article.titleBn : article.titleEn} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* ARTICLE CONTENT */}
        <article className="rounded-[28px] border border-white/80 bg-white/75 p-6 shadow-[0_16px_44px_rgba(0,89,96,0.08)] backdrop-blur md:p-9 prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-brand-deep prose-a:text-brand hover:prose-a:text-brand-deep prose-img:rounded-[2rem] prose-p:text-brand-deep/80 prose-li:text-brand-deep/80">
          <div 
            dangerouslySetInnerHTML={{ __html: isBn ? article.contentBn : article.contentEn }}
            className="leading-relaxed"
          />
        </article>
        
        {/* SHARE BOTTOM SECTION */}
        <div className="mt-16 pt-8 border-t border-brand/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-brand-deep/60 font-bold uppercase tracking-wider text-sm">
            {isBn ? 'এই গাইডটি আপনার উপকারে এসেছে?' : 'Found this guide helpful?'}
          </p>
          <div className="flex gap-4">
            <button onClick={handleShare} className="px-6 py-2 bg-brand-light text-brand-deep font-bold rounded-full hover:bg-brand-mid/60 transition-colors flex items-center gap-2">
              <Share2 size={16} />
              {isBn ? 'শেয়ার করুন' : 'Share'}
            </button>
            <button onClick={handleCopy} className="px-6 py-2 bg-brand text-white font-bold rounded-full hover:bg-brand-deep transition-colors shadow-lg shadow-brand/20 flex items-center gap-2">
              <Copy size={16} />
              {isBn ? 'লিঙ্ক কপি করুন' : 'Copy Link'}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ArticleDetail;
