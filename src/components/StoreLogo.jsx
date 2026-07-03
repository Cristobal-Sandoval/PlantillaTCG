import React from 'react';

export default function StoreLogo({ className = "h-14", showText = true }) {
  return (
    <div className={`flex items-center justify-center font-black tracking-tight text-sm sm:text-base text-[#0052FF] select-none ${className}`}>
      [LOGO DE TIENDA]
    </div>
  );
}
