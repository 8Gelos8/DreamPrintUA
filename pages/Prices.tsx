import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRightCircle, Edit2, Save, X, Trash2, Plus } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { useAdmin } from '../contexts/AdminContext';
import { PRICES } from '../constants';

const Prices: React.FC = () => {
  const { content, updateContent } = useContent();
  const { isAdmin } = useAdmin();
  const [displayPrices, setDisplayPrices] = useState(PRICES);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    service: '',
    price: '',
    details: ''
  });
  
  useEffect(() => {
    if (content.prices && content.prices.length > 0) {
      setDisplayPrices(content.prices);
    } else {
      setDisplayPrices(PRICES);
    }
  }, [content.prices]);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm(displayPrices[index]);
  };

  const handleSave = (index: number) => {
    const updatedPrices = [...displayPrices];
    updatedPrices[index] = editForm;
    updateContent({ prices: updatedPrices });
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updatedPrices = displayPrices.filter((_, i) => i !== index);
    updateContent({ prices: updatedPrices });
  };

  const handleAddPrice = () => {
    updateContent({ prices: [...displayPrices, editForm] });
    setEditForm({ service: '', price: '', details: '' });
    setEditingIndex(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 flex items-center justify-center gap-4">
        <div>
          <h1 className="text-5xl font-display font-black text-stone-800 mb-6">
              Прайс-<span className="text-transparent bg-clip-text bg-gradient-to-r from-dream-green to-dream-cyan">Лист</span>
          </h1>
          <p className="text-stone-500 text-lg">
            Чесні ціни на магію. Обирайте послугу, а ми зробимо все інше.
          </p>
        </div>
        {isAdmin && editingIndex !== -1 && (
          <button
            onClick={() => {
              setEditingIndex(-1);
              setEditForm({ service: '', price: '', details: '' });
            }}
            className="p-3 bg-dream-green text-white rounded-full hover:shadow-lg transition-all h-fit"
            title="Додати нову послугу"
          >
            <Plus size={28} />
          </button>
        )}
      </div>

      {/* Add/Edit Price Form */}
      {isAdmin && editingIndex === -1 && (
        <div className="mb-8 bg-white p-8 rounded-3xl border-2 border-dream-green shadow-lg max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Додати нову послугу</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Назва послуги</label>
              <input
                type="text"
                value={editForm.service}
                onChange={(e) => setEditForm({...editForm, service: e.target.value})}
                className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-dream-cyan"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Ціна</label>
              <input
                type="text"
                value={editForm.price}
                onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-dream-cyan"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Деталі</label>
              <textarea
                value={editForm.details}
                onChange={(e) => setEditForm({...editForm, details: e.target.value})}
                rows={2}
                className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-dream-cyan"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddPrice}
                className="px-6 py-3 bg-dream-green text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save size={18} /> Додати
              </button>
              <button
                onClick={() => {
                  setEditingIndex(null);
                  setEditForm({ service: '', price: '', details: '' });
                }}
                className="px-6 py-3 bg-stone-400 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <X size={18} /> Скасувати
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayPrices.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl hover:border-dream-cyan/30 transition-all duration-300 group">
                  {editingIndex === index ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Назва послуги</label>
                        <input
                          type="text"
                          value={editForm.service}
                          onChange={(e) => setEditForm({...editForm, service: e.target.value})}
                          className="w-full px-3 py-2 border-2 border-dream-cyan rounded-lg focus:outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Ціна</label>
                        <input
                          type="text"
                          value={editForm.price}
                          onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                          className="w-full px-3 py-2 border-2 border-dream-cyan rounded-lg focus:outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Деталі</label>
                        <textarea
                          value={editForm.details}
                          onChange={(e) => setEditForm({...editForm, details: e.target.value})}
                          rows={2}
                          className="w-full px-3 py-2 border-2 border-dream-cyan rounded-lg focus:outline-none text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(index)}
                          className="flex-1 px-3 py-2 bg-dream-green text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1 text-sm"
                        >
                          <Save size={16} /> Зберегти
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="flex-1 px-3 py-2 bg-stone-400 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1 text-sm"
                        >
                          <X size={16} /> Скасувати
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <>
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
                      <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden mb-4">
                          <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-dream-cyan to-dream-purple transition-all duration-700 ease-out"></div>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="flex-1 p-2 bg-dream-blue text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-1 text-sm font-bold"
                          >
                            <Edit2 size={16} /> Редагувати
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="flex-1 p-2 bg-red-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-1 text-sm font-bold"
                          >
                            <Trash2 size={16} /> Видалити
                          </button>
                        </div>
                      )}
                    </>
                  )}
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