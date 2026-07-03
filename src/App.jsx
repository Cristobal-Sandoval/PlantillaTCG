// MiTienda v1.0.2 - Vercel Rebuild Trigger
import React, { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCards } from './hooks/useCards';
import { useNews } from './hooks/useNews';
import { useTournaments } from './hooks/useTournaments';
import { useAutoNews } from './hooks/useAutoNews';
import { useAdmin } from './hooks/useAdmin';
import { HERO_BANNERS } from './constants/banners';
import { 
  ShoppingBag, 
  X,
  Copy,
  Check,
  Plus,
  Sun,
  Moon,
  ExternalLink,
  ChevronUp,
  Building,
  Shield,
  Layers,
  Sparkles,
  BookOpen,
  MapPin
} from 'lucide-react';

import StoreLogo from './components/StoreLogo';
import LeagueBadge from './components/LeagueBadge';
import GoogleAdSlot from './components/GoogleAdSlot';

// Carga perezosa de vistas públicas de MiTienda
const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Tournaments = lazy(() => import('./pages/Tournaments'));
const HowToBuy = lazy(() => import('./pages/HowToBuy'));

// Helper para parsear fechas de noticias (soportando formatos ISO y texto en español "26 de junio de 2026")
const parseNewsDate = (dateStr) => {
  if (!dateStr) return 0;
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return parsed;
  const clean = dateStr.toLowerCase().replace(/\bde\b/g, '').replace(/\s+/g, ' ').trim();
  const months = {
    'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
    'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
    'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12',
    'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05', 'jun': '06',
    'jul': '07', 'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12'
  };
  const match = clean.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const monthNum = months[match[2]];
    const year = match[3];
    if (monthNum) {
      const parsedIso = Date.parse(`${year}-${monthNum}-${day}T12:00:00`);
      if (!isNaN(parsedIso)) return parsedIso;
    }
  }
  return 0;
};

// SVG de Icono de Instagram
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

// Rarezas y prioridades de ordenamiento
const RARITIES = [
  { id: 'Todas', name: 'Todas' },
  { id: 'Común', name: 'Común' },
  { id: 'Poco Común', name: 'Poco Común' },
  { id: 'Rara', name: 'Rara' },
  { id: 'Doble Rara', name: 'Doble Rara' },
  { id: 'Ultra Rara', name: 'Ultra Rara' },
  { id: 'Ilustración Rara', name: 'Ilustración Rara' },
  { id: 'Especial Ilustración Rara', name: 'Especial Ilustración Rara' },
  { id: 'Ultra Rara Secreta', name: 'Ultra Rara Secreta' },
  { id: 'Secreta Dorada', name: 'Secreta Dorada' },
  { id: 'Hyper Rara', name: 'Hyper Rara' }
];

const normalizeRarityText = (str) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

const RARITY_PRIORITY = {
  'hyper rara': 1,
  'secreta dorada': 2,
  'ultra rara secreta': 3,
  'especial ilustracion rara': 4,
  'ilustracion rara': 5,
  'ultra rara': 6,
  'rara': 7,
  'doble rara': 8,
  'poco comun': 9,
  'comun': 10
};

// Tarjetas de marcador de posición (Fallback)
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
  }
];

// Hook de Debounce
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

// Hook de SEO Dinámico Avanzado (Título, descripciones, OpenGraph, Twitter y Canonical en DOM)
function useSEO(title, description, image = '') {
  useEffect(() => {
    document.title = title;
    
    const setMetaName = (name, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (el) {
        el.setAttribute('content', value);
      } else {
        el = document.createElement('meta');
        el.name = name;
        el.content = value;
        document.head.appendChild(el);
      }
    };

    const setMetaProperty = (property, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (el) {
        el.setAttribute('content', value);
      } else {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        el.content = value;
        document.head.appendChild(el);
      }
    };

    setMetaName('description', description);
    
    // OpenGraph
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:image', image || 'https://tudominio.cl/og-image.png');

    // Twitter Cards
    setMetaProperty('twitter:title', title);
    setMetaProperty('twitter:description', description);
    setMetaProperty('twitter:image', image || 'https://tudominio.cl/og-image.png');

    // Enlace Canónico Dinámico
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.href);

  }, [title, description, image]);
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Derive currentTab from URL path
  const path = location.pathname.replace('/', '');
  const currentTab = path === '' ? 'home' : path;

  // Navegador interno
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

  const catalogCards = dbCards;

  // Carousel uses DB cards sorted by rarity priority
  const carouselSource = useMemo(() => {
    const rawSource = dbCards.length > 0 ? dbCards : PLACEHOLDER_CARDS;
    const sorted = [...rawSource].sort((a, b) => {
      const normA = normalizeRarityText(a.rarity);
      const normB = normalizeRarityText(b.rarity);
      
      const pA = RARITY_PRIORITY[normA] || 99;
      const pB = RARITY_PRIORITY[normB] || 99;

      if (pA !== pB) return pA - pB;
      return (b.price || 0) - (a.price || 0);
    });
    return sorted.slice(0, 15);
  }, [dbCards]);
  
  // Search & Catalog Filter States (Stock)
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); 
  const [selectedRarity, setSelectedRarity] = useState('Todas');
  const [sortBy, setSortBy] = useState('default');
  const [cardPage, setCardPage] = useState(1);

  // Refs to control scrolling to catalog grid on page changes
  const catalogHeaderRef = useRef(null);
  const prevPageRef = useRef(1);
  const prevTabRef = useRef(currentTab);

  // Scroll to catalog grid when changing page
  useEffect(() => {
    const tabChanged = currentTab !== prevTabRef.current;
    if (currentTab === 'catalog' && cardPage !== prevPageRef.current && !tabChanged) {
      catalogHeaderRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevPageRef.current = cardPage;
    prevTabRef.current = currentTab;
  }, [cardPage, currentTab]);

  // Memoized visible rarities based on existing cards in stock
  const visibleRarities = useMemo(() => {
    if (dbCards.length === 0) return RARITIES;
    const existingNormalized = new Set(
      dbCards.map(c => normalizeRarityText(c.rarity)).filter(Boolean)
    );
    return RARITIES.filter(rarity => {
      if (rarity.id === 'Todas') return true;
      return existingNormalized.has(normalizeRarityText(rarity.id));
    });
  }, [dbCards]);

  // Reset page when search/filters change
  useEffect(() => {
    setCardPage(1);
  }, [debouncedSearchQuery, selectedRarity, sortBy]);

  // Sistema de Noticias
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsPage, setNewsPage] = useState(1);
  const [loadingFullContent, setLoadingFullContent] = useState(false);

  // Panel de Control Settings
  const { adminSettings, updateSetting } = useAdmin();
  const { autoNews, loadingAuto } = useAutoNews(adminSettings.news_sources);
  
  const hiddenNewsIds = adminSettings.hidden_news || [];
  const pinnedNewsIds = adminSettings.pinned_news || [];
  const localTournaments = adminSettings.tournaments_override || [];
  const customBanners = adminSettings.custom_banners || [];
  const rawSponsoredAd = adminSettings.sponsored_ad;
  const sponsoredAds = Array.isArray(rawSponsoredAd) ? rawSponsoredAd : (rawSponsoredAd ? [rawSponsoredAd] : []);
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

  // Carga dinámica diferida de Google AdSense (Deshabilitado temporalmente a petición del usuario)
  /*
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      const scriptId = 'google-adsense-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2882896493327968";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  */

  useEffect(() => {
    if (activeAds.length <= 1) return;
    const duration = isMobile ? 24000 : 30000;
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % activeAds.length);
    }, duration);
    return () => clearInterval(interval);
  }, [activeAds.length, isMobile]);

  const currentAd = activeAds[currentAdIndex] || null;

  // Carga diferida de noticia completa
  useEffect(() => {
    if (!selectedNews || !selectedNews.isExternal || selectedNews.hasFullContent) {
      return;
    }

    let isMounted = true;
    const fetchFullContent = async () => {
      setLoadingFullContent(true);
      try {
        const PROXIES = [
          (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
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
                const clone = el.cloneNode(true);

                // Si es Noticias TCG, removemos enlaces a instagram o menciones
                if (selectedNews.sourceName === 'Noticias TCG') {
                  const links = clone.querySelectorAll('a');
                  links.forEach(a => {
                    const href = a.getAttribute('href') || '';
                    const aText = a.textContent || '';
                    if (
                      href.includes('instagram.com/tcgnews') ||
                      href.includes('instagram.com/tcgnews.cl') ||
                      aText.includes('@tcgnews.cl') ||
                      aText.includes('tcgnews.cl')
                    ) {
                      a.remove();
                    }
                  });
                }

                let text = clone.textContent?.trim() || '';

                if (selectedNews.sourceName === 'Noticias TCG') {
                  const lowerText = text.toLowerCase();
                  if (lowerText.includes('@tcgnews.cl') || lowerText.includes('instagram.com/tcgnews')) {
                    if (text.length < 60 || lowerText.includes('síguenos') || lowerText.includes('siguenos') || lowerText.includes('redes sociales')) {
                      return null;
                    }
                    text = text
                      .replace(/@tcgnews\.cl/gi, '')
                      .replace(/tcgnews\.cl/gi, '')
                      .replace(/\s+/g, ' ')
                      .trim();
                  }
                }

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

  // Filtrado de noticias visibles
  const visibleNewsList = useMemo(() => {
    const filtered = newsList.filter(n => !hiddenNewsIds.includes(n.id));
    return filtered.sort((a, b) => {
      const aPinned = pinnedNewsIds.includes(a.id);
      const bPinned = pinnedNewsIds.includes(b.id);
      
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      
      const timeA = a.created_at ? new Date(a.created_at).getTime() : parseNewsDate(a.date);
      const timeB = b.created_at ? new Date(b.created_at).getTime() : parseNewsDate(b.date);
      return timeB - timeA;
    });
  }, [newsList, hiddenNewsIds, pinnedNewsIds]);

  const displayTournaments = useMemo(() => {
    const MONTHS = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const baseTournaments = dbTournaments.map(t => {
      const local = localTournaments.find(lt => lt.id === t.id);
      return local ? { ...t, ...local } : t;
    });

    let list = [];
    baseTournaments.forEach(t => {
      if (t.is_recurring) {
        const weekDaysMap = {
          'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3, 'jueves': 4,
          'viernes': 5, 'sábado': 6, 'sabado': 6, 'domingo': 0
        };
        const targetDays = (t.recurring_days || '').toLowerCase().split(',').map(d => d.trim());
        const targetDOWs = targetDays.map(d => weekDaysMap[d]).filter(d => d !== undefined);
        
        for (let i = 0; i < 30; i++) {
          const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
          const dow = date.getDay();
          
          if (targetDOWs.includes(dow)) {
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
            break;
          }
        }
      } else {
        let tDate = null;
        if (t.specific_date) {
          tDate = new Date(t.specific_date + 'T23:59:59');
        } else if (t.day && t.month) {
          const monthIndex = MONTHS.indexOf(t.month.toUpperCase());
          if (monthIndex !== -1) {
            tDate = new Date(now.getFullYear(), monthIndex, parseInt(t.day, 10), 23, 59, 59);
            if (tDate.getTime() < todayStart) {
              tDate.setFullYear(now.getFullYear() + 1);
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
    
    list.sort((a, b) => a.dateTime - b.dateTime);
    return list;
  }, [dbTournaments, localTournaments]);

  const homepageTournaments = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const threeDaysLimit = todayStart + 3 * 24 * 60 * 60 * 1000;
    
    const withinThreeDays = displayTournaments.filter(t => t.dateTime <= threeDaysLimit + 24 * 60 * 60 * 1000);

    if (withinThreeDays.length < 3) {
      return displayTournaments.slice(0, 3);
    }
    return withinThreeDays.slice(0, 4);
  }, [displayTournaments]);

  // SEO y Metadatos Dinámicos
  let pageTitle = "MiTienda | Tienda de Singles TCG";
  let pageDesc = "Tienda especializada en compra y venta de cartas sueltas de Pokémon TCG en Concepción, Chile.";
  let pageImage = "";
  
  switch(currentTab) {
    case 'catalog':
      pageTitle = "Catálogo de Cartas | MiTienda";
      pageDesc = "Revisa nuestro stock real actualizado de cartas Pokémon TCG. Singles, full arts y cartas raras listas para envío a todo Chile.";
      break;
    case 'news':
      pageTitle = "Noticias TCG | MiTienda";
      if (selectedNews) {
        pageTitle = `${selectedNews.title} | MiTienda`;
        pageDesc = selectedNews.summary;
        pageImage = selectedNews.image;
      } else {
        pageDesc = "Entérate de las últimas novedades, aperturas y noticias de la comunidad Pokémon TCG.";
      }
      break;
    case 'tournaments':
      pageTitle = "Torneos Locales | MiTienda";
      pageDesc = "Inscríbete en nuestros próximos torneos de Pokémon TCG en Concepción. Próximos eventos y fechas.";
      break;
    case 'database':
      pageTitle = "Base de Datos Pokémon | MiTienda";
      pageDesc = "Busca cartas en la base de datos oficial de Pokémon TCG. Consulta precios de mercado y disponibilidad.";
      break;
    case 'how-to-buy':
      pageTitle = "¿Cómo Comprar? | MiTienda";
      pageDesc = "Aprende cómo comprar tus cartas de forma segura. Métodos de pago y envíos mediante Starken a todo Chile.";
      break;
  }
  
  useSEO(pageTitle, pageDesc, pageImage);

  // Estados de Base de Datos Pokémon TCG
  const [dbSearch, setDbSearch] = useState('Pikachu');
  const [dbCardsList, setDbCardsList] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [dbPage, setDbPage] = useState(1);
  const [lastFetchedQuery, setLastFetchedQuery] = useState('');
  const [lastFetchedPage, setLastFetchedPage] = useState(1);
  const dbCacheRef = useRef({}); // Caché para búsquedas oficiales de la API


  // Bolsa de Cotización / Modales
  const [inquiryList, setInquiryList] = useState([]);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showTransferDetails, setShowTransferDetails] = useState(false);
  const [selectedCardDetail, setSelectedCardDetail] = useState(null);
  const [showRealPhoto, setShowRealPhoto] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Cupones de descuento
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // UI/UX Loader state for card detail image loading
  const [modalImageLoading, setModalImageLoading] = useState(true);

  // Triggers image loading spinner on card detail or view toggles
  useEffect(() => {
    setModalImageLoading(true);
  }, [selectedCardDetail, showRealPhoto]);

  useEffect(() => {
    if (!newsLoading) {
      setNewsList([...dbNews, ...autoNews]);
    }
  }, [dbNews, autoNews, newsLoading]);

  useEffect(() => {
    setIsImageZoomed(false);
  }, [selectedCardDetail]);

  useEffect(() => {
    if (currentTab !== 'news') {
      setSelectedNews(null);
    }
    setSelectedCardDetail(null);
  }, [currentTab]);

  // Sincronizar noticia seleccionada con el parámetro "id" de la URL (Deep linking)
  useEffect(() => {
    if (currentTab === 'news') {
      const queryParams = new URLSearchParams(location.search);
      const idFromUrl = queryParams.get('id');
      
      if (idFromUrl) {
        if (newsList.length > 0) {
          const found = newsList.find(n => n.id === idFromUrl);
          if (found) {
            if (!selectedNews || selectedNews.id !== found.id) {
              setSelectedNews(found);
            }
          } else if (!newsLoading) {
            // Si el id no existe en la lista cargada, limpiar la URL
            navigate('/news', { replace: true });
          }
        }
      } else {
        if (selectedNews) {
          setSelectedNews(null);
        }
      }
    }
  }, [location.search, currentTab, newsList, newsLoading]);

  // Manejador para actualizar la URL al seleccionar una noticia
  const handleSetSelectedNews = (n) => {
    setSelectedNews(n);
    if (n) {
      navigate(`/news?id=${n.id}`);
    } else {
      if (location.pathname.startsWith('/news')) {
        navigate('/news');
      }
    }
  };

  // Generar URL de TCGPlayer con tracking de afiliados de Impact
  const getTcgPlayerUrl = (card) => {
    if (!card) return '';
    const query = `${card.name} ${card.set || ''}`.trim();
    const encodedQuery = encodeURIComponent(query);
    // Cambiar por tu ID de afiliado de Impact cuando sea aprobada
    const affiliateId = 'YOUR_AFFILIATE_ID_HERE';
    
    const targetUrl = `https://www.tcgplayer.com/search/pokemon/product?q=${encodedQuery}&utm_campaign=affiliate&utm_medium=mitienda&utm_source=impact`;
    
    if (affiliateId && affiliateId !== 'YOUR_AFFILIATE_ID_HERE') {
      return `https://tcgplayer.pxf.io/c/${affiliateId}/subID/marketplace?u=${encodeURIComponent(targetUrl)}`;
    }
    return targetUrl;
  };

  const detailStockItem = useMemo(() => {
    if (!selectedCardDetail) return null;
    const isApiCard = typeof selectedCardDetail.id === 'string' && isNaN(Number(selectedCardDetail.id));
    if (!isApiCard) return selectedCardDetail;
    return dbCards.find(sc => 
      sc.in_stock && 
      (sc.stock ?? 0) > 0 && 
      sc.name.trim().toLowerCase() === selectedCardDetail.name.trim().toLowerCase()
    );
  }, [selectedCardDetail, dbCards]);

  const carruselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hero slideshow auto-avance
  const [heroBannerIdx, setHeroBannerIdx] = useState(0);

  const carouselCards = useMemo(() => {
    return [...carouselSource, ...carouselSource, ...carouselSource];
  }, [carouselSource]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Carga dinámica de Microsoft Clarity
  useEffect(() => {
    const clarityId = adminSettings.clarity_id;
    if (!clarityId || clarityId === 'YOUR_CLARITY_ID_HERE') return;

    const scriptId = 'microsoft-clarity-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `;
      document.head.appendChild(script);
    }
  }, [adminSettings.clarity_id]);

  // Carga dinámica de Google Tag Manager (GTM)
  useEffect(() => {
    const gtmId = adminSettings.gtm_id;
    if (!gtmId || gtmId === 'YOUR_GTM_ID_HERE') return;

    const scriptId = 'google-tag-manager-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      document.head.appendChild(script);

      // Elemento iframe noscript al inicio del body
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
      document.body.insertBefore(noscript, document.body.firstChild);
    }
  }, [adminSettings.gtm_id]);

  // Carga dinámica de Meta Pixel (Facebook Ads)
  useEffect(() => {
    const pixelId = adminSettings.pixel_id;
    if (!pixelId || pixelId === 'YOUR_PIXEL_ID_HERE') return;

    const scriptId = 'meta-pixel-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);

      const noscript = document.createElement('noscript');
      noscript.innerHTML = `
        <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />
      `;
      document.body.appendChild(noscript);
    }
  }, [adminSettings.pixel_id]);

  const activeBanners = useMemo(() => {
    const activeCustom = customBanners.filter(b => b.active !== false);
    return activeCustom.length > 0 ? activeCustom : HERO_BANNERS;
  }, [customBanners]);

  useEffect(() => {
    if (currentTab !== 'home') return;
    const interval = setInterval(() => {
      setHeroBannerIdx(prev => (prev + 1) % activeBanners.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [currentTab, activeBanners.length]);

  const goBanner = (idx) => {
    setHeroBannerIdx(idx);
  };

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

  const fetchDBCards = async (query, page = 1, retryCount = 0) => {
    if (!query.trim()) return;
    const cacheKey = `${query.trim().toLowerCase()}-${page}`;
    
    // Si ya existe en caché, usar los datos guardados sin disparar llamada a red
    if (dbCacheRef.current[cacheKey]) {
      setDbCardsList(dbCacheRef.current[cacheKey]);
      setDbLoading(false);
      setDbError(null);
      return;
    }

    setDbLoading(true);
    setDbError(null);
    try {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=name:"*${query.trim()}*"&page=${page}&pageSize=16`
      );
      if (!response.ok) {
        if (response.status === 429 && retryCount < 1) {
          await new Promise(r => setTimeout(r, 1500));
          return fetchDBCards(query, page, retryCount + 1);
        }
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
      
      // Guardar en la caché
      dbCacheRef.current[cacheKey] = formatted;
      setDbCardsList(formatted);
    } catch (err) {
      if (retryCount < 1) {
        await new Promise(r => setTimeout(r, 1500));
        return fetchDBCards(query, page, retryCount + 1);
      }
      setDbError("Parece que hay un micro-corte de conexión con la base de datos de Pokémon Company. Por favor, pulsa 'Reintentar Búsqueda' en unos segundos.");
    } finally {
      setDbLoading(false);
    }
  };

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

  const handleApplyCoupon = (code) => {
    const cleanCode = code.toUpperCase().trim();
    if (!cleanCode) {
      setAppliedCoupon(null);
      setCouponError('');
      return;
    }
    
    const dbCoupons = adminSettings.coupons || [];
    const found = dbCoupons.find(c => c.active && c.code.toUpperCase() === cleanCode);
    
    if (found) {
      setAppliedCoupon({
        code: found.code,
        discount: Number(found.discount) / 100
      });
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError('Cupón inválido o inactivo');
    }
  };

  const copyInquiryToClipboard = () => {
    const listText = inquiryList.map(card => {
      const activePrice = card.is_offer && card.offer_price ? card.offer_price : card.price;
      return `- ${card.name} (${card.condition}) - $${activePrice.toLocaleString('es-CL')} CLP`;
    }).join('\n');
    const total = inquiryList.reduce((acc, curr) => acc + (curr.is_offer && curr.offer_price ? curr.offer_price : curr.price), 0);
    
    let message = '';
    if (appliedCoupon) {
      const discountAmount = Math.round(total * appliedCoupon.discount);
      const finalTotal = total - discountAmount;
      message = `¡Hola MiTienda! Me interesan las siguientes cartas que vi en su catálogo web:\n\n${listText}\n\nTotal bruto: $${total.toLocaleString('es-CL')} CLP\nCupón aplicado: ${appliedCoupon.code} (-${appliedCoupon.discount * 100}%)\nTotal con descuento: $${finalTotal.toLocaleString('es-CL')} CLP\n\n¿Me confirman disponibilidad para coordinar transferencia?`;
    } else {
      message = `¡Hola MiTienda! Me interesan las siguientes cartas que vi en su catálogo web:\n\n${listText}\n\nTotal estimado: $${total.toLocaleString('es-CL')} CLP\n\n¿Me confirman disponibilidad para coordinar transferencia?`;
    }
    
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
    window.open(`https://instagram.com/tudominio.cl`, '_blank');
  };

  const filteredCards = useMemo(() => {
    return catalogCards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
                            card.set.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesRarity = selectedRarity === 'Todas' || (card.rarity && card.rarity.trim().toLowerCase() === selectedRarity.trim().toLowerCase());
      return matchesSearch && matchesRarity;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      
      const normA = normalizeRarityText(a.rarity);
      const normB = normalizeRarityText(b.rarity);
      const pA = RARITY_PRIORITY[normA] || 99;
      const pB = RARITY_PRIORITY[normB] || 99;
      
      if (pA !== pB) return pA - pB;
      
      const priceDiff = (b.price || 0) - (a.price || 0);
      if (priceDiff !== 0) return priceDiff;
      
      return a.name.localeCompare(b.name);
    });
  }, [catalogCards, debouncedSearchQuery, selectedRarity, sortBy]);

  const cardsPerPage = 12;
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  
  const paginatedCards = useMemo(() => {
    const start = (cardPage - 1) * cardsPerPage;
    return filteredCards.slice(start, start + cardsPerPage);
  }, [filteredCards, cardPage]);

  const totalInquiryValue = inquiryList.reduce((sum, item) => sum + (item.is_offer && item.offer_price ? item.offer_price : item.price), 0);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 font-sans theme-transition ${theme === 'dark' ? 'bg-[#0a0d14] text-[#f1f5f9]' : 'bg-[#fafbfe] text-[#1e293b]'}`}>
      
      {/* 0. ESPACIO DE GOOGLE ADSENSE SUPERIOR BANNER */}
      {currentAd && (
        <div
          key={currentAdIndex}
          className="w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center"
          style={{ height: '34px' }}
        >
          <span className="hidden md:flex flex-shrink-0 pl-4 pr-3 text-[8px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">
            Anuncio Patrocinado
          </span>

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
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentTab('home'); setSelectedRarity('Todas'); setSelectedNews(null); }}>
              <StoreLogo className="scale-90 origin-left" showText={true} />
            </div>

            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 font-bold text-xs uppercase tracking-wider">
              {[
                { id: 'home', label: 'Inicio' },
                { id: 'catalog', label: 'En Stock' },
                { id: 'tournaments', label: 'Torneos' }
              ].map((item) => {
                const isActive = currentTab === item.id && !selectedNews;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setSelectedNews(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3 py-2 rounded-xl transition-all duration-205 flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'text-[#0052FF] font-black bg-[#0052FF]/10' 
                        : 'text-slate-605 dark:text-slate-300 hover:text-[#0052FF] dark:hover:text-[#0052FF]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Acciones de Cabecera */}
            <div className="flex items-center gap-2 sm:gap-3">


              {/* Tema Oscuro / Claro */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  theme === 'dark' 
                    ? 'border-slate-800 bg-slate-900 text-yellow-400' 
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Cotizar bag */}
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

      {/* NAVEGACIÓN COMPACTA MÓVIL */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-45 border-t flex justify-around items-center px-2 py-3 transition-colors ${theme === 'dark' ? 'bg-[#0f172a]/95 border-slate-800' : 'bg-white/95 border-slate-100'} backdrop-blur-md shadow-lg`}>
        {[
          { id: 'home', label: 'Inicio', icon: Sparkles },
          { id: 'catalog', label: 'Stock', icon: Layers },
          { id: 'tournaments', label: 'Torneos', icon: MapPin }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setSelectedNews(null);
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
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16 md:mb-0">
        
        {/* Renderizado de Páginas modulares cargadas con Suspense */}
        <Suspense fallback={
          <div className="py-32 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-450 font-bold tracking-wide animate-pulse">Cargando contenido premium...</p>
          </div>
        }>
          {currentTab === 'home' && !selectedNews && (
            <Home 
              theme={theme}
              dbCards={dbCards}
              cardsLoading={cardsLoading}
              dbNews={dbNews}
              newsLoading={newsLoading}
              dbTournaments={dbTournaments}
              tournamentsLoading={tournamentsLoading}
              inquiryList={inquiryList}
              toggleInquiry={toggleInquiry}
              setSelectedCardDetail={setSelectedCardDetail}
              setShowRealPhoto={setShowRealPhoto}
              visibleNewsList={visibleNewsList}
              displayTournaments={displayTournaments}
              homepageTournaments={homepageTournaments}
              activeBanners={activeBanners}
              heroBannerIdx={heroBannerIdx}
              setHeroBannerIdx={setHeroBannerIdx}
              goBanner={goBanner}
              carruselRef={carruselRef}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              carouselCards={carouselCards}
              setCurrentTab={setCurrentTab}
              setSelectedNews={handleSetSelectedNews}
            />
          )}

          {currentTab === 'catalog' && (
            <Catalog 
              theme={theme}
              catalogCards={catalogCards}
              cardsLoading={cardsLoading}
              inquiryList={inquiryList}
              toggleInquiry={toggleInquiry}
              setSelectedCardDetail={setSelectedCardDetail}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              debouncedSearchQuery={debouncedSearchQuery}
              selectedRarity={selectedRarity}
              setSelectedRarity={setSelectedRarity}
              sortBy={sortBy}
              setSortBy={setSortBy}
              cardPage={cardPage}
              setCardPage={setCardPage}
              catalogHeaderRef={catalogHeaderRef}
              visibleRarities={visibleRarities}
              filteredCards={filteredCards}
              totalPages={totalPages}
              paginatedCards={paginatedCards}
            />
          )}


          {currentTab === 'tournaments' && (
            <Tournaments 
              theme={theme}
              tournamentsLoading={tournamentsLoading}
              displayTournaments={displayTournaments}
            />
          )}


          {currentTab === 'how-to-buy' && (
            <HowToBuy theme={theme} />
          )}
        </Suspense>

      </main>

      {/* ==========================================
          MODALES Y DIÁLOGOS FLOTANTES
      ========================================== */}

      {/* 1. MODAL BOLSA DE COTIZACIÓN */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
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

            {/* Listado */}
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
                      <span className="font-bold text-xs text-slate-900 dark:text-white">${(card.is_offer && card.offer_price ? card.offer_price : card.price).toLocaleString('es-CL')}</span>
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

            {/* Acciones */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
              {/* Cupón de Descuento */}
              {inquiryList.length > 0 && (
                <div className="border-b border-slate-200/40 dark:border-slate-800/40 pb-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                    <span>Cupón de Descuento:</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ingresar código de cupón..."
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-grow px-3 py-1.5 text-xs rounded-xl border bg-white dark:bg-[#0c0e16] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#0052FF] uppercase"
                    />
                    <button
                      onClick={() => handleApplyCoupon(couponInput)}
                      className="px-3.5 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black">
                        ✓ {appliedCoupon.code} aplicado (-{appliedCoupon.discount * 100}%)
                      </span>
                      <button 
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponInput('');
                          setCouponError('');
                        }}
                        className="text-emerald-600 dark:text-emerald-400 hover:text-red-500 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>Cartas seleccionadas:</span>
                  <span>{inquiryList.length}</span>
                </div>
                {appliedCoupon ? (
                  <>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                      <span>Subtotal bruto:</span>
                      <span>${totalInquiryValue.toLocaleString('es-CL')} CLP</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#0052FF] font-bold uppercase">
                      <span>Descuento ({appliedCoupon.discount * 100}%):</span>
                      <span>-${Math.round(totalInquiryValue * appliedCoupon.discount).toLocaleString('es-CL')} CLP</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-900 dark:text-white pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-800">
                      <span className="font-black text-sm">Valor Total Estimado:</span>
                      <span className="font-black text-lg text-[#0052FF]">${(totalInquiryValue - Math.round(totalInquiryValue * appliedCoupon.discount)).toLocaleString('es-CL')} CLP</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between text-slate-900 dark:text-white">
                    <span className="font-black text-sm">Valor Total Estimado:</span>
                    <span className="font-black text-lg text-[#0052FF]">${totalInquiryValue.toLocaleString('es-CL')} CLP</span>
                  </div>
                )}
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
                      Copiar Lista de Pedido
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    disabled={inquiryList.length === 0}
                    onClick={clearInquiryList}
                    className="w-full py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-50 text-slate-500 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Vaciar Bolsa
                  </button>
                </div>
              </div>

              <p className="text-[9px] text-slate-400 text-center leading-relaxed">
                *Copia la lista y envíanosla por nuestro medio de contacto preferido para coordinar el pago y envío.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL DETALLE DE CARTA */}
      {selectedCardDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedCardDetail(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#121824] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col md:flex-row animate-scale-up max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-y-visible no-scrollbar">
            
            {/* Imagen Izquierda con Spinner de Carga de UX */}
            <div className="relative md:w-1/2 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              {selectedCardDetail.is_league && (
                <LeagueBadge className="absolute top-4 left-4" />
              )}
              
              <div className="relative w-full flex items-center justify-center min-h-[250px] sm:min-h-[300px] md:min-h-[360px]">
                {modalImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-xs z-10 rounded-2xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0052FF] border-t-transparent"></div>
                  </div>
                )}
                <img 
                  src={showRealPhoto && selectedCardDetail.real_photo ? selectedCardDetail.real_photo : selectedCardDetail.image} 
                  alt={`Detalle de carta Pokémon: ${selectedCardDetail.name} - Rarity: ${selectedCardDetail.rarity}`} 
                  loading="lazy"
                  onLoad={() => setModalImageLoading(false)}
                  onClick={() => setIsImageZoomed(true)}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.pokemontcg.io/cardback.png"; }}
                  className="w-full max-h-[250px] sm:max-h-[300px] md:max-h-[360px] object-contain transform hover:scale-105 transition-transform duration-300 cursor-zoom-in" 
                />
              </div>

              {/* Toggles de foto real */}
              {selectedCardDetail.real_photo && (
                <div className="flex items-center gap-1 bg-slate-105 dark:bg-slate-900 rounded-xl p-1">
                  <button
                    onClick={() => setShowRealPhoto(false)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      !showRealPhoto ? 'bg-white dark:bg-slate-700 text-[#0052FF] shadow-sm' : 'text-slate-405 hover:text-slate-600'
                    }`}
                  >
                    🎨 Arte Oficial
                  </button>
                  <button
                    onClick={() => setShowRealPhoto(true)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      showRealPhoto ? 'bg-white dark:bg-slate-700 text-green-500 shadow-sm' : 'text-slate-405 hover:text-slate-600'
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
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-505/30 uppercase">
                          {selectedCardDetail.idioma || selectedCardDetail.language}
                        </span>
                      )}
                      {selectedCardDetail.is_reverse && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-505/30 uppercase">
                          ✨ Reverse Holo
                        </span>
                      )}
                      {selectedCardDetail.is_league && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-505/30 uppercase flex items-center gap-1">
                          🏆 De Liga
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

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Descripción</span>
                  <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed">
                    {selectedCardDetail.description || "Sin descripción adicional."}
                  </p>
                </div>
              </div>

              {!detailStockItem ? (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-3 py-2">
                  <div>
                    <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800/85 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                      Solo catálogo de referencia
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-550 leading-normal px-4">
                    Esta carta no está disponible actualmente en nuestro stock para cotización.
                  </p>
                  
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-end justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase">Precio MiTienda:</span>
                    {detailStockItem.is_offer && detailStockItem.offer_price ? (
                      <div className="text-right">
                        <span className="text-xs text-slate-400 line-through block leading-tight">
                          ${detailStockItem.price.toLocaleString('es-CL')} CLP
                        </span>
                        <span className="font-black text-2xl text-red-550 block leading-tight">
                          ${detailStockItem.offer_price.toLocaleString('es-CL')} CLP
                        </span>
                      </div>
                    ) : (
                      <span className="font-black text-2xl text-slate-900 dark:text-white">
                        ${detailStockItem.price.toLocaleString('es-CL')} CLP
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      toggleInquiry(selectedCardDetail);
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

                  {inquiryList.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCardDetail(null);
                        setShowInquiryModal(true);
                      }}
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <ShoppingBag size={14} />
                      Ver bolsa de cotización ({inquiryList.length})
                    </button>
                  )}

                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom con Transición Suave */}
      {isImageZoomed && selectedCardDetail && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in cursor-zoom-out"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img 
              src={showRealPhoto && selectedCardDetail.real_photo ? selectedCardDetail.real_photo : selectedCardDetail.image} 
              alt={`Imagen ampliada de ${selectedCardDetail.name}`}
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
                { label: "Nombre", val: "MiTienda SpA" },
                { label: "Correo Electrónico", val: "pagos@tudominio.cl" }
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
                Una vez coordinada la cotización, realiza la transferencia e infórmanos enviando el comprobante de pago para procesar tu envío de inmediato.
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
            <StoreLogo className="scale-75 origin-left" showText={false} />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">tudominio.cl</p>
              <p className="text-[10px] text-slate-400">© 2026 MiTienda. Todos los derechos reservados.</p>
              <p className="text-[9px] text-slate-550 mt-0.5">hecho por 🐱</p>
            </div>
          </div>

          <div className="flex gap-6 font-bold text-slate-650 dark:text-slate-350">
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
          className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 p-3 rounded-full bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/30 hover:bg-blue-600 hover:-translate-y-1 hover:scale-110 transition-all duration-300 animate-fade-in"
          aria-label="Volver arriba"
        >
          <ChevronUp size={24} />
        </button>
      )}

    </div>
  );
}
