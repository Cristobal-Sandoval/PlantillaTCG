import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCards } from './hooks/useCards';
import { useNews } from './hooks/useNews';
import { useTournaments } from './hooks/useTournaments';
import { useAutoNews } from './hooks/useAutoNews';
import { HERO_BANNERS } from './constants/banners';
import { useAdmin } from './hooks/useAdmin';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  Info, 
  Check, 
  Copy, 
  Layers, 
  Moon, 
  Sun, 
  ShoppingBag, 
  X,
  Coins,
  Shield,
  Truck,
  Sparkles,
  Building,
  Plus,
  BookOpen,
  Image as ImageIcon,
  ArrowLeft,
  Database,
  ExternalLink,
  Flame,
  HelpCircle,
  Calendar,
  ChevronUp
} from 'lucide-react';

// ==========================================
// COMPONENTE ICONO INSTAGRAM PERSONALIZADO
// ==========================================
function Instagram({ size = 24, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2054/svg" 
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

// ==========================================
// COMPONENTE DE ANUNCIOS DE GOOGLE ADSENSE (PLACEHOLDER PREMIUM)
// ==========================================
function GoogleAdSlot({ format = "horizontal", className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 text-center transition-all ${className}`}>
      <span className="absolute top-2 right-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
        Publicidad Patrocinada
      </span>
      
      {format === "horizontal" ? (
        <div className="flex flex-col items-center justify-center min-h-[90px] py-2">
          {/* Simulación del Bloque de Anuncio Leaderboard 728x90 */}
          <div className="w-full max-w-[728px] h-[90px] rounded-lg bg-gradient-to-r from-slate-200/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 flex flex-col items-center justify-center border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Google AdSense Banner (728x90)</span>
            <p className="text-[10px] text-slate-400 mt-1">Este espacio monetiza la navegación de tus coleccionistas</p>
          </div>
        </div>
      ) : format === "card" ? (
        <div className="flex flex-col items-center justify-center min-h-[280px] h-full p-4 rounded-2xl bg-gradient-to-b from-slate-100/40 to-slate-50/20 dark:from-slate-900/40 dark:to-slate-900/10 border border-slate-200/60 dark:border-slate-800/60 text-center">
          <div className="w-8 h-8 rounded-full bg-blue-105 dark:bg-blue-950 flex items-center justify-center text-blue-600 mb-2">
            <Sparkles size={16} />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-400">Anuncio Patrocinado</span>
          <p className="text-[10px] text-slate-400 mt-2 max-w-[160px] mx-auto leading-relaxed">
            Monetiza cada búsqueda. Espacio ideal para patrocinadores del sector TCG.
          </p>
          <div className="mt-4 px-3 py-1.5 bg-blue-500/10 text-[#0052FF] text-[9px] font-bold rounded-lg uppercase tracking-wider">
            Saber Más
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[250px] py-4">
          {/* Simulación de Anuncio Rectangular 300x250 */}
          <div className="w-[280px] h-[250px] rounded-xl bg-gradient-to-b from-slate-200/30 to-slate-100/30 dark:from-slate-800/30 dark:to-slate-900/30 flex flex-col items-center justify-center border border-slate-200/60 dark:border-slate-800/60 p-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 mb-2">
              <Sparkles size={16} />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">AdSense Ad (300x250)</span>
            <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-2 text-center leading-relaxed">
              Posicionamiento ideal para maximizar el CPM con anunciantes de tecnología, gaming o figuras de colección.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENTE DE LOGO CARDPOINT
// ==========================================
function CardpointLogo({ className = "h-14", showText = true }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Icono de las cartas en abanico */}
      <svg className="w-20 h-14" viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Carta Izquierda */}
        <rect 
          x="34" y="24" width="38" height="58" rx="5" 
          transform="rotate(-15 34 24)" 
          stroke="currentColor" 
          className="text-slate-955 dark:text-white fill-white dark:fill-[#0a0d14]" 
          strokeWidth="4" 
        />
        {/* Carta Derecha */}
        <rect 
          x="90" y="14" width="38" height="58" rx="5" 
          transform="rotate(15 90 14)" 
          stroke="currentColor" 
          className="text-slate-950 dark:text-white fill-white dark:fill-[#0a0d14]" 
          strokeWidth="4" 
        />
        {/* Carta Central */}
        <rect 
          x="58" y="14" width="44" height="64" rx="6" 
          stroke="currentColor" 
          className="text-slate-955 dark:text-white fill-white dark:fill-[#0a0d14]" 
          strokeWidth="4.5" 
        />
        {/* Brillo/Estrella de 4 puntas azul en el centro */}
        <path 
          d="M80,26 C80,38 80,38 92,38 C80,38 80,38 80,50 C80,38 80,38 68,38 C80,38 80,38 80,26 Z" 
          fill="#0052FF" 
        />
        {/* Triángulo/Cuña azul inferior */}
        <path 
          d="M60,84 L100,84 L80,94 Z" 
          fill="#0052FF" 
        />
      </svg>

      {/* Bloque de texto corporativo e indicador de Tienda TCG */}
      {showText && (
        <div className="text-center mt-1">
          <div className="flex items-center justify-center font-black tracking-tight text-xl leading-none">
            <span className="text-slate-900 dark:text-white">CARD</span>
            <span className="text-[#0052FF]">POINT</span>
            <span className="text-slate-900 dark:text-white">.CL</span>
          </div>
          
          {/* Línea divisoria y Tienda TCG */}
          <div className="flex items-center justify-between gap-2 mt-1.5 w-full max-w-[170px] mx-auto">
            <div className="h-[2px] bg-gradient-to-r from-transparent to-[#0052FF] flex-grow rounded"></div>
            <span className="text-[9px] font-black tracking-[0.25em] text-slate-900 dark:text-white uppercase leading-none whitespace-nowrap px-1">
              TIENDA TCG
            </span>
            <div className="h-[2px] bg-gradient-to-l from-transparent to-[#0052FF] flex-grow rounded"></div>
          </div>
          
          {/* Rombo / Diamante inferior */}
          <div className="flex justify-center mt-1.5">
            <div className="w-2 h-2 rotate-45 bg-[#0052FF]"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Eras de Stock Físico
const ERAS = [
  { id: 'Todas', name: 'Todas' },
  { id: 'Escarlata y Púrpura', name: 'Escarlata y Púrpura' },
  { id: 'Espada y Escudo', name: 'Espada y Escudo' },
  { id: 'SM - Sol y Luna', name: 'SM - Sol y Luna' },
  { id: 'XY', name: 'XY' },
  { id: 'Black & White', name: 'Black & White' },
  { id: 'Otras', name: 'Otras' }
];

// Placeholder cards para el carrusel cuando la DB aún carga
const PLACEHOLDER_CARDS = [
  {
    id: 1,
    name: "Charizard ex",
    set: "Escarlata y Púrpura",
    setCode: "sv45",
    rarity: "Especial Ilustración Rara",
    price: 89990,
    condition: "NM",
    image: "https://images.pokemontcg.io/sv4f/234_hires.png",
    description: "Impresionante Charizard ex con ilustración especial de Paldean Fates. Estado impecable (Near Mint), ideal para coleccionistas exigentes."
  },
  {
    id: 2,
    name: "Pikachu ex",
    set: "Escarlata y Púrpura",
    setCode: "sv035",
    rarity: "Especial Ilustración Rara",
    price: 74990,
    condition: "NM",
    image: "https://images.pokemontcg.io/sv3pt5/173_hires.png",
    description: "Pikachu en su versión de arte alternativo de la expansión 151. Centrado ideal y esquinas perfectas."
  },
  {
    id: 3,
    name: "Mewtwo V",
    set: "Espada y Escudo",
    setCode: "swsh12",
    rarity: "Ultra Rara",
    price: 39990,
    condition: "NM",
    image: "https://images.pokemontcg.io/swsh12pt5/GG44_hires.png",
    description: "Espectacular Mewtwo V de Crown Zenith (Galarian Gallery) combatiendo a Charizard. Una de las cartas más dinámicas de la era."
  },
  {
    id: 4,
    name: "Gardevoir ex",
    set: "Escarlata y Púrpura",
    setCode: "sv45",
    rarity: "Especial Ilustración Rara",
    price: 29990,
    condition: "NM",
    image: "https://images.pokemontcg.io/sv4f/233_hires.png",
    description: "Gardevoir ex Ilustración Especial. Cuenta la bella historia familiar del Pokémon en un entorno hogareño."
  },
  {
    id: 5,
    name: "Arceus VSTAR",
    set: "Espada y Escudo",
    setCode: "swsh12pt5",
    rarity: "Ultra Rara Secreta",
    price: 49990,
    condition: "NM",
    image: "https://images.pokemontcg.io/swsh12pt5/GG70_hires.png",
    description: "Carta dorada de Arceus VSTAR de la galería de Crown Zenith. Una pieza central de lujo para cualquier coleccionista del TCG."
  },
  {
    id: 6,
    name: "Greninja ex",
    set: "Escarlata y Púrpura",
    setCode: "sv06",
    rarity: "Especial Ilustración Rara",
    price: 185000,
    condition: "NM",
    image: "https://images.pokemontcg.io/sv6/214_hires.png",
    description: "La carta más cotizada del formato actual. Estilo mosaico brillante excelente."
  },
  {
    id: 7,
    name: "Teal Mask Ogerpon ex",
    set: "Escarlata y Púrpura",
    setCode: "sv06",
    rarity: "Doble Rara",
    price: 9500,
    condition: "NM",
    image: "https://images.pokemontcg.io/sv6/25_hires.png",
    description: "Esencial para el mazo competitivo de moda. Varias copias disponibles en stock inmediato."
  },
  {
    id: 8,
    name: "Giratina VSTAR",
    set: "Espada y Escudo",
    setCode: "swsh12pt5",
    rarity: "Secreta Dorada",
    price: 110000,
    condition: "NM",
    image: "https://images.pokemontcg.io/swsh12pt5/GG69_hires.png",
    description: "Versión dorada de colección texturizada. Recién sacada de sobre."
  }
];

// (Datos de Torneos y Noticias ahora vienen de Supabase via hooks)

// Banners del hero slideshow ahora en src/constants/banners.js

// Hook para Debounce (mejora rendimiento del buscador local)
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Hook para SEO Dinámico (Cambia título y descripción de meta tag por cada página)
function useSEO(title, description) {
  useEffect(() => {
    document.title = title;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = description;
      document.head.appendChild(metaDescription);
    }
  }, [title, description]);
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Derive currentTab from URL path
  const path = location.pathname.replace('/', '');
  const currentTab = path === '' ? 'home' : path;

  // Helper to replace old setCurrentTab
  const setCurrentTab = (tab) => {
    if (tab === 'news') setNewsPage(1);
    if (tab === 'home') navigate('/');
    else navigate(`/${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [theme, setTheme] = useState('light');

  // ── Supabase data hooks ──────────────────────────────────────
  const { cards: dbCards, loading: cardsLoading } = useCards();
  const { news: dbNews, loading: newsLoading } = useNews();
  const { tournaments: dbTournaments, loading: tournamentsLoading } = useTournaments();

  // Use DB cards for catalog; fall back to empty while loading
  const catalogCards = dbCards;

  // Carousel uses DB cards (tripled for seamless loop) once loaded
  const carouselSource = dbCards.length > 0 ? dbCards : PLACEHOLDER_CARDS;
  
  // Search & Catalog Filter States (Stock)
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms de retraso inteligente
  const [selectedEra, setSelectedEra] = useState('Todas');
  const [sortBy, setSortBy] = useState('default');

  // Sistema de Noticias
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsPage, setNewsPage] = useState(1);
  const [loadingFullContent, setLoadingFullContent] = useState(false);

  const { autoNews, loadingAuto } = useAutoNews();

  // Panel de Control State (Global Supabase)
  const { adminSettings, updateSetting } = useAdmin();
  
  const hiddenNewsIds = adminSettings.hidden_news || [];
  const localTournaments = adminSettings.tournaments_override || [];
  const customBanners = adminSettings.custom_banners || [];
  const rawSponsoredAd = adminSettings.sponsored_ad;
  const sponsoredAds = Array.isArray(rawSponsoredAd) ? rawSponsoredAd : (rawSponsoredAd ? [rawSponsoredAd] : [{ active: true, text: '🔥 ¡Encuentra fundas y carpetas oficiales con 15% de descuento usando el código CARDPOINT15 en la tienda partner!', link: 'https://google.com/adsense' }]);
  const activeAds = sponsoredAds.filter(ad => ad.active);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeAds.length <= 1) return;
    const duration = isMobile ? 24000 : 30000;
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % activeAds.length);
    }, duration);
    return () => clearInterval(interval);
  }, [activeAds.length, isMobile]);

  const currentAd = activeAds[currentAdIndex] || null;
  const toggleHideNews = async (id) => {
    const next = hiddenNewsIds.includes(id) 
      ? hiddenNewsIds.filter(nId => nId !== id) 
      : [...hiddenNewsIds, id];
    await updateSetting('hidden_news', next);
  };

  const updateLocalTournament = async (id, data) => {
    const existing = localTournaments.find(t => t.id === id);
    let next;
    if (existing) {
      next = localTournaments.map(t => t.id === id ? { ...t, ...data } : t);
    } else {
      next = [...localTournaments, { id, ...data }];
    }
    await updateSetting('tournaments_override', next);
  };

  const updateCustomBanners = async (next) => {
    await updateSetting('custom_banners', next);
  };

  // Carga diferida de noticia completa para fuentes externas (Pokémon Oficial, Pokémon Alpha, TCGNews)
  useEffect(() => {
    if (!selectedNews || !selectedNews.isExternal || selectedNews.hasFullContent) {
      return;
    }

    let isMounted = true;
    const fetchFullContent = async () => {
      setLoadingFullContent(true);
      try {
        const PROXIES = [
          (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
          (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
          (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
        ];

        const fetchWithTimeout = async (url, ms = 3000) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), ms);
          try {
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(id);
            return res;
          } catch (e) {
            clearTimeout(id);
            throw e;
          }
        };

        let success = false;
        let html = '';

        for (const makeUrl of PROXIES) {
          try {
            const proxyUrl = makeUrl(selectedNews.sourceUrl);
            const res = await fetchWithTimeout(proxyUrl, 3000);
            if (!res.ok) continue;

            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const json = await res.json();
              html = json.contents || json.data || '';
            } else {
              html = await res.text();
            }

            if (html) {
              success = true;
              break;
            }
          } catch (e) {
            console.warn("Error fetching full content proxy:", e);
          }
        }

        if (!isMounted) return;

        if (success && html) {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            let paragraphs = [];

            if (selectedNews.sourceName === 'Pokémon Oficial') {
              const article = doc.querySelector('article') || doc.querySelector('.news-detail') || doc.querySelector('.news-article') || doc.querySelector('main');
              if (article) {
                paragraphs = Array.from(article.querySelectorAll('p, h2, h3'));
              }
            } else if (selectedNews.sourceName === 'Pokémon Alpha') {
              const contentDiv = doc.querySelector('.entry-content') || doc.querySelector('.post-content') || doc.querySelector('article') || doc.querySelector('main');
              if (contentDiv) {
                paragraphs = Array.from(contentDiv.querySelectorAll('p, h2, h3'));
              }
            } else if (selectedNews.sourceName === 'Noticias TCG') {
              const tcgPs = doc.querySelectorAll('p.noti-p');
              if (tcgPs && tcgPs.length > 0) {
                paragraphs = Array.from(tcgPs);
              } else {
                const container = doc.querySelector('.noti-body') || doc.querySelector('article') || doc.querySelector('main');
                if (container) {
                  paragraphs = Array.from(container.querySelectorAll('p, h2, h3'));
                }
              }
            }

            if (paragraphs.length === 0) {
              const main = doc.querySelector('article') || doc.querySelector('main') || doc.body;
              if (main) paragraphs = Array.from(main.querySelectorAll('p'));
            }

            const cleanParas = paragraphs
              .map(el => {
                const text = el.textContent?.trim() || '';
                if (text.length < 10) return null;
                if (el.tagName && el.tagName.startsWith('H')) {
                  return `<h3 class="text-lg font-black text-slate-900 dark:text-white mt-6 mb-3">${text}</h3>`;
                }
                return `<p class="text-sm text-slate-650 dark:text-slate-350 leading-relaxed mb-4">${text}</p>`;
              })
              .filter(Boolean)
              .join('');

            if (cleanParas && cleanParas.length > 100) {
              setSelectedNews(prev => {
                if (prev && prev.id === selectedNews.id) {
                  return { ...prev, content: cleanParas, hasFullContent: true };
                }
                return prev;
              });
              return;
            }
          } catch (parseErr) {
            console.error("Error parsing news content:", parseErr);
          }
        }

        // Caer suavemente al contenido pre-cargado de fallback (ya enriquecido en useAutoNews)
        setSelectedNews(prev => {
          if (prev && prev.id === selectedNews.id) {
            return { ...prev, hasFullContent: true };
          }
          return prev;
        });
      } catch (err) {
        console.error("Critical error in fetchFullContent:", err);
      } finally {
        if (isMounted) {
          setLoadingFullContent(false);
        }
      }
    };

    fetchFullContent();

    return () => {
      isMounted = false;
    };
  }, [selectedNews]);

  // Noticias visibles: manuales primero (ya ordenadas por fecha desc desde Supabase), luego las auto
  const visibleNewsList = useMemo(() => {
    const filtered = newsList.filter(n => !hiddenNewsIds.includes(n.id));
    const manual = filtered.filter(n => !n.isExternal);
    const auto = filtered.filter(n => n.isExternal);
    return [...manual, ...auto];
  }, [newsList, hiddenNewsIds]);

  const displayTournaments = useMemo(() => {
    const MONTHS = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Aplicar overrides locales de adminSettings si existen
    const baseTournaments = dbTournaments.map(t => {
      const local = localTournaments.find(lt => lt.id === t.id);
      return local ? { ...t, ...local } : t;
    });

    let list = [];
    
    baseTournaments.forEach(t => {
      // 1. Torneos Recurrentes
      if (t.is_recurring) {
        const weekDaysMap = {
          'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3, 'jueves': 4,
          'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6, 'domingo': 0
        };
        const targetDays = (t.recurring_days || '').toLowerCase().split(',').map(d => d.trim());
        const targetDOWs = targetDays.map(d => weekDaysMap[d]).filter(d => d !== undefined);
        
        // Generar ocurrencias en los próximos 30 días
        for (let i = 0; i < 30; i++) {
          const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
          const dow = date.getDay();
          
          if (targetDOWs.includes(dow)) {
            // Si es hoy, comprobar si el torneo ya pasó
            if (i === 0 && t.time) {
              const timeMatch = t.time.match(/(\d+)[:.](\d+)/);
              if (timeMatch) {
                const hour = parseInt(timeMatch[1], 10);
                const min = parseInt(timeMatch[2], 10);
                const tournamentTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, min);
                if (now > tournamentTime) {
                  continue; 
                }
              }
            }
            
            list.push({
              ...t,
              id: `${t.id}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
              day: String(date.getDate()),
              month: MONTHS[date.getMonth()],
              dateObj: date,
              dateTime: date.getTime()
            });
          }
        }
      } 
      // 2. Torneos Manuales
      else {
        let tDate = null;
        if (t.specific_date) {
          tDate = new Date(t.specific_date + 'T23:59:59');
        } else if (t.day && t.month) {
          // Legacy: Asumir año actual para ordenación
          const monthIndex = MONTHS.indexOf(t.month.toUpperCase());
          if (monthIndex !== -1) {
            tDate = new Date(now.getFullYear(), monthIndex, parseInt(t.day, 10), 23, 59, 59);
            if (tDate.getTime() < todayStart) {
              tDate.setFullYear(now.getFullYear() + 1); // Traspasar al prox año
            }
          }
        }
        
        if (tDate && tDate.getTime() >= todayStart) {
          let displayDay = t.day;
          let displayMonth = t.month;
          if (t.specific_date) {
            const dateVal = new Date(t.specific_date + 'T00:00:00');
            displayDay = String(dateVal.getDate());
            displayMonth = MONTHS[dateVal.getMonth()];
          }
          list.push({
            ...t,
            day: displayDay,
            month: displayMonth,
            dateObj: tDate,
            dateTime: tDate.getTime()
          });
        }
      }
    });
    
    // Ordenar de más cercano a más lejano
    list.sort((a, b) => a.dateTime - b.dateTime);
    return list;
  }, [dbTournaments, localTournaments]);

  const homepageTournaments = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const threeDaysLimit = todayStart + 3 * 24 * 60 * 60 * 1000;
    
    // Filtrar los torneos que ocurren en los próximos 3 días (hasta el fin del 3er día)
    const withinThreeDays = displayTournaments.filter(t => {
      return t.dateTime <= threeDaysLimit + 24 * 60 * 60 * 1000;
    });

    // "Si es que hay espacio": Si hay menos de 3 torneos en los próximos 3 días,
    // rellenamos con los siguientes torneos más cercanos hasta tener 3, con un tope de 4
    // para mantener el balance y orden estético del layout de inicio.
    if (withinThreeDays.length < 3) {
      return displayTournaments.slice(0, 3);
    }
    return withinThreeDays.slice(0, 4);
  }, [displayTournaments]);

  // SEO Dinámico según la ruta
  let pageTitle = "Cardpoint | Tienda de Singles TCG";
  let pageDesc = "Tienda especializada en compra y venta de cartas sueltas de Pokémon TCG en Concepción, Chile.";
  
  switch(currentTab) {
    case 'catalog':
      pageTitle = "Catálogo de Cartas | Cardpoint";
      pageDesc = "Revisa nuestro stock real actualizado de cartas Pokémon TCG. Singles, full arts y cartas raras listas para envío a todo Chile.";
      break;
    case 'news':
      pageTitle = "Noticias TCG | Cardpoint";
      if (selectedNews) {
        pageTitle = `${selectedNews.title} | Cardpoint`;
        pageDesc = selectedNews.summary;
      } else {
        pageDesc = "Entérate de las últimas novedades, aperturas y noticias de la comunidad Pokémon TCG.";
      }
      break;
    case 'tournaments':
      pageTitle = "Torneos Locales | Cardpoint";
      pageDesc = "Inscríbete en nuestros próximos torneos de Pokémon TCG en Concepción. Próximos eventos y fechas.";
      break;
    case 'database':
      pageTitle = "Base de Datos Pokémon | Cardpoint";
      pageDesc = "Busca cartas en la base de datos oficial de Pokémon TCG. Consulta precios de mercado y disponibilidad.";
      break;
    case 'how-to-buy':
      pageTitle = "¿Cómo Comprar? | Cardpoint";
      pageDesc = "Aprende cómo comprar tus cartas de forma segura. Métodos de pago y envíos mediante Starken a todo Chile.";
      break;
  }
  
  useSEO(pageTitle, pageDesc);

  // ==========================================
  // ESTADOS DE LA BASE DE DATOS DE CARTAS (REAL-TIME API!)
  // ==========================================
  const [dbSearch, setDbSearch] = useState('Pikachu'); // Pikachu por defecto para que muestre resultados hermosos al cargar
  const [dbCardsList, setDbCardsList] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [dbPage, setDbPage] = useState(1);

  // Bolsa de Cotización / Lista de Interés
  const [inquiryList, setInquiryList] = useState([]);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showTransferDetails, setShowTransferDetails] = useState(false);
  const [selectedCardDetail, setSelectedCardDetail] = useState(null);
  const [showRealPhoto, setShowRealPhoto] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Sync noticias: mostrar las de Supabase apenas cargan, agregar auto-noticias después
  useEffect(() => {
    if (!newsLoading) {
      // Siempre mostrar noticias de Supabase + lo que haya de auto (aunque sea [])  
      setNewsList([...dbNews, ...autoNews]);
    }
  }, [dbNews, autoNews, newsLoading]);

  // Reset zoom when active card changes
  useEffect(() => {
    setIsImageZoomed(false);
  }, [selectedCardDetail]);

  // Reset sub-state views and modals when changing tabs
  useEffect(() => {
    if (currentTab !== 'news') {
      setSelectedNews(null);
    }
    setSelectedCardDetail(null);
  }, [currentTab]);

  // Control de Animación de Carrusel Continuo (cartas)
  const carruselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Scroll to Top UI State
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hero banner slideshow
  const [heroBannerIdx, setHeroBannerIdx] = useState(0);

  // Triplicamos stock para el carrusel infinito seamless
  const carouselCards = useMemo(() => {
    return [...carouselSource, ...carouselSource, ...carouselSource];
  }, [carouselSource]);

  // Sync de tema oscuro / claro
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const activeBanners = useMemo(() => {
    const activeCustom = customBanners.filter(b => b.active !== false);
    return activeCustom.length > 0 ? activeCustom : HERO_BANNERS;
  }, [customBanners]);

  // Hero banner auto-avance suave
  useEffect(() => {
    if (currentTab !== 'home') return;
    const interval = setInterval(() => {
      setHeroBannerIdx(prev => (prev + 1) % activeBanners.length);
    }, 12000); // 12 segundos para lectura pausada
    return () => clearInterval(interval);
  }, [currentTab, activeBanners.length]);

  const goBanner = (idx) => {
    setHeroBannerIdx(idx);
  };

  // Inicialización del carrusel de cartas en el centro
  useEffect(() => {
    if (currentTab !== 'home') return;
    const el = carruselRef.current;
    if (el) {
      const timer = setTimeout(() => {
        const setWidth = el.scrollWidth / 3;
        if (setWidth > 0) {
          el.scrollLeft = setWidth;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentTab, carouselCards]);

  // Loop continuo del carrusel (Marquesina seamless)
  useEffect(() => {
    if (currentTab !== 'home' || isPaused) return;

    let animationId;
    const el = carruselRef.current;
    if (!el) return;

    const smoothScroll = () => {
      const setWidth = el.scrollWidth / 3;
      if (setWidth > 0) {
        el.scrollLeft += 0.70; 
        if (el.scrollLeft >= setWidth * 2) {
          el.scrollLeft -= setWidth;
        }
      }
      animationId = requestAnimationFrame(smoothScroll);
    };

    animationId = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(animationId);
  }, [currentTab, isPaused, carouselCards]);

  // ==========================================
  // CONEXIÓN EN VIVO A LA BASE DE DATOS POKÉMON TCG API
  // ==========================================
  const fetchDBCards = async (query, page = 1) => {
    if (!query.trim()) return;
    setDbLoading(true);
    setDbError(null);
    try {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=name:"*${query.trim()}*"&page=${page}&pageSize=16`
      );
      if (!response.ok) {
        throw new Error('No se pudo establecer conexión con la base de datos de Pokémon Company.');
      }
      const data = await response.json();
      
      const formatted = (data.data || []).map(card => ({
        id: card.id,
        name: card.name,
        set: card.set.name,
        setCode: card.set.id,
        rarity: card.rarity || 'Doble Rara',
        price: card.cardmarket?.prices?.averageSellPrice 
          ? Math.round(card.cardmarket.prices.averageSellPrice * 950) 
          : 5000, 
        condition: 'Base de Datos (Referencia)',
        image: card.images.large,
        description: `Información oficial de la carta ${card.name} perteneciente a la expansión ${card.set.name}. Tipo principal: ${card.types ? card.types.join(', ') : 'Ninguno'}. Número oficial de set: ${card.number}.`
      }));
      
      setDbCardsList(formatted);
    } catch (err) {
      setDbError(err.message);
    } finally {
      setDbLoading(false);
    }
  };

  // Buscar en la base de datos Pokémon al cambiar el término de búsqueda
  useEffect(() => {
    if (currentTab === 'database') {
      const delayDebounceFn = setTimeout(() => {
        fetchDBCards(dbSearch, dbPage);
      }, 550); 
      return () => clearTimeout(delayDebounceFn);
    }
  }, [dbSearch, dbPage, currentTab]);

  // Manejo de la Bolsa de Cotización
  const toggleInquiry = (card) => {
    if (inquiryList.some(item => item.id === card.id)) {
      setInquiryList(inquiryList.filter(item => item.id !== card.id));
    } else {
      setInquiryList([...inquiryList, card]);
    }
  };

  const clearInquiryList = () => {
    setInquiryList([]);
  };

  const copyInquiryToClipboard = () => {
    const listText = inquiryList.map(card => `- ${card.name} (${card.condition}) - $${card.price.toLocaleString('es-CL')} CLP`).join('\n');
    const total = inquiryList.reduce((acc, curr) => acc + curr.price, 0);
    const message = `¡Hola Cardpoint! Me interesan las siguientes cartas que vi en su catálogo web:\n\n${listText}\n\nTotal estimado: $${total.toLocaleString('es-CL')} CLP\n\n¿Me confirman disponibilidad para coordinar transferencia?`;
    
    navigator.clipboard.writeText(message).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    }).catch(err => {
      const textarea = document.createElement('textarea');
      textarea.value = message;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 3000);
      } catch (err) {
        console.error('No se pudo copiar el texto', err);
      }
      document.body.removeChild(textarea);
    });
  };

  const openInstagramInquiry = () => {
    window.open(`https://instagram.com/cardpoint.cl`, '_blank');
  };

  const filteredCards = useMemo(() => {
    return catalogCards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
                            card.set.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesEra = selectedEra === 'Todas' || card.set === selectedEra;
      return matchesSearch && matchesEra;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [catalogCards, debouncedSearchQuery, selectedEra, sortBy]);

  const totalInquiryValue = inquiryList.reduce((sum, item) => sum + item.price, 0);

  // Manejo de Creación de Noticias
  const handleAddNews = (e) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsSummary || !newNewsContent) return;

    const newArticle = {
      id: Date.now(),
      title: newNewsTitle,
      date: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }),
      summary: newNewsSummary,
      content: newNewsContent,
      image: newNewsImage || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop"
    };

    setNewsList([newArticle, ...newsList]);
    setIsAddingNews(false);
    
    setNewNewsTitle('');
    setNewNewsSummary('');
    setNewNewsContent('');
    setNewNewsImage('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${theme === 'dark' ? 'bg-[#0a0d14] text-[#f1f5f9]' : 'bg-[#fafbfe] text-[#1e293b]'}`}>
      
      {/* 0. ESPACIO DE GOOGLE ADSENSE SUPERIOR BANNER (Leaderboard Fijo Superior para Monetización Premium) */}
      {currentAd && (
        <div
          key={currentAdIndex}
          className="w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center"
          style={{ height: '34px' }}
        >
          {/* Label izquierda — estático en desktop, oculto en mobile */}
          <span className="hidden md:flex flex-shrink-0 pl-4 pr-3 text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Anuncio Patrocinado
          </span>

          {/* Zona de scroll del texto */}
          <div className="flex-1 overflow-hidden relative h-full flex items-center justify-center">
            <div
              className="animate-marquee text-[10px] font-bold text-slate-500 dark:text-slate-400 absolute top-0 h-full flex items-center"
              onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
              onTouchStart={e => { e.currentTarget.style.animationPlayState = 'paused'; }}
              onTouchEnd={e => { e.currentTarget.style.animationPlayState = 'running'; }}
            >
              {currentAd.text}
            </div>
          </div>

          {/* Más info derecha — visible en mobile y desktop para no perder la acción, estático */}
          {currentAd.link && (
            <a
              href={currentAd.link}
              target="_blank"
              rel="noreferrer"
              className="flex flex-shrink-0 px-4 items-center h-full text-[9px] font-extrabold text-[#0052FF] hover:underline gap-0.5"
            >
              Más info <ExternalLink size={9} />
            </a>
          )}
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${theme === 'dark' ? 'bg-[#0f172a]/95 border-slate-800' : 'bg-white/95 border-slate-100'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            
            {/* Logo Corporativo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentTab('home'); setSelectedEra('Todas'); setSelectedNews(null); }}>
              <CardpointLogo className="scale-90 origin-left" showText={true} />
            </div>

            {/* Menú de Navegación (Responsive: md y superior) */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 font-bold text-xs uppercase tracking-wider">
              {[
                { id: 'home', label: 'Inicio' },
                { id: 'catalog', label: 'En Stock' },
                { id: 'news', label: 'Noticias' },
                { id: 'tournaments', label: 'Torneos' },
              ].map((item) => {
                const isActive = currentTab === item.id && !selectedNews;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setSelectedNews(null);
                      setIsAddingNews(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'text-[#0052FF] font-black bg-[#0052FF]/10' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#0052FF] dark:hover:text-[#0052FF]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Acciones de Cabecera */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Enlace Directo Instagram (Oculto en móviles pequeños) */}
              <a
                href="https://instagram.com/cardpoint.cl"
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pink-650 transition-colors"
              >
                <Instagram size={15} className="text-pink-500" />
                <span>@cardpoint.cl</span>
              </a>

              {/* Botón Modo Claro / Oscuro */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  theme === 'dark' 
                    ? 'border-slate-800 bg-slate-900 text-yellow-400' 
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Carrito de Consulta */}
              <button
                onClick={() => setShowInquiryModal(true)}
                className="relative p-2.5 rounded-xl bg-[#0052FF] text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Bolsa de cotización"
              >
                <ShoppingBag size={18} />
                <span className="hidden sm:inline text-xs font-bold">Cotizar</span>
                {inquiryList.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                    {inquiryList.length}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* NAVEGACIÓN COMPACTA MÓVIL (Oculta en md y superior) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex justify-around items-center px-2 py-3.5 transition-colors ${theme === 'dark' ? 'bg-[#0f172a]/95 border-slate-800' : 'bg-white/95 border-slate-100'} backdrop-blur-md shadow-lg`}>
        {[
          { id: 'home', label: 'Inicio', icon: Sparkles },
          { id: 'catalog', label: 'Stock', icon: Layers },
          { id: 'news', label: 'Noticias', icon: BookOpen },
          { id: 'tournaments', label: 'Torneos', icon: MapPin },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setSelectedNews(null);
                setIsAddingNews(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center gap-1 px-3 transition-all cursor-pointer ${
                isActive 
                  ? 'text-[#0052FF] font-bold scale-105' 
                  : 'text-slate-400 dark:text-slate-500 text-xs'
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENIDO PRINCIPAL DE LA PÁGINA */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VISTA HOME */}
        {currentTab === 'home' && !selectedNews && (
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
                            <img src={b.images[2]} alt="carta" className="absolute w-[130px] rounded-xl shadow-2xl border border-white/20 rotate-[-20deg] -translate-x-28 translate-y-8 opacity-80" />
                            <img src={b.images[0]} alt="carta" className="absolute w-[145px] rounded-xl shadow-2xl border border-white/30 rotate-[12deg] translate-x-20 translate-y-10" />
                            <img src={b.images[1]} alt="carta" className="absolute w-[155px] rounded-xl shadow-2xl border border-white/40 -rotate-5 z-10" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* SLIDE TIPO IMAGEN (Full Bleed) */
                      <div 
                        className={`relative w-full h-full ${b.linkUrl && b.linkUrl !== '#' ? 'cursor-pointer' : ''}`}
                        onClick={() => { if(b.linkUrl && b.linkUrl !== '#') window.open(b.linkUrl, '_blank') }}
                      >
                        <img 
                          src={b.imageUrl} 
                          alt="Banner promocional" 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Gradiente oscuro sutil encima para que las flechas y puntos se vean siempre bien */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
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
                  onClick={() => { setCurrentTab('catalog'); setSelectedEra('Todas'); }}
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
                  className="absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 backdrop-blur-md opacity-100 md:opacity-0 md:group-hover/carrusel:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
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
                  className="absolute -right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 backdrop-blur-md opacity-100 md:opacity-0 md:group-hover/carrusel:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
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
                          className="relative aspect-[3/4] bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-pointer" 
                          onClick={() => { setSelectedCardDetail(card); setShowRealPhoto(false); }}
                        >
                          <img 
                            src={card.image} 
                            alt={card.name} 
                            loading="lazy"
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
                        </div>

                        <div className="p-4 flex flex-col flex-grow justify-between">
                          <div>
                            <h4 
                              className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1 hover:text-[#0052FF] transition-colors cursor-pointer"
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

            {/* SECCIÓN DOBLE: "Últimas noticias" y "Próximos Torneos" */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* LADO IZQUIERDO: NOTICIAS LOCALES */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase">NOTICIAS</span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Últimas novedades</h3>
                  </div>
                  <button
                    onClick={() => { setCurrentTab('news'); setSelectedNews(null); }}
                    className="text-xs font-bold text-[#0052FF] hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                  >
                    Ver todas <ChevronRight size={14} />
                  </button>
                </div>

                <div className="space-y-4">
                  {newsLoading ? (
                    <p className="text-sm text-slate-400">Cargando noticias...</p>
                  ) : visibleNewsList.length === 0 ? (
                    <p className="text-sm text-slate-400">No hay noticias publicadas aún.</p>
                  ) : (
                    visibleNewsList.slice(0, 3).map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => { setSelectedNews(n); setCurrentTab('news'); }}
                      className={`flex gap-4 p-3 rounded-2xl border cursor-pointer transition-all hover:border-[#0052FF]/40 bg-white dark:bg-[#121824] border-slate-100 dark:border-slate-800`}
                    >
                      <div className="w-20 sm:w-24 aspect-[4/3] rounded-xl overflow-hidden bg-slate-105 dark:bg-slate-950 flex-shrink-0">
                        <img src={n.image} alt={n.title} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1 flex-grow">
                        <span className="text-[9px] font-bold text-[#0052FF] uppercase">{n.date}</span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">{n.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{n.summary}</p>
                      </div>
                    </div>
                  ))
                  )}
                </div>
              </div>

              {/* LADO DERECHO: TORNEOS EN CONCEPCIÓN */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-[#0052FF] tracking-widest uppercase">TORNEOS</span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Próximos torneos en Concepción</h3>
                  </div>
                  <button
                    onClick={() => setCurrentTab('tournaments')}
                    className="text-xs font-bold text-[#0052FF] hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                  >
                    Ver todos <ChevronRight size={14} />
                  </button>
                </div>

                <div className="space-y-4">
                  {homepageTournaments.map((t) => (
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
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.title}</h4>
                          <span className="text-[10px] font-bold text-[#0052FF] bg-blue-50 dark:bg-blue-955/40 px-2 py-0.5 rounded">
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
                  ))}
                </div>
              </div>

            </div>

            {/* BANNER DE INSTAGRAM INTERACTIVO */}
            <div className={`p-4 sm:p-6 rounded-3xl border overflow-hidden relative ${
              theme === 'dark' ? 'bg-gradient-to-r from-blue-950 to-slate-900 border-slate-800' : 'bg-gradient-to-r from-blue-50/40 via-white to-blue-50/20 border-blue-100/40'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                
                {/* Info */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/10 flex-shrink-0">
                    <Instagram size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">Síguenos en Instagram</h3>
                    <p className="text-xs sm:text-sm font-black text-[#0052FF]">@cardpoint.cl</p>
                  </div>
                </div>

                {/* Stock cards showcase */}
                <div className="flex gap-2 justify-center flex-wrap">
                  {(dbCards.filter(c => c.image).slice(0, 4)).map((card, i) => (
                    <div
                      key={card.id || i}
                      onClick={() => { setCurrentTab('catalog'); setSelectedNews(null); }}
                      className="w-12 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                    >
                      <img src={card.image} alt={card.name || 'Carta en stock'} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {/* Fallback si no hay cartas aún */}
                  {dbCards.filter(c => c.image).length === 0 && [
                    "https://images.pokemontcg.io/sv4f/233_hires.png",
                    "https://images.pokemontcg.io/sv3pt5/173_hires.png",
                    "https://images.pokemontcg.io/sv4f/234_hires.png",
                  ].map((imgUrl, i) => (
                    <div key={i} className="w-12 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow">
                      <img src={imgUrl} alt="Carta" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <a
                  href="https://instagram.com/cardpoint.cl"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer flex-shrink-0"
                >
                  <Instagram size={16} />
                  Ir a Instagram
                </a>
              </div>
            </div>

          </div>
        )}

        {/* VISTA CATALOG / EN STOCK */}
        {currentTab === 'catalog' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* 1. SECCIÓN DE BÚSQUEDA DESTACADA (Separada del listado de cartas y centrada) */}
            <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 dark:from-blue-950/15 dark:to-indigo-950/15 flex flex-col items-center justify-center text-center space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0052FF]/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <span className="text-[10px] font-black text-[#0052FF] uppercase tracking-widest">STOCK CARDPOINT CONCEPCIÓN</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">¿Qué carta estás buscando hoy?</h2>
              <p className="text-xs text-slate-400 max-w-md">Escribe el nombre de la carta o expansión para comprobar disponibilidad inmediata en stock físico.</p>
              
              <div className="relative w-full max-w-lg shadow-lg rounded-2xl bg-white dark:bg-[#121824]">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Buscar Charizard, Pikachu, Mascarada, Crown Zenith..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-0 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* 2. ESPACIO DE MONETIZACIÓN: ANUNCIO LEADERBOARD ENTRE BÚSQUEDA Y GRILLA */}
            <GoogleAdSlot format="horizontal" />

            {/* Header de Catálogo (Filtros y orden solamente, sin la barra de búsqueda al lado) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
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
                >
                  <option value="default">Ordenar por defecto</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="name">Nombre: A-Z</option>
                </select>
              </div>
            </div>

            {/* Filtro de Eras (Desplazable horizontalmente en móvil, limpio) */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {ERAS.map((era) => (
                <button
                  key={era.id}
                  onClick={() => setSelectedEra(era.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedEra === era.id
                      ? 'bg-[#0052FF] text-white shadow-md shadow-blue-500/10'
                      : 'bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 hover:border-[#0052FF]'
                  }`}
                >
                  {era.name}
                </button>
              ))}
            </div>

            {/* Grid de Cartas (Responsive, móvil-first) */}
            {filteredCards.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* Renderizado de cartas e inserción de anuncio publicitario tipo tarjeta cada 4 cartas */}
                {filteredCards.map((card, index) => {
                  const isInList = inquiryList.some(item => item.id === card.id);
                  const isAdPosition = index === 3; // Mostrar publicidad en la 4ta tarjeta para monetización elegante

                  return (
                    <React.Fragment key={card.id}>
                      {isAdPosition && (
                        <GoogleAdSlot format="card" className="col-span-1" />
                      )}
                      
                      <div 
                        className="rounded-2xl border overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-0.5 bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800"
                      >
                        <div 
                          className="relative aspect-[3/4] bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-pointer" 
                          onClick={() => setSelectedCardDetail(card)}
                        >
                          <img 
                            src={card.image} 
                            alt={card.name} 
                            loading="lazy"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain p-3 sm:p-4 transform hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-2 right-2 bg-[#0052FF] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                            {card.condition}
                          </span>
                          <span className="absolute bottom-2 left-2 bg-purple-600/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow uppercase">
                            {card.idioma || 'ES'}
                          </span>
                          {card.is_reverse && (
                            <span className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow uppercase tracking-wide border border-white/20">
                              REVERSE
                            </span>
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
                                  <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                                    ${card.price.toLocaleString('es-CL')} CLP
                                  </span>
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
                              >
                                {isInList ? <Check size={13} className="scale-110" /> : <Plus size={13} className="opacity-60" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 rounded-3xl">
                <HelpCircle size={40} className="mx-auto text-slate-400 mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white">No encontramos cartas</h3>
                <p className="text-xs text-slate-400 mt-1">Prueba cambiando tu búsqueda o seleccionando otra era.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedEra('Todas'); }}
                  className="mt-4 px-4 py-2 bg-[#0052FF] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Restaurar Filtros
                </button>
              </div>
            )}

            {/* Google Adsense en Catálogo */}
            <GoogleAdSlot format="horizontal" className="mt-12" />
          </div>
        )}

        {/* VISTA NOTICIAS */}
        {currentTab === 'news' && (
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
                  <img src={selectedNews.image} alt={selectedNews.title} loading="lazy" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#0052FF] uppercase">{selectedNews.date}</span>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{selectedNews.title}</h1>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-300 leading-relaxed italic border-l-4 border-[#0052FF] pl-4">
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
                <div className="w-full bg-slate-50 dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-800/50 rounded-xl p-4 my-8 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs shadow-inner">
                  <span className="mb-2 uppercase tracking-widest font-bold text-[10px] opacity-70">Publicidad</span>
                  <div className="w-full max-w-[728px] h-[90px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center">
                    Espacio para Google AdSense (728x90)
                  </div>
                </div>
                  
                {selectedNews.isExternal && (
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                      <a 
                        href={selectedNews.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052FF] text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                      >
                        Fuente: {selectedNews.sourceName || 'Página Original'}
                        <ExternalLink size={16} />
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
                <div className="w-full bg-slate-50 dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs shadow-inner">
                  <span className="mb-2 uppercase tracking-widest font-bold text-[10px] opacity-70">Publicidad Patrocinada</span>
                  <div className="w-full max-w-[728px] h-[90px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center">
                    Espacio reservado para banner Google AdSense (Horizontal)
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {visibleNewsList.slice((newsPage - 1) * 6, newsPage * 6).map((n) => (
                    <article 
                      key={n.id} 
                      onClick={() => { setSelectedNews(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="group bg-white dark:bg-[#121824] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                    >
                      <div className="relative h-64 md:h-72 overflow-hidden">
                        <img 
                          src={n.image} 
                          alt={n.title} 
                          loading="lazy"
                          loading="lazy"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
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
                  ))}
                </div>

                {/* Controles de Paginación */}
                {visibleNewsList.length > 0 && (
                  <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => {
                        setNewsPage(p => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={newsPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all cursor-pointer ${
                          newsPage === page 
                            ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/30 scale-110' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
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
                      className="w-10 h-10 flex items-center justify-center rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VISTA TORNEOS */}
        {currentTab === 'tournaments' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-xs font-black text-[#0052FF] uppercase tracking-widest">COMPETICIÓN LOCAL</span>
              <h2 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">Torneos en Concepción</h2>
              <p className="text-xs text-slate-400 mt-1">Únete a nuestra vibrante comunidad local. ¡El meta competitivo te espera!</p>
            </div>

            {/* Grid de Torneos (Responsive, móvil-first) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTournaments.length === 0 && !tournamentsLoading && (
                <p className="text-slate-400 col-span-3 text-center py-8">No hay torneos programados por el momento.</p>
              )}
              {displayTournaments.map((t, idx) => (
                <div 
                  key={t.id}
                  className={`flex flex-col justify-between p-6 rounded-3xl border transition-all hover:shadow-xl bg-white dark:bg-[#121824] ${
                    idx === 1 ? 'border-[#0052FF]/60 dark:border-[#0052FF]/50 relative animate-pulse-subtle' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {idx === 1 && (
                    <span className="absolute -top-3 left-6 bg-[#0052FF] text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      Copa Oficial
                    </span>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#0052FF] flex flex-col items-center justify-center flex-shrink-0 shadow">
                        <span className="text-2xl font-black leading-none">{t.day}</span>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase mt-0.5">{t.month}</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">{t.title}</h4>
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[9px] mt-1">
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-350 border-t border-slate-100 dark:border-slate-800 pt-4">
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-[#0052FF] flex-shrink-0" />
                        <span>Formato: <strong className="text-slate-805 dark:text-slate-100">{t.format}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#0052FF] flex-shrink-0" />
                        <span>Lugar: <strong className="text-slate-805 dark:text-slate-100">{t.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coins size={14} className="text-[#0052FF] flex-shrink-0" />
                        <span>Inscripción: <strong className="text-slate-805 dark:text-slate-100">{t.entry_fee}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info size={14} className="text-[#0052FF] flex-shrink-0" />
                        <span>Hora: <strong className="text-slate-805 dark:text-slate-100">{t.time}</strong></span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={t.registration_link || "https://instagram.com/cardpoint.cl"}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 w-full text-center bg-[#0052FF] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    <span>{t.registration_link ? 'Inscribirse aquí' : 'Inscribirse por Instagram'}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              ))}
            </div>

            {/* Banner Informativo Torneos */}
            <div className="p-6 sm:p-8 rounded-3xl border border-dashed border-[#0052FF]/30 dark:border-[#0052FF]/20 bg-slate-50/50 dark:bg-slate-900/40 text-center max-w-2xl mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-[#0052FF] mx-auto">
                <HelpCircle size={20} />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">¿Primera vez jugando torneos?</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
                No te preocupes. Explicamos las reglas básicas de torneos, cómo armar tu decklist y cómo prepararte. Solo necesitas tu mazo de 60 cartas y muchas ganas de divertirte. Escríbenos si tienes dudas.
              </p>
            </div>
          </div>
        )}

        {/* VISTA BASE DE DATOS / BUSCADOR LIVE API */}
        {currentTab === 'database' && (
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Publicidad Patrocinada antes de resultados de la base de datos */}
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
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{dbError}</p>
                <button
                  onClick={() => fetchDBCards(dbSearch, dbPage)}
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
                    const isAd = idx === 5; // Insertar publicidad en la grilla oficial también

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
                              alt={card.name} 
                              loading="lazy"
                              loading="lazy"
                              className="w-full h-full object-contain p-4 transform hover:scale-105 transition-transform duration-300"
                              loading="lazy"
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
                            
                            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                              <div className="text-left">
                                <span className="block text-[8px] text-slate-450 font-bold uppercase">Referencia</span>
                                <span className="font-extrabold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                                  ${card.price.toLocaleString('es-CL')} CLP
                                </span>
                              </div>
                              <button
                                onClick={() => toggleInquiry(card)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isInList
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                              >
                                {isInList ? <Check size={13} className="scale-110" /> : <Plus size={13} className="opacity-60" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Controles de paginación */}
                <div className="flex items-center justify-center gap-6 pt-4">
                  <button
                    disabled={dbPage === 1}
                    onClick={() => { setDbPage(dbPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2.5 rounded-xl border bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-500 hover:border-emerald-500 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Página {dbPage}</span>
                  <button
                    onClick={() => { setDbPage(dbPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2.5 rounded-xl border bg-white dark:bg-[#121824] border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-500 hover:border-emerald-500 transition-all cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md mx-auto">
                <HelpCircle size={40} className="mx-auto text-slate-400 mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white">Búsqueda Vacía</h3>
                <p className="text-xs text-slate-400 mt-1">Ingresa el nombre de algún Pokémon para obtener resultados en tiempo real.</p>
              </div>
            )}
          </div>
        )}

        {/* VISTA NOSOTROS / COMO COMPRAR */}
        {currentTab === 'how-to-buy' && (
          <div className="space-y-12 max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="text-xs font-black text-[#0052FF] uppercase tracking-widest">NUESTRA TIENDA</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Sobre CardPoint</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Somos un equipo apasionado por el juego de cartas coleccionables Pokémon en Concepción. Nos esforzamos por ofrecer las mejores piezas y un servicio cercano y confiable.
              </p>
            </div>

            {/* Historia y Visión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-[#0052FF]">¿Quiénes Somos?</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Fundada en Concepción, CardPoint.cl nació con el propósito de conectar a los coleccionistas y jugadores competitivos de la región del Biobío con un inventario actualizado y transparente. 
                </p>
                <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
                  Garantizamos que el 100% de nuestras cartas sueltas son auténticas y han sido revisadas meticulosamente bajo estándares Near Mint (NM).
                </p>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-105 dark:bg-slate-950">
                <img 
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop" 
                  alt="Cartas Coleccionables" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            {/* Google Adsense Horizontal en Nosotros */}
            <GoogleAdSlot format="horizontal" />

            {/* Preguntas Frecuentes FAQ */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white text-center">Preguntas Frecuentes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { q: "¿Hacen envíos a todo Chile?", a: "Sí. Realizamos envíos de lunes a viernes a todo el país a través de Starken, Chilexpress o Correos de Chile, por pagar o cancelado previamente. Todo va sumamente protegido." },
                  { q: "¿Dónde hacen entregas presenciales?", a: "Entregamos directamente en Concepción Centro, previa coordinación a través de nuestro Instagram oficial @cardpoint.cl. También en torneos locales." },
                  { q: "¿Las cartas son 100% originales?", a: "Por supuesto. Contamos con amplia reputación. No aceptamos ni comercializamos ninguna carta que no sea oficial de The Pokémon Company." },
                  { q: "¿Cómo funciona la Bolsa de Cotización?", a: "Navegas por la web, agregas las cartas que te interesan y presionas 'Cotizar'. Copiarás un formato de texto directo y nos escribes por Instagram para finalizar el pago por transferencia." }
                ].map((faq, idx) => (
                  <div key={idx} className="p-5 bg-white dark:bg-[#121824] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
                      <HelpCircle size={15} className="text-[#0052FF]" />
                      {faq.q}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Redes y Contacto */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0052FF]/10 to-indigo-500/10 rounded-3xl border border-[#0052FF]/20 text-center space-y-4">
              <h4 className="font-black text-slate-900 dark:text-white text-lg">¿Tienes alguna consulta especial?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Buscamos cartas por encargo o te asesoramos en el armado de tu mazo competitivo. ¡No dudes en escribirnos!
              </p>
              <a
                href="https://instagram.com/cardpoint.cl"
                target="_blank"
                rel="noreferrer"
                className="inline-flex bg-[#0052FF] hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer mx-auto"
              >
                <Instagram size={15} />
                Contactar en @cardpoint.cl
              </a>
            </div>
          </div>
        )}


      </main>

      {/* ==========================================
          MODALES Y DIÁLOGOS FLOTANTES (FULL RESPONSIVE)
      ========================================== */}

      {/* 1. MODAL BOLSA DE COTIZACIÓN */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          {/* Backdrop Close Click */}
          <div className="absolute inset-0" onClick={() => setShowInquiryModal(false)}></div>
          
          <div className="relative w-full sm:max-w-md h-full bg-white dark:bg-[#0f172a] shadow-2xl flex flex-col justify-between z-10 border-l border-slate-100 dark:border-slate-800 animate-slide-in">
            {/* Cabecera */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-[#0052FF]" size={20} />
                <h3 className="font-black text-slate-900 dark:text-white text-base">Bolsa de Cotización</h3>
              </div>
              <button 
                onClick={() => setShowInquiryModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Listado de cartas */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar">
              {inquiryList.length > 0 ? (
                inquiryList.map((card) => (
                  <div key={card.id} className="flex gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-14 rounded bg-slate-100 dark:bg-slate-950 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img src={card.image} alt={card.name} loading="lazy" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{card.name}</h4>
                        <span className="text-[9px] text-[#0052FF] font-medium">{card.set}</span>
                        <span className="block text-[8px] text-slate-400">{card.condition} • {card.idioma || 'ES'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">${card.price.toLocaleString('es-CL')}</span>
                      <button 
                        onClick={() => toggleInquiry(card)}
                        className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-500/5 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag size={36} className="mx-auto text-slate-300" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Tu bolsa está vacía</h4>
                  <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto">Navega por nuestro stock o base de datos y agrega cartas para cotizar.</p>
                </div>
              )}
            </div>

            {/* Pie de bolsa con totales y acciones */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                  <span>Cartas seleccionadas:</span>
                  <span>{inquiryList.length}</span>
                </div>
                <div className="flex items-center justify-between text-slate-900 dark:text-white">
                  <span className="font-black text-sm">Valor Total Estimado:</span>
                  <span className="font-black text-lg text-[#0052FF]">${totalInquiryValue.toLocaleString('es-CL')} CLP</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  disabled={inquiryList.length === 0}
                  onClick={copyInquiryToClipboard}
                  className="w-full bg-[#0052FF] hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10"
                >
                  {copiedText ? (
                    <>
                      <Check size={14} />
                      ¡Lista Copiada al Portapapeles!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copiar Lista para Instagram
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    disabled={inquiryList.length === 0}
                    onClick={openInstagramInquiry}
                    className="w-1/2 py-2.5 border border-pink-500/30 hover:bg-pink-500/5 disabled:opacity-50 text-pink-500 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Instagram size={14} />
                    Ir a Instagram
                  </button>
                  <button
                    disabled={inquiryList.length === 0}
                    onClick={clearInquiryList}
                    className="w-1/2 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-50 text-slate-500 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Vaciar Bolsa
                  </button>
                </div>
              </div>

              <p className="text-[9px] text-slate-400 text-center leading-relaxed">
                *Copia la lista y envíanosla por mensaje directo en Instagram. Confirmaremos stock real y te enviaremos los datos definitivos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL DETALLE DE CARTA */}
      {selectedCardDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          {/* Backdrop Close Click */}
          <div className="absolute inset-0" onClick={() => setSelectedCardDetail(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#121824] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col md:flex-row animate-scale-up max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-y-visible no-scrollbar">
            
            {/* Imagen Izquierda */}
            <div className="md:w-1/2 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <img 
                src={showRealPhoto && selectedCardDetail.real_photo ? selectedCardDetail.real_photo : selectedCardDetail.image} 
                alt={selectedCardDetail.name} 
                loading="lazy"
                onClick={() => setIsImageZoomed(true)}
                className="w-full max-h-[250px] sm:max-h-[300px] md:max-h-[360px] object-contain transform hover:scale-105 transition-transform duration-300 cursor-zoom-in" 
              />
              {/* Toggle button: only show if real_photo exists */}
              {selectedCardDetail.real_photo && (
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
                  <button
                    onClick={() => setShowRealPhoto(false)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      !showRealPhoto ? 'bg-white dark:bg-slate-700 text-[#0052FF] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    🎨 Arte Oficial
                  </button>
                  <button
                    onClick={() => setShowRealPhoto(true)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      showRealPhoto ? 'bg-white dark:bg-slate-700 text-green-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    📸 Foto Real
                  </button>
                </div>
              )}
            </div>

            {/* Detalles Derecha */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="text-[10px] font-black text-[#0052FF] uppercase tracking-wider">{selectedCardDetail.set}</span>
                    <h3 className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight">{selectedCardDetail.name}</h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] text-slate-400">{selectedCardDetail.rarity}</span>
                      {(selectedCardDetail.idioma || selectedCardDetail.language) && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 uppercase">
                          {selectedCardDetail.idioma || selectedCardDetail.language}
                        </span>
                      )}
                      {selectedCardDetail.is_reverse && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 uppercase">
                          ✨ Reverse Holo
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCardDetail(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer flex-shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-slate-100 dark:border-slate-800 py-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Expansión</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-sm leading-tight block">{selectedCardDetail.set || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Número</span>
                    <span className="font-extrabold text-[#0052FF] text-sm uppercase block">
                      {selectedCardDetail.set_code || selectedCardDetail.setCode || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Rareza</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-sm block">{selectedCardDetail.rarity || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Estado</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-sm block">{selectedCardDetail.condition || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Idioma</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-sm block">{selectedCardDetail.idioma || selectedCardDetail.language || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Stock</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-sm block">
                      {selectedCardDetail.stock ?? 1} disponible{(selectedCardDetail.stock ?? 1) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {selectedCardDetail.description ? (
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Descripción</span>
                    <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">{selectedCardDetail.description}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Descripción</span>
                    <p className="text-xs text-slate-400 italic">Sin descripción adicional.</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-end justify-between">
                  <span className="text-xs text-slate-400 font-bold uppercase">Precio CardPoint:</span>
                  <span className="font-black text-2xl text-slate-900 dark:text-white">${selectedCardDetail.price.toLocaleString('es-CL')} CLP</span>
                </div>

                <button
                  onClick={() => {
                    toggleInquiry(selectedCardDetail);
                    setSelectedCardDetail(null);
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                    inquiryList.some(item => item.id === selectedCardDetail.id)
                      ? 'bg-red-500 text-white shadow-red-500/10 hover:bg-red-600'
                      : 'bg-[#0052FF] text-white shadow-blue-500/10 hover:bg-blue-700'
                  }`}
                >
                  {inquiryList.some(item => item.id === selectedCardDetail.id) ? (
                    <>
                      <X size={14} />
                      Quitar de la bolsa
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      Agregar a la bolsa
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom de Imagen */}
      {isImageZoomed && selectedCardDetail && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in cursor-zoom-out"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img 
              src={showRealPhoto && selectedCardDetail.real_photo ? selectedCardDetail.real_photo : selectedCardDetail.image} 
              alt={selectedCardDetail.name}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl select-none animate-scale-up border border-slate-800/50 shadow-2xl"
            />
            <button 
              onClick={() => setIsImageZoomed(false)}
              className="absolute -top-12 right-0 p-2 text-white/85 hover:text-white hover:bg-white/15 rounded-full transition-all cursor-pointer"
              aria-label="Cerrar zoom"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* 3. MODAL DETALLES DE TRANSFERENCIA BANCARIA */}
      {showTransferDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          {/* Backdrop Close Click */}
          <div className="absolute inset-0" onClick={() => setShowTransferDetails(false)}></div>
          
          <div className="relative w-full max-w-md bg-white dark:bg-[#121824] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="text-[#0052FF]" size={20} />
                <h3 className="font-black text-slate-900 dark:text-white text-base">Datos de Transferencia</h3>
              </div>
              <button 
                onClick={() => setShowTransferDetails(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Banco", val: "Banco de Chile" },
                { label: "Tipo de Cuenta", val: "Cuenta Corriente" },
                { label: "Número de Cuenta", val: "123-45678-90" },
                { label: "RUT", val: "12.345.678-9" },
                { label: "Nombre", val: "CardPoint SpA" },
                { label: "Correo Electrónico", val: "pagos@cardpoint.cl" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">{item.label}</span>
                    <span className="font-extrabold text-slate-800 dark:text-white text-xs sm:text-sm">{item.val}</span>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(item.val);
                    }}
                    className="p-2 text-slate-400 hover:text-[#0052FF] rounded-lg hover:bg-[#0052FF]/5 cursor-pointer"
                    title="Copiar dato"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-2xl flex gap-3 text-xs leading-relaxed text-emerald-600 dark:text-emerald-400 items-start">
              <Shield size={18} className="flex-shrink-0 mt-0.5" />
              <p>
                Una vez coordinada la cotización por Instagram, realiza la transferencia e infórmanos enviando el comprobante de pago para procesar tu envío de inmediato.
              </p>
            </div>

            <button
              onClick={() => setShowTransferDetails(false)}
              className="w-full bg-[#0052FF] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className={`border-t py-12 transition-colors ${theme === 'dark' ? 'bg-[#0a0d14] border-slate-900 text-slate-400' : 'bg-[#f8fafc] border-slate-100 text-slate-500'} text-xs pb-24 md:pb-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <CardpointLogo className="scale-75 origin-left" showText={false} />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">CardPoint.cl</p>
              <p className="text-[10px] text-slate-400">© 2026 Cardpoint. Todos los derechos reservados.</p>
              <p className="text-[9px] text-slate-500 mt-0.5">hecho por 🐱</p>
            </div>
          </div>

          <div className="flex gap-6 font-bold text-slate-650 dark:text-slate-300">
            <button onClick={() => { setCurrentTab('home'); setSelectedNews(null); }} className="hover:text-[#0052FF] cursor-pointer">Inicio</button>
            <button onClick={() => { setCurrentTab('catalog'); setSelectedNews(null); }} className="hover:text-[#0052FF] cursor-pointer">En Stock</button>
            <button onClick={() => { setCurrentTab('how-to-buy'); setSelectedNews(null); }} className="hover:text-[#0052FF] cursor-pointer">Nosotros</button>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-[#0052FF]" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Concepción, Chile</span>
          </div>
        </div>
      </footer>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 p-3 rounded-full bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/30 hover:bg-blue-600 hover:-translate-y-1 hover:scale-110 transition-all duration-300 animate-fade-in`}
          aria-label="Volver arriba"
        >
          <ChevronUp size={24} />
        </button>
      )}

    </div>
  );
}
