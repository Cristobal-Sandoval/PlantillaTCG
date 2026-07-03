import React from 'react';
import { 
  Shield, 
  MapPin, 
  Coins, 
  Info, 
  ExternalLink, 
  HelpCircle 
} from 'lucide-react';

export default function Tournaments({
  theme,
  tournamentsLoading,
  displayTournaments
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <span className="text-xs font-black text-[#0052FF] uppercase tracking-widest">COMPETICIÓN LOCAL</span>
        <h2 className="text-3xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">Torneos en Concepción</h2>
        <p className="text-xs text-slate-400 mt-1">Únete a nuestra vibrante comunidad local. ¡El meta competitivo te espera!</p>
      </div>

      {/* Grid de Torneos (Responsive, móvil-first) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournamentsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col justify-between p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] animate-pulse h-[300px]">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                  <div className="space-y-2 flex-grow">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))
        ) : displayTournaments.length === 0 ? (
          <p className="text-slate-450 col-span-3 text-center py-8">No hay torneos programados por el momento.</p>
        ) : (
          displayTournaments.map((t) => (
            <div 
              key={t.id}
              className="flex flex-col justify-between p-6 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all hover:shadow-xl bg-white dark:bg-[#121824]"
            >

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#0052FF] flex flex-col items-center justify-center flex-shrink-0 shadow">
                    <span className="text-2xl font-black leading-none">{t.day}</span>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase mt-0.5">{t.month}</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">{t.title}</h4>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[9px] mt-1">
                      {t.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-350 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-[#0052FF] flex-shrink-0" />
                    <span>Formato: <strong className="text-slate-800 dark:text-slate-100">{t.format}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#0052FF] flex-shrink-0" />
                    <span>Lugar: <strong className="text-slate-800 dark:text-slate-100">{t.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins size={14} className="text-[#0052FF] flex-shrink-0" />
                    <span>Inscripción: <strong className="text-slate-800 dark:text-slate-100">{t.entry_fee}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info size={14} className="text-[#0052FF] flex-shrink-0" />
                    <span>Hora: <strong className="text-slate-800 dark:text-slate-100">{t.time}</strong></span>
                  </div>
                </div>
              </div>

              <a
                href={t.registration_link || "https://instagram.com/tudominio.cl"}
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full text-center bg-[#0052FF] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <span>{t.registration_link ? 'Inscribirse aquí' : 'Inscribirse por Instagram'}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          ))
        )}
      </div>

      {/* Banner Informativo Torneos */}
      <div className="p-6 sm:p-8 rounded-3xl border border-dashed border-[#0052FF]/30 dark:border-[#0052FF]/20 bg-slate-50/50 dark:bg-slate-900/40 text-center max-w-2xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-[#0052FF] mx-auto">
          <HelpCircle size={20} />
        </div>
        <h4 className="font-extrabold text-slate-900 dark:text-white text-base">¿Primera vez jugando torneos?</h4>
        <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
          No te preocupes. Explicamos las reglas básicas de torneos, cómo armar tu decklist y cómo prepararte. Solo necesitas tu mazo de 60 cartas y muchas ganas de divertirte. Escríbenos si tienes dudas.
        </p>
      </div>
    </div>
  );
}
