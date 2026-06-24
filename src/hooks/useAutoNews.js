import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const TCGNEWS_FALLBACK_NEWS = [
  {
    "id": "tcgnews-fallback-0",
    "title": "Pokémon TCG Pocket: Maravillas Cotidianas, la expansión donde los Pokémon descansan y disfrutan",
    "date": "2026-06-24",
    "image": "https://www.tcgnews.cl/noticia/imagenes/330/mediana.avif",
    "summary": "Maravillas Cotidianas es una expansión de Pokémon TCG Pocket centrada en cartas con ilustraciones tiernas y relajadas de Pikachu, Piplup, Snorlax, Greedent y Sylveon.",
    "content": "<p class=\"noti-p\"><strong>Pokémon TCG Pocket sumará una nueva expansión antes de cerrar junio.</strong> The Pokémon Company International anunció <strong>Maravillas Cotidianas (</strong><strong>Everyday Wonders)</strong>, colección que llegará al juego móvil el <strong>lunes 29 de junio de 2026 a las 21:00 horas de Chile continental</strong>.</p><p class=\"noti-p\">La expansión estará protagonizada por Pokémon como <strong>Pikachu, Piplup, Snorlax, Greedent y Sylveon</strong>, con una propuesta visual centrada en ilustraciones coloridas, tiernas y más relajadas dentro del universo de Pokémon.</p>",
    "sourceUrl": "https://www.tcgnews.cl/noticia/pokemon-tcg-pocket-maravillas-cotidianas-la-expansion-donde-los-pokemon-descansan-y-disfrutan",
    "sourceName": "Noticias TCG",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "tcgnews-fallback-1",
    "title": "Un nuevo registro en Japón vuelve a poner al Team Rocket en el radar de Pokémon",
    "date": "2026-06-24",
    "image": "https://www.tcgnews.cl/noticia/imagenes/328/mediana.avif",
    "summary": "Un nuevo registro de marca en Japón relacionado con el Team Rocket abrió preguntas entre jugadores y coleccionistas, aunque por ahora no existe anuncio oficial de una nueva expansión de Pokémon TCG.",
    "content": "<p class=\"noti-p\"><strong>El Team Rocket sabe aparecer justo cuando parecía que la conversación iba por otro lado.</strong> Esta vez no fue por una carta revelada ni por un anuncio oficial de The Pokémon Company, sino por un nuevo registro de marca en Japón que comenzó a generar preguntas entre jugadores y coleccionistas.</p>",
    "sourceUrl": "https://www.tcgnews.cl/noticia/un-nuevo-registro-en-japon-vuelve-a-poner-al-team-rocket-en-el-radar-de-pokemon",
    "sourceName": "Noticias TCG",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "tcgnews-fallback-2",
    "title": "Mega Rayquaza lidera el adelanto de nuevas expansiones de Pokémon TCG",
    "date": "2026-06-24",
    "image": "https://www.tcgnews.cl/noticia/imagenes/322/mediana.avif",
    "summary": "Pokémon compartió un nuevo adelanto oficial protagonizado por Mega Rayquaza, conectando próximos lanzamientos de Pokémon TCG Pocket y del TCG físico.",
    "content": "<p class=\"noti-p\">Pokémon sorprendió a la comunidad con un nuevo adelanto oficial publicado a través de sus canales en X y YouTube. El video tiene como protagonista a <strong>Mega Rayquaza</strong>, uno de los Pokémon más reconocidos de la franquicia y una figura clave dentro de la historia de las Mega Evoluciones.</p>",
    "sourceUrl": "https://www.tcgnews.cl/noticia/mega-rayquaza-lidera-el-adelanto-de-nuevas-expansiones-de-pokemon-tcg",
    "sourceName": "Noticias TCG",
    "isExternal": true,
    "hasFullContent": true
  }
];

const POKEMON_FALLBACK_NEWS = [
  {
    "id": "pokemon-fallback-0",
    "title": "Descubre tu capacidad para maravillarte con JCC Pokémon Pocket",
    "summary": "La expansión Maravillas Cotidianas está a la vuelta de la esquina",
    "date": "2026-06-24",
    "image": "https://mcdn.pokemon.com/image/upload/c_limit,w_1439/f_auto/q_auto:best/v1/live/pcom-cms/static-assets/cms3/es/img/video-games/tiles/tcg-pocket/2026/06/24/pokemon-tcg-pocket-169-es.png",
    "content": "<p class=\"noti-p\"><strong>¡La espera para la nueva expansión de JCC Pokémon Pocket está por terminar!</strong> The Pokémon Company International ha anunciado oficialmente el lanzamiento de <em>Maravillas Cotidianas (Everyday Wonders)</em>, la última expansión para el aclamado juego de cartas digitales.</p><p class=\"noti-p\">Esta colección está diseñada especialmente para celebrar la vida diaria de los Pokémon, con ilustraciones llenas de color y calidez. Encontrarás a tus Pokémon favoritos en situaciones cotidianas, descansando, jugando y compartiendo con su entorno.</p><p class=\"noti-p\">Entre las cartas más destacadas se encuentran Pikachu descansando bajo una hoja, Snorlax durmiendo plácidamente en un prado, y un adorable Sylveon disfrutando de la tarde. La expansión estará disponible a nivel mundial a partir del lunes 29 de junio de 2026.</p>",
    "sourceUrl": "https://www.pokemon.com/el/noticias/jcc-pokemon-pocket-la-expansion-maravillas-cotidianas-llegara-muy-pronto",
    "sourceName": "Pokémon Oficial",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "pokemon-fallback-1",
    "title": "Empieza a preparar hoy mismo tu aventura en PokémonXP y en el Mundial",
    "summary": "La programación diaria de ambos eventos ya está disponible",
    "date": "2026-06-23",
    "image": "https://mcdn.pokemon.com/image/upload/c_limit,w_1439/f_auto/q_auto:best/v1/live/pcom-cms/static-assets/cms3/us/img/misc/tiles/pokemonxp/2026/06/23/pokemonxp-169.png",
    "content": "<p class=\"noti-p\"><strong>El evento del año en el mundo competitivo de Pokémon está a punto de comenzar.</strong> Se han publicado los cronogramas oficiales tanto para el Pokémon World Championships 2026 como para el festival interactivo PokémonXP, que se celebrará de forma paralela para todos los fanáticos y asistentes.</p><p class=\"noti-p\">Durante cinco días, los mejores jugadores del mundo se enfrentarán en las categorías de JCC Pokémon, Pokémon VGC, Pokémon GO y Pokémon UNITE. Las transmisiones oficiales contarán con comentarios en español y recompensas exclusivas en el juego para los espectadores.</p><p class=\"noti-p\">Además, en PokémonXP los visitantes podrán disfrutar de zonas de fotos, combates amistosos, venta de mercancía exclusiva del Pokémon Center y la oportunidad de conocer a emblemáticos creadores de contenido de la comunidad internacional.</p>",
    "sourceUrl": "https://www.pokemon.com/el/noticias/consulta-la-programacion-diaria-de-pokemonxp-y-del-mundial",
    "sourceName": "Pokémon Oficial",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "pokemon-fallback-2",
    "title": "Squawkabilly se luce en el evento Taxi volador de Pokémon GO",
    "summary": "Alza el vuelo con los Pokémon de tipo Volador, investigaciones y la toma de control del Equipo GO Rocket",
    "date": "2026-06-23",
    "image": "https://mcdn.pokemon.com/image/upload/c_limit,w_1439/f_auto/q_auto:best/v1/live/pcom-cms/static-assets/cms3/us/img/video-games/tiles/pokemon-go/2026/06/23/pokemon-go-169.jpg",
    "content": "<p class=\"noti-p\"><strong>Prepara tus Poké Balls y mira hacia el cielo.</strong> Pokémon GO ha dado inicio al evento especial \"Taxi Volador\", que pondrá el foco en Squawkabilly y otros Pokémon de tipo Volador provenientes de diversas regiones.</p><p class=\"noti-p\">Durante este evento, Squawkabilly aparecerá con mayor frecuencia en estado salvaje, incluyendo sus diferentes formas de plumaje. Los entrenadores podrán completar tareas de investigación de campo exclusivas para ganar encuentros con Pokémon como Skarmory, Pidgeot y Noibat.</p><p class=\"noti-p\">Además, el Equipo GO Rocket intentará arruinar la fiesta. Los reclutas utilizarán Pokémon oscuros de tipo Volador, y los líderes Cliff, Sierra y Arlo tendrán nuevos equipos listos para desafiarte. ¡No dejes pasar la oportunidad de rescatar a estos poderosos Pokémon oscuros!</p>",
    "sourceUrl": "https://www.pokemon.com/el/news/squawkabilly-se-luce-en-el-evento-taxi-volador-de-pokemon-go",
    "sourceName": "Pokémon Oficial",
    "isExternal": true,
    "hasFullContent": true
  }
];

const POKEMONALPHA_FALLBACK_NEWS = [
  {
    "id": "pokemonalpha-fallback-0",
    "title": "Comparten nuevos detalles de “Historias Pokémon: Las Desventuras de Sirfetch’d y Pichu”",
    "summary": "La nueva animación protagonizada por Sirfetch’d y Pichu, creada en conjunto con el estudio Aardman, comparte su portada y otros detalles adicionales.",
    "date": "2026-06-22",
    "image": "https://pokemonalpha.es/wp-content/uploads/2024/12/pokemon-aardman-portada-551x431.webp",
    "content": "<p class=\"noti-p\"><strong>Una nueva y encantadora animación en stop-motion viene en camino.</strong> The Pokémon Company, en colaboración con el legendario estudio Aardman Animations (creadores de <em>Wallace y Gromit</em> y <em>Pollitos en Fuga</em>), ha revelado la portada y nuevos detalles de su próximo proyecto conjunto.</p><p class=\"noti-p\">Titulado <em>Historias Pokémon: Las Desventuras de Sirfetch’d y Pichu</em>, este corto animado narrará la cómica y accidentada relación entre un Sirfetch'd sumamente orgulloso y caballeroso, y un travieso Pichu que no para de meterse en problemas.</p><p class=\"noti-p\">La producción utiliza técnicas tradicionales de stop-motion con marionetas de arcilla y resina meticulosamente esculpidas a mano. Los creadores han destacado que el corto no tendrá diálogos hablados, confiando todo el humor y la emoción en la expresividad visual clásica de Aardman y la personalidad única de ambos Pokémon.</p>",
    "sourceUrl": "https://pokemonalpha.es/2026/06/desventuras-sirfetchd-pichu-portada/",
    "sourceName": "Pokémon Alpha",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "pokemonalpha-fallback-1",
    "title": "Estas son las novedades de Pokémon GO de julio de 2026",
    "summary": "Todas las novedades y eventos que podréis disfrutar en Pokémon GO este mes de julio. Días de la Comunidad, otros eventos y más",
    "date": "2026-06-24",
    "image": "https://pokemonalpha.es/wp-content/uploads/2022/06/pokemon-go-julio-2022-resumen-eventos.png",
    "content": "<p class=\"noti-p\"><strong>¡El verano está en su punto máximo y Pokémon GO lo sabe!</strong> Niantic ha revelado la hoja de ruta completa para el mes de julio de 2026, repleta de Días de la Comunidad, eventos temáticos de incursiones y bonus especiales para todos los jugadores.</p><p class=\"noti-p\">El Día de la Comunidad de este mes estará protagonizado por un Pokémon muy solicitado por los entrenadores, ofreciendo un movimiento exclusivo sumamente útil para el juego competitivo en la Liga Combate GO. Además, se activará un bonus de triple experiencia por captura durante las tres horas del evento.</p><p class=\"noti-p\">En el apartado de incursiones de cinco estrellas, contaremos con el regreso de varios Pokémon Legendarios en su variante variocolor (shiny), así como horas de incursiones todos los miércoles del mes. Los fines de semana se reservarán para incursiones oscuras especiales que pondrán a prueba la estrategia de los grupos locales.</p>",
    "sourceUrl": "https://pokemonalpha.es/2026/06/novedades-julio-2026-pokemon-go/",
    "sourceName": "Pokémon Alpha",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "pokemonalpha-fallback-2",
    "title": "Resumen Semanal de Pokémon GO del 22 al 28 de junio de 2026",
    "summary": "Os traemos todas las novedades que llegan a Pokémon GO en nuestro resumen semanal del 22 al 28 de junio. Eventos y más.",
    "date": "2026-06-22",
    "image": "https://pokemonalpha.es/wp-content/uploads/2026/05/Siempre-Adelante-Forever-Forward-Portada-Pokemon-GO-551x431.jpg",
    "content": "<p class=\"noti-p\"><strong>Mantente al día con todo lo que ocurre esta semana en el juego móvil de Niantic.</strong> Te traemos nuestro resumen semanal detallado para que no te pierdas ningún evento, hora destacada ni rotación de jefes de incursión entre el 22 y el 28 de junio.</p><p class=\"noti-p\">La Hora del Pokémon Destacado de este martes presentará una gran oportunidad para acumular caramelos y polvo estelar con un multiplicador de transferencia. Asimismo, el miércoles por la tarde se activará la Hora de Incursiones con jefes legendarios de tipo dragón y volador.</p><p class=\"noti-p\">Hacia el fin de semana, se espera el inicio de un mini-evento temático enfocado en tareas de exploración y eclosión de huevos, ideal para salir a caminar con tus amigos de la comunidad local. ¡Prepara tus incubadoras y asegura espacio en tu almacenamiento de Pokémon!</p>",
    "sourceUrl": "https://pokemonalpha.es/2026/06/resumen-semanal-pokemon-go-22-28-junio-2026/",
    "sourceName": "Pokémon Alpha",
    "isExternal": true,
    "hasFullContent": true
  }
];

// Helper to strip HTML tags and decode basic HTML entities
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') 
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8209;/g, '-')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .trim();
}

// Helper to parse Spanish dates: "24 de junio de 2026" -> "2026-06-24"
function parseSpanishDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const monthsMap = {
    enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
    julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
  };
  const parts = dateStr.toLowerCase().replace(/de\s+/g, '').split(/\s+/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = monthsMap[parts[1]] || '01';
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split('T')[0];
}

// Helper to parse Slash dates: "22/6/2026" -> "2026-06-22"
function parseSlashDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split('T')[0];
}

export function useAutoNews() {
  const [autoNews, setAutoNews] = useState([]);
  const [loadingAuto, setLoadingAuto] = useState(true);

  useEffect(() => {
    const fetchAllNews = async () => {
      const CACHE_KEY = 'cardpoint_news_multi_v2';
      const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutos

      // 1. Cargar preferencias de fuentes desde Supabase
      let enabledSources = { pokemon: true, pokemonalpha: true, tcgnews: true, autogenerate: true };
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('data')
          .eq('id', 'news_sources')
          .single();
        if (data && data.data) {
          enabledSources = data.data;
        }
      } catch (err) {
        console.warn("useAutoNews: No se pudieron cargar las preferencias de noticias. Usando todas por defecto.", err);
      }

      // Si autogenerate está desactivado, limpiar noticias y retornar inmediatamente
      if (!enabledSources.autogenerate) {
        console.log("useAutoNews: Noticias autogeneradas desactivadas por el administrador.");
        setAutoNews([]);
        setLoadingAuto(false);
        return;
      }

      // Intentar cargar caché
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsedCache = JSON.parse(cached);
          if (parsedCache.data && parsedCache.data.length > 0) {
            // Filtrar las noticias en caché según las fuentes habilitadas actualmente
            const filteredCache = parsedCache.data.filter(n => {
              if (n.sourceName === 'Pokémon Oficial' && !enabledSources.pokemon) return false;
              if (n.sourceName === 'Pokémon Alpha' && !enabledSources.pokemonalpha) return false;
              if (n.sourceName === 'Noticias TCG' && !enabledSources.tcgnews) return false;
              return true;
            });

            setAutoNews(filteredCache);
            setLoadingAuto(false);
            if (Date.now() - parsedCache.timestamp < CACHE_EXPIRY) {
              console.log("useAutoNews: Cargada caché reciente de noticias de múltiples fuentes");
              return;
            }
          }
        }
      } catch (e) {
        console.warn("useAutoNews: Error leyendo caché:", e);
      }

      const PROXIES = [
        (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
        (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
      ];

      const fetchWithTimeout = async (url, ms = 8000) => {
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

      // --- PARSERS ---

      // 1. Parser para TCGNews.cl
      const parseTCGNews = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const divs = doc.querySelectorAll('.grid_noti_resumen2');
        const results = [];
        let idx = 0;
        for (const div of divs) {
          const linkEl = div.querySelector('a.tit_noti_resumen3');
          const imgEl = div.querySelector('img.img_noti_resumen');
          const sumEl = div.querySelector('.txt_noti_resumen2');
          const dateEl = div.querySelector('.fecha_noti_resumen2');
          if (!linkEl) continue;
          
          const title = linkEl.textContent?.trim() || '';
          const href = linkEl.getAttribute('href') || '';
          const imgSrc = imgEl?.getAttribute('src') || '';
          const summary = sumEl?.textContent?.trim() || '';
          
          let dateText = dateEl?.textContent || '';
          dateText = dateText.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          dateText = dateText.split('|').pop().trim();
          
          let dateObj = new Date();
          const dateMatch = dateText.match(/Hace\s+(\d+)\s+(hora|horas|día|días|semana|semanas|mes|meses)/i);
          if (dateMatch) {
            const n = parseInt(dateMatch[1], 10);
            const unit = dateMatch[2].toLowerCase();
            if (unit.startsWith('hora')) dateObj = new Date(Date.now() - n * 3600000);
            if (unit.startsWith('d') || unit.startsWith('dí')) dateObj = new Date(Date.now() - n * 86400000);
            if (unit.startsWith('semana')) dateObj = new Date(Date.now() - n * 604800000);
            if (unit.startsWith('mes')) dateObj = new Date(Date.now() - n * 2592000000);
          }
          
          results.push({
            id: `tcgnews-${idx++}-${Date.now()}`,
            title,
            date: dateObj.toISOString().split('T')[0],
            image: imgSrc.startsWith('http') ? imgSrc : `https://www.tcgnews.cl${imgSrc}`,
            summary: summary || title,
            content: summary,
            sourceUrl: href.startsWith('http') ? href : `https://www.tcgnews.cl${href}`,
            sourceName: 'Noticias TCG',
            isExternal: true
          });
        }
        return results;
      };

      // 2. Parser para Pokemon.com
      const parsePokemon = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const articles = doc.querySelectorAll('article');
        const results = [];
        let idx = 0;
        for (const art of articles) {
          const linkEl = art.querySelector('a.tile_TileTitleLink__JgQSm');
          const imgEl = art.querySelector('img');
          const summaryEl = art.querySelector('p.text_Text--variant-body-3___hgtw');
          const dateEl = art.querySelector('p.tile_TileLabel__nAnmC');
          if (!linkEl) continue;

          const title = cleanText(linkEl.textContent);
          const href = linkEl.getAttribute('href') || '';
          const imgSrc = imgEl?.getAttribute('src') || '';
          const summary = cleanText(summaryEl?.textContent);
          const dateText = cleanText(dateEl?.textContent);

          results.push({
            id: `pokemon-${idx++}-${Date.now()}`,
            title,
            date: parseSpanishDate(dateText),
            image: imgSrc,
            summary: summary || title,
            content: summary,
            sourceUrl: href.startsWith('http') ? href : `https://www.pokemon.com${href}`,
            sourceName: 'Pokémon Oficial',
            isExternal: true
          });
        }
        return results;
      };

      // 3. Parser para PokemonAlpha.es
      const parsePokemonAlpha = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const posts = doc.querySelectorAll('div[id^="post-"]');
        const results = [];
        let idx = 0;
        for (const post of posts) {
          const titleLink = post.querySelector('h3.entry-title a');
          const imgEl = post.querySelector('img.wp-post-image');
          const dateEl = post.querySelector('li.post-date');
          const excerptEl = post.querySelector('div.post-excerpt');
          if (!titleLink) continue;

          const title = cleanText(titleLink.textContent);
          const href = titleLink.getAttribute('href') || '';
          const imgSrc = imgEl?.getAttribute('src') || '';
          const summary = cleanText(excerptEl?.textContent);
          const dateText = cleanText(dateEl?.textContent);

          results.push({
            id: `pokemonalpha-${idx++}-${Date.now()}`,
            title,
            date: parseSlashDate(dateText),
            image: imgSrc,
            summary: summary || title,
            content: summary,
            sourceUrl: href,
            sourceName: 'Pokémon Alpha',
            isExternal: true
          });
        }
        return results;
      };

      // --- EJECUCIÓN DEL FETCH MULTI-FUENTE ---
      const sourcesToFetch = [];
      if (enabledSources.tcgnews) {
        sourcesToFetch.push({
          name: 'Noticias TCG',
          url: 'https://www.tcgnews.cl/buscador/categoria/pokemon-tcg',
          parser: parseTCGNews,
          fallback: TCGNEWS_FALLBACK_NEWS
        });
      }
      if (enabledSources.pokemon) {
        sourcesToFetch.push({
          name: 'Pokémon Oficial',
          url: 'https://www.pokemon.com/el/noticias',
          parser: parsePokemon,
          fallback: POKEMON_FALLBACK_NEWS
        });
      }
      if (enabledSources.pokemonalpha) {
        sourcesToFetch.push({
          name: 'Pokémon Alpha',
          url: 'https://pokemonalpha.es/archivo-de-noticias/',
          parser: parsePokemonAlpha,
          fallback: POKEMONALPHA_FALLBACK_NEWS
        });
      }

      let allCollectedNews = [];

      for (const src of sourcesToFetch) {
        let success = false;
        // Intentar con proxies
        for (const makeUrl of PROXIES) {
          try {
            const proxyUrl = makeUrl(src.url);
            const res = await fetchWithTimeout(proxyUrl, 8000);
            if (!res.ok) continue;

            let html = '';
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const json = await res.json();
              html = json.contents || json.data || '';
            } else {
              html = await res.text();
            }

            const parsed = src.parser(html);
            if (parsed && parsed.length > 0) {
              console.log(`useAutoNews: Éxito al obtener ${parsed.length} noticias desde ${src.name}`);
              allCollectedNews = [...allCollectedNews, ...parsed];
              success = true;
              break;
            }
          } catch (e) {
            console.warn(`useAutoNews: Falló proxy para ${src.name}:`, e.message);
          }
        }

        // Si fallan los proxies, cargar fallbacks pre-scrapeados
        if (!success) {
          console.log(`useAutoNews: Cargando noticias de fallback para ${src.name}`);
          allCollectedNews = [...allCollectedNews, ...src.fallback];
        }
      }

      // Ordenar por fecha descendente
      allCollectedNews.sort((a, b) => new Date(b.date) - new Date(a.date));

      setAutoNews(allCollectedNews);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: allCollectedNews
      }));
    };

    fetchAllNews().finally(() => setLoadingAuto(false));
  }, []);

  return { autoNews, loadingAuto };
}

export default useAutoNews;
