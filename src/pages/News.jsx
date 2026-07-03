import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import GoogleAdSlot from '../components/GoogleAdSlot';

export default function News({
  theme,
  newsLoading,
  selectedNews,
  setSelectedNews,
  loadingFullContent,
  visibleNewsList,
  newsPage,
  setNewsPage
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      {selectedNews ? (
        // Detalle de Noticia
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => setSelectedNews(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0052FF] hover:underline cursor-pointer"
          >
            <ArrowLeft size={14} />
            Volver a noticias
          </button>

          <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <img 
              src={selectedNews.image} 
              alt={`Imagen destacada de noticia: ${selectedNews.title}`} 
              loading="lazy" 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.onerror = null; e.target.src = "/og-image.png"; }}
            />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-[#0052FF] uppercase">{selectedNews.date}</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{selectedNews.title}</h1>
            <p className="text-sm font-semibold text-slate-505 dark:text-slate-300 leading-relaxed italic border-l-4 border-[#0052FF] pl-4">
              {selectedNews.summary}
            </p>
          </div>

          {selectedNews.isExternal && loadingFullContent ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0052FF] border-t-transparent animate-pulse"></div>
              <span className="text-xs font-bold text-slate-500">Cargando noticia completa desde la fuente...</span>
            </div>
          ) : selectedNews.isExternal ? (
            <div 
              className="prose dark:prose-invert text-sm text-slate-600 dark:text-slate-350 leading-relaxed space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800"
              dangerouslySetInnerHTML={{ __html: selectedNews.content }}
            />
          ) : (
            <div className="prose dark:prose-invert text-sm text-slate-600 dark:text-slate-350 leading-relaxed space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {(selectedNews.content || '').split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
          
          {/* Espacio para publicidad AdSense en el detalle */}
          <GoogleAdSlot format="horizontal" className="my-8" />
            
          {selectedNews.isExternal && (
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end text-xs text-slate-450 dark:text-slate-500">
              <a 
                href={selectedNews.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#0052FF] hover:underline transition-colors font-semibold"
              >
                Fuente: {selectedNews.sourceName === 'Noticias TCG' ? 'TCGnews' : (selectedNews.sourceName || 'TCGnews')}
              </a>
            </div>
          )}
        </div>
      ) : (
        // Listado de Noticias (Responsive, formato grande)
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-black text-[#0052FF] uppercase tracking-widest">MUNDO POKÉMON</span>
              <h2 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">Noticias Pokémon</h2>
            </div>
          </div>

          {/* Espacio para publicidad AdSense en listado de noticias */}
          <GoogleAdSlot format="horizontal" className="mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#121824] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-pulse flex flex-col h-[400px]">
                  <div className="h-64 md:h-72 bg-slate-200 dark:bg-slate-800"></div>
                  <div className="p-6 flex-grow space-y-3">
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                  </div>
                </div>
              ))
            ) : (
              visibleNewsList.slice((newsPage - 1) * 6, newsPage * 6).map((n) => (
                <article 
                  key={n.id} 
                  onClick={() => { setSelectedNews(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="group bg-white dark:bg-[#121824] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative h-64 md:h-72 overflow-hidden">
                    <img 
                      src={n.image} 
                      alt={`Miniatura de noticia: ${n.title}`}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.onerror = null; e.target.src = "/og-image.png"; }}
                    />
                    {n.date && (
                      <span className="absolute top-2.5 right-2.5 bg-[#0052FF] text-white text-[9px] font-black px-2 py-0.5 rounded shadow uppercase z-10">
                        {n.date}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow relative">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0052FF] mb-3">
                      <Calendar size={14} className="stroke-[2.5]" />
                      {n.date}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-[#0052FF] transition-colors line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed line-clamp-3">
                      {n.summary}
                    </p>
                    <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#0052FF] uppercase tracking-wider flex items-center gap-1">Léelo ahora</span>
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover:bg-[#0052FF] group-hover:text-white transition-all duration-300">
                        <ChevronRight size={20} className="stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Controles de Paginación de 44px (WCAG 2.1) */}
          {visibleNewsList.length > 6 && (
            <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => {
                  setNewsPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={newsPage === 1}
                className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] text-slate-500 hover:text-[#0052FF] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Página anterior de noticias"
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: Math.ceil(visibleNewsList.length / 6) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => {
                    setNewsPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    newsPage === page 
                      ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/30 scale-105' 
                      : 'bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#0052FF]'
                  }`}
                  aria-label={`Ir a la página de noticias ${page}`}
                  aria-current={newsPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => {
                  setNewsPage(p => Math.min(Math.ceil(visibleNewsList.length / 6), p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={newsPage === Math.ceil(visibleNewsList.length / 6)}
                className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] text-slate-500 hover:text-[#0052FF] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Página siguiente de noticias"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
