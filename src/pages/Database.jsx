import React from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Info 
} from 'lucide-react';
import GoogleAdSlot from '../components/GoogleAdSlot';

export default function DatabaseView({
  theme,
  dbSearch,
  setDbSearch,
  dbCardsList = [],
  dbLoading,
  dbError,
  dbPage,
  setDbPage,
  setSelectedCardDetail,
  inquiryList = [],
  toggleInquiry,
  storeStockCards = [], // Recibir stock de la tienda
  refetch
}) {

  // Sugerencias populares de cartas Pokémon para buscar en la base de datos
  const POPULAR_SEARCHES = ["Pikachu", "Charizard", "Lugia", "Mewtwo", "Arceus", "Mew", "Giratina"];

  const handleSuggestionClick = (term) => {
    setDbSearch(term);
    setDbPage(1);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header de Base de Datos */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
            <Database size={13} className="animate-pulse" />
            CONEXIÓN REAL-TIME POKÉMON TCG API
          </span>
          <h2 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">Buscador Oficial</h2>
          <p className="text-xs text-slate-400 mt-1">Busca cualquier carta en la base de datos mundial de Pokémon Company.</p>
        </div>

        {/* Input de búsqueda API */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Ej. Pikachu, Charizard, Lugia..."
            value={dbSearch}
            onChange={(e) => { setDbSearch(e.target.value); setDbPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-emerald-505 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white"
            aria-label="Buscar en la base de datos oficial"
          />
        </div>
      </div>

      {/* Publicidad Patrocinada antes de resultados */}
      <GoogleAdSlot format="horizontal" />

      {/* Estado de Carga / Error */}
      {dbLoading ? (
        <div className="text-center py-24">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-slate-450">Consultando con la base de datos de Pokémon Company...</p>
        </div>
      ) : dbError ? (
        <div className="text-center py-16 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-3xl max-w-md mx-auto p-6 space-y-3">
          <Info className="mx-auto text-red-500" size={32} />
          <h4 className="font-bold text-slate-900 dark:text-white">Error de Conexión</h4>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">{dbError}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-emerald-700"
          >
            Reintentar Búsqueda
          </button>
        </div>
      ) : dbCardsList.length > 0 ? (
        // Grid de Resultados API (Móvil-first)
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {dbCardsList.map((card, idx) => {
              const isInList = inquiryList.some(item => item.id === card.id);
              const isAd = idx === 5; // Insertar publicidad en la grilla oficial

              // Buscar si la carta está en stock local por coincidencia de nombre
              const stockItem = storeStockCards.find(sc => 
                sc.in_stock && 
                (sc.stock ?? 0) > 0 && 
                sc.name.trim().toLowerCase() === card.name.trim().toLowerCase()
              );

              return (
                <React.Fragment key={card.id}>
                  {isAd && (
                    <GoogleAdSlot format="card" className="col-span-1" />
                  )}
                  <div 
                    className="rounded-2xl border overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800"
                  >
                    <div 
                      className="relative aspect-[3/4] bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-pointer" 
                      onClick={() => setSelectedCardDetail(card)}
                    >
                      <img 
                        src={card.image} 
                        alt={`Carta Pokémon ${card.name} - Rarity: ${card.rarity} - Set: ${card.set}`}
                        loading="lazy"
                        className="w-full h-full object-contain p-4 transform hover:scale-105 transition-transform duration-300"
                      />
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
                      
                      {stockItem ? (
                        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                          <div className="text-left">
                            <span className="block text-[8px] text-[#0052FF] font-bold uppercase">En Stock</span>
                            <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                              ${stockItem.price.toLocaleString('es-CL')} CLP
                            </span>
                          </div>
                          <button
                            onClick={() => toggleInquiry(card)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isInList
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                            aria-label={isInList ? "Quitar de bolsa de cotización" : "Agregar a bolsa de cotización"}
                          >
                            {isInList ? <Check size={13} className="scale-110" /> : <Plus size={13} className="opacity-60" />}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-slate-450">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            No disponible
                          </span>
                          <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full">
                            Solo catálogo
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Controles de paginación de 44px (WCAG 2.1) */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <button
              disabled={dbPage === 1}
              onClick={() => { setDbPage(dbPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-11 h-11 flex items-center justify-center rounded-xl border bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-500 hover:border-emerald-500 disabled:opacity-40 transition-all cursor-pointer"
              aria-label="Página anterior oficial"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Página {dbPage}</span>
            <button
              onClick={() => { setDbPage(dbPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-11 h-11 flex items-center justify-center rounded-xl border bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-500 hover:border-emerald-500 transition-all cursor-pointer"
              aria-label="Página siguiente oficial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Empty State de base de datos con sugerencias */
        <div className="text-center py-16 bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md mx-auto p-6">
          <HelpCircle size={40} className="mx-auto text-slate-400 mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white">Búsqueda Vacía</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Ingresa el nombre de algún Pokémon para obtener resultados en tiempo real.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 block w-full mb-1">Prueba con:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handleSuggestionClick(term)}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
