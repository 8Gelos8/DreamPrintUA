import React from 'react';
import { ShoppingBag, ArrowRightCircle } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { PRICES } from '../constants';

const Prices: React.FC = () => {
  const { content } = useContent();
  const prices = content.prices && content.prices.length > 0 ? content.prices : PRICES;
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-display font-black text-stone-800 mb-6">
            Прайс-<span className="text-transparent bg-clip-text bg-gradient-to-r from-dream-green to-dream-cyan">Лист</span>
        </h1>
        <p className="text-stone-500 text-lg">
          Чесні ціни на магію. Обирайте послугу, а ми зробимо все інше.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {prices.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl hover:border-dream-cyan/30 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-stone-50 rounded-xl text-stone-400 group-hover:bg-dream-cyan group-hover:text-white transition-colors">
                          <ShoppingBag size={24} />
                      </div>
                      <span className="font-display font-black text-2xl text-stone-800 group-hover:text-dream-pink transition-colors">
                          {item.price}
                      </span>
                  </div>
                  <h3 className="font-bold text-xl text-stone-800 mb-2">{item.service}</h3>
                  <p className="text-stone-500 text-sm mb-4">{item.details}</p>
                  <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-dream-cyan to-dream-purple transition-all duration-700 ease-out"></div>
                  </div>
              </div>
          ))}
      </div>

      <div className="mt-12 p-8 bg-gradient-to-r from-dream-purple to-dream-blue rounded-3xl text-white text-center shadow-lg shadow-dream-blue/20">
           <h3 className="text-2xl font-bold font-display mb-2">Оптове замовлення?</h3>
           <p className="opacity-90 mb-6">Для корпоративних клієнтів та великих тиражів у нас діють спеціальні "смачні" ціни.</p>
           <button className="px-6 py-3 bg-white text-dream-purple font-bold rounded-xl hover:bg-dream-yellow hover:text-stone-900 transition-colors inline-flex items-center gap-2">
               Написати менеджеру <ArrowRightCircle size={20} />
           </button>
      </div>
    </div>
  );
};

export default Prices;