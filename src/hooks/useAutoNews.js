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
    "id": "pokemon-fallback-poketoon",
    "title": "Ven a bailar con el nuevo POKÉTOON",
    "summary": "Prepárate para vivir una explosión de ternura en Pawmi, Pawmo y Pawmot en YouTube.",
    "date": "2026-06-25",
    "image": "/og-image.png",
    "content": "<p class=\"noti-p\"><strong>¡Una nueva entrega de POKÉTOON ha llegado a YouTube!</strong> Prepárate para bailar y sonreír con las divertidas aventuras de Pawmi, Pawmo y Pawmot en este nuevo corto animado lleno de ritmo y diversión.</p><p class=\"noti-p\">En esta adorable historia, una niña que está de pícnic con su padre se encuentra con estos tres dinámicos Pokémon bailando con una sincronía increíble, desatando una tarde llena de risas y música.</p>",
    "sourceUrl": "https://www.pokemon.com/el/noticias/ven-a-bailar-con-el-nuevo-corto-de-poketoon-en-youtube",
    "sourceName": "Pokémon Oficial",
    "isExternal": true,
    "hasFullContent": true
  },
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
    "title": "¡Hoy es el Día de Pokémon Masters EX de junio!",
    "date": "2026-06-25",
    "image": "https://pokemonalpha.es/wp-content/uploads/2025/09/cropped-icono-grande-zorro-32x32.jpg",
    "summary": "El evento Día de Pokémon Masters EX de junio llega cargado de regalos, mejoras a compis y otras novedades.",
    "content": "<p class=\"noti-p\"><strong>Hoy se celebra el día de Pokémon Masters EX de junio, como cada 25 de mes.</strong> Este evento especial dura únicamente 24 horas, por lo que es de suma importancia conectarse a la aplicación, reclamar los regalos exclusivos y realizar las actividades y canjes más relevantes del día.</p><p class=\"noti-p\">Entre las principales novedades destaca que todos los entrenadores recibirán <strong>500 joyas de regalo por iniciar sesión</strong>. Además, en el combate individual por el Día de Pokémon Masters EX podremos conseguir Pikapegatinas, <strong>500 joyas adicionales, 1 Potenciador de 5 estrellas, 1 moneda de Movicaramelo por cada rol y billetes de reclutamiento.</strong> Este combate especial solo se puede completar una vez por cuenta.</p><p class=\"noti-p\">Adicionalmente, en el combate cooperativo por el Día de Pokémon Masters EX se podrán conseguir <strong>Pikapegatinas y accesorios especiales</strong>. Este combate se puede repetir tantas veces como se desee para farmear recompensas. Por otra parte, <strong>Eco (Traje S) y Lugia, Aura y Swampert, y Kalm (Neocampeón) y Greninja Variocolor</strong> reciben importantes mejoras en sus tableros compi.</p><p class=\"noti-p\">Para finalizar, estará disponible un Reclutamiento x25 joyas gratis de 11 compis y un reclutamiento triple maestro con <strong>Elio (Neocampeón) y Necrozma Melena Crepuscular Variocolor, Kalm (Neocampeón) y Greninja Variocolor, y Eco (Traje S) y Lugia.</strong> El evento finalizará este 26 de junio a las 7:59 a.m. hora local.</p>",
    "sourceUrl": "https://pokemonalpha.es/2026/06/dia-pokemon-masters-ex-junio-2026/",
    "sourceName": "Pokémon Alpha",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "pokemonalpha-fallback-1",
    "title": "Anunciada «Maravillas Cotidianas», la nueva expansión de Pokémon TCG Pocket",
    "date": "2026-06-24",
    "image": "https://pokemonalpha.es/wp-content/uploads/2026/06/cartas-tcg-pocket-maravillas-cotidianas.webp",
    "summary": "Ha sido anunciada Maravillas Cotidianas, la próxima expansión de Pokémon TCG Pocket, con Pikachu, Piplup y Sylveon.",
    "content": "<p class=\"noti-p\"><strong>El exitoso juego de cartas para móviles Pokémon TCG Pocket ha anunciado oficialmente su próxima expansión</strong> titulada <em>Maravillas Cotidianas (Everyday Wonders)</em>. Esta hermosa colección de cartas digitales se centra principalmente en ilustraciones relajadas, coloridas y tiernas de Pokémon emblemáticos como Pikachu, Piplup, Snorlax, Greedent y Sylveon en situaciones diarias del universo Pokémon.</p><p class=\"noti-p\">Las nuevas cartas digitales y sobres de esta expansión estarán disponibles a partir del <strong>martes 30 de junio de 2026 por la noche</strong> (hora del Pacífico). The Pokémon Company ya ha revelado algunas de las cartas de arte alternativo y los cosméticos que los jugadores podrán desbloquear completando las misiones temáticas de este lanzamiento.</p><p class=\"noti-p\">Junto con la llegada de las cartas, se activará una serie de eventos en el juego durante las semanas siguientes: a principios de julio se celebrará el evento emblema <em>Maravillas Cotidianas</em> para obtener insignias exclusivas por victorias. A mediados de julio llegará la semana de la comunidad con misiones de intercambio de cartas, y a finales de julio se activará el evento botín Zorua de Hisui para conseguir cartas de sobres promocionales de la serie B.</p>",
    "sourceUrl": "https://pokemonalpha.es/2026/06/pokemon-tcg-pocket-maravillas-cotidianas/",
    "sourceName": "Pokémon Alpha",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "pokemonalpha-fallback-2",
    "title": "Comparten nuevos detalles de “Historias Pokémon: Las Desventuras de Sirfetch’d y Pichu”",
    "date": "2026-06-22",
    "image": "https://pokemonalpha.es/wp-content/uploads/2026/06/Sirfetchd-y-pichu-portada-aardman-1024x576.jpg",
    "summary": "La nueva animación protagonizada por Sirfetch’d y Pichu, creada en conjunto con el estudio Aardman, comparte su portada y otros detalles adicionales.",
    "content": "<p class=\"noti-p\"><strong>The Pokémon Company ha revelado la primera portada oficial y nuevos detalles técnicos</strong> sobre su próximo proyecto animado en stop-motion titulado <em>“Historias Pokémon: Las Desventuras de Sirfetch’d y Pichu”</em>. Esta producción se realiza en colaboración directa con el aclamado estudio de animación británico Aardman Animations (creadores de éxitos internacionales como Wallace y Gromit o Pollitos en Fuga).</p><p class=\"noti-p\">La portada compartida deja ver la estética visual de la obra, caracterizada por modelados tridimensionales de arcilla con texturas limpias y fondos sumamente detallados y coloridos, junto a un diseño de logo alegre y caricaturesco. El corto animado estará ambientado en la región de Galar, que posee un diseño inspirado en Gran Bretaña, lo que permitirá a Aardman explotar su humor slapstick inglés característico y su narrativa sin diálogos hablados.</p><p class=\"noti-p\">Aunque de momento no se han revelado las plataformas de distribución definitivas ni el reparto de idiomas, se ha confirmado que la animación mantiene su ventana de lanzamiento programada para algún punto del próximo año 2027. La presentación oficial del proyecto se realizará durante el Festival Internacional de Animación de Annecy en Francia.</p>",
    "sourceUrl": "https://pokemonalpha.es/2026/06/desventuras-sirfetchd-pichu-portada/",
    "sourceName": "Pokémon Alpha",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "pokemonalpha-fallback-3",
    "title": "Estas son las novedades de Pokémon GO de julio de 2026",
    "date": "2026-06-24",
    "image": "https://pokemonalpha.es/wp-content/uploads/2022/06/pokemon-go-julio-2022-resumen-eventos.png",
    "summary": "Todas las novedades y eventos que podréis disfrutar en Pokémon GO este mes de julio. Días de la Comunidad, otros eventos y más",
    "content": "<p class=\"noti-p\"><strong>El verano de 2026 arranca con fuerza en Pokémon GO</strong> con una hoja de ruta mensual cargada de eventos masivos, rotaciones competitivas y el esperado Pokémon GO Fest. Niantic ha confirmado que los Pokémon destacados de las incursiones y las horas de incursión de julio contarán con figuras de la talla de Kyurem, Mega Aggron y el debut de Solgaleo en su codiciada forma variocolor (shiny).</p><p class=\"noti-p\">Los Combates Max también se renovarán semanalmente en los nodos energéticos: Chansey aparecerá del 6 al 12 de julio, seguido de Deino del 13 al 19 de julio, Trubbish del 20 al 26 de julio y Feebas del 27 de julio al 2 de agosto. Adicionalmente, las Megaincursiones darán protagonismo a Mega Lucario, Mega Sceptile, Mega Salamence y Mega Aggron en diferentes periodos del mes.</p><p class=\"noti-p\">Entre los eventos presenciales y globales programados, destaca el Día de la Comunidad de Sobble el 4 de julio, la fiesta del décimo aniversario de Pokémon GO del 4 al 6 de julio, el evento Sendero de Leyendas del 6 al 10 de julio, y el masivo Pokémon GO Fest 2026: Global los días 11 y 12 de julio. Prepárate con tus pases de incursión remotos y locales para disfrutar de un mes lleno de capturas legendarias.</p>",
    "sourceUrl": "https://pokemonalpha.es/2026/06/novedades-julio-2026-pokemon-go/",
    "sourceName": "Pokémon Alpha",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "pokemonalpha-fallback-4",
    "title": "Resumen Semanal de Pokémon GO del 22 al 28 de junio de 2026",
    "date": "2026-06-22",
    "image": "https://pokemonalpha.es/wp-content/uploads/2026/05/Siempre-Adelante-Forever-Forward-Portada-Pokemon-GO.jpg",
    "summary": "Os traemos todas las novedades que llegan a Pokémon GO en nuestro resumen semanal del 22 al 28 de junio. Eventos y más.",
    "content": "<p class=\"noti-p\"><strong>Para mantenerte al tanto de cada rotación y evento especial en Pokémon GO</strong>, te presentamos el resumen detallado de la última semana de junio. El principal atractivo es el inicio del evento \"Taxi Volador\" del 23 al 29 de junio, que incluye el debut del simpático Squawkabilly y un incremento notable en las apariciones de Pokémon salvajes de tipo volador.</p><p class=\"noti-p\">De forma paralela, desde el jueves 25 de junio comenzará el evento \"Taxi Volador: Toma de Control\" del Team GO Rocket. Giovanni regresa liderando a un poderosísimo Reshiram Oscuro que los entrenadores podrán rescatar tras derrotarlo. Además, se habilitará la posibilidad de utilizar una MT de ataque cargado para eliminar el movimiento Frustración de nuestros Pokémon oscuros favoritos.</p><p class=\"noti-p\">En incursiones, Necrozma y Mega Scizor darán paso a Mega Pidgeot y a la dupla regional Kartana/Celesteela a partir del miércoles 24 de junio. Para cerrar el fin de semana, el sábado 27 de junio se celebrará el Día de Incursiones de Mega Skarmory de 14:00 a 17:00 hora local, ofreciendo pases de incursión adicionales gratis y mayor probabilidad de conseguir su versión variocolor.</p>",
    "sourceUrl": "https://pokemonalpha.es/2026/06/resumen-semanal-pokemon-go-22-28-junio-2026/",
    "sourceName": "Pokémon Alpha",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "pokemonalpha-fallback-5",
    "title": "Mega-Rayquaza llegará a Pokémon TCG estándar y Pocket a lo largo de este año",
    "date": "2026-06-21",
    "image": "https://pokemonalpha.es/wp-content/uploads/2026/06/cartas-tcg-pocket-maravillas-cotidianas.webp",
    "summary": "Esta doble expansión llegará primero a Pokémon TCG Pocket, el próximo mes de julio. Permitirá disfrutar de una expansión con Rayquaza.",
    "content": "<p class=\"noti-p\"><strong>El dragón legendario Rayquaza será la estrella indiscutible del juego de cartas coleccionables de Pokémon.</strong> The Pokémon Company ha anunciado una estrategia conjunta de lanzamientos que llevará la temática de Mega-Rayquaza tanto al juego digital para móviles Pokémon TCG Pocket como al formato físico de cartas coleccionables tradicionales.</p><p class=\"noti-p\">La primera parte de esta doble expansión digital llegará en julio de 2026 bajo el nombre de <em>“Ruler of the Skies”</em> (Gobernante de los Cielos), introduciendo una gran cantidad de cartas exclusivas y sobres de mejora en la aplicación móvil Pokémon TCG Pocket. Esta expansión contará con mecánicas aceleradas adaptadas al formato digital.</p><p class=\"noti-p\">Posteriormente, el 6 de noviembre de 2026 se lanzará a nivel mundial la expansión física de cartas titulada <em>“Megaevolución-Delta Reign”</em>, que adaptará la temática y mecánicas de Mega-Rayquaza al formato físico competitivo estándar. De esta manera, los jugadores de ambas plataformas podrán disfrutar de la majestuosidad de Rayquaza y sus poderosas evoluciones a lo largo del año.</p>",
    "sourceUrl": "https://pokemonalpha.es/2026/06/mega-rayquaza-pokemon-tcg-pocket/",
    "sourceName": "Pokémon Alpha",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "pokemonalpha-fallback-6",
    "title": "Inteleon teratipo Hielo llega a las teraincursiones de Pokémon Escarlata y Púrpura",
    "date": "2026-06-20",
    "image": "https://pokemonalpha.es/wp-content/uploads/2023/03/teraincursion-7-cristal-negro-1024x576.webp",
    "summary": "Inteleon de teratipo Hielo protagonizará el siguiente evento de teraincursiones para Pokémon Escarlata y Pokémon Púrpura.",
    "content": "<p class=\"noti-p\"><strong>El inicial de tipo agua de Galar, Inteleon, hace su debut en Paldea con un evento especial.</strong> The Pokémon Company y Nintendo han anunciado el próximo evento de teraincursiones de 7 estrellas con cristales negros en Pokémon Escarlata y Pokémon Púrpura, el cual estará protagonizado por un poderoso Inteleon con Teratipo Hielo y el codiciado Emblema de Imbatibilidad.</p><p class=\"noti-p\">El evento temporal se celebrará del 19 de junio al 25 de junio de 2026. Dado que Inteleon no es un Pokémon que se pueda capturar de forma salvaje en la región de Paldea ordinariamente, este evento supone una excelente oportunidad para que los coleccionistas y jugadores competitivos lo añadan a sus equipos y Pokédex locales sin necesidad de utilizar Pokémon HOME.</p><p class=\"noti-p\">Las teraincursiones de cristales negros de nivel 7 ofrecen un desafío de dificultad elevada. Aunque solo se puede capturar una única unidad de Inteleon de teratipo Hielo por partida guardada, los entrenadores podrán repetir el combate online o de manera cooperativa local tantas veces como lo deseen para farmear recompensas valiosas como parches habilidad, caramelos de experiencia y teralitos de tipo hielo.</p>",
    "sourceUrl": "https://pokemonalpha.es/2026/06/inteleon-teraincursiones-escarlata-purpura/",
    "sourceName": "Pokémon Alpha",
    "isExternal": true,
    "hasFullContent": true
  },
  {
    "id": "pokemonalpha-fallback-7",
    "title": "Embarcaos en un Sendero de leyendas camino al Pokémon GO Fest 2026",
    "date": "2026-06-19",
    "image": "https://pokemonalpha.es/wp-content/uploads/2026/05/Siempre-Adelante-Forever-Forward-Portada-Pokemon-GO.jpg",
    "summary": "Sendero de Leyendas será el nuevo evento de Pokémon GO que nos preparará para el Pokémon GO Fest 2026: Global.",
    "content": "<p class=\"noti-p\"><strong>El camino de preparación para el mayor festival de Pokémon GO del año ha sido revelado.</strong> Niantic ha presentado el evento especial <em>\"Sendero de Leyendas\"</em>, diseñado específicamente para preparar a toda la comunidad de entrenadores para el multitudinario Pokémon GO Fest 2026: Global, el cual promete traer sorpresas increíbles.</p><p class=\"noti-p\">El evento dará inicio el lunes 6 de julio de 2026 a las 00:01 y se prolongará hasta el viernes 10 de julio a las 23:59 (hora local). Durante este periodo, los jugadores disfrutarán de bonificaciones extraordinarias como la eliminación del límite de pases de incursión remotos, mayor efectividad de captura con las Honor Ball en incursiones y caramelos++ garantizados por intercambios para entrenadores de nivel 31 en adelante.</p><p class=\"noti-p\">En el apartado de incursiones, una inmensa alineación de Pokémon legendarios regresará a los gimnasios: Articuno, Zapdos, Moltres, Raikou, Entei, Suicune, Lugia, Ho-Oh, Rayquaza y Dialga/Palkia en su forma Origen, entre muchos otros. Cada día a las 18:00 hora local se celebrará una Hora de Incursiones con rotaciones de estos Pokémon, brindando una oportunidad inmejorable para conseguir sus variantes variocolor antes del fin de semana global.</p>",
    "sourceUrl": "https://pokemonalpha.es/2026/06/sendero-leyendas-camino-pokemon-go-fest-2026/",
    "sourceName": "Pokémon Alpha",
    "isExternal": true,
    "hasFullContent": true
  }
];

// Helper to generate a stable hash from a string
function hashCode(str) {
  if (!str) return '0';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

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

export function useAutoNews(newsSourcesParam) {
  const [autoNews, setAutoNews] = useState([]);
  const [loadingAuto, setLoadingAuto] = useState(true);

  const sourcesKey = newsSourcesParam ? JSON.stringify(newsSourcesParam) : '';

  useEffect(() => {
    const fetchAllNews = async () => {
      const CACHE_KEY = 'mitienda_news_rss_v9';
      const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutos (actualización más frecuente)

      // 1. Cargar preferencias de fuentes desde Supabase o parámetro
      let enabledSources = { autogenerate: true };
      if (newsSourcesParam) {
        enabledSources = newsSourcesParam;
      } else {
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
          console.warn("useAutoNews: No se pudieron cargar las preferencias de noticias.", err);
        }
      }

      // Si autogenerate está desactivado, limpiar y retornar
      if (!enabledSources.autogenerate) {
        console.log("useAutoNews: Noticias autogeneradas desactivadas.");
        setAutoNews([]);
        setLoadingAuto(false);
        return;
      }

      // Intentar cargar caché
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsedCache = JSON.parse(cached);
          const cacheSourcesMatch = parsedCache.enabledSources && parsedCache.enabledSources.autogenerate === enabledSources.autogenerate;
          
          if (parsedCache.data && parsedCache.data.length > 0 && cacheSourcesMatch) {
            setAutoNews(parsedCache.data);
            setLoadingAuto(false);
            if (Date.now() - parsedCache.timestamp < CACHE_EXPIRY) {
              console.log("useAutoNews: Cargada caché reciente de noticias de Pokémon Alpha RSS");
              return;
            }
          }
        }
      } catch (e) {
        console.warn("useAutoNews: Error leyendo caché:", e);
      }

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

      // --- PARSER PARA EL FEED RSS DE POKÉMON ALPHA ---
      const parsePokemonAlphaRSS = (items) => {
        return items.map((item) => {
          let cleanContent = item.content || item.description || '';
          
          // Extraer la primera imagen del contenido HTML
          let image = '';
          const imgMatch = cleanContent.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) {
            image = imgMatch[1];
          }

          // Si no tiene imagen, asignar una temática estable según el título y categorías
          if (!image) {
            const categories = (item.categories || []).map(c => c.toLowerCase());
            const titleLower = (item.title || '').toLowerCase();
            
            if (titleLower.includes('rayquaza')) {
              image = 'https://assets.pokemon.com/assets/cms2/img/trading-card-game/series/xy06/xy06-169.jpg';
            } else if (titleLower.includes('charizard')) {
              image = 'https://assets.pokemon.com/assets/cms2/img/trading-card-game/series/sv03/sv03-169.jpg';
            } else if (titleLower.includes('pikachu')) {
              image = 'https://assets.pokemon.com/assets/cms2/img/trading-card-game/series/sv04/sv04-169.jpg';
            } else if (titleLower.includes('mew')) {
              image = 'https://assets.pokemon.com/assets/cms2/img/trading-card-game/series/sv03pt5/sv03pt5-169.jpg';
            } else if (categories.includes('pokémon go') || categories.includes('go') || titleLower.includes('go')) {
              image = 'https://assets.pokemon.com/assets/cms2/img/misc/countries/es/country_detail_pokemon_go.jpg';
            } else if (categories.includes('jcc pokémon') || categories.includes('tcg') || categories.includes('pocket') || titleLower.includes('tcg') || titleLower.includes('cartas') || titleLower.includes('pocket')) {
              image = 'https://assets.pokemon.com/assets/cms2/img/trading-card-game/tcg-homepage-featured-169-es.jpg';
            } else if (categories.includes('masters') || titleLower.includes('masters') || titleLower.includes('ex')) {
              image = 'https://assets.pokemon.com/assets/cms2/img/video-games/pokemon-masters/pokemon-masters-169.jpg';
            } else if (categories.includes('escarlata') || categories.includes('púrpura') || titleLower.includes('escarlata') || titleLower.includes('púrpura') || titleLower.includes('teraincursión')) {
              image = 'https://assets.pokemon.com/assets/cms2/img/video-games/pokemon-scarlet-and-pokemon-violet/pokemon-scarlet-and-pokemon-violet-169.jpg';
            } else if (categories.includes('anime') || titleLower.includes('anime') || titleLower.includes('serie') || titleLower.includes('poketoon') || titleLower.includes('corto')) {
              image = 'https://assets.pokemon.com/assets/cms2/img/watch-pokemon-tv/seasons/season26/season26_169_es.jpg';
            } else {
              image = 'https://assets.pokemon.com/assets/cms2/img/misc/countries/es/country_detail_pokemon_tv.jpg'; // Fallback oficial genérico
            }
          }

          // Remover scripts si hubiera
          cleanContent = cleanContent
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .trim();

          const dateStr = item.pubDate ? item.pubDate.split(' ')[0] : new Date().toISOString().split('T')[0];

          let summary = item.description || '';
          summary = summary.replace(/<[^>]*>/g, '').trim();
          if (summary.length > 150) {
            summary = summary.substring(0, 150) + "...";
          }

          return {
            id: `auto-news-${hashCode(item.link || item.title)}`,
            title: item.title,
            date: dateStr,
            image: image,
            summary: summary || item.title,
            content: cleanContent,
            sourceUrl: item.link,
            sourceName: 'Pokémon Alpha',
            isExternal: true,
            hasFullContent: true // Ya tiene todo el HTML, no requiere fetch diferido
          };
        });
      };

      // --- EJECUCIÓN DEL FETCH AL RSS ---
      let allCollectedNews = [];
      let success = false;

      try {
        const feedUrl = "https://pokemonalpha.es/feed/";
        const rssJsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        
        const res = await fetchWithTimeout(rssJsonUrl, 6000);
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'ok' && json.items && json.items.length > 0) {
            allCollectedNews = parsePokemonAlphaRSS(json.items);
            success = true;
            console.log(`useAutoNews: Éxito al obtener ${allCollectedNews.length} noticias desde Pokémon Alpha RSS`);
          }
        }
      } catch (e) {
        console.warn("useAutoNews: Error consultando feed RSS de Pokémon Alpha:", e.message);
      }

      // Si falla, usar fallback local de Pokémon Alpha
      if (!success) {
        console.log("useAutoNews: Cargando noticias de fallback locales de Pokémon Alpha");
        allCollectedNews = POKEMONALPHA_FALLBACK_NEWS.map(n => ({
          ...n,
          hasFullContent: true
        }));
      }

      // Ordenar por fecha descendente
      allCollectedNews.sort((a, b) => new Date(b.date) - new Date(a.date));

      setAutoNews(allCollectedNews);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        enabledSources: enabledSources,
        data: allCollectedNews
      }));
    };

    fetchAllNews().finally(() => setLoadingAuto(false));
  }, [sourcesKey]);

  return { autoNews, loadingAuto };
}

export default useAutoNews;
