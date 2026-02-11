import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { PRODUCTS } from '../constants';

const Products: React.FC = () => {
  const { content } = useContent();
  const [displayProducts, setDisplayProducts] = useState(PRODUCTS);
  const [filter, setFilter] = useState<'all' | 'printing' | 'handmade' | 'souvenir'>('all');

  useEffect(() => {
    if (content.products && content.products.length > 0) {
      setDisplayProducts(content.products);
    } else {
      setDisplayProducts(PRODUCTS);
    }
  }, [content.products]);

  const filteredProducts = displayProducts.filter(
    (product) => filter === 'all' || product.category === filter
  );

  const getCategoryColor = (cat: string) => {
      switch(cat) {
          case 'printing': return 'text-dream-cyan bg-cyan-50 border-dream-cyan';
          case 'handmade': return 'text-dream-pink bg-pink-50 border-dream-pink';
          case 'souvenir': return 'text-dream-orange bg-orange-50 border-dream-orange';
          default: return 'text-stone-500 bg-stone-50';
      }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-display font-black text-stone-800 mb-6">
            Наша <span className="text-dream-purple">Продукція</span>
        </h1>
        <p className="text-stone-500 max-w-2xl mx-auto text-lg">
          Обирайте серцем! Від персоналізованого одягу до затишного декору для дому.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {[
          { id: 'all', label: 'Всі ✨', color: 'hover:border-stone-800 hover:text-stone-800' },
          { id: 'printing', label: 'Друк 🖨️', color: 'hover:border-dream-cyan hover:text-dream-cyan' },
          { id: 'handmade', label: 'Handmade 🧶', color: 'hover:border-dream-pink hover:text-dream-pink' },
          { id: 'souvenir', label: 'Сувеніри 🎁', color: 'hover:border-dream-orange hover:text-dream-orange' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
              filter === tab.id
                ? 'bg-stone-900 text-white border-stone-900 shadow-lg scale-105'
                : `bg-white text-stone-500 border-stone-200 ${tab.color} hover:bg-white`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key={product.id}
            className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-dream-purple/10 transition-all duration-300 border border-stone-100 flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden bg-stone-100 relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getCategoryColor(product.category)}`}>
                      {product.category}
                  </span>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-stone-800 mb-3 font-display leading-tight">{product.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-grow">
                {product.description}
              </p>
              <button className="w-full py-3 rounded-xl bg-stone-50 text-stone-800 font-bold hover:bg-gradient-to-r hover:from-dream-cyan hover:to-dream-blue hover:text-white transition-all duration-300 border border-stone-200 hover:border-transparent group-hover:shadow-md">
                Детальніше
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
         <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-stone-100 mb-4">
               <Tag size={48} className="text-stone-300" />
            </div>
            <p className="text-stone-400 font-medium">В цій категорії поки що пусто...</p>
         </div>
      )}
    </div>
  );
};

export default Products;