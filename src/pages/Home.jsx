import React, { useMemo, useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  MapPin, 
  Calendar, 
  Shield, 
  Coins, 
  Info,
  Check
} from 'lucide-react';
import GoogleAdSlot from '../components/GoogleAdSlot';
import LeagueBadge from '../components/LeagueBadge';

// Componente SVG local de Instagram
function Instagram({ size = 24, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Home({
  theme,
  dbCards,
  cardsLoading,
  dbNews,
  newsLoading,
  dbTournaments,
  tournamentsLoading,
  inquiryList,
  toggleInquiry,
  setSelectedCardDetail,
  setShowRealPhoto,
  visibleNewsList,
  displayTournaments,
  homepageTournaments,
  activeBanners,
  heroBannerIdx,
  setHeroBannerIdx,
  goBanner,
  carruselRef,
  isPaused,
  setIsPaused,
  carouselCards,
  setCurrentTab,
  setSelectedNews
}) {
  const [randomPromoCards, setRandomPromoCards] = useState([]);

  // Seleccionar 3 cartas aleatorias al azar en cada recarga o cambio de catálogo
  useEffect(() => {
    if (dbCards && dbCards.length > 0) {
      const pool = dbCards.filter(c => c.image);
      if (pool.length > 0) {
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        setRandomPromoCards([
          shuffled[0], 
          shuffled[1] || shuffled[0], 
          shuffled[2] || shuffled[0]
        ]);
      }
    }
  }, [dbCards]);

  return (
    <div className="space-y-16">
      
      {/* HERO BANNER SLIDESHOW */}
      <div className="relative w-full rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl min-h-[300px] sm:min-h-[380px]">
        
        {/* Contenedor de Slides con Opacidad Cruzada (Crossfade suave) */}
        {activeBanners.map((b, i) => {
          const isActive = i === heroBannerIdx;
          
          return (
            <div
              key={b.id || i}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {b.type === 'ui' ? (
                /* SLIDE TIPO UI (Primer banner con CTA) */
                <div className="relative w-full h-full flex items-center">
                  {/* Fondo con gradiente */}
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${b.bgFrom} 0%, ${b.bgTo} 100%)` }}
                  />
                  {/* Estrellitas decorativas */}
                  <div className="absolute top-6 left-8 text-white/15 text-4xl font-black select-none">★</div>
                  <div className="absolute bottom-10 left-16 text-white/10 text-2xl font-black select-none">★</div>
                  <div className="absolute top-10 right-[45%] text-white/10 text-xl select-none">✦</div>

                  {/* Contenido */}
                  <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center px-8 sm:px-12 py-10 w-full">
                    {/* Texto */}
                    <div className="space-y-5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold text-white uppercase tracking-wide">
                        <Sparkles size={10} /> {b.tag}
                      </div>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
                        {b.title} <span className="text-white/80">{b.titleAccent}</span>
                      </h1>
                      <p className="text-sm text-white/80 leading-relaxed max-w-md drop-shadow-sm">{b.description}</p>
                      <button
                        onClick={() => {
                          if (b.tab) { setCurrentTab(b.tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }
                        }}
                        className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-7 py-3.5 rounded-xl shadow-xl hover:bg-slate-50 transition-all text-sm cursor-pointer hover:-translate-y-0.5"
                      >
                        {b.cta} <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* Imágenes de cartas en abanico */}
                    <div className="hidden lg:flex items-center justify-center relative h-[260px]">
                      {randomPromoCards.length === 3 ? (
                        <>
                          <img 
                            src={randomPromoCards[2].image} 
                            alt={`Producto: ${randomPromoCards[2].name}`} 
                            loading="eager" 
                            onClick={() => setSelectedCardDetail(randomPromoCards[2])}
                            onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='320' viewBox='0 0 240 320'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2364748b'>[Sin Imagen]</text></svg>"; }}
                            className="absolute w-[130px] rounded-xl shadow-2xl border border-white/20 rotate-[-20deg] -translate-x-28 translate-y-8 opacity-80 cursor-pointer hover:scale-110 hover:-translate-y-2 hover:opacity-100 transition-all duration-300 z-0" 
                          />
                          <img 
                            src={randomPromoCards[0].image} 
                            alt={`Producto: ${randomPromoCards[0].name}`} 
                            loading="eager" 
                            onClick={() => setSelectedCardDetail(randomPromoCards[0])}
                            onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='320' viewBox='0 0 240 320'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2364748b'>[Sin Imagen]</text></svg>"; }}
                            className="absolute w-[145px] rounded-xl shadow-2xl border border-white/30 rotate-[12deg] translate-x-20 translate-y-10 cursor-pointer hover:scale-110 hover:-translate-y-2 transition-all duration-300 z-10" 
                          />
                          <img 
                            src={randomPromoCards[1].image} 
                            alt={`Producto: ${randomPromoCards[1].name}`} 
                            loading="eager" 
                            onClick={() => setSelectedCardDetail(randomPromoCards[1])}
                            onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='320' viewBox='0 0 240 320'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2364748b'>[Sin Imagen]</text></svg>"; }}
                            className="absolute w-[155px] rounded-xl shadow-2xl border border-white/40 -rotate-5 cursor-pointer hover:scale-110 hover:-translate-y-2 transition-all duration-300 z-20" 
                          />
                        </>
                      ) : (
                        <>
                          <img 
                            src={b.images[2]} 
                            alt="Producto TCG destacada de fondo" 
                            loading="eager" 
                            className="absolute w-[130px] rounded-xl shadow-2xl border border-white/20 rotate-[-20deg] -translate-x-28 translate-y-8 opacity-80" 
                          />
                          <img 
                            src={b.images[0]} 
                            alt="Producto TCG destacada derecha" 
                            loading="eager" 
                            className="absolute w-[145px] rounded-xl shadow-2xl border border-white/30 rotate-[12deg] translate-x-20 translate-y-10" 
                          />
                          <img 
                            src={b.images[1]} 
                            alt="Producto TCG destacada central" 
                            loading="eager" 
                            className="absolute w-[155px] rounded-xl shadow-2xl border border-white/40 -rotate-5 z-10" 
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* SLIDE TIPO IMAGEN (Full Bleed con Texto Superpuesto Opcional) */
                <div 
                  className={`relative w-full h-full ${b.linkUrl && b.linkUrl !== '#' ? 'cursor-pointer' : ''}`}
                  onClick={() => { if(b.linkUrl && b.linkUrl !== '#') window.open(b.linkUrl, '_blank') }}
                >
                  <img 
                    src={b.imageUrl} 
                    alt={b.title || "Banner promocional"} 
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: `center ${b.alignmentY ?? 50}%` }}
                    loading={i === 0 ? "eager" : "lazy"}
                    {...(i === 0 ? { fetchpriority: "high" } : {})}
                  />
                  
                  {/* Capa de oscurecimiento (se orienta y ajusta según la alineación del texto para garantizar legibilidad) */}
                  <div className={`absolute inset-0 pointer-events-none ${
                    (b.title || b.subtitle) 
                      ? b.alignmentX === 'right'
                        ? 'bg-gradient-to-l from-black/75 via-black/40 to-transparent'
                        : b.alignmentX === 'center'
                          ? 'bg-black/45'
                          : 'bg-gradient-to-r from-black/75 via-black/40 to-transparent' 
                      : 'bg-gradient-to-t from-black/40 via-transparent to-transparent'
                  }`} />

                  {/* Superposición de Texto Dinámica */}
                  {(b.title || b.subtitle || b.badge) && (
                    <div className="absolute inset-0 flex items-center z-10">
                      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${
                        b.alignmentX === 'right' 
                          ? 'text-right' 
                          : b.alignmentX === 'center' 
                            ? 'text-center' 
                            : 'text-left'
                      }`}>
                        <div className={`max-w-xs sm:max-w-md md:max-w-xl space-y-1.5 sm:space-y-3 flex flex-col ${
                          b.alignmentX === 'right' 
                            ? 'ml-auto items-end' 
                            : b.alignmentX === 'center' 
                              ? 'mx-auto items-center' 
                              : 'mr-auto items-start'
                        }`}>
                          {b.badge && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#0052FF]/20 backdrop-blur-md rounded-full border border-[#0052FF]/30 text-[#4d8aff] text-[8px] sm:text-[10px] font-black uppercase tracking-wider w-fit">
                              <span>{b.badge}</span>
                            </div>
                          )}
                          {b.title && (
                            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                              {b.title}
                            </h2>
                          )}
                          {b.subtitle && (
                            <p className="text-slate-200 text-[10px] sm:text-xs md:text-sm font-medium leading-relaxed drop-shadow-sm max-w-[280px] sm:max-w-sm md:max-w-md">
                              {b.subtitle}
                            </p>
                          )}
                          {b.linkUrl && b.linkUrl !== '#' && (
                            <div className="pt-1.5 sm:pt-2">
                              <span className="inline-flex items-center gap-1 bg-[#0052FF] hover:bg-blue-600 text-white font-bold text-[8px] sm:text-[10px] md:text-xs px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all shadow-md shadow-blue-500/20">
                                Saber Más →
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Controles de Navegación y Dots (Solo si hay más de 1 banner) */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() => goBanner((heroBannerIdx - 1 + activeBanners.length) % activeBanners.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border border-white/10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goBanner((heroBannerIdx + 1) % activeBanners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border border-white/10"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goBanner(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer shadow-sm ${
                    i === heroBannerIdx
                      ? 'w-8 h-2.5 bg-white'
                      : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>


      {/* SECCIÓN CARTAS POKÉMON CON MOVIMIENTO SEAMLESS INFINITO */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-black text-[#0052FF] uppercase tracking-widest">VITRINA DE STOCK REAL</span>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">Disponibles Ahora</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px] animate-pulse">
                NM - Near Mint
              </span>
            </div>
          </div>
          
          <button
            onClick={() => { setCurrentTab('catalog'); }}
            className="text-sm font-bold text-[#0052FF] hover:text-blue-700 ml-2 cursor-pointer"
          >
            Ver stock completo
          </button>
        </div>

        {/* Contenedor con flechas flotantes laterales */}
        <div className="relative group/carrusel px-2">
          <button 
            onClick={() => {
              setIsPaused(true);
              carruselRef.current?.scrollBy({ left: -260, behavior: 'smooth' });
              setTimeout(() => setIsPaused(false), 4000);
            }}
            className="absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-855 dark:text-slate-100 backdrop-blur-md opacity-100 md:opacity-0 md:group-hover/carrusel:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
            aria-label="Regresar"
          >
            <ChevronLeft size={22} className="stroke-[2.5]" />
          </button>

          <button 
            onClick={() => {
              setIsPaused(true);
              carruselRef.current?.scrollBy({ left: 260, behavior: 'smooth' });
              setTimeout(() => setIsPaused(false), 4000);
            }}
            className="absolute -right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-855 dark:text-slate-100 backdrop-blur-md opacity-100 md:opacity-0 md:group-hover/carrusel:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
            aria-label="Avanzar"
          >
            <ChevronRight size={22} className="stroke-[2.5]" />
          </button>

          {/* Marquesina */}
          <div 
            ref={carruselRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex items-stretch gap-5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-2 select-none"
          >
            {carouselCards.map((card, idx) => {
              const isInList = inquiryList.some(item => item.id === card.id);
              return (
                <div 
                  key={`${card.id}-${idx}`} 
                  className="w-[210px] sm:w-[230px] flex-shrink-0 rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-lg hover:-translate-y-0.5 bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800"
                >
                  <div 
                    className="relative aspect-[3/4] bg-slate-50 dark:bg-slate-955 overflow-hidden cursor-pointer" 
                    onClick={() => { setSelectedCardDetail(card); setShowRealPhoto(false); }}
                  >
                    <img 
                      src={card.image} 
                      alt={`Producto ${card.name} - Rarity: ${card.rarity} - Set: ${card.set}`}
                      loading="lazy"
                      className="w-full h-full object-contain p-3.5 transform hover:scale-105 transition-transform duration-300"
                      draggable="false"
                    />
                    <span className="absolute bottom-2.5 right-2.5 bg-[#0052FF] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                      {card.condition}
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 bg-purple-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow uppercase">
                      {card.idioma || 'ES'}
                    </span>
                    {card.is_reverse && (
                      <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow uppercase tracking-wide border border-white/20">
                        REVERSE
                      </span>
                    )}
                    {card.is_league && (
                      <LeagueBadge className="absolute top-2.5 left-2.5" />
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                      <h4 
                        className="font-bold text-sm text-slate-850 dark:text-white line-clamp-1 hover:text-[#0052FF] transition-colors cursor-pointer"
                        onClick={() => setSelectedCardDetail(card)}
                      >
                        {card.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{card.rarity}</p>
                      <p className="text-[10px] text-[#0052FF] font-medium">{card.set}</p>
                    </div>
                    
                    <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <div>
                        {card.stock === 0 ? (
                          <span className="font-extrabold text-red-500 text-xs">AGOTADO</span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                              ${card.price.toLocaleString('es-CL')} CLP
                            </span>
                            {(card.stock || 1) > 1 && <span className="text-[9px] text-slate-400 font-medium tracking-tight">x{card.stock} disp.</span>}
                          </div>
                        )}
                      </div>
                      {(card.stock !== 0) && (
                        <button
                          onClick={() => toggleInquiry(card)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            isInList
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Check size={13} className={isInList ? 'scale-110' : 'opacity-45'} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ESPACIO DE MONETIZACIÓN: GOOGLE ADSENSE LEADERBOARD */}
      <div className="py-2">
        <GoogleAdSlot format="horizontal" />
      </div>

      {/* SECCIÓN: "¿Cómo comprar?" */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Bloque: ¿Cómo comprar? */}
        <div className={`lg:col-span-12 p-6 sm:p-8 rounded-3xl border ${
          theme === 'dark' ? 'bg-[#111827]/40 border-slate-800' : 'bg-blue-50/20 border-blue-100/50'
        }`}>
          <h3 className="text-xl font-black text-[#0052FF] dark:text-[#0052FF] mb-6">¿Cómo comprar?</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
            {[
              { step: 1, title: "1. Elige tus cartas", desc: "Explora nuestro catálogo y selecciona tus cartas favoritas." },
              { step: 2, title: "2. Contáctanos", desc: "Escríbenos por Instagram para confirmar disponibilidad y precio." },
              { step: 3, title: "3. Realiza tu pago", desc: "Te enviamos los datos de transferencia para completar tu compra." },
              { step: 4, title: "4. Envío seguro", desc: "Enviamos tu pedido a cualquier parte de Chile con seguimiento." }
            ].map((s, idx) => (
              <div key={idx} className="space-y-2 relative">
                <div className="w-10 h-10 rounded-xl bg-[#0052FF] text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white pt-1">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECCIÓN: "Próximos Torneos" */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase">TORNEOS</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Próximos torneos y eventos</h3>
          </div>
          <button
            onClick={() => setCurrentTab('tournaments')}
            className="text-xs font-bold text-[#0052FF] hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            Ver todos <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournamentsLoading ? (
            <div className="space-y-4 col-span-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border bg-white dark:bg-[#121824] border-slate-100 dark:border-slate-800 animate-pulse">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : homepageTournaments.length === 0 ? (
            <p className="text-sm text-slate-400 col-span-2">No hay torneos programados por ahora.</p>
          ) : (
            homepageTournaments.map((t) => (
              <div 
                key={t.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  theme === 'dark' ? 'border-slate-800 bg-[#121824]' : 'border-slate-100 bg-white'
                }`}
              >
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xl font-black text-[#0052FF] dark:text-[#0052FF] leading-none">{t.day}</span>
                  <span className="text-[9px] font-extrabold text-slate-400 mt-0.5">{t.month}</span>
                </div>

                <div className="flex-grow space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    {t.registration_link ? (
                      <a 
                        href={t.registration_link}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 hover:text-[#0052FF] hover:underline transition-all cursor-pointer"
                      >
                        {t.title}
                      </a>
                    ) : (
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{t.title}</h4>
                    )}
                    <span className="text-[10px] font-bold text-[#0052FF] bg-blue-50 dark:bg-blue-955/40 px-2 py-0.5 rounded whitespace-nowrap">
                      Inscripción: {t.entry_fee}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">🛡️ {t.format}</span>
                    <span className="flex items-center gap-1">📍 {t.location}</span>
                    <span className="flex items-center gap-1">🕒 {t.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>


    </div>
  );
}
