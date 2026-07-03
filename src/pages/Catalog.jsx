import React from 'react';
import { 
  Search, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Check, 
  HelpCircle 
} from 'lucide-react';
import GoogleAdSlot from '../components/GoogleAdSlot';
import LeagueBadge from '../components/LeagueBadge';

export default function Catalog({
  theme,
  catalogCards,
  cardsLoading,
  inquiryList,
  toggleInquiry,
  setSelectedCardDetail,
  searchQuery,
  setSearchQuery,
  debouncedSearchQuery,
  selectedRarity,
  setSelectedRarity,
  sortBy,
  setSortBy,
  cardPage,
  setCardPage,
  catalogHeaderRef,
  visibleRarities,
  filteredCards,
  totalPages,
  paginatedCards
}) {

  const [showAutocomplete, setShowAutocomplete] = React.useState(false);

  // Obtener sugerencias de autocompletado en base al stock real
  const autocompleteSuggestions = React.useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2 || !catalogCards) return [];
    const query = searchQuery.toLowerCase().trim();
    
    const matchedNames = catalogCards
      .filter(c => c.name && c.name.toLowerCase().includes(query))
      .map(c => c.name);
      
    return [...new Set(matchedNames)].slice(0, 5);
  }, [searchQuery, catalogCards]);

  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.relative.w-full.max-w-lg')) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Sugerencias populares
  const SUGGESTIONS = ["Producto A", "Producto B", "Categoría X", "Modelo Y"];

  const handleSuggestionClick = (term) => {
    setSearchQuery(term);
    setCardPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      let start = Math.max(2, cardPage - 1);
      let end = Math.min(totalPages - 1, cardPage + 1);
      
      if (cardPage <= 2) {
        end = 4;
      } else if (cardPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. SECCIÓN DE BÚSQUEDA DESTACADA */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 dark:from-blue-950/15 dark:to-indigo-950/15 flex flex-col items-center justify-center text-center space-y-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0052FF]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <span className="text-[10px] font-black text-[#0052FF] uppercase tracking-widest">STOCK DISPONIBLE</span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">¿Qué carta estás buscando hoy?</h2>
        <p className="text-xs text-slate-400 max-w-md">Escribe el nombre de la carta o expansión para comprobar disponibilidad inmediata en stock físico.</p>
        
        <div className="relative w-full max-w-lg shadow-lg rounded-2xl bg-white dark:bg-[#121824] border border-slate-100 dark:border-slate-800/80">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar productos, categorías o código..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAutocomplete(true);
            }}
            onFocus={() => setShowAutocomplete(true)}
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-0 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-all"
            aria-label="Buscar productos"
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setShowAutocomplete(false);
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}

          {/* Menú de Autocompletado Flotante */}
          {showAutocomplete && autocompleteSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#111723] border border-slate-200/85 dark:border-slate-800 rounded-2xl shadow-xl z-20 overflow-hidden text-left">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-850 text-[9px] font-black text-[#0052FF] uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/10">
                Sugerencias en Stock
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-850">
                {autocompleteSuggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowAutocomplete(false);
                        setSelectedRarity('Todas');
                        setCardPage(1);
                      }}
                      className="w-full px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs text-slate-700 dark:text-slate-350 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Search size={12} className="text-slate-400" />
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 2. ESPACIO DE MONETIZACIÓN: ANUNCIO LEADERBOARD ENTRE BÚSQUEDA Y GRILLA */}
      <GoogleAdSlot format="horizontal" />

      {/* Header de Catálogo */}
      <div ref={catalogHeaderRef} style={{ scrollMarginTop: '100px' }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Cartas en Vitrina</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Mostrando {filteredCards.length} singles de stock real.</p>
        </div>

        {/* Selector de Orden */}
        <div className="w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-850 text-xs focus:outline-none focus:border-[#0052FF] transition-all text-slate-900 dark:text-white cursor-pointer"
            aria-label="Ordenar listado"
          >
            <option value="default">Ordenar por defecto</option>
            <option value="price-low">Precio: Menor a Mayor</option>
            <option value="price-high">Precio: Mayor a Menor</option>
            <option value="name">Nombre: A-Z</option>
          </select>
        </div>
      </div>

      {/* Filtro de Rarezas */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {visibleRarities.map((rarity) => (
          <button
            key={rarity.id}
            onClick={() => setSelectedRarity(rarity.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedRarity === rarity.id
                ? 'bg-[#0052FF] text-white shadow-md shadow-blue-500/10'
                : 'bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 hover:border-[#0052FF]'
            }`}
          >
            {rarity.name}
          </button>
        ))}
      </div>

      {/* Grid de Cartas */}
      {cardsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border overflow-hidden flex flex-col justify-between bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800 animate-pulse">
              <div className="relative aspect-[3/4] bg-slate-200 dark:bg-slate-800"></div>
              <div className="p-3 sm:p-4 space-y-2.5">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded mt-3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCards.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {paginatedCards.map((card, index) => {
              const isInList = inquiryList.some(item => item.id === card.id);

              return (
                <React.Fragment key={card.id}>
                  
                  <div 
                    className="rounded-2xl border overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-0.5 bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800"
                  >
                    <div 
                      className="relative aspect-[3/4] bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-pointer" 
                      onClick={() => setSelectedCardDetail(card)}
                    >
                      <img 
                        src={card.image} 
                        alt={`Producto ${card.name} - Rarity: ${card.rarity} - Set: ${card.set}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-3 sm:p-4 transform hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='320' viewBox='0 0 240 320'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2364748b'>[Sin Imagen]</text></svg>"; }}
                      />
                      <span className="absolute bottom-2 right-2 bg-[#0052FF] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                        {card.condition}
                      </span>
                      <span className="absolute bottom-2 left-2 bg-purple-600/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow uppercase">
                        {card.idioma || 'ES'}
                      </span>
                      {card.is_offer && card.offer_price && (
                        <span className="absolute top-2 right-2 bg-red-650 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow uppercase tracking-wide border border-white/20 z-10 animate-pulse">
                          🔥 Oferta
                        </span>
                      )}
                      {card.is_reverse && (
                        <span className={`absolute ${card.is_offer && card.offer_price ? 'top-8' : 'top-2'} right-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow uppercase tracking-wide border border-white/20 z-10`}>
                          REVERSE
                        </span>
                      )}
                      {card.is_league && (
                        <LeagueBadge className="absolute top-2 left-2" />
                      )}
                    </div>

                    <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
                      <div>
                        <h4 
                          className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white line-clamp-1 hover:text-[#0052FF] transition-colors cursor-pointer"
                          onClick={() => setSelectedCardDetail(card)}
                        >
                          {card.name}
                        </h4>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">{card.rarity}</p>
                        <p className="text-[9px] sm:text-[10px] text-[#0052FF] font-medium">{card.set}</p>
                      </div>
                      
                      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                        <div>
                          {card.stock === 0 ? (
                            <span className="font-extrabold text-red-500 text-xs sm:text-sm">AGOTADO</span>
                          ) : (
                            <div className="flex flex-col">
                              {card.is_offer && card.offer_price ? (
                                <>
                                  <span className="text-[10px] text-slate-400 line-through leading-tight">
                                    ${card.price.toLocaleString('es-CL')}
                                  </span>
                                  <span className="font-extrabold text-red-505 dark:text-red-400 text-xs sm:text-sm leading-tight">
                                    ${card.offer_price.toLocaleString('es-CL')} CLP
                                  </span>
                                </>
                              ) : (
                                <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                                  ${card.price.toLocaleString('es-CL')} CLP
                                </span>
                              )}
                              {(card.stock || 1) > 1 && <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium tracking-tight">x{card.stock} disp.</span>}
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
                            aria-label={isInList ? "Quitar de bolsa de cotización" : "Agregar a bolsa de cotización"}
                          >
                            <Check size={13} className={isInList ? 'scale-110' : 'opacity-45'} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Controles de Paginación de 44px (WCAG 2.1) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCardPage(prev => Math.max(1, prev - 1))}
                disabled={cardPage === 1}
                className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] text-slate-650 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0052FF] transition-all cursor-pointer"
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((p, i) => (
                  p === '...' ? (
                    <span key={`dots-${i}`} className="px-3 text-slate-450 font-bold text-sm">...</span>
                  ) : (
                    <button
                      key={`page-${p}`}
                      onClick={() => setCardPage(p)}
                      className={`w-11 h-11 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        cardPage === p
                          ? 'bg-[#0052FF] text-white shadow-md shadow-blue-500/25 scale-105'
                          : 'bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-300 hover:border-[#0052FF]'
                      }`}
                      aria-label={`Ir a la página ${p}`}
                      aria-current={cardPage === p ? "page" : undefined}
                    >
                      {p}
                    </button>
                  )
                ))}
              </div>

              <button
                onClick={() => setCardPage(prev => Math.min(totalPages, prev + 1))}
                disabled={cardPage === totalPages}
                className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] text-slate-650 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0052FF] transition-all cursor-pointer"
                aria-label="Página siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State con sugerencias de búsqueda interactiva */
        <div className="text-center py-16 bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
          <HelpCircle size={40} className="mx-auto text-slate-400 mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white">No encontramos cartas</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Prueba cambiando tu búsqueda o seleccionando otra rareza.</p>
          
          {/* Sugerencias de búsqueda */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2 max-w-sm mx-auto">
            <span className="text-[10px] font-bold text-slate-400 block w-full mb-1">Ideas de búsqueda:</span>
            {SUGGESTIONS.map((term) => (
              <button
                key={term}
                onClick={() => handleSuggestionClick(term)}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-[#0052FF] hover:bg-blue-500/5 rounded-lg transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setSearchQuery(''); setSelectedRarity('Todas'); }}
            className="px-5 py-2.5 bg-[#0052FF] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10"
          >
            Restaurar Filtros
          </button>
        </div>
      )}

      {/* Google Adsense en Catálogo */}
      <GoogleAdSlot format="horizontal" className="mt-12" />
    </div>
  );
}
