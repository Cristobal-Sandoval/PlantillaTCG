import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useAutoNews } from '../hooks/useAutoNews';
import { useAdmin } from '../hooks/useAdmin';
import { HERO_BANNERS } from '../constants/banners';

// Helper para parsear fechas de noticias (soportando formatos ISO y texto en español "26 de junio de 2026")
const parseNewsDate = (dateStr) => {
  if (!dateStr) return 0;
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return parsed;
  const clean = dateStr.toLowerCase().replace(/\bde\b/g, '').replace(/\s+/g, ' ').trim();
  const months = {
    'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
    'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
    'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12',
    'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04', 'may': '05', 'jun': '06',
    'jul': '07', 'ago': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12'
  };
  const match = clean.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const monthNum = months[match[2]];
    const year = match[3];
    if (monthNum) {
      const parsedIso = Date.parse(`${year}-${monthNum}-${day}T12:00:00`);
      if (!isNaN(parsedIso)) return parsedIso;
    }
  }
  return 0;
};

// ── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IcoCards      = () => <Icon d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5M16 2v4M8 2v4M3 10h7m7 10v-3m0 0V14m0 3h3m-3 0h-3" />;
const IcoNews       = () => <Icon d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zm0 0-2-2V8a2 2 0 0 1 2-2h2M11 6h6M11 10h6M11 14h4" />;
const IcoTrophy     = () => <Icon d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z" />;
const IcoLogout     = () => <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;
const IcoPlus       = () => <Icon d="M12 5v14M5 12h14" />;
const IcoEdit       = () => <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const IcoTrash      = () => <Icon d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />;
const IcoX          = () => <Icon d="M18 6 6 18M6 6l12 12" />;
const IcoCheck      = () => <Icon d="M20 6 9 17l-5-5" />;
const IcoEye        = () => <Icon d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const IcoEyeOff     = () => <Icon d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />;
const IcoImage      = () => <Icon d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21" />;
const IcoMegaphone  = () => <Icon d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />;
const IcoTag        = () => <Icon d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" />;
const IcoChevronLeft  = () => <Icon d="m15 18-6-6 6-6" dSize="16" />;
const IcoChevronRight = () => <Icon d="m9 18 6-6-6-6" dSize="16" />;
const IcoUpload       = () => <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const IcoCamera       = () => <Icon d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10" />;
const IcoPin         = () => <Icon d="M12 17v5M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.5A2 2 0 0 1 15 9.24V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4.24c0 .43-.14.85-.4 1.2l-2.78 3.5a2 2 0 0 0-.44 1.24z" />;
const IcoDatabase    = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
  </svg>
);

// ── RARITY OPTIONS ───────────────────────────────────────────────────────────
const RARITIES = ['Común', 'Poco Común', 'Rara', 'Doble Rara', 'Ultra Rara', 'Ilustración Rara', 'Especial Ilustración Rara', 'Ultra Rara Secreta', 'Secreta Dorada', 'Hyper Rara'];
const ERAS = ['Escarlata y Púrpura', 'Espada y Escudo', 'SM - Sol y Luna', 'XY', 'Black & White', 'Otras'];
const CONDITIONS = ['NM', 'LP', 'MP', 'HP', 'DMG'];
const LANGUAGES = ['Español', 'Inglés', 'Japonés', 'Otro'];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const today = () => new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });

const compressImage = (file, maxDimension = 800, quality = 0.85) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            quality
          );
        } catch (err) {
          console.error('Image compression error:', err);
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

// ============================================================
// MODAL BASE
// ============================================================
function Modal({ title, onClose, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 bg-[#0f1117] border border-white/10 rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <IcoX />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── FORM FIELD COMPONENTS ─────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF]/60 focus:bg-white/8 transition-all";
const selectCls = "w-full bg-[#1a1d26] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0052FF]/60 transition-all";

// ============================================================
// NOTIFICATION TOAST
// ============================================================
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-semibold transition-all
      ${type === 'success' ? 'bg-green-900/90 border-green-500/40 text-green-300' : 'bg-red-900/90 border-red-500/40 text-red-300'}`}>
      {type === 'success' ? <IcoCheck /> : <IcoX />}
      {message}
    </div>
  );
}

// ============================================================
// DELETE CONFIRM MODAL
// ============================================================
function DeleteConfirm({ item, label, onConfirm, onClose }) {
  return (
    <Modal title="Confirmar eliminación" onClose={onClose}>
      <p className="text-slate-300 mb-6">¿Estás seguro de que quieres eliminar <span className="text-white font-semibold">"{label}"</span>? Esta acción no se puede deshacer.</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-all">Cancelar</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all">Eliminar</button>
      </div>
    </Modal>
  );
}

// ============================================================
// CARDS ADMIN SECTION
// ============================================================
function AdminCards({ toast }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const emptyForm = { name: '', set: 'Escarlata y Púrpura', set_code: '', rarity: 'Rara', price: '', condition: 'NM', image: '', real_photo: '', description: '', in_stock: true, idioma: 'Español', is_reverse: false, is_league: false, stock: 1, is_offer: false, offer_price: '' };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [apiSearching, setApiSearching] = useState(false);
  const [apiResults, setApiResults] = useState([]);
  const [apiSearchError, setApiSearchError] = useState(null); // null | 'no_results' | 'timeout' | 'error'
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [adminSearch, setAdminSearch] = useState('');
  const itemsPerPage = 10;

  // Reset pagination when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [adminSearch]);

  const filteredCards = useMemo(() => {
    if (!adminSearch) return cards;
    const q = adminSearch.toLowerCase();
    return cards.filter(c => 
      (c.name || '').toLowerCase().includes(q) ||
      (c.set || '').toLowerCase().includes(q) ||
      (c.rarity || '').toLowerCase().includes(q)
    );
  }, [cards, adminSearch]);

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedCards = useMemo(() => {
    return filteredCards.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  }, [filteredCards, activePage, itemsPerPage]);

  const handleApiSearch = async () => {
    if (!form.name) return;
    setApiSearching(true);
    setApiResults([]);
    setApiSearchError(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=name:"${form.name}"&pageSize=250`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      const data = await res.json();
      const results = data.data || [];
      if (results.length === 0) {
        setApiSearchError('no_results');
      } else {
        setApiResults(results);
      }
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        setApiSearchError('timeout');
      } else {
        setApiSearchError('error');
      }
    }
    setApiSearching(false);
  };

  const selectApiResult = (card) => {
    setForm(prev => ({
      ...prev,
      image: card.images?.large || card.images?.small || '',
      set: card.set?.name || prev.set,
      set_code: (card.set?.id || '').toUpperCase(),
      rarity: card.rarity || prev.rarity
    }));
    setApiResults([]);
  };

  // Upload real photo to ImgBB (free, unlimited)
  const IMGBB_KEY = '149aebd904174718dea8f1c5eb444935';
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      toast('Optimizando imagen...', 'info');
      const compressedFile = await compressImage(file, 800, 0.85);
      const formData = new FormData();
      formData.append('image', compressedFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'Error al subir');
      const directUrl = data.data.display_url || data.data.url;
      setForm(prev => ({ ...prev, real_photo: directUrl }));
      toast('Foto subida a ImgBB ✓', 'success');
    } catch (err) {
      toast('Error al subir: ' + err.message, 'error');
    }
    setUploadingPhoto(false);
    e.target.value = '';
  };

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('cards').select('*').order('created_at', { ascending: false });
    setCards(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditingCard(null); setApiResults([]); setShowForm(true); };
  const openEdit = (card) => { setForm({ ...card, idioma: card.idioma || 'Español', is_reverse: !!card.is_reverse, is_league: !!card.is_league, stock: card.stock ?? 1, is_offer: !!card.is_offer, offer_price: card.offer_price || '' }); setEditingCard(card); setApiResults([]); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { 
      ...form, 
      price: parseInt(form.price) || 0,
      offer_price: form.is_offer && form.offer_price ? parseInt(form.offer_price) || 0 : null
    };
    let error;
    if (editingCard) {
      ({ error } = await supabase.from('cards').update(payload).eq('id', editingCard.id));
    } else {
      ({ error } = await supabase.from('cards').insert([payload]));
    }
    setSaving(false);
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    toast(editingCard ? 'Carta actualizada ✓' : 'Carta agregada ✓', 'success');
    setShowForm(false);
    load();
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('cards').delete().eq('id', deleteTarget.id);
    if (error) { toast('Error al eliminar: ' + error.message, 'error'); }
    else { toast('Carta eliminada ✓', 'success'); load(); }
    setDeleteTarget(null);
  };

  const toggleStock = async (card) => {
    await supabase.from('cards').update({ in_stock: !card.in_stock }).eq('id', card.id);
    load();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos en Stock</h1>
          <p className="text-slate-400 text-sm mt-1">
            {adminSearch ? `${filteredCards.length} de ` : ''}{cards.length} productos registrados
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, categoría..."
              value={adminSearch}
              onChange={e => setAdminSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] w-full sm:w-64 transition-all"
            />
            {adminSearch && (
              <button 
                onClick={() => setAdminSearch('')} 
                className="absolute right-3 top-2 text-slate-550 hover:text-white transition-colors text-sm font-black"
              >
                ✕
              </button>
            )}
          </div>
          <button onClick={openAdd} className="flex items-center justify-center gap-2 bg-[#0052FF] hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/30 whitespace-nowrap">
            <IcoPlus /> Nuevo Producto
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-500">Cargando cartas...</div>
      ) : (
        <div>
          <div className="overflow-x-auto rounded-2xl border border-white/8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/8">
                  {['Imagen','Nombre','Idioma','Set','Rareza','Precio','Condición','Stock','Visible','Acciones'].map(h => (
                    <th key={h} className="px-3 py-2.5 sm:px-4 sm:py-3 text-left text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedCards.map(card => (
                  <tr key={card.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-3 py-2 sm:px-4 sm:py-3">
                      <img src={card.image} alt={card.name} className="w-8 h-11 sm:w-10 sm:h-14 object-cover rounded-lg" onError={e => e.target.style.display='none'} />
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-white max-w-[120px] sm:max-w-[160px] truncate">
                      {card.name}
                      {card.is_reverse && <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase">Reverse</span>}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3">
                      <span className="px-1.5 py-0.5 bg-purple-900/40 text-purple-300 text-[9px] sm:text-[10px] uppercase font-bold rounded-lg border border-purple-500/20">
                        {card.idioma || 'Español'}
                      </span>
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-slate-400 text-xs sm:text-sm max-w-[100px] sm:max-w-[140px] truncate">{card.set}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-slate-400 text-[11px] sm:text-xs max-w-[100px] sm:max-w-[140px] truncate">{card.rarity}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-green-400 font-bold whitespace-nowrap text-xs sm:text-sm">
                      {card.is_offer && card.offer_price ? (
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] text-slate-500 line-through leading-tight">${(card.price || 0).toLocaleString('es-CL')}</span>
                          <span className="text-red-400 font-black leading-tight">${(card.offer_price || 0).toLocaleString('es-CL')}</span>
                        </div>
                      ) : (
                        <span>${(card.price || 0).toLocaleString('es-CL')}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3">
                      <span className="px-1.5 py-0.5 bg-blue-900/40 text-blue-300 text-[10px] sm:text-xs rounded-lg font-bold">
                        {card.condition}
                      </span>
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-slate-300 text-center font-bold text-xs sm:text-sm">{card.stock ?? 1}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3">
                      <button onClick={() => toggleStock(card)} className={`w-8 h-4.5 sm:w-10 sm:h-5 rounded-full transition-all ${card.in_stock ? 'bg-green-500' : 'bg-slate-600'}`}>
                        <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full mx-0.5 transition-transform ${card.in_stock ? 'translate-x-3.5 sm:translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(card)} className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 transition-all"><IcoEdit /></button>
                        <button onClick={() => setDeleteTarget(card)} className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-red-600/20 text-slate-400 hover:text-red-400 transition-all"><IcoTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCards.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                {adminSearch ? 'No se encontraron cartas para tu búsqueda.' : 'No hay cartas registradas aún.'}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-6 pt-6 border-t border-white/5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={activePage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <IcoChevronLeft />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    activePage === page
                      ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 border border-white/5 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={activePage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <IcoChevronRight />
              </button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <Modal title={editingCard ? 'Editar Producto' : 'Nuevo Producto'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Nombre">
              <input className={inputCls} required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ej: Nombre de Producto" />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Idioma">
                <select className={selectCls} value={form.idioma} onChange={e => setForm({...form, idioma: e.target.value})}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Era / Set">
                <input
                  className={inputCls}
                  value={form.set}
                  onChange={e => setForm({...form, set: e.target.value})}
                  placeholder="Ej: Escarlata y Púrpura"
                  list="eras-list"
                />
                <datalist id="eras-list">
                  {['Escarlata y Púrpura','Espada y Escudo','SM - Sol y Luna','XY','Black & White','Otras'].map(e => (
                    <option key={e} value={e} />
                  ))}
                </datalist>
              </Field>
              <Field label="Código de Set">
                <input
                  className={inputCls}
                  value={form.set_code}
                  onChange={e => setForm({...form, set_code: e.target.value.toUpperCase()})}
                  placeholder="Ej: SV4F"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Rareza">
                <select className={selectCls} value={form.rarity} onChange={e => setForm({...form, rarity: e.target.value})}>
                  {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Condición">
                <select className={selectCls} value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Stock (Cantidad)"><input className={inputCls} type="number" required min="0" value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value) || 0})} placeholder="Ej: 1" /></Field>
              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2.5 cursor-pointer select-none pb-2.5">
                  <div className={`w-11 h-6 rounded-full transition-all flex-shrink-0 ${form.is_reverse ? 'bg-amber-500' : 'bg-slate-600'}`} onClick={() => setForm({...form, is_reverse: !form.is_reverse})}>
                    <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${form.is_reverse ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Reverse Holo</span>
                </label>
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2.5 cursor-pointer select-none pb-2.5">
                  <div className={`w-11 h-6 rounded-full transition-all flex-shrink-0 ${form.is_league ? 'bg-rose-500' : 'bg-slate-600'}`} onClick={() => setForm({...form, is_league: !form.is_league})}>
                    <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${form.is_league ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Carta de Liga</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Precio Normal (CLP)">
                <input className={inputCls} type="number" required min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Ej: 5000" />
              </Field>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none pt-6">
                  <div className={`w-11 h-6 rounded-full transition-all flex-shrink-0 ${form.is_offer ? 'bg-red-500' : 'bg-slate-600'}`} onClick={() => setForm({...form, is_offer: !form.is_offer})}>
                    <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${form.is_offer ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">🔥 Poner en Oferta</span>
                </label>
              </div>
            </div>

            {form.is_offer && (
              <Field label="Precio Oferta (CLP)">
                <input className={inputCls} type="number" required min="0" value={form.offer_price} onChange={e => setForm({...form, offer_price: e.target.value})} placeholder="Ej: 3990" />
              </Field>
            )}
            <Field label="URL de Imagen (API / Oficial)">
              <input className={inputCls} value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://images.pokemontcg.io/..." />
            </Field>
            {form.image && <img src={form.image} alt="preview" className="w-20 h-28 object-contain rounded-xl border border-white/10 mx-auto" />}
            <Field label="📸 Foto Real de tu Carta">
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  value={form.real_photo || ''}
                  onChange={e => setForm({...form, real_photo: e.target.value})}
                  placeholder="Pega URL directa o sube un archivo →"
                />
                <label className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                  uploadingPhoto
                    ? 'bg-slate-700 border-white/10 text-slate-400 cursor-not-allowed'
                    : 'bg-green-600/20 border-green-500/40 text-green-400 hover:bg-green-600/30'
                }`}>
                  {uploadingPhoto ? 'Subiendo...' : '↑ Subir'}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                </label>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Sube desde tu dispositivo directo, o pega un enlace de <strong className="text-slate-400">postimages.org</strong>.</p>
            </Field>
            {form.real_photo && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Vista previa: Foto Real</span>
                <img src={form.real_photo} alt="preview real" className="w-20 h-28 object-cover rounded-xl border-2 border-green-500/40 mx-auto shadow-lg" />
              </div>
            )}
            <Field label="Descripción"><textarea className={`${inputCls} resize-none`} rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Descripción de la carta..." /></Field>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className={`w-11 h-6 rounded-full transition-all ${form.in_stock ? 'bg-[#0052FF]' : 'bg-slate-600'}`} onClick={() => setForm({...form, in_stock: !form.in_stock})}>
                <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${form.in_stock ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-slate-300">{form.in_stock ? 'Visible en catálogo' : 'Oculta del catálogo'}</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-all">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#0052FF] hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
                {saving ? 'Guardando...' : editingCard ? 'Guardar cambios' : 'Agregar carta'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showBulkImport && (
        <BulkImportModal 
          onClose={() => setShowBulkImport(false)} 
          onImportSuccess={load} 
          toast={toast} 
        />
      )}

      {deleteTarget && (
        <DeleteConfirm label={deleteTarget.name} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}

// ============================================================
// NEWS ADMIN SECTION
// ============================================================
function AdminNews({ toast }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const { adminSettings, updateSetting } = useAdmin();
  const hiddenNewsIds = adminSettings?.hidden_news || [];
  const pinnedNewsIds = adminSettings?.pinned_news || [];
  const newsSources = adminSettings?.news_sources || { pokemon: true, tcgnews: true, autogenerate: true };
  const { autoNews, loadingAuto } = useAutoNews(newsSources);

  const togglePinNews = async (id) => {
    const next = pinnedNewsIds.includes(id)
      ? pinnedNewsIds.filter(pId => pId !== id)
      : [...pinnedNewsIds, id];
    await updateSetting('pinned_news', next);
  };

  const handleToggleSource = async (key) => {
    const nextSources = {
      ...newsSources,
      [key]: !newsSources[key]
    };
    await updateSetting('news_sources', nextSources);
  };

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const emptyForm = { title: '', date: today(), summary: '', content: '', image: '', published: true };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    setNews(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const [cleaned, setCleaned] = useState(false);

  useEffect(() => {
    if (adminSettings && Object.keys(adminSettings).length > 0 && !cleaned) {
      const cleanOldNews = async () => {
        try {
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          const isoString = sixMonthsAgo.toISOString();

          const { data: oldNews } = await supabase
            .from('news')
            .select('id')
            .lt('created_at', isoString);

          if (oldNews && oldNews.length > 0) {
            const idsToDelete = oldNews
              .map(n => n.id)
              .filter(id => !pinnedNewsIds.includes(id));

            if (idsToDelete.length > 0) {
              await supabase.from('news').delete().in('id', idsToDelete);
              console.log(`Auto-limpieza de noticias: ${idsToDelete.length} eliminadas.`);
              load();
            }
          }
          setCleaned(true);
        } catch (err) {
          console.warn("Auto-limpieza de noticias falló:", err);
        }
      };
      cleanOldNews();
    }
  }, [adminSettings, pinnedNewsIds, cleaned]);

  const openAdd = () => { setForm({...emptyForm, date: today()}); setEditingItem(null); setShowForm(true); };
  const openEdit = (item) => {
    setForm({
      title: item.title || '',
      date: item.date || today(),
      summary: item.summary || '',
      content: item.content || '',
      image: item.image || '',
      published: item.published !== undefined ? item.published : true
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let error;
    
    if (editingItem && !editingItem.isExternal) {
      // Editar noticia manual existente
      ({ error } = await supabase.from('news').update(form).eq('id', editingItem.id));
    } else {
      // Crear nueva noticia manual (o importar y editar una autogenerada)
      ({ error } = await supabase.from('news').insert([form]));
      
      // Si era una noticia autogenerada, la ocultamos en el feed original para evitar duplicaciones
      if (editingItem && editingItem.isExternal) {
        try {
          const next = hiddenNewsIds.includes(editingItem.id) 
            ? hiddenNewsIds 
            : [...hiddenNewsIds, editingItem.id];
          await updateSetting('hidden_news', next);
        } catch (hideErr) {
          console.error("Error al ocultar noticia autogenerada original:", hideErr);
        }
      }
    }
    
    setSaving(false);
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    
    toast(
      editingItem && !editingItem.isExternal 
        ? 'Noticia actualizada ✓' 
        : editingItem && editingItem.isExternal 
          ? 'Noticia autogenerada editada y guardada ✓' 
          : 'Noticia publicada ✓', 
      'success'
    );
    setShowForm(false);
    load();
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('news').delete().eq('id', deleteTarget.id);
    if (error) { toast('Error: ' + error.message, 'error'); }
    else { toast('Noticia eliminada ✓', 'success'); load(); }
    setDeleteTarget(null);
  };

  const togglePublish = async (item) => {
    await supabase.from('news').update({ published: !item.published }).eq('id', item.id);
    load();
  };

  const toggleHideAutoNews = async (id) => {
    const next = hiddenNewsIds.includes(id) 
      ? hiddenNewsIds.filter(nId => nId !== id) 
      : [...hiddenNewsIds, id];
    await updateSetting('hidden_news', next);
  };

  const combinedNews = useMemo(() => {
    const list = [...news, ...autoNews];
    return list.sort((a, b) => {
      const aPinned = pinnedNewsIds.includes(a.id);
      const bPinned = pinnedNewsIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      const timeA = a.created_at ? new Date(a.created_at).getTime() : parseNewsDate(a.date);
      const timeB = b.created_at ? new Date(b.created_at).getTime() : parseNewsDate(b.date);
      return timeB - timeA;
    });
  }, [news, autoNews, pinnedNewsIds]);

  const totalPages = Math.ceil(combinedNews.length / itemsPerPage);
  const paginatedNews = combinedNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const isFullyLoading = loading || loadingAuto;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Noticias</h1>
          <p className="text-slate-400 text-sm mt-1">{combinedNews.length} artículos en total ({autoNews.length} automáticos)</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#0052FF] hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/30">
          <IcoPlus /> Nueva Noticia
        </button>
      </div>

      {isFullyLoading ? (
        <div className="flex items-center justify-center h-48 text-slate-500">Cargando noticias...</div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {paginatedNews.map(item => (
              <div key={item.id} className={`flex items-center gap-4 bg-white/3 border rounded-2xl p-4 hover:bg-white/5 transition-all ${pinnedNewsIds.includes(item.id) ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/8 bg-white/3'}`}>
                {item.image && <img src={item.image} alt={item.title} className="w-16 h-12 object-cover rounded-xl flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white truncate">{item.title}</h3>
                    {pinnedNewsIds.includes(item.id) && (
                      <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
                        📌 Fijada
                      </span>
                    )}
                    {item.isExternal ? (
                      <div className="flex items-center gap-1.5">
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0052FF]/20 text-[#4d8aff] border border-[#0052FF]/30">
                          Automática
                        </span>
                        {hiddenNewsIds.includes(item.id) && (
                          <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-900/50 text-red-400 border border-red-500/30">
                            Ocultada
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.published ? 'bg-green-900/50 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                        {item.published ? 'Publicada' : 'Borrador'}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{item.date} · {item.summary?.slice(0,80)}...</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.isExternal ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleHideAutoNews(item.id)} title={hiddenNewsIds.includes(item.id) ? 'Mostrar en tienda' : 'Ocultar de tienda'} className={`p-2 rounded-lg bg-white/5 transition-all ${hiddenNewsIds.includes(item.id) ? 'text-red-400 hover:bg-red-600/20' : 'text-slate-400 hover:text-green-400 hover:bg-green-600/20'}`}>
                        {hiddenNewsIds.includes(item.id) ? <IcoEyeOff /> : <IcoEye />}
                      </button>
                      <button onClick={() => openEdit(item)} title="Editar y guardar copia local" className="p-2 rounded-lg bg-white/5 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 transition-all">
                        <IcoEdit />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => togglePinNews(item.id)} 
                        title={pinnedNewsIds.includes(item.id) ? 'Desfijar de arriba' : 'Fijar arriba (Pin)'} 
                        className={`p-2 rounded-lg bg-white/5 transition-all ${
                          pinnedNewsIds.includes(item.id) 
                            ? 'text-amber-400 hover:bg-amber-600/20 bg-amber-500/10' 
                            : 'text-slate-400 hover:text-amber-400 hover:bg-amber-600/20'
                        }`}
                      >
                        <IcoPin />
                      </button>
                      <button onClick={() => togglePublish(item)} title={item.published ? 'Ocultar' : 'Publicar'} className="p-2 rounded-lg bg-white/5 hover:bg-yellow-600/20 text-slate-400 hover:text-yellow-400 transition-all">
                        {item.published ? <IcoEyeOff /> : <IcoEye />}
                      </button>
                      <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 transition-all"><IcoEdit /></button>
                      <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-lg bg-white/5 hover:bg-red-600/20 text-slate-400 hover:text-red-400 transition-all"><IcoTrash /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {combinedNews.length === 0 && <div className="text-center py-16 text-slate-500">No hay noticias registradas aún.</div>}
          </div>

          {totalPages > 0 && (
            <div className="flex items-center justify-center gap-1.5 mt-6 pt-6 border-t border-white/5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-slate-450 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <IcoChevronLeft />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 border border-white/5 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-slate-450 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <IcoChevronRight />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Configuración de Fuentes de Noticias */}
      <div className="mt-8 bg-white/3 border border-white/8 rounded-3xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            ⚙️ Configuración de Noticias Autogeneradas
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Elige qué portales externos se utilizarán para alimentar la sección de noticias de la tienda de forma automática.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl">
            <div>
              <span className="text-sm font-semibold text-white block">Habilitar Noticias Autogeneradas</span>
              <span className="text-xs text-slate-500 block">Si se desactiva, solo se mostrarán las noticias manuales que crees aquí. (Proveedor: TCGnews)</span>
            </div>
            <button 
              onClick={() => handleToggleSource('autogenerate')} 
              className={`w-11 h-6 rounded-full transition-all relative flex items-center cursor-pointer ${
                newsSources.autogenerate ? 'bg-[#0052FF]' : 'bg-slate-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                newsSources.autogenerate ? 'translate-x-5.5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <Modal title={editingItem ? 'Editar Noticia' : 'Nueva Noticia'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Título"><input className={inputCls} required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Título de la noticia" /></Field>
            <Field label="Fecha"><input className={inputCls} value={form.date} onChange={e => setForm({...form, date: e.target.value})} placeholder="10 de Mayo, 2026" /></Field>
            <Field label="Resumen"><input className={inputCls} required value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} placeholder="Descripción breve..." /></Field>
            <Field label="Contenido completo"><textarea className={`${inputCls} resize-none`} rows={5} required value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Texto completo de la noticia..." /></Field>
            <Field label="URL de Imagen"><input className={inputCls} value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://images.unsplash.com/..." /></Field>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className={`w-11 h-6 rounded-full transition-all ${form.published ? 'bg-[#0052FF]' : 'bg-slate-600'}`} onClick={() => setForm({...form, published: !form.published})}>
                <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${form.published ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-slate-300">{form.published ? 'Publicada' : 'Guardar como borrador'}</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-all">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#0052FF] hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
                {saving ? 'Guardando...' : editingItem ? 'Guardar cambios' : 'Publicar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {deleteTarget && <DeleteConfirm label={deleteTarget.title} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ============================================================
// TOURNAMENTS ADMIN SECTION
// ============================================================
function AdminTournaments({ toast }) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const emptyForm = { 
    day: '', 
    month: 'ENE', 
    title: '', 
    format: 'Estándar', 
    location: 'Concepción, Chile', 
    time: '15:00 hrs', 
    entry_fee: '$5.000', 
    status: 'Inscripciones Abiertas',
    is_recurring: false,
    recurring_days: '',
    registration_link: '',
    specific_date: ''
  };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const MONTHS = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const FORMATS = ['Estándar', 'Expandido', 'Libre', 'Draft'];
  const STATUSES = ['Inscripciones Abiertas', 'Próximamente', 'Lleno', 'Finalizado'];

  const handleSpecificDateChange = (val) => {
    if (val) {
      const parts = val.split('-'); // YYYY-MM-DD
      if (parts.length === 3) {
        const dayStr = String(parseInt(parts[2], 10)); // ej: "05" -> "5"
        const monthIndex = parseInt(parts[1], 10) - 1;
        const monthStr = MONTHS[monthIndex] || 'ENE';
        setForm(prev => ({
          ...prev,
          specific_date: val,
          day: dayStr,
          month: monthStr
        }));
        return;
      }
    }
    setForm(prev => ({ ...prev, specific_date: val }));
  };

  const handleRecurringDayChange = (day, checked) => {
    const currentDays = form.recurring_days ? form.recurring_days.split(',') : [];
    let nextDays;
    if (checked) {
      nextDays = [...currentDays, day];
    } else {
      nextDays = currentDays.filter(d => d !== day);
    }
    // Mantener orden lógico de la semana
    const sortedDays = WEEK_DAYS.filter(d => nextDays.includes(d));
    setForm(prev => ({ ...prev, recurring_days: sortedDays.join(',') }));
  };

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('tournaments').select('*').order('created_at', { ascending: true });
    setTournaments(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditingItem(null); setShowForm(true); };
  const openEdit = (item) => { setForm({ ...item }); setEditingItem(item); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let error;
    
    // Convertir specific_date vacía en null para evitar error de sintaxis de fecha en Postgres
    const payload = { ...form };
    if (!payload.specific_date || payload.specific_date.trim() === '') {
      payload.specific_date = null;
    }

    if (editingItem) {
      ({ error } = await supabase.from('tournaments').update(payload).eq('id', editingItem.id));
    } else {
      ({ error } = await supabase.from('tournaments').insert([payload]));
    }
    setSaving(false);
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    toast(editingItem ? 'Torneo actualizado ✓' : 'Torneo creado ✓', 'success');
    setShowForm(false);
    load();
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('tournaments').delete().eq('id', deleteTarget.id);
    if (error) { toast('Error: ' + error.message, 'error'); }
    else { toast('Torneo eliminado ✓', 'success'); load(); }
    setDeleteTarget(null);
  };

  const statusColor = (s) => {
    if (s === 'Inscripciones Abiertas') return 'bg-green-900/50 text-green-400';
    if (s === 'Próximamente') return 'bg-yellow-900/50 text-yellow-400';
    if (s === 'Lleno') return 'bg-red-900/50 text-red-400';
    return 'bg-slate-700 text-slate-400';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Torneos</h1>
          <p className="text-slate-400 text-sm mt-1">{tournaments.length} torneos registrados</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#0052FF] hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/30">
          <IcoPlus /> Nuevo Torneo
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-500">Cargando torneos...</div>
      ) : (
        <div className="space-y-3">
          {tournaments.map(t => (
            <div key={t.id} className="flex items-center gap-4 bg-white/3 border border-white/8 rounded-2xl p-4 hover:bg-white/5 transition-all">
              <div className="w-14 h-14 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/30 flex flex-col items-center justify-center flex-shrink-0 text-center">
                {t.is_recurring ? (
                  <>
                    <span className="text-lg font-black text-white leading-none">🔄</span>
                    <span className="text-[8px] font-black text-[#0052FF] uppercase mt-0.5">Recur</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl font-black text-white leading-none">{t.day}</span>
                    <span className="text-[10px] font-bold text-[#0052FF] uppercase">{t.month}</span>
                  </>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white">{t.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor(t.status)}`}>{t.status}</span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">
                  {t.is_recurring ? `Repite: ${t.recurring_days || 'Sin días'}` : `Fecha: ${t.specific_date || (t.day + ' ' + t.month)}`} · {t.format} · {t.location} · {t.time} · {t.entry_fee}
                </p>
                {t.registration_link && (
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">Inscripción: {t.registration_link}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(t)} className="p-2 rounded-lg bg-white/5 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 transition-all"><IcoEdit /></button>
                <button onClick={() => setDeleteTarget(t)} className="p-2 rounded-lg bg-white/5 hover:bg-red-600/20 text-slate-400 hover:text-red-400 transition-all"><IcoTrash /></button>
              </div>
            </div>
          ))}
          {tournaments.length === 0 && <div className="text-center py-16 text-slate-500">No hay torneos registrados aún.</div>}
        </div>
      )}

      {showForm && (
        <Modal title={editingItem ? 'Editar Torneo' : 'Nuevo Torneo'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tipo de Torneo">
                <select className={selectCls} value={form.is_recurring ? 'recurring' : 'manual'} onChange={e => setForm({...form, is_recurring: e.target.value === 'recurring'})}>
                  <option value="manual">Manual (Fecha Única)</option>
                  <option value="recurring">Recurrente (Semanal)</option>
                </select>
              </Field>
              <Field label="Nombre del Torneo">
                <input className={inputCls} required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Ej: Copa MiTienda" />
              </Field>
            </div>

            {form.is_recurring ? (
              <Field label="Días de la Semana (Repetición)">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {WEEK_DAYS.map(d => {
                    const isChecked = (form.recurring_days || '').split(',').includes(d);
                    return (
                      <label key={d} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={e => handleRecurringDayChange(d, e.target.checked)}
                          className="rounded border-white/10 bg-white/5 text-[#0052FF] focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                        <span>{d}</span>
                      </label>
                    );
                  })}
                </div>
              </Field>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha del Torneo">
                  <input 
                    type="date" 
                    className={inputCls} 
                    required={!form.is_recurring}
                    value={form.specific_date || ''} 
                    onChange={e => handleSpecificDateChange(e.target.value)} 
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2 opacity-60 pointer-events-none">
                  <Field label="Día"><input className={inputCls} readOnly value={form.day} placeholder="Auto" /></Field>
                  <Field label="Mes"><input className={selectCls} readOnly value={form.month} placeholder="Auto" /></Field>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Field label="Formato">
                <select className={selectCls} value={form.format} onChange={e => setForm({...form, format: e.target.value})}>
                  {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Horario"><input className={inputCls} value={form.time} onChange={e => setForm({...form, time: e.target.value})} placeholder="15:00 hrs" /></Field>
            </div>
            
            <Field label="Ubicación"><input className={inputCls} value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Concepción, Chile" /></Field>
            
            <Field label="Enlace de Inscripción (Instagram / URL)"><input className={inputCls} value={form.registration_link || ''} onChange={e => setForm({...form, registration_link: e.target.value})} placeholder="Ej: https://instagram.com/cuchostore.cl" /></Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Inscripción"><input className={inputCls} value={form.entry_fee} onChange={e => setForm({...form, entry_fee: e.target.value})} placeholder="$5.000" /></Field>
              <Field label="Estado">
                <select className={selectCls} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-all">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#0052FF] hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
                {saving ? 'Guardando...' : editingItem ? 'Guardar cambios' : 'Crear torneo'}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {deleteTarget && <DeleteConfirm label={deleteTarget.title} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ============================================================
// BANNERS ADMIN SECTION
// ============================================================
function AdminBanners({ toast }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('admin_settings').select('data').eq('id', 'custom_banners').single();
    setBanners(data?.data?.length > 0 ? data.data : HERO_BANNERS);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveBanners = async (newBanners) => {
    setSaving(true);
    const { error } = await supabase.from('admin_settings').upsert({ 
      id: 'custom_banners', 
      data: newBanners, 
      updated_at: new Date().toISOString() 
    });
    setSaving(false);
    if (error) { toast('Error: ' + error.message, 'error'); }
    else { toast('Banners guardados ✓', 'success'); setBanners(newBanners); }
  };

  const addBanner = () => {
    const next = [...banners, { id: Date.now().toString(), type: 'image', imageUrl: '', linkUrl: '', active: true }];
    setBanners(next);
  };

  const updateBanner = (id, key, val) => {
    const next = banners.map(b => b.id === id ? { ...b, [key]: val } : b);
    setBanners(next);
  };

  const removeBanner = (id) => {
    const next = banners.filter(b => b.id !== id);
    setBanners(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Banners Principales</h1>
          <p className="text-slate-400 text-sm mt-1">Configura las imágenes del carrusel. Si desactivas todos, se usarán los predeterminados.</p>
          <p className="text-[#0052FF] text-xs font-semibold mt-2">Recomendación: Usa imágenes de 1920x640 px (proporción 3:1) y mantén el texto al centro.</p>
        </div>
        <button onClick={() => saveBanners(banners)} disabled={saving} className="flex items-center gap-2 bg-[#0052FF] hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-500">Cargando banners...</div>
      ) : (
        <div className="space-y-4">
          {banners.map((b, idx) => (
            <div key={b.id} className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:bg-white/5 transition-all">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">Banner #{idx + 1}</h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className={`text-xs font-bold ${b.active !== false ? 'text-green-400' : 'text-slate-500'}`}>{b.active !== false ? 'Activo' : 'Oculto'}</span>
                    <div className={`w-9 h-5 rounded-full transition-all ${b.active !== false ? 'bg-green-500' : 'bg-slate-600'}`} onClick={() => updateBanner(b.id, 'active', b.active === false ? true : false)}>
                      <div className={`w-3.5 h-3.5 bg-white rounded-full mt-[3px] transition-transform ${b.active !== false ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                  </label>
                  <button onClick={() => removeBanner(b.id)} className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-600/30 transition-all"><IcoTrash /></button>
                </div>
              </div>
              
              {/* VISTA PREVIA DEL BANNER */}
              {b.type === 'ui' ? (
                <div className="mb-4 relative w-full h-32 md:h-48 rounded-xl overflow-hidden border border-[#0052FF]/30 bg-gradient-to-br from-[#0052FF] to-blue-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xl drop-shadow-md">Tienda TCG (Banner Animado)</span>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/40 backdrop-blur-sm rounded text-[10px] font-bold text-white uppercase tracking-wider">
                    Predeterminado del sistema
                  </div>
                </div>
              ) : b.imageUrl && (
                <div className="mb-4 relative w-full h-32 md:h-48 rounded-xl overflow-hidden border border-white/10 bg-slate-900 flex items-center">
                  <img src={b.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: `center ${b.alignmentY ?? 50}%` }} />
                  <div className={`absolute inset-0 pointer-events-none ${
                    (b.title || b.subtitle) 
                      ? b.alignmentX === 'right'
                        ? 'bg-gradient-to-l from-black/85 via-black/55 to-transparent'
                        : b.alignmentX === 'center'
                          ? 'bg-black/55'
                          : 'bg-gradient-to-r from-black/85 via-black/55 to-transparent' 
                      : 'bg-gradient-to-t from-black/40 via-transparent to-transparent'
                  }`} />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[8px] font-bold text-white uppercase tracking-wider z-20">
                    Vista Previa
                  </div>

                  {/* Texto superpuesto en la vista previa del administrador */}
                  {(b.title || b.subtitle || b.badge) && (
                    <div className={`relative z-10 px-6 w-full space-y-1 ${
                      b.alignmentX === 'right' 
                        ? 'text-right pr-6 pl-12 flex flex-col items-end' 
                        : b.alignmentX === 'center' 
                          ? 'text-center px-12 flex flex-col items-center' 
                          : 'text-left pl-6 pr-12 flex flex-col items-start'
                    }`}>
                      {b.badge && (
                        <div className="inline-block px-1.5 py-0.5 bg-[#0052FF]/20 border border-[#0052FF]/30 text-[#4d8aff] text-[7px] md:text-[8px] font-black uppercase rounded">
                          {b.badge}
                        </div>
                      )}
                      {b.title && (
                        <div className="text-white font-black text-xs md:text-sm leading-tight drop-shadow">
                          {b.title}
                        </div>
                      )}
                      {b.subtitle && (
                        <div className="text-slate-300 text-[8px] md:text-[9px] line-clamp-2 leading-tight drop-shadow max-w-[200px]">
                          {b.subtitle}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {b.type !== 'ui' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="URL de la Imagen">
                      <input className={inputCls} value={b.imageUrl || ''} onChange={e => updateBanner(b.id, 'imageUrl', e.target.value)} placeholder="https://..." />
                    </Field>
                    <Field label="Enlace al hacer clic (Opcional)">
                      <input className={inputCls} value={b.linkUrl || ''} onChange={e => updateBanner(b.id, 'linkUrl', e.target.value)} placeholder="https://..." />
                    </Field>
                  </div>

                  {b.imageUrl && (
                    <div className="bg-white/3 p-4 rounded-xl border border-white/8 space-y-4">
                      <div className="font-bold text-white text-[10px] sm:text-xs uppercase tracking-wider">Superposición de Texto (Opcional)</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Field label="Etiqueta / Badge (Ej: ¡OFERTA!)">
                          <input className={inputCls} value={b.badge || ''} onChange={e => updateBanner(b.id, 'badge', e.target.value)} placeholder="Ej: ¡Nuevo Set!" />
                        </Field>
                        <Field label="Título Principal">
                          <input className={inputCls} value={b.title || ''} onChange={e => updateBanner(b.id, 'title', e.target.value)} placeholder="Ej: Preventas Disponibles" />
                        </Field>
                        <Field label="Subtítulo / Descripción Corta">
                          <input className={inputCls} value={b.subtitle || ''} onChange={e => updateBanner(b.id, 'subtitle', e.target.value)} placeholder="Ej: Asegura tu display al mejor precio." />
                        </Field>
                        <Field label="Alineación Horizontal">
                          <select className={selectCls} value={b.alignmentX || 'left'} onChange={e => updateBanner(b.id, 'alignmentX', e.target.value)}>
                            <option value="left">Izquierda</option>
                            <option value="center">Centrado</option>
                            <option value="right">Derecha</option>
                          </select>
                        </Field>
                      </div>
                    </div>
                  )}

                  {b.imageUrl && (
                    <Field label={`Alineación Vertical de Imagen: ${b.alignmentY ?? 50}%`}>
                      <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Arriba</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={b.alignmentY ?? 50} 
                          onChange={e => updateBanner(b.id, 'alignmentY', parseInt(e.target.value))} 
                          className="flex-grow h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#0052FF]" 
                        />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Abajo</span>
                      </div>
                    </Field>
                  )}
                </div>
              )}
            </div>
          ))}
          {banners.length === 0 && <div className="text-center py-12 text-slate-500 border border-dashed border-white/10 rounded-2xl">No hay banners personalizados. Se mostrarán los predeterminados de la aplicación.</div>}
          <button onClick={addBanner} className="w-full mt-4 py-3 rounded-xl border border-dashed border-[#0052FF]/50 text-[#0052FF] hover:bg-[#0052FF]/10 font-bold transition-all text-sm">
            + Añadir Nuevo Banner
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COUPONS ADMIN SECTION
// ============================================================
function AdminCoupons({ toast }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // States for new coupon form
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('10');
  const [newActive, setNewActive] = useState(true);

  // States for Microsoft Clarity
  const [clarityId, setClarityId] = useState('');
  const [savingClarity, setSavingClarity] = useState(false);

  // States for GTM & Meta Pixel
  const [gtmId, setGtmId] = useState('');
  const [pixelId, setPixelId] = useState('');
  const [savingGtm, setSavingGtm] = useState(false);
  const [savingPixel, setSavingPixel] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('data')
        .eq('id', 'coupons')
        .single();
        
      if (error) {
        console.warn("No coupons key found in admin_settings, initializing empty.");
        setCoupons([]);
      } else if (data?.data && Array.isArray(data.data)) {
        setCoupons(data.data);
      }

      // Cargar Clarity ID
      const { data: clarityData } = await supabase
        .from('admin_settings')
        .select('data')
        .eq('id', 'clarity_id')
        .single();
      if (clarityData?.data) {
        setClarityId(clarityData.data);
      }

      // Cargar GTM ID
      const { data: gtmData } = await supabase
        .from('admin_settings')
        .select('data')
        .eq('id', 'gtm_id')
        .single();
      if (gtmData?.data) {
        setGtmId(gtmData.data);
      }

      // Cargar Pixel ID
      const { data: pixelData } = await supabase
        .from('admin_settings')
        .select('data')
        .eq('id', 'pixel_id')
        .single();
      if (pixelData?.data) {
        setPixelId(pixelData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveGtmId = async () => {
    setSavingGtm(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ id: 'gtm_id', data: gtmId, updated_at: new Date().toISOString() });
        
      if (error) throw error;
      toast('success', 'ID de Google Tag Manager guardado');
    } catch (err) {
      console.error(err);
      toast('error', 'Error al guardar el ID de GTM');
    } finally {
      setSavingGtm(false);
    }
  };

  const savePixelId = async () => {
    setSavingPixel(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ id: 'pixel_id', data: pixelId, updated_at: new Date().toISOString() });
        
      if (error) throw error;
      toast('success', 'ID de Meta Pixel guardado');
    } catch (err) {
      console.error(err);
      toast('error', 'Error al guardar el ID de Meta Pixel');
    } finally {
      setSavingPixel(false);
    }
  };

  const saveClarityId = async () => {
    setSavingClarity(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ id: 'clarity_id', data: clarityId, updated_at: new Date().toISOString() });
        
      if (error) throw error;
      toast('success', 'ID de Clarity guardado correctamente');
    } catch (err) {
      console.error(err);
      toast('error', 'Error al guardar el ID de Clarity');
    } finally {
      setSavingClarity(false);
    }
  };

  const save = async (updatedList) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ id: 'coupons', data: updatedList, updated_at: new Date().toISOString() });
        
      if (error) throw error;
      setCoupons(updatedList);
      toast('success', 'Cupones guardados correctamente');
    } catch (err) {
      console.error(err);
      toast('error', 'Error al guardar los cupones');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddCoupon = () => {
    const code = newCode.toUpperCase().trim();
    if (!code) {
      toast('error', 'El código de cupón no puede estar vacío');
      return;
    }
    const discountVal = Number(newDiscount);
    if (isNaN(discountVal) || discountVal <= 0 || discountVal > 100) {
      toast('error', 'El descuento debe ser un número entre 1 y 100');
      return;
    }

    if (coupons.some(c => c.code.toUpperCase() === code)) {
      toast('error', 'Ya existe un cupón con este código');
      return;
    }

    const newCoupon = {
      code,
      discount: discountVal,
      active: newActive,
      id: Math.random().toString(36).substring(2, 9)
    };

    const updated = [newCoupon, ...coupons];
    save(updated);
    
    // Clear inputs
    setNewCode('');
    setNewDiscount('10');
    setNewActive(true);
  };

  const handleToggleActive = (id) => {
    const updated = coupons.map(c => c.id === id ? { ...c, active: !c.active } : c);
    save(updated);
  };

  const handleDeleteCoupon = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cupón?')) {
      const updated = coupons.filter(c => c.id !== id);
      save(updated);
    }
  };

  return (
    <div className="max-w-3xl font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Cupones</h1>
          <p className="text-slate-400 text-sm mt-1">Crea y administra códigos de descuento para la bolsa de cotizaciones de tus clientes.</p>
        </div>
      </div>

      {/* Formulario Agregar Cupón */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6 space-y-4">
        <h3 className="font-bold text-white text-sm">Crear Nuevo Cupón</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1.5">Código del Cupón</label>
            <input
              type="text"
              placeholder="Ej: PROMO15"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full bg-[#0c0e16] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0052FF] uppercase"
            />
          </div>
          <div>
            <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1.5">Descuento (%)</label>
            <input
              type="number"
              min="1"
              max="100"
              placeholder="15"
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
              className="w-full bg-[#0c0e16] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0052FF]"
            />
          </div>
          <button
            onClick={handleAddCoupon}
            disabled={saving}
            className="bg-[#0052FF] hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/20"
          >
            <IcoPlus />
            Crear Cupón
          </button>
        </div>
      </div>

      {/* Listado de Cupones */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <h3 className="font-bold text-white text-sm mb-4">Cupones Registrados</h3>
        
        {loading ? (
          <div className="text-center py-8 text-slate-500 text-sm">Cargando cupones...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 text-slate-550 border border-dashed border-white/10 rounded-xl text-xs">
            No tienes cupones creados aún. Ingresa un código arriba para empezar.
          </div>
        ) : (
          <div className="divide-y divide-white/5 space-y-3">
            {coupons.map((coupon, idx) => (
              <div key={coupon.id || idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <span className="font-black text-sm text-white tracking-wider bg-white/5 px-2.5 py-1 rounded-lg border border-white/8 mr-3 uppercase">{coupon.code}</span>
                  <span className="text-xs text-slate-300 font-bold">-{coupon.discount}% de descuento</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Botón Toggle Estado */}
                  <button
                    onClick={() => handleToggleActive(coupon.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                      coupon.active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20'
                    }`}
                  >
                    {coupon.active ? 'Activo' : 'Inactivo'}
                  </button>

                  {/* Botón Eliminar */}
                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                    title="Eliminar cupón"
                  >
                    <IcoTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Integración de Analíticas y Marketing */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mt-6 space-y-6">
        <div>
          <h3 className="font-bold text-white text-sm">Configuración de Analíticas y Marketing</h3>
          <p className="text-slate-400 text-xs mt-1">Conecta herramientas avanzadas para medir tráfico, grabar visitas y optimizar campañas publicitarias de tu tienda.</p>
        </div>
        
        <div className="space-y-6 divide-y divide-white/5">
          {/* 1. Google Tag Manager */}
          <div className="pt-0 space-y-3">
            <h4 className="font-bold text-[#4d8aff] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>📊</span> Google Tag Manager (GTM)
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">Pega tu ID de contenedor para cargar Google Tag Manager. Te permite instalar Google Analytics 4, hacer tracking de conversiones y administrar etiquetas en un solo lugar.</p>
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1">
                <label className="text-slate-400 text-[9px] uppercase font-bold block mb-1">ID de Contenedor GTM</label>
                <input
                  type="text"
                  placeholder="Ej: GTM-XXXXXXX"
                  value={gtmId}
                  onChange={(e) => setGtmId(e.target.value.trim().toUpperCase())}
                  className="w-full bg-[#0c0e16] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                />
              </div>
              <button
                onClick={saveGtmId}
                disabled={savingGtm}
                className="bg-[#0052FF] hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/20"
              >
                {savingGtm ? 'Guardando...' : 'Guardar GTM'}
              </button>
            </div>
          </div>

          {/* 2. Meta Pixel */}
          <div className="pt-4 space-y-3 border-t border-white/5">
            <h4 className="font-bold text-pink-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>📸</span> Meta Pixel (Facebook/Instagram Ads)
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">Conecta tu Pixel de Facebook ingresando tu ID de Pixel. Es fundamental para optimizar campañas pagadas de Instagram, registrar visitas procedentes de anuncios y medir el retorno de inversión.</p>
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1">
                <label className="text-slate-400 text-[9px] uppercase font-bold block mb-1">ID de Pixel de Meta</label>
                <input
                  type="text"
                  placeholder="Ej: 123456789012345"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value.trim())}
                  className="w-full bg-[#0c0e16] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                />
              </div>
              <button
                onClick={savePixelId}
                disabled={savingPixel}
                className="bg-[#0052FF] hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/20"
              >
                {savingPixel ? 'Guardando...' : 'Guardar Pixel'}
              </button>
            </div>
          </div>

          {/* 3. Microsoft Clarity */}
          <div className="pt-4 space-y-3 border-t border-white/5">
            <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>👁️</span> Microsoft Clarity
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">Graba sesiones anónimas de tus usuarios para ver cómo navegan, dónde hacen clic y detectar problemas de experiencia.</p>
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1">
                <label className="text-slate-400 text-[9px] uppercase font-bold block mb-1">ID del Proyecto Clarity</label>
                <input
                  type="text"
                  placeholder="Ej: xfheeraaaz"
                  value={clarityId}
                  onChange={(e) => setClarityId(e.target.value.trim())}
                  className="w-full bg-[#0c0e16] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#0052FF]"
                />
              </div>
              <button
                onClick={saveClarityId}
                disabled={savingClarity}
                className="bg-[#0052FF] hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/20"
              >
                {savingClarity ? 'Guardando...' : 'Guardar Clarity'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AD SETTINGS ADMIN SECTION
// ============================================================
function AdminAdSettings({ toast }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('admin_settings').select('data').eq('id', 'sponsored_ad').single();
    if (data?.data && Array.isArray(data.data)) {
      setAds(data.data);
    } else if (data?.data && typeof data.data === 'object') {
      // Migrate from single object to array
      setAds([{ id: Date.now().toString(), ...data.data }]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveAds = async () => {
    setSaving(true);
    const { error } = await supabase.from('admin_settings').upsert({ 
      id: 'sponsored_ad', 
      data: ads, 
      updated_at: new Date().toISOString() 
    });
    setSaving(false);
    if (error) { toast('Error al guardar: ' + error.message, 'error'); }
    else { toast('Anuncios guardados ✓', 'success'); }
  };

  const addAd = () => {
    setAds([...ads, { id: Date.now().toString(), active: true, text: '', link: '' }]);
  };

  const updateAd = (id, key, val) => {
    setAds(ads.map(a => a.id === id ? { ...a, [key]: val } : a));
  };

  const removeAd = (id) => {
    setAds(ads.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Anuncios Patrocinados</h1>
          <p className="text-slate-400 text-sm mt-1">Configura los textos y enlaces del carrusel en la barra superior pública.</p>
        </div>
        <button onClick={saveAds} disabled={saving} className="flex items-center gap-2 bg-[#0052FF] hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-500">Cargando ajustes...</div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad, idx) => (
            <div key={ad.id} className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6 relative group">
              <button 
                onClick={() => removeAd(ad.id)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 rounded-lg"
                title="Eliminar anuncio"
              >
                <IcoTrash />
              </button>
              
              <div className="font-bold text-white mb-2">Anuncio #{idx + 1}</div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <div className="font-bold text-white mb-1">Estado del Anuncio</div>
                  <div className="text-sm text-slate-400">Si lo desactivas, este anuncio no aparecerá en el carrusel.</div>
                </div>
                <button 
                  onClick={() => updateAd(ad.id, 'active', !ad.active)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${ad.active ? 'bg-green-500' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${ad.active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <Field label="Texto del Anuncio">
                <input
                  className={inputCls}
                  value={ad.text}
                  onChange={e => updateAd(ad.id, 'text', e.target.value)}
                  placeholder="Ej: ¡Aprovecha un 15% de descuento!"
                />
              </Field>

              <Field label="Enlace al hacer clic (URL)">
                <input
                  className={inputCls}
                  type="url"
                  value={ad.link}
                  onChange={e => updateAd(ad.id, 'link', e.target.value)}
                  placeholder="Ej: https://tutiendapartner.com"
                />
              </Field>
            </div>
          ))}

          <button 
            onClick={addAd}
            className="w-full py-4 border-2 border-dashed border-white/10 hover:border-[#0052FF]/50 hover:bg-[#0052FF]/10 rounded-2xl text-slate-400 hover:text-[#0052FF] transition-all flex flex-col items-center gap-2"
          >
            <div className="bg-white/5 p-2 rounded-full">
              <span className="text-xl leading-none">+</span>
            </div>
            <span className="font-semibold text-sm">Añadir Nuevo Anuncio</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ADMIN LOGIN
// ============================================================
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError('Credenciales incorrectas. Verifica tu email y contraseña.'); return; }
    onLogin(data.session);
  };

  return (
    <div className="min-h-screen bg-[#080a10] flex items-center justify-center p-4" style={{
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(0,82,255,0.12) 0%, transparent 70%)'
    }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center">
            <div className="flex items-center font-black text-3xl tracking-tight mb-1">
              <span className="text-white">CARD</span>
              <span className="text-[#0052FF]">POINT</span>
              <span className="text-white">.CL</span>
            </div>
            <span className="text-xs font-bold tracking-[0.3em] text-slate-500 uppercase">Panel de Administración</span>
          </div>
        </div>

        <div className="bg-white/3 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white mb-1">Iniciar sesión</h2>
          <p className="text-slate-500 text-sm mb-6">Ingresa tus credenciales de administrador</p>

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Email">
              <input
                className={inputCls}
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@tudominio.cl"
                autoComplete="email"
              />
            </Field>
            <Field label="Contraseña">
              <div className="relative">
                <input
                  className={`${inputCls} pr-10`}
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <IcoEyeOff /> : <IcoEye />}
                </button>
              </div>
            </Field>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0052FF] hover:bg-blue-500 text-white font-bold rounded-xl transition-all mt-2 disabled:opacity-60 shadow-lg shadow-blue-900/30"
            >
              {loading ? 'Iniciando sesión...' : 'Entrar al panel'}
            </button>
          </form>
        </div>
        <p className="text-center text-slate-600 text-xs mt-6">
          ¿No tienes acceso? Contacta al administrador del sistema.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN ADMIN APP
// ============================================================
export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [activeSection, setActiveSection] = useState('cards');
  const [toast, setToastState] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const [dbStats, setDbStats] = useState({ sizeMB: 0, limitMB: 500, realData: false, loading: true });

  const fetchDatabaseSize = async () => {
    try {
      const { data, error } = await supabase.rpc('get_db_size');
      if (!error && data && data.db_size_bytes) {
        const sizeBytes = data.db_size_bytes;
        const sizeMB = parseFloat((sizeBytes / (1024 * 1024)).toFixed(2));
        setDbStats({ sizeMB, limitMB: 500, realData: true, loading: false });
        return;
      }
    } catch (rpcErr) {
      console.warn("RPC no disponible, usando estimación:", rpcErr);
    }

    try {
      const { count: cardsCount } = await supabase.from('cards').select('*', { count: 'exact', head: true });
      const { count: newsCount } = await supabase.from('news').select('*', { count: 'exact', head: true });
      const { count: tournamentsCount } = await supabase.from('tournaments').select('*', { count: 'exact', head: true });

      // Estimación: 40MB Postgres base + 120KB por carta + 250KB por noticia + 10KB por torneo
      const estimatedBytes = (40 * 1024 * 1024) + 
                             ((cardsCount || 0) * 120 * 1024) + 
                             ((newsCount || 0) * 250 * 1024) + 
                             ((tournamentsCount || 0) * 10 * 1024);
      
      const sizeMB = parseFloat((estimatedBytes / (1024 * 1024)).toFixed(2));
      setDbStats({ sizeMB, limitMB: 500, realData: false, loading: false });
    } catch (err) {
      console.error("Error estimando espacio:", err);
      setDbStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (session) {
      fetchDatabaseSize();
    }
  }, [session, activeSection]);

  const showToast = (message, type = 'success') => {
    setToastState({ message, type, key: Date.now() });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#080a10] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0052FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <AdminLogin onLogin={setSession} />;

  const navItems = [
    { id: 'cards', label: 'Productos', icon: <IcoCards /> },
    { id: 'tournaments', label: 'Torneos', icon: <IcoTrophy /> },
    { id: 'banners', label: 'Banners', icon: <IcoImage /> },
    { id: 'coupons', label: 'Cupones', icon: <IcoTag /> },
  ];

  return (
    <div className="min-h-screen bg-[#080a10] text-white font-sans flex" style={{
      backgroundImage: 'radial-gradient(ellipse at 0% 0%, rgba(0,82,255,0.06) 0%, transparent 50%)'
    }}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 bg-[#0c0e16] border-r border-white/8 flex flex-col transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'w-64 lg:w-20' : 'w-64 lg:w-64'}`}>
        {/* Logo */}
        <div className={`p-6 border-b border-white/8 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0052FF] flex items-center justify-center font-black text-white text-sm flex-shrink-0">CP</div>
            {!sidebarCollapsed && (
              <div className="truncate transition-opacity duration-300">
                <div className="font-black text-white text-sm leading-tight">MiTienda Admin</div>
                <div className="text-slate-500 text-[10px] truncate max-w-[155px]">{session.user.email}</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all
                ${sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}
                ${activeSection === item.id
                  ? 'bg-[#0052FF]/15 text-[#4d8aff] border border-[#0052FF]/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {!sidebarCollapsed && <span className="transition-opacity duration-300">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/8 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            title={sidebarCollapsed ? "Ver sitio público" : undefined}
            className={`w-full flex items-center rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all
              ${sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}`}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
            </svg>
            {!sidebarCollapsed && <span className="transition-opacity duration-300">Ver sitio público</span>}
          </a>
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? "Cerrar sesión" : undefined}
            className={`w-full flex items-center rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-900/10 transition-all
              ${sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}`}
          >
            <div className="flex-shrink-0"><IcoLogout /></div>
            {!sidebarCollapsed && <span className="transition-opacity duration-300">Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-white/8 flex items-center gap-4 px-6 bg-[#080a10]/80 backdrop-blur-sm sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white transition-colors">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>
          
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
            className="hidden lg:flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 w-8 h-8 rounded-lg border border-white/10 transition-all"
            title={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {sidebarCollapsed ? (
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            ) : (
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            )}
          </button>

          <div className="flex-1">
            <h1 className="text-sm font-bold text-slate-300 capitalize">{navItems.find(n => n.id === activeSection)?.label}</h1>
          </div>
          
          {/* Indicador de Espacio en Base de Datos */}
          <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 bg-white/3 border border-white/8 rounded-xl text-xs text-slate-300 relative group cursor-pointer hover:bg-white/5 transition-all" title="Espacio de Base de Datos Supabase">
            <IcoDatabase />
            <div className="flex flex-col text-[10px] leading-tight">
              <span className="font-semibold text-slate-400">Espacio BD</span>
              <span className="font-bold text-slate-200">
                {dbStats.loading ? 'Cargando...' : `${dbStats.sizeMB} MB / ${dbStats.limitMB} MB`}
              </span>
            </div>
            
            {!dbStats.loading && (
              <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden flex-shrink-0">
                <div 
                  className={`h-full rounded-full transition-all ${
                    (dbStats.sizeMB / dbStats.limitMB) > 0.8 ? 'bg-red-500' : (dbStats.sizeMB / dbStats.limitMB) > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (dbStats.sizeMB / dbStats.limitMB) * 100)}%` }}
                />
              </div>
            )}

            {/* Tooltip con explicación y detalles */}
            <div className="absolute right-0 top-11 w-64 p-3 bg-[#0f1117] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-[10px] text-slate-400 space-y-2 pointer-events-none leading-relaxed">
              <div className="font-bold text-slate-200 flex items-center justify-between">
                <span>Estado de Supabase</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${dbStats.realData ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {dbStats.realData ? 'Tiempo Real' : 'Estimado'}
                </span>
              </div>
              <p>Límite gratuito de Supabase: 500 MB de base de datos Postgres.</p>
              <div className="border-t border-white/5 pt-2">
                <strong>¿Cómo ver el tamaño exacto en tiempo real?</strong>
                <p className="mt-1">Ejecuta esta función SQL en tu consola de Supabase:</p>
                <div className="bg-black/50 p-1.5 rounded text-[8.5px] font-mono text-emerald-400 overflow-x-auto mt-1 select-all whitespace-pre">
{`CREATE OR REPLACE FUNCTION get_db_size()
RETURNS json AS $$
BEGIN
  RETURN json_build_object(
    'db_size_bytes', pg_database_size(current_database())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`}
                </div>
              </div>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#0052FF]/20 border border-[#0052FF]/30 flex items-center justify-center text-[#4d8aff] text-xs font-black">
            {session.user.email?.[0]?.toUpperCase()}
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {activeSection === 'cards'       && <AdminCards toast={showToast} />}
          {activeSection === 'news'        && <AdminNews toast={showToast} />}
          {activeSection === 'tournaments' && <AdminTournaments toast={showToast} />}
          {activeSection === 'banners'     && <AdminBanners toast={showToast} />}
          {activeSection === 'ad'          && <AdminAdSettings toast={showToast} />}
          {activeSection === 'coupons'     && <AdminCoupons toast={showToast} />}
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToastState(null)} />
      )}
    </div>
  );
}

// ============================================================
// MODAL DE IMPORTACIÓN MASIVA (BULK IMPORT)
// ============================================================
function BulkImportModal({ onClose, onImportSuccess, toast }) {
  const [step, setStep] = useState(1); // 1: Input, 2: Preview, 3: Success
  const [inputText, setInputText] = useState('');
  const [defaultLanguage, setDefaultLanguage] = useState('Español');
  const [importRows, setImportRows] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [uploadingRowId, setUploadingRowId] = useState(null);

  // Manual Add Form Modal state
  const [manualAddIndex, setManualAddIndex] = useState(null);
  const [showManualAddForm, setShowManualAddForm] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    set: 'Escarlata y Púrpura',
    setCode: '',
    rarity: 'Rara',
    price: 0,
    stock: 1,
    condition: 'NM',
    idioma: 'Español',
    image: '',
    real_photo: '',
    is_reverse: false,
    is_league: false
  });

  const translateRarity = (engRarity) => {
    if (!engRarity) return 'Rara';
    const r = engRarity.toLowerCase();
    if (r.includes('common') && !r.includes('uncommon')) return 'Común';
    if (r.includes('uncommon')) return 'Poco Común';
    if (r.includes('double rare')) return 'Doble Rara';
    if (r.includes('special illustration rare')) return 'Especial Ilustración Rara';
    if (r.includes('illustration rare')) return 'Ilustración Rara';
    if (r.includes('ultra rare') || r.includes('shiny ultra rare')) return 'Ultra Rara';
    if (r.includes('secret rare') || r.includes('shiny rare')) return 'Ultra Rara Secreta';
    if (r.includes('hyper rare') || r.includes('rainbow rare')) return 'Hyper Rara';
    if (r.includes('gold') || r.includes('rare holo star')) return 'Secreta Dorada';
    if (r.includes('rare') || r.includes('holo')) return 'Rara';
    return 'Común';
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setInputText(evt.target?.result || '');
    };
    reader.readAsText(file);
  };

  const parseRarityPrefix = (prefix) => {
    if (!prefix) return null;
    const p = prefix.trim().toUpperCase();
    switch (p) {
      case 'C': return 'Común';
      case 'PC':
      case 'U': return 'Poco Común';
      case 'R': return 'Rara';
      case 'RR': return 'Doble Rara';
      case 'UR': return 'Ultra Rara';
      case 'IR':
      case 'AR': return 'Ilustración Rara';
      case 'SIR': return 'Especial Ilustración Rara';
      case 'SR':
      case 'URS': return 'Ultra Rara Secreta';
      case 'GR':
      case 'SD': return 'Secreta Dorada';
      case 'HR': return 'Hyper Rara';
      default:
        const lower = prefix.toLowerCase();
        if (lower.includes('común') || lower.includes('comun')) return 'Común';
        if (lower.includes('poco')) return 'Poco Común';
        if (lower.includes('doble')) return 'Doble Rara';
        if (lower.includes('especial')) return 'Especial Ilustración Rara';
        if (lower.includes('ilustración') || lower.includes('ilustracion')) return 'Ilustración Rara';
        if (lower.includes('secreta') && lower.includes('ultra')) return 'Ultra Rara Secreta';
        if (lower.includes('dorada')) return 'Secreta Dorada';
        if (lower.includes('hyper')) return 'Hyper Rara';
        if (lower.includes('ultra')) return 'Ultra Rara';
        if (lower.includes('rara')) return 'Rara';
        return null;
    }
  };

  const handleProcessList = async () => {
    if (!inputText.trim()) return;
    
    // Parse
    const lines = inputText.split('\n');
    const parsed = [];
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      let parts = [];
      if (trimmed.includes('|')) {
        parts = trimmed.split('|').map(p => p.trim());
      } else {
        parts = trimmed.split(',').map(p => p.trim());
      }
      if (parts.length < 3) return; // Name, Set Code, Number required
      
      const name = parts[0];
      let setCode = parts[1].toLowerCase();
      const fullNumber = parts[2];
      let number = fullNumber.split('/')[0].trim();
      
      // Strip leading zeros from purely numeric card numbers or numbers with trailing letters (e.g. "018" -> "18")
      if (/^0+[1-9]\d*$/.test(number)) {
        number = number.replace(/^0+/, '');
      } else if (/^0+$/.test(number)) {
        number = '0';
      }
      
      const stock = parts[3] ? parseInt(parts[3], 10) || 1 : 1;
      const price = parts[4] ? parseInt(parts[4].replace(/[$.]/g, ''), 10) || 0 : 0;
      const condition = parts[5] || 'NM';
      
      // Detect language from set suffix (e.g. "MEGes" or "MEGen") or explicit 7th field
      let idioma = defaultLanguage;
      if (setCode.endsWith('es') && setCode.length > 2) {
        setCode = setCode.slice(0, -2);
        idioma = 'Español';
      } else if (setCode.endsWith('en') && setCode.length > 2) {
        setCode = setCode.slice(0, -2);
        idioma = 'Inglés';
      }
      
      // Map common set abbreviations to official API set IDs (supporting prefixes like twmem -> twm -> sv6)
      const setCodeMapping = {
        'svi': 'sv1', 'pal': 'sv2', 'obf': 'sv3', 'mew': 'sv3pt5', 'par': 'sv4', 'paf': 'sv4pt5',
        'tef': 'sv5', 'twm': 'sv6', 'ste': 'sv7', 'ssp': 'sv8', 'pre': 'sv8pt5'
      };
      
      for (const [key, val] of Object.entries(setCodeMapping)) {
        if (setCode.startsWith(key)) {
          setCode = val;
          break;
        }
      }
      
      if (parts[6]) {
        const pLang = parts[6].trim().toLowerCase();
        if (pLang === 'es' || pLang.includes('español') || pLang.includes('espanol')) idioma = 'Español';
        else if (pLang === 'en' || pLang.includes('ingles') || pLang.includes('inglés') || pLang.includes('english')) idioma = 'Inglés';
        else if (pLang === 'jp' || pLang.includes('japones') || pLang.includes('japonés') || pLang.includes('japanese')) idioma = 'Japonés';
        else idioma = parts[6].trim();
      }
      
      // Detect flags and custom rarity in optional fields (reverse / liga / rarity)
      let is_reverse = false;
      let is_league = false;
      let overriddenRarity = null;
      for (let j = 3; j < parts.length; j++) {
        if (parts[j]) {
          const val = parts[j].trim();
          const lowerVal = val.toLowerCase();
          if (lowerVal === 'reverse' || lowerVal === 'rev') {
            is_reverse = true;
          } else if (lowerVal === 'liga' || lowerVal === 'league' || lowerVal === 'de liga') {
            is_league = true;
          } else {
            const matchedRarity = parseRarityPrefix(val);
            if (matchedRarity) {
              overriddenRarity = matchedRarity;
            }
          }
        }
      }
      
      parsed.push({
        id: Math.random().toString(36).substr(2, 9),
        name,
        setCode,
        number,
        stock,
        price,
        condition,
        idioma,
        is_reverse,
        is_league,
        overriddenRarity,
        selected: true,
        real_photo: '',
        status: 'pending',
        image: '',
        set: '',
        rarity: overriddenRarity || 'Rara',
        description: 'Sin descripción adicional.',
        apiCard: null
      });
    });

    if (parsed.length === 0) {
      toast('No se encontraron líneas válidas. Formato: Nombre, Set, Número, Cantidad, Precio', 'error');
      return;
    }

    setProcessing(true);
    setStep(2);
    setImportRows(parsed);
    setProgress({ current: 0, total: parsed.length });

    const updatedRows = [...parsed];

    for (let i = 0; i < updatedRows.length; i++) {
      const row = updatedRows[i];
      updatedRows[i] = { ...row, status: 'loading' };
      setImportRows([...updatedRows]);

      try {
        const query = `name:"${row.name}" number:"${row.number}" set.id:"${row.setCode}"`;
        const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}`);
        
        if (res.ok) {
          const data = await res.json();
          const results = data.data || [];
          if (results.length > 0) {
            const card = results[0];
            updatedRows[i] = {
              ...row,
              status: 'success',
              name: card.name,
              set: card.set?.name || 'Escarlata y Púrpura',
              setCode: card.set?.id || row.setCode,
              rarity: row.overriddenRarity || translateRarity(card.rarity),
              image: card.images?.large || card.images?.small || '',
              apiCard: card
            };
          } else {
            // Fallback lookup
            const fallbackQuery = `name:"${row.name}" number:"${row.number}"`;
            const fbRes = await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(fallbackQuery)}`);
            if (fbRes.ok) {
              const fbData = await fbRes.json();
              const fbResults = fbData.data || [];
              const match = fbResults.find(c => {
                const setId = (c.set?.id || '').toLowerCase();
                const setName = (c.set?.name || '').toLowerCase();
                const userCode = row.setCode.toLowerCase();
                
                if (setId.includes(userCode) || setName.includes(userCode)) return true;
                
                const fallbackSetMapping = {
                  'svi': ['sv1', 'scarlet & violet', 'escarlata y púrpura'],
                  'pal': ['sv2', 'paldea evolved', 'evoluciones en paldea'],
                  'obf': ['sv3', 'obsidian flames', 'llamas obsidianas'],
                  'mew': ['sv3pt5', '151'],
                  'par': ['sv4', 'paradox rift', 'brecha paradójica'],
                  'paf': ['sv4pt5', 'paldean fates', 'destino de paldea'],
                  'tef': ['sv5', 'temporal forces', 'fuerzas temporales'],
                  'twm': ['sv6', 'twilight masquerade', 'mascarada crepuscular'],
                  'ste': ['sv7', 'stellar crown', 'corona estelar'],
                  'ssp': ['sv8', 'surging sparks', 'chispas fulgurantes'],
                  'pre': ['sv8pt5', 'prismatic evolutions', 'evoluciones prismáticas']
                };
                
                const mapKey = Object.keys(fallbackSetMapping).find(k => userCode.startsWith(k));
                if (mapKey) {
                  return fallbackSetMapping[mapKey].some(mappedVal => 
                    setId.includes(mappedVal) || setName.includes(mappedVal)
                  );
                }
                
                return false;
              });
              
              if (match) {
                updatedRows[i] = {
                  ...row,
                  status: 'success',
                  name: match.name,
                  set: match.set?.name || 'Escarlata y Púrpura',
                  setCode: match.set?.id || row.setCode,
                  rarity: row.overriddenRarity || translateRarity(match.rarity),
                  image: match.images?.large || match.images?.small || '',
                  apiCard: match
                };
              } else if (fbResults.length > 0) {
                const matchFirst = fbResults[0];
                updatedRows[i] = {
                  ...row,
                  status: 'success',
                  name: matchFirst.name,
                  set: matchFirst.set?.name || 'Escarlata y Púrpura',
                  setCode: matchFirst.set?.id || row.setCode,
                  rarity: row.overriddenRarity || translateRarity(matchFirst.rarity),
                  image: matchFirst.images?.large || matchFirst.images?.small || '',
                  apiCard: matchFirst
                };
              } else {
                updatedRows[i] = { ...row, status: 'error' };
              }
            } else {
              updatedRows[i] = { ...row, status: 'error' };
            }
          }
        } else {
          updatedRows[i] = { ...row, status: 'error' };
        }
      } catch (err) {
        console.error(err);
        updatedRows[i] = { ...row, status: 'error' };
      }

      setProgress(prev => ({ ...prev, current: i + 1 }));
      setImportRows([...updatedRows]);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    setProcessing(false);
  };

  const handleRowChange = (rowId, field, value) => {
    setImportRows(prev => prev.map(row => {
      if (row.id === rowId) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleRowPhotoUpload = async (rowId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingRowId(rowId);
    try {
      toast('Optimizando imagen...', 'info');
      const compressedFile = await compressImage(file, 800, 0.85);
      const formData = new FormData();
      formData.append('image', compressedFile);
      
      const res = await fetch(`https://api.imgbb.com/1/upload?key=149aebd904174718dea8f1c5eb444935`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        const url = data.data?.url || '';
        handleRowChange(rowId, 'real_photo', url);
        toast('📷 Foto real cargada con éxito', 'success');
      } else {
        toast('⚠️ Error al subir imagen a ImgBB', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('⚠️ Error al subir imagen', 'error');
    } finally {
      setUploadingRowId(null);
    }
  };

  const openManualAdd = (idx) => {
    const row = importRows[idx];
    setManualForm({
      name: row.name,
      set: 'Escarlata y Púrpura',
      setCode: row.setCode.toUpperCase(),
      number: row.number,
      rarity: row.overriddenRarity || 'Rara',
      price: row.price,
      stock: row.stock,
      condition: row.condition,
      idioma: row.idioma,
      image: '',
      real_photo: '',
      is_reverse: !!row.is_reverse,
      is_league: !!row.is_league
    });
    setManualAddIndex(idx);
    setShowManualAddForm(true);
  };

  const handleSaveManual = (e) => {
    e.preventDefault();
    const updated = [...importRows];
    updated[manualAddIndex] = {
      ...updated[manualAddIndex],
      ...manualForm,
      status: 'success'
    };
    setImportRows(updated);
    setShowManualAddForm(false);
    setManualAddIndex(null);
    toast('Carta configurada manualmente ✓', 'success');
  };

  const handleManualFormPhotoUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      toast('Optimizando imagen...', 'info');
      const compressedFile = await compressImage(file, 800, 0.85);
      const formData = new FormData();
      formData.append('image', compressedFile);
      
      const res = await fetch(`https://api.imgbb.com/1/upload?key=149aebd904174718dea8f1c5eb444935`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        const url = data.data?.url || '';
        setManualForm(prev => ({ ...prev, [type]: url }));
        toast('Imagen subida con éxito ✓', 'success');
      } else {
        toast('⚠️ Error al subir imagen', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('⚠️ Error al subir imagen', 'error');
    }
  };

  const handlePublish = async () => {
    const successRows = importRows.filter(r => r.status === 'success' && r.selected);
    if (successRows.length === 0) {
      toast('No hay cartas seleccionadas listas para importar.', 'error');
      return;
    }

    setProcessing(true);
    setStep(3);
    setImportProgress({ current: 0, total: successRows.length });

    try {
      const cardsToInsert = successRows.map(row => ({
        name: row.name,
        set: row.set || 'Escarlata y Púrpura',
        set_code: row.setCode.toUpperCase(),
        rarity: row.rarity,
        price: row.price,
        condition: row.condition,
        image: row.image || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
        real_photo: row.real_photo || null,
        description: row.description || 'Sin descripción adicional.',
        in_stock: row.price > 0 && row.stock > 0,
        stock: row.stock,
        is_reverse: row.is_reverse,
        is_league: row.is_league,
        idioma: row.idioma
      }));

      const { error } = await supabase.from('cards').insert(cardsToInsert);
      if (error) throw error;

      setImportProgress({ current: successRows.length, total: successRows.length });
      toast(`🎉 ${successRows.length} cartas importadas correctamente`, 'success');
      
      setTimeout(() => {
        onImportSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      toast('⚠️ Error al publicar cartas en Supabase: ' + err.message, 'error');
      setProcessing(false);
      setStep(2);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0052FF] transition-all";
  const selectCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0052FF] transition-all cursor-pointer";

  return (
    <Modal title="Importar Cartas en Lote" onClose={onClose} maxWidth="max-w-5xl">
      {step === 1 && (
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2 text-xs text-slate-400">
            <p className="font-bold text-slate-200">💡 Instrucciones de Formato:</p>
            <p>Escribe o pega una lista de cartas, una por línea. El formato requerido es (separado por comas `,` o barras `|`):</p>
            <code className="block bg-black/40 p-2 rounded text-[#0052FF] font-mono select-all">
              Nombre de Carta, Código de Set, Número de Carta, Cantidad (opcional), Precio (opcional), Estado (opcional), Idioma (opcional), Reverso (opcional), Liga (opcional)
            </code>
            <p className="mt-2 text-[10px]">Ejemplo con comas: <strong className="text-white">Mega Gengar Ex, xy4es, 35, 1, 60000, NM</strong> (detecta Español por el sufijo <strong className="text-[#0052FF]">es</strong> en el set)</p>
            <p className="text-[10px]">Ejemplo con banderas: <strong className="text-white">Mega Gengar Ex, xy4, 35, 1, 60000, NM, Español, reverse, liga</strong></p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Idioma por Defecto">
              <select className={selectCls} value={defaultLanguage} onChange={e => setDefaultLanguage(e.target.value)}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Subir Archivo (.txt / .csv)">
              <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className={inputCls} />
            </Field>
          </div>

          <Field label="Pegar Lista de Cartas">
            <textarea
              className={`${inputCls} font-mono`}
              rows={8}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Ejemplo:\nCharmander | obf | 026/197 | 3 | 800\nMewtwo V | swsh12 | GG44 | 1 | 39990 | NM`}
            />
          </Field>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-semibold transition-all">Cancelar</button>
            <button type="button" onClick={handleProcessList} disabled={!inputText.trim()} className="px-6 py-2 rounded-xl bg-[#0052FF] hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
              Procesar Lista
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {processing ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium">Buscando detalles en la API oficial...</p>
              <p className="text-xs text-slate-500">{progress.current} de {progress.total} procesadas</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400">Total leídas: <strong className="text-white">{importRows.length}</strong> | Listas para guardar: <strong className="text-green-400">{importRows.filter(r => r.status === 'success').length}</strong> | Seleccionadas: <strong className="text-[#0052FF]">{importRows.filter(r => r.status === 'success' && r.selected).length}</strong></span>
                <span className="text-[10px] text-amber-400 font-semibold">⚠️ Revisa precio, cantidad y sube foto real antes de publicar.</span>
              </div>

              <div className="overflow-x-auto border border-white/10 rounded-xl max-h-[50vh] overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 uppercase tracking-wider text-[10px] text-slate-400 font-bold">
                      <th className="px-3 py-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={importRows.length > 0 && importRows.every(r => r.selected)}
                          onChange={e => {
                            const val = e.target.checked;
                            setImportRows(prev => prev.map(r => ({ ...r, selected: val })));
                          }}
                          className="w-4 h-4 rounded border-white/10 bg-black/40 text-[#0052FF] cursor-pointer"
                        />
                      </th>
                      <th className="px-3 py-3 w-12 text-center">Arte</th>
                      <th className="px-3 py-3">Nombre / Set</th>
                      <th className="px-3 py-3 w-28">Precio (CLP)</th>
                      <th className="px-3 py-3 w-20">Stock</th>
                      <th className="px-3 py-3 w-20">Cond.</th>
                      <th className="px-3 py-3 w-24">Idioma</th>
                      <th className="px-2 py-3 text-center">Rev.</th>
                      <th className="px-2 py-3 text-center">Liga</th>
                      <th className="px-3 py-3 text-center w-16">Foto Real</th>
                      <th className="px-3 py-3 text-center w-24">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.map((row, idx) => (
                      <tr key={row.id} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${!row.selected ? 'opacity-40' : ''}`}>
                        <td className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={!!row.selected}
                            onChange={e => handleRowChange(row.id, 'selected', e.target.checked)}
                            className="w-4 h-4 rounded border-white/10 bg-black/40 text-[#0052FF] cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-3 text-center">
                          {row.image ? (
                            <img src={row.image} alt={row.name} className="w-8 h-10 object-contain rounded border border-white/10 bg-slate-900" />
                          ) : (
                            <div className="w-8 h-10 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[10px] text-slate-500 font-black">?</div>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-bold text-white line-clamp-1">{row.name}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{row.set || row.setCode.toUpperCase()} • #{row.number}</p>
                          <span className="inline-block mt-0.5 text-[8px] px-1.5 py-0.5 rounded uppercase font-extrabold bg-[#0052FF]/20 text-blue-400 border border-blue-500/20">{row.rarity}</span>
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            value={row.price}
                            onChange={e => handleRowChange(row.id, 'price', parseInt(e.target.value) || 0)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            value={row.stock}
                            onChange={e => handleRowChange(row.id, 'stock', parseInt(e.target.value) || 1)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <select
                            value={row.condition}
                            onChange={e => handleRowChange(row.id, 'condition', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-1 py-1 text-xs text-white cursor-pointer"
                          >
                            {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          <select
                            value={row.idioma}
                            onChange={e => handleRowChange(row.id, 'idioma', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-1 py-1 text-xs text-white cursor-pointer"
                          >
                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={row.is_reverse}
                            onChange={e => handleRowChange(row.id, 'is_reverse', e.target.checked)}
                            className="w-4 h-4 rounded border-white/10 bg-black/40 text-[#0052FF] cursor-pointer"
                          />
                        </td>
                        <td className="px-2 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={row.is_league}
                            onChange={e => handleRowChange(row.id, 'is_league', e.target.checked)}
                            className="w-4 h-4 rounded border-white/10 bg-black/40 text-[#0052FF] cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <label className={`w-8 h-8 rounded-lg border border-white/10 bg-black/40 flex items-center justify-center hover:bg-white/5 cursor-pointer mx-auto transition-all ${row.real_photo ? 'border-green-500/50 bg-green-500/10' : ''}`}>
                            {uploadingRowId === row.id ? (
                              <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                            ) : row.real_photo ? (
                              <IcoCheck size={14} className="text-green-400" />
                            ) : (
                              <IcoCamera size={14} />
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={e => handleRowPhotoUpload(row.id, e)} disabled={uploadingRowId !== null} />
                          </label>
                        </td>
                        <td className="px-3 py-3 text-center">
                          {row.status === 'success' && (
                            <span className="text-green-400 font-bold text-[10px]">Listo</span>
                          )}
                          {row.status === 'loading' && (
                            <span className="text-blue-400 animate-pulse text-[10px]">Cargando...</span>
                          )}
                          {row.status === 'error' && (
                            <button
                              type="button"
                              onClick={() => openManualAdd(idx)}
                              className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-[10px] font-bold border border-amber-500/30 whitespace-nowrap transition-colors"
                            >
                              Agregar Manual
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-semibold transition-all">← Atrás</button>
                <div className="flex gap-3">
                  <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm font-semibold transition-all">Cancelar</button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={importRows.filter(r => r.status === 'success' && r.selected).length === 0}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-900/30 disabled:opacity-50"
                  >
                    Publicar {importRows.filter(r => r.status === 'success' && r.selected).length} cartas
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="p-8 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-200">Guardando cartas en la base de datos...</p>
          <p className="text-xs text-slate-500">{importProgress.current} de {importProgress.total} guardadas</p>
        </div>
      )}

      {showManualAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowManualAddForm(false)} />
          <div className="relative z-10 bg-[#0f1117] border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Configurar Carta Manualmente</h3>
            <form onSubmit={handleSaveManual} className="space-y-4">
              <Field label="Nombre">
                <input className={inputCls} required value={manualForm.name} onChange={e => setManualForm({ ...manualForm, name: e.target.value })} placeholder="Ej: Charizard ex" />
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Idioma">
                  <select className={selectCls} value={manualForm.idioma} onChange={e => setManualForm({ ...manualForm, idioma: e.target.value })}>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Era / Set">
                  <input
                    className={inputCls}
                    required
                    value={manualForm.set}
                    onChange={e => setManualForm({ ...manualForm, set: e.target.value })}
                    placeholder="Ej: Escarlata y Púrpura"
                    list="manual-eras-list"
                  />
                  <datalist id="manual-eras-list">
                    {['Escarlata y Púrpura','Espada y Escudo','SM - Sol y Luna','XY','Black & White','Otras'].map(e => (
                      <option key={e} value={e} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Código de Set">
                  <input className={inputCls} required value={manualForm.setCode} onChange={e => setManualForm({ ...manualForm, setCode: e.target.value.toUpperCase() })} placeholder="Ej: SV4F" />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Número">
                  <input className={inputCls} required value={manualForm.number} onChange={e => setManualForm({ ...manualForm, number: e.target.value })} placeholder="Ej: 18" />
                </Field>
                <Field label="Rareza">
                  <select className={selectCls} value={manualForm.rarity} onChange={e => setManualForm({ ...manualForm, rarity: e.target.value })}>
                    {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Condición">
                  <select className={selectCls} value={manualForm.condition} onChange={e => setManualForm({ ...manualForm, condition: e.target.value })}>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Stock (Cantidad)">
                  <input type="number" className={inputCls} required min="0" value={manualForm.stock} onChange={e => setManualForm({ ...manualForm, stock: parseInt(e.target.value) || 0 })} placeholder="Ej: 1" />
                </Field>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none pb-2.5">
                    <div className={`w-11 h-6 rounded-full transition-all flex-shrink-0 ${manualForm.is_reverse ? 'bg-amber-500' : 'bg-slate-600'}`} onClick={() => setManualForm({ ...manualForm, is_reverse: !manualForm.is_reverse })}>
                      <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${manualForm.is_reverse ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Reverse Holo</span>
                  </label>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none pb-2.5">
                    <div className={`w-11 h-6 rounded-full transition-all flex-shrink-0 ${manualForm.is_league ? 'bg-rose-500' : 'bg-slate-600'}`} onClick={() => setManualForm({ ...manualForm, is_league: !manualForm.is_league })}>
                      <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${manualForm.is_league ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Carta de Liga</span>
                  </label>
                </div>
              </div>

              <Field label="Precio (CLP)">
                <input type="number" className={inputCls} required min="0" value={manualForm.price} onChange={e => setManualForm({ ...manualForm, price: parseInt(e.target.value) || 0 })} placeholder="Ej: 89990" />
              </Field>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Field label="Arte Oficial">
                  <div className="flex gap-2">
                    <input className={inputCls} placeholder="https://..." value={manualForm.image} onChange={e => setManualForm({ ...manualForm, image: e.target.value })} />
                    <label className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border bg-slate-800 border-white/10 hover:bg-slate-700 text-slate-300">
                      Subir
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleManualFormPhotoUpload(e, 'image')} />
                    </label>
                  </div>
                </Field>
                <Field label="📸 Foto Real (Opcional)">
                  <div className="flex gap-2">
                    <input
                      className={inputCls}
                      placeholder="Pega URL o sube archivo →"
                      value={manualForm.real_photo || ''}
                      onChange={e => setManualForm({ ...manualForm, real_photo: e.target.value })}
                    />
                    <label className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border bg-green-600/20 border-green-500/40 text-green-400 hover:bg-green-600/30">
                      Subir
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleManualFormPhotoUpload(e, 'real_photo')} />
                    </label>
                  </div>
                </Field>
              </div>

              <div className="flex gap-4 justify-center">
                {manualForm.image && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Arte Oficial</span>
                    <img src={manualForm.image} alt="preview" className="w-16 h-22 object-contain rounded-lg border border-white/10" />
                  </div>
                )}
                {manualForm.real_photo && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Foto Real</span>
                    <img src={manualForm.real_photo} alt="preview real" className="w-16 h-22 object-cover rounded-lg border-2 border-green-500/40 shadow-md" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowManualAddForm(false)} className="flex-1 py-2 rounded-xl border border-white/10 text-slate-350 hover:bg-white/5 text-xs font-semibold transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all">
                  Guardar en Lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
}
