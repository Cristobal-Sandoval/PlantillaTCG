# 🛍️ Plantilla de E-commerce y Catálogo Multi-Propósito (TCG y Más)

Esta es una plantilla de desarrollo altamente optimizada para crear tiendas en línea basadas en catálogos de stock físico con cierres de venta asistidos (vía WhatsApp o mensajes directos de Instagram).

> [!IMPORTANT]
> **Creado por CardPoint** ⚡
> Esta plantilla fue diseñada, desarrollada y liberada por **[CardPoint](https://www.cardpoint.cl)**. Está basada en la arquitectura y experiencia comercial de su plataforma, estructurada como un borrador limpio y genérico para que desarrolladores y emprendedores puedan adaptarla a cualquier rubro: tiendas de cartas coleccionables (TCG como Pokémon, Magic, Yu-Gi-Oh!), tiendas de ropa/moda, tecnología, accesorios, libros o cualquier otro catálogo de productos.

---

## 🚀 Características Principales

* **🛒 Catálogo Dinámico con Filtros Avanzados:** Filtros en tiempo real por categoría (set), rarezas/etiquetas, idioma, estado físico y badges personalizados (como ofertas activas o promociones).
* **💼 Bolsa de Cotización (Carrito Asistido):** Los usuarios seleccionan los productos de interés, aplican cupones de descuento y generan una lista optimizada y formateada en texto plano que pueden copiar con un clic al portapapeles para enviarla por WhatsApp o Instagram DM y coordinar la transferencia manual.
* **🎟️ Administrador de Cupones:** Sistema dinámico administrable para crear códigos de descuento temporales (ej: `PROMO10`), activarlos/desactivarlos o eliminarlos directamente desde el panel de control.
* **🛠️ Panel de Administración Premium:** Interfaz integrada y protegida para:
  * Gestionar el inventario de productos (crear, editar, subir fotos reales del stock físico, modificar cantidad de stock y cambiar visibilidad).
  * Administrar banners promocionales animados de la página principal.
  * Crear y calendarizar torneos locales, eventos presenciales o lanzamientos.
* **🔌 Analíticas y Marketing Integrado:** Configuración sin código desde la sección de administración para:
  * **Google Tag Manager (GTM):** Inyección de ID para conectar Google Analytics 4, Tag Assistant o conversiones de Google Ads.
  * **Meta Pixel (Facebook/Instagram Ads):** Medición de eventos de visitas para optimizar campañas de redes sociales.
  * **Microsoft Clarity:** Grabación de comportamiento de usuario y mapas térmicos.
* **☁️ Integración Supabase:** Conexión directa en tiempo real con Supabase para almacenamiento de datos, autenticación y storage de imágenes.

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
