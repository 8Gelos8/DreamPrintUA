import React from 'react';
import { Instagram, Send, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="w-32 mb-4">
               <img src="./logo.png" alt="Dream Print UA" className="w-full h-auto opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
            <h3 className="font-display font-bold text-white text-lg mb-2">Dream Print UA</h3>
            <p className="text-sm text-stone-400 max-w-xs">
              Твоя майстерня унікальних подарунків. Друкуємо мрії на реальних речах.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Контакти</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} /> +380 99 123 45 67
              </li>
              <li className="flex items-center gap-2">
                <Send size={16} /> @dreamprint_ua_bot
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Ми в соцмережах</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-pink-400 transition-colors">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-8 pt-8 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} Dream Print UA. Всі права захищено.
        </div>
      </div>
    </footer>
  );
};

export default Footer;