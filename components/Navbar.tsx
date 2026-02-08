import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg shadow-dream-purple/5 border-b border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            {/* Logo Image */}
            <div className="relative h-16 w-auto transition-transform duration-300 group-hover:scale-105">
                <img src="./logo.png" alt="Dream Print UA" className="h-full w-auto object-contain drop-shadow-md" onError={(e) => {
                    // Fallback if logo.png is missing
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="font-display font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-dream-cyan via-dream-yellow to-dream-pink drop-shadow-sm">DreamPrint<span class="text-dream-purple">UA</span></span>';
                }} />
            </div>
          </NavLink>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-base font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-dream-pink to-dream-purple text-white shadow-md transform scale-105'
                        : 'text-stone-600 hover:text-dream-pink hover:bg-pink-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-stone-600 hover:text-dream-pink hover:bg-pink-50 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-dream-pink/20">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-lg font-bold text-center transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-dream-cyan to-dream-blue text-white shadow-lg'
                      : 'text-stone-600 hover:text-dream-pink hover:bg-pink-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;