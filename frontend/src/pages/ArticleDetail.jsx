import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useStore from '@/store/useStore';
import { GUIDES_DATA } from '@/data/guides';

const ArticleDetail = () => {
  const { id } = useParams();
  const language = useStore(state => state.language);
  const isBn = language === 'BN';
  const [article, setArticle] = useState(null);

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
    <div className="min-h-screen bg-[#D7DBD4] text-[#142334] font-sans selection:bg-[#A2C4C4]/50 pb-20">
      
      {/* Top Navigation */}
      <div className="w-full bg-[#D7DBD4]/90 backdrop-blur-md border-b border-[#A2C4C4] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/guide" className="text-[#0095A1] font-bold hover:text-[#142334] flex items-center gap-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {isBn ? 'ফিরে যান' : 'Back to Guides'}
          </Link>
          <div className="text-sm font-bold text-[#142334]/60 uppercase tracking-widest">
            {isBn ? article.tagBn : article.tagEn}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        
        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-[#0095A1] mb-6 leading-tight drop-shadow-sm">
            {isBn ? article.titleBn : article.titleEn}
          </h1>
          
          <div className="flex flex-wrap items-center text-[#142334]/60 text-sm md:text-base gap-4 md:gap-6 font-bold uppercase tracking-wider border-b border-[#A2C4C4] pb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#142334] flex items-center justify-center text-[#A2C4C4] font-bold shadow-md">
                {article.author.charAt(0)}
              </div>
              <span className="text-[#142334]">{article.author}</span>
            </div>
            <span className="hidden md:inline text-[#A2C4C4]">•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {isBn ? article.dateBn : article.dateEn}
            </span>
            <span className="hidden md:inline text-[#A2C4C4]">•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {isBn ? article.readTimeBn : article.readTimeEn}
            </span>
          </div>
        </header>

        {/* HERO IMAGE */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-xl mb-12 bg-[#A2C4C4]/20 border border-[#A2C4C4]/50">
          <img 
            src={article.image} 
            alt={isBn ? article.titleBn : article.titleEn} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* ARTICLE CONTENT */}
        <article className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#0095A1] prose-a:text-[#0095A1] hover:prose-a:text-[#142334] prose-img:rounded-[2rem] prose-p:text-[#142334]/80 prose-li:text-[#142334]/80">
          <div 
            dangerouslySetInnerHTML={{ __html: isBn ? article.contentBn : article.contentEn }}
            className="leading-relaxed"
          />
        </article>
        
        {/* SHARE BOTTOM SECTION */}
        <div className="mt-16 pt-8 border-t border-[#A2C4C4] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[#142334]/60 font-bold uppercase tracking-wider text-sm">
            {isBn ? 'এই গাইডটি আপনার উপকারে এসেছে?' : 'Found this guide helpful?'}
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-[#A2C4C4]/40 text-[#142334] font-bold rounded-full hover:bg-[#A2C4C4]/60 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              {isBn ? 'শেয়ার করুন' : 'Share'}
            </button>
            <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="px-6 py-2 bg-[#0095A1] text-white font-bold rounded-full hover:bg-[#142334] transition-colors shadow-lg shadow-[#0095A1]/20">
              {isBn ? 'লিঙ্ক কপি করুন' : 'Copy Link'}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ArticleDetail;
