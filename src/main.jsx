import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Lazy load AdminApp for performance
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

// Loading fallback for lazy components
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-[#0052FF] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 mt-4 text-sm font-semibold">Cargando...</p>
    </div>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route 
          path="/acceso-privado-cp/*" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminApp />
            </Suspense>
          } 
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
