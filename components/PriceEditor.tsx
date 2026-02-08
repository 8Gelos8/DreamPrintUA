import React, { useState } from 'react';
import { DollarSign, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { PriceItem } from '../types';

const PriceEditor: React.FC = () => {
  const { content, updateContent } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [prices, setPrices] = useState<PriceItem[]>(content.prices);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<PriceItem>>({});

  const handleAddPrice = () => {
    const newPrice: PriceItem = {
      service: 'Нова послуга',
      price: '0 грн',
      details: 'Деталі',
    };
    setPrices([...prices, newPrice]);
  };

  const handleEditStart = (idx: number) => {
    setEditingIdx(idx);
    setEditForm({ ...prices[idx] });
  };

  const handleEditSave = () => {
    if (editingIdx !== null) {
      const updated = [...prices];
      updated[editingIdx] = { ...updated[editingIdx], ...editForm };
      setPrices(updated);
      setEditingIdx(null);
      setEditForm({});
    }
  };

  const handleDelete = (idx: number) => {
    setPrices(prices.filter((_, i) => i !== idx));
  };

  const handleSaveAll = () => {
    updateContent({ prices });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-white/50 backdrop-blur-sm shadow-xl mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-display font-black text-stone-800 flex items-center gap-3">
          <div className="p-2 bg-dream-green rounded-xl text-white shadow-lg">
            <DollarSign size={24} />
          </div>
          Редагування Цін
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-lg bg-dream-green text-white font-bold hover:shadow-lg transition-all"
          >
            <Edit2 size={18} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold hover:shadow-lg transition-all"
            >
              <Save size={18} />
            </button>
            <button
              onClick={() => {
                setPrices(content.prices);
                setIsEditing(false);
              }}
              className="px-4 py-2 rounded-lg bg-stone-200 text-stone-700 font-bold hover:shadow-lg transition-all"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <button
            onClick={handleAddPrice}
            className="w-full py-3 px-4 rounded-lg font-bold text-white bg-dream-green hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-4"
          >
            <Plus size={18} />
            Додати Цінник
          </button>

          {prices.map((price, idx) => (
            <div key={idx} className="border-2 border-stone-200 rounded-xl p-4 space-y-3">
              {editingIdx === idx ? (
                <>
                  <input
                    type="text"
                    value={editForm.service || ''}
                    onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}
                    placeholder="Послуга"
                    className="w-full px-3 py-2 rounded border border-stone-200"
                  />
                  <input
                    type="text"
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    placeholder="Ціна"
                    className="w-full px-3 py-2 rounded border border-stone-200"
                  />
                  <textarea
                    value={editForm.details || ''}
                    onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}
                    placeholder="Деталі"
                    rows={2}
                    className="w-full px-3 py-2 rounded border border-stone-200 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSave}
                      className="flex-1 py-2 px-3 rounded bg-green-600 text-white font-bold text-sm"
                    >
                      Зберегти
                    </button>
                    <button
                      onClick={() => setEditingIdx(null)}
                      className="flex-1 py-2 px-3 rounded bg-stone-200 text-stone-700 font-bold text-sm"
                    >
                      Скасувати
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-stone-800">{price.service}</p>
                      <p className="text-sm text-stone-600">{price.details}</p>
                      <p className="font-bold text-dream-green mt-2">{price.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditStart(idx)}
                        className="p-2 hover:bg-blue-100 rounded text-blue-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="p-2 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prices.map((price, idx) => (
            <div key={idx} className="border border-stone-200 rounded-lg p-3">
              <p className="font-bold text-stone-800">{price.service}</p>
              <p className="text-sm text-stone-600">{price.details}</p>
              <p className="font-bold text-dream-green mt-2">{price.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceEditor;
