import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '@/store/useStore';
import { GUIDES_DATA } from '@/data/guides';

const GuidePage = () => {
  const [copied, setCopied] = useState(false);
  const language = useStore(state => state.language);
  const isBn = language === 'BN';

  // Function to handle the "Manual Mail" Copy-to-Clipboard feature
  const copyTemplate = () => {
    const template = `Subject: [GUIDE SUBMISSION] - ${new Date().toLocaleDateString()}\n\nAuthor Name: \nArticle Title: \nArticle Content: \n\n(Please attach images to your email)`;
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="min-h-screen bg-[#D7DBD4] text-[#142334] font-sans selection:bg-[#A2C4C4]/50 pb-20">
      
      {/* 1. BREAKING NEWS TICKER */}
      <div className="w-full bg-[#142334] border-b border-[#A2C4C4] py-2 overflow-hidden whitespace-nowrap text-white">
        <div className="inline-block animate-marquee hover:[animation-play-state:paused]">
          <span className="mx-4 text-sm font-bold text-[#A2C4C4]">NEW:</span>
          <Link to="/jobs" className="mx-4 text-sm font-medium hover:text-[#A2C4C4] transition-colors hover:underline cursor-pointer">Updated Minimum Wage Rates for 2024 are now available in the Job Guide.</Link>
          <span className="mx-4 text-sm font-bold text-[#A2C4C4]">ALERT:</span>
          <a href="mailto:editorial@kiwidreambd.com" className="mx-4 text-sm font-medium hover:text-[#A2C4C4] transition-colors hover:underline cursor-pointer">Join our contributor program and share your NZ journey.</a>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        
        {/* PAGE HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#0095A1] mb-4">NZ Essentials & Guides</h1>
          <p className="text-lg text-[#142334]/80 max-w-2xl mx-auto">Discover everything you need to know about moving, living, and thriving in New Zealand as a Bangladeshi student.</p>
        </div>

        {/* 2. HERO FEATURED ARTICLE */}
        <section className="mb-16" id="featured-guide">
          <Link to={`/guide/${GUIDES_DATA.featured.id}`} className="block relative group overflow-hidden rounded-3xl bg-[#142334] aspect-[21/9] shadow-2xl shadow-[#142334]/20">
            <img 
              src={GUIDES_DATA.featured.image} 
              alt="Featured" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#142334] via-[#142334]/60 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 md:p-14 max-w-4xl z-10">
              <span className="inline-block px-4 py-1.5 bg-[#A2C4C4] text-[#142334] text-xs font-bold uppercase tracking-wider rounded-full mb-6 shadow-lg">
                {isBn ? GUIDES_DATA.featured.tagBn : GUIDES_DATA.featured.tagEn}
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-md transition-colors group-hover:text-[#A2C4C4]">
                {isBn ? GUIDES_DATA.featured.titleBn : GUIDES_DATA.featured.titleEn}
              </h2>
              <p className="text-white/80 text-lg md:text-xl mb-6 line-clamp-2 max-w-2xl font-medium">
                {isBn ? GUIDES_DATA.featured.descriptionBn : GUIDES_DATA.featured.descriptionEn}
              </p>
              <div className="flex items-center text-[#A2C4C4] text-sm gap-4 font-bold tracking-wide uppercase">
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0095A1] flex items-center justify-center text-white text-xs">K</div>
                  {GUIDES_DATA.featured.author}
                </span>
                <span>•</span>
                <span>{isBn ? GUIDES_DATA.featured.dateBn : GUIDES_DATA.featured.dateEn}</span>
                <span>•</span>
                <span>{isBn ? GUIDES_DATA.featured.readTimeBn : GUIDES_DATA.featured.readTimeEn}</span>
              </div>
            </div>
          </Link>
        </section>

        {/* 3. SECONDARY ARTICLE GRID */}
        <section className="mb-20" id="all-guides">
          <div className="flex items-center justify-between mb-10 border-b border-[#A2C4C4] pb-4">
            <h2 className="text-3xl font-serif font-bold text-[#142334]">Latest Articles</h2>
            <a href="#all-guides" className="text-[#0095A1] font-bold hover:text-[#142334] transition-colors flex items-center gap-1">
              View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GUIDES_DATA.articles.map((article) => (
              <Link to={`/guide/${article.id}`} key={article.id} className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#A2C4C4]/50 flex flex-col h-full">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-4 py-1.5 bg-[#D7DBD4]/90 backdrop-blur-md text-[#142334] text-xs font-bold uppercase tracking-wider rounded-full shadow-sm border border-[#A2C4C4]">
                      {isBn ? article.tagBn : article.tagEn}
                    </span>
                  </div>
                  <img 
                    src={article.image} 
                    alt={article.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-bold text-[#0095A1] mb-3 group-hover:text-[#142334] transition-colors leading-snug">
                    {isBn ? article.titleBn : article.titleEn}
                  </h3>
                  <p className="text-[#142334]/70 text-base mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {isBn ? article.descriptionBn : article.descriptionEn}
                  </p>
                  <div className="flex justify-between items-center pt-5 border-t border-[#A2C4C4]/50 text-xs text-[#142334]/60 font-bold uppercase tracking-wider">
                    <span className="text-[#0095A1]">{article.author}</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {isBn ? article.readTimeBn : article.readTimeEn}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. SUBMISSION SECTION */}
        <section className="relative bg-[#0095A1] rounded-[2.5rem] overflow-hidden shadow-xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#A2C4C4] rounded-full blur-[80px] opacity-30"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-[#D7DBD4] rounded-full blur-[60px] opacity-20"></div>
          
          <div className="relative p-10 md:p-20 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Share Your NZ Journey</h2>
            <p className="text-white/90 mb-12 text-lg max-w-2xl mx-auto font-medium">
              Help the Bangladeshi community grow by sharing your experiences. Whether it's finding a flat or landing a job, your story matters.
            </p>

            <div className="bg-[#142334]/20 backdrop-blur-md rounded-3xl p-8 md:p-12 text-left border border-[#A2C4C4]/30 max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#A2C4C4] text-[#142334] rounded-full flex items-center justify-center font-bold text-xl shadow-lg">1</div>
                <div>
                  <h3 className="font-bold text-2xl text-white">Submit via Email</h3>
                  <p className="text-white/80 text-sm mt-1">Use our quick template to format your submission</p>
                </div>
              </div>

              {/* The Template Box */}
              <div className="relative bg-[#142334]/40 border border-[#A2C4C4]/30 rounded-2xl p-6 mb-8 overflow-hidden group">
                <pre className="text-sm md:text-base text-white/90 whitespace-pre-wrap font-mono leading-relaxed">
                  {`Subject: [GUIDE SUBMISSION] - {Title}\n\nAuthor Name: \nArticle Title: \nContent: \n\n(Attach any relevant images to email) `}
                </pre>
                
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#142334] to-transparent flex items-center justify-end pr-4 opacity-80">
                  <button 
                    onClick={copyTemplate}
                    className="bg-[#A2C4C4] hover:bg-white text-[#142334] px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg flex items-center gap-2 transform active:scale-95"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#A2C4C4]/30">
                <div className="text-white/90 text-sm font-medium">
                  Send your completed draft to our editorial team:
                </div>
                <a href="mailto:editorial@kiwidreambd.com" className="font-bold text-[#A2C4C4] hover:text-white transition-colors flex items-center gap-2 bg-[#142334]/50 px-5 py-2.5 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  editorial@kiwidreambd.com
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER SPACING */}
      <footer className="py-12 text-center text-[#142334]/60 text-sm font-medium">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-4 h-4 bg-[#0095A1] rounded-full block shadow-md"></span>
          <span className="font-serif font-bold text-[#142334] text-xl tracking-tight">KiwiDream BD</span>
        </div>
        &copy; {new Date().getFullYear()} KiwiDream BD. All rights reserved.
      </footer>

      {/* CSS for the Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
        }
        .pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default GuidePage;

