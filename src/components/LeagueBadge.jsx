import React from 'react';

export default function LeagueBadge({ className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-0.5 select-none z-10 ${className}`}>
      {/* Contenedor recortado de la imagen para quitarle el borde blanco de afuera y los puntos negros de las esquinas */}
      <div className="w-9 h-6 sm:w-10.5 sm:h-7 rounded-[3px] sm:rounded-[4px] overflow-hidden flex items-center justify-center bg-white border border-black/35 shadow-md">
        <img 
          src="/league-stamp.png" 
          alt="De Liga" 
          className="w-full h-full object-cover scale-[1.04]" 
          draggable="false"
        />
      </div>
      {/* Texto debajo */}
      <span 
        className="text-[6px] sm:text-[7px] font-black text-black dark:text-black uppercase tracking-wider leading-none text-center"
        style={{ textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' }}
      >
        De Liga
      </span>
    </div>
  );
}
