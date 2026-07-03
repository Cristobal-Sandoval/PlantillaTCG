import React from 'react';

export default function StoreLogo({ className = "h-14", showText = true }) {
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
            <span className="text-slate-950 dark:text-white">MI</span>
            <span className="text-[#0052FF]">TIENDA</span>
            <span className="text-slate-950 dark:text-white">.CL</span>
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
