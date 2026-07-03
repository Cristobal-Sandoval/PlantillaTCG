import React from 'react';
import { HelpCircle } from 'lucide-react';
import GoogleAdSlot from '../components/GoogleAdSlot';

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

export default function HowToBuy({ theme }) {
  return (
    <div className="space-y-12 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-black text-[#0052FF] uppercase tracking-widest">NUESTRA TIENDA</span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Sobre MiTienda</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Somos un equipo apasionado por el juego de cartas coleccionables Pokémon en Concepción. Nos esforzamos por ofrecer las mejores piezas y un servicio cercano y confiable.
        </p>
      </div>

      {/* Historia y Visión */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-[#121824] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="space-y-4">
          <h3 className="text-lg font-black text-[#0052FF]">¿Quiénes Somos?</h3>
          <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
            Fundada en Concepción, tudominio.cl nació con el propósito de conectar a los coleccionistas y jugadores competitivos de la región del Biobío con un inventario actualizado y transparente. 
          </p>
          <p className="text-xs sm:text-sm text-slate-655 dark:text-slate-300 leading-relaxed">
            Garantizamos que el 100% de nuestras cartas sueltas son auténticas y han sido revisadas meticulosamente bajo estándares Near Mint (NM).
          </p>
        </div>
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img 
            src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop" 
            alt="Cartas Coleccionables Pokémon" 
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
            { q: "¿Dónde hacen entregas presenciales?", a: "Entregamos directamente en Concepción Centro, previa coordinación a través de nuestro Instagram oficial @tudominio.cl. También en torneos locales." },
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
          href="https://instagram.com/tudominio.cl"
          target="_blank"
          rel="noreferrer"
          className="inline-flex bg-[#0052FF] hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer mx-auto"
        >
          <Instagram size={15} />
          Contactar en @tudominio.cl
        </a>
      </div>
    </div>
  );
}
