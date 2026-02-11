import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Prices from './pages/Prices';
import About from './pages/About';
import Admin from './pages/Admin';

const App: React.FC = () => {
  React.useEffect(() => {
    const buildTime = '2026-02-11T' + Math.random().toString(36).slice(2);
    console.log('[App v8f7d825] Rendering - checking localStorage keys:', {
      buildTime,
      hasProductPhotos_v2: !!localStorage.getItem('productPhotos_v2'),
      hasProductPhotos_old: !!localStorage.getItem('productPhotos'),
      hasAdminAuth: !!localStorage.getItem('adminAuth'),
      keys: Object.keys(localStorage),
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;