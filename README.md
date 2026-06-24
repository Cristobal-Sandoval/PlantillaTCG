# Plantilla de Tienda TCG 🎴⚡

Este proyecto fue hecho para servir de plantilla y base de desarrollo para tiendas de cartas sueltas (singles) TCG (Trading Card Game) como Pokémon, Magic, Yu-Gi-Oh!, One Piece, etc.

Es **totalmente modificable** y cuenta con las siguientes características integradas:
- Un catálogo interactivo y dinámico de singles TCG con filtros por expansiones, rarezas, estado e idioma.
- Sistema de zoom y Lightbox para ver fotos reales de las cartas físicas.
- Agregador automatizado y diferido de noticias desde portales externos con sistema de resiliencia y fallbacks.
- Planificador y ordenador dinámico de torneos físicos locales (manuales y semanales recurrentes).
- Panel de control de administrador prémium para gestionar stock, torneos y fuentes de noticias.
- Integración en tiempo real con Supabase.

## Comenzando 🚀

### Requisitos previos
- Node.js (versión 18 o superior).
- Una instancia de base de datos de Supabase configurada.

### Instalación de dependencias
`ash
npm install
`

### Configuración
Asegúrate de configurar tus credenciales de Supabase en src/supabaseClient.js con las variables correspondientes a tu proyecto.

### Ejecutar en desarrollo
`ash
npm run dev
`

### Compilar para producción
`ash
npm run build
`
