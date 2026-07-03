import React from 'react';

export default function GoogleAdSlot({ format = "horizontal", className = "" }) {
  return (
    <div className={`w-full bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-[10px] sm:text-xs font-semibold text-slate-400 select-none py-6 px-4 min-h-[80px] my-4 ${className}`}>
      [Espacio de Publicidad / Anuncio Patrocinado]
    </div>
  );
}
