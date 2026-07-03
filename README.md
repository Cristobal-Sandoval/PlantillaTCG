# 🎴 Plantilla de Tienda E-commerce y Catálogo TCG

Esta es una plantilla de desarrollo altamente optimizada para crear tiendas de cartas coleccionables (Trading Card Games como Pokémon, Magic: The Gathering, Yu-Gi-Oh!, One Piece, etc.) y sitios de e-commerce basados en catálogos físicos con cierres de compra asistidos (por WhatsApp o mensajes de Instagram).

> [!IMPORTANT]
> **Hecho por CardPoint** ⚡
> Esta plantilla fue diseñada, desarrollada y liberada por **[CardPoint](https://www.cardpoint.cl)**. Está basada directamente en la arquitectura de producción de su plataforma comercial, incorporando todas las características de rendimiento, SEO y marketing digital de última generación.

---

## 🚀 Características Principales

* **🛒 Catálogo Dinámico con Filtros Avanzados:** Filtros en tiempo real por expansión (set), rarezas, idioma de la carta (Español/Inglés), estado físico (NM, LP, MP, etc.) y badges dinámicos para cartas *Reverse Holo* o especiales de Liga.
* **💼 Bolsa de Cotización (Carrito Asistido):** Los usuarios seleccionan las cartas de interés, aplican cupones de descuento y generan una lista optimizada y formateada en texto plano que pueden copiar con un clic al portapapeles para enviarla por Instagram DM o WhatsApp y coordinar la transferencia manual.
* **🎟️ Administrador de Cupones:** Sistema dinámico administrable para crear códigos de descuento temporales (ej: `PROMO10`), activarlos/desactivarlos o eliminarlos directamente desde el panel de control.
* **🛠️ Panel de Administración Premium:** interfaz integrada y protegida para:
  * Gestionar el inventario de cartas (crear, editar, subir fotos reales de la carta física, modificar stock y cambiar visibilidad).
  * Administrar banners promocionales animados de la página principal.
  * Publicar, ocultar o fijar noticias.
  * Crear y calendarizar torneos locales con enlaces de preinscripción.
* **🔌 Analíticas y Marketing Integrado:** Configuración sin código desde la sección de administración para:
  * **Google Tag Manager (GTM):** inyección de ID para conectar Google Analytics 4, Tag Assistant o conversiones de Google Ads.
  * **Meta Pixel (Facebook/Instagram Ads):** medición de eventos de visitas para optimizar campañas de redes sociales.
  * **Microsoft Clarity:** grabación de comportamiento de usuario y mapas térmicos.
* **📰 Automatización de Noticias:** Módulo de lector RSS que consume noticias del mundo TCG de forma automatizada y resiliente con fallbacks.
* **☁️ Integración Supabase:** Conexión directa en tiempo real con Supabase para almacenamiento de datos, autenticación y storage de imágenes de cartas.

---

## 🛠️ Tecnologías Utilizadas

1. **Frontend:** React + Vite.
2. **Estilos:** Vanilla CSS / Tailwind (Configurado para transiciones de temas).
3. **Base de Datos y Backend:** Supabase (PostgreSQL, Row Level Security, Storage de fotos reales).
4. **Despliegue:** Optimizado para Vercel.

---

## 🏁 Comenzando

### Requisitos Previos
* **Node.js** (versión 18 o superior).
* Una cuenta de **Supabase** activa con la estructura de tablas de la base de datos configurada.

### Instalación de Dependencias
```bash
npm install
```

### Configuración de Supabase
Asegúrate de enlazar tus credenciales de API de Supabase modificando las constantes en el archivo:
`src/supabaseClient.js`

### Ejecución en Entorno de Desarrollo
```bash
npm run dev
```

### Compilación para Producción
```bash
npm run build
```

---

## 📄 Licencia y Mención
Este proyecto está liberado bajo licencia abierta para uso comercial y personal. Si utilizas esta plantilla para construir tu tienda, te agradecemos mantener el enlace o mención a **[CardPoint](https://www.cardpoint.cl)** como creadores del diseño original.
