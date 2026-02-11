import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Prices from './pages/Prices';
import About from './pages/About';
import Admin from './pages/Admin';

const AppContent: React.FC = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    const buildTime = '2026-02-11T' + Math.random().toString(36).slice(2);
    console.log('[App v8f7d825] Rendering - current location:', {
      pathname: location.pathname,
      hash: location.hash,
      buildTime,
      hasProductPhotos_v2: !!localStorage.getItem('productPhotos_v2'),
      hasProductPhotos_old: !!localStorage.getItem('productPhotos'),
      hasAdminAuth: !!localStorage.getItem('adminAuth'),
      keys: Object.keys(localStorage),
      timestamp: new Date().toISOString()
    });
  }, [location]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;