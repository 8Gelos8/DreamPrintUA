import React, { useState } from 'react';
import { ShoppingBag, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { Product } from '../types';

const ProductEditor: React.FC = () => {
  const { content, updateContent } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [products, setProducts] = useState<Product[]>(content.products);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      title: 'Новий продукт',
      description: 'Опис',
      imageUrl: 'https://via.placeholder.com/300',
      category: 'printing',
    };
    setProducts([...products, newProduct]);
  };

  const handleEditStart = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleEditSave = () => {
    if (editingId) {
      const updated = products.map(p => p.id === editingId ? { ...p, ...editForm } : p);
      setProducts(updated);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSaveAll = () => {
    updateContent({ products });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-white/50 backdrop-blur-sm shadow-xl mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-display font-black text-stone-800 flex items-center gap-3">
          <div className="p-2 bg-dream-orange rounded-xl text-white shadow-lg">
            <ShoppingBag size={24} />
          </div>
          Редагування Продуктів
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-lg bg-dream-orange text-white font-bold hover:shadow-lg transition-all"
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
                setProducts(content.products);
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
            onClick={handleAddProduct}
            className="w-full py-3 px-4 rounded-lg font-bold text-white bg-dream-green hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-4"
          >
            <Plus size={18} />
            Додати Продукт
          </button>

          {products.map((product, idx) => (
            <div key={product.id} className="border-2 border-stone-200 rounded-xl p-4 space-y-3">
              {editingId === product.id ? (
                <>
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Назва"
                    className="w-full px-3 py-2 rounded border border-stone-200"
                  />
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Опис"
                    rows={2}
                    className="w-full px-3 py-2 rounded border border-stone-200 resize-none"
                  />
                  <input
                    type="text"
                    value={editForm.imageUrl || ''}
                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                    placeholder="URL фото"
                    className="w-full px-3 py-2 rounded border border-stone-200"
                  />
                  <select
                    value={editForm.category || 'printing'}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded border border-stone-200"
                  >
                    <option value="printing">Друк</option>
                    <option value="handmade">Handmade</option>
                    <option value="souvenir">Сувенір</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSave}
                      className="flex-1 py-2 px-3 rounded bg-green-600 text-white font-bold text-sm"
                    >
                      Зберегти
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
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
                      <p className="font-bold text-stone-800">{product.title}</p>
                      <p className="text-sm text-stone-600">{product.description}</p>
                      <p className="text-xs text-stone-400 mt-1">категорія: {product.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditStart(product)}
                        className="p-2 hover:bg-blue-100 rounded text-blue-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <img src={product.imageUrl} alt={product.title} className="w-20 h-20 object-cover rounded" />
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="border border-stone-200 rounded-lg p-3">
              <img src={product.imageUrl} alt={product.title} className="w-full h-24 object-cover rounded mb-2" />
              <p className="font-bold text-sm text-stone-800">{product.title}</p>
              <p className="text-xs text-stone-600">{product.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductEditor;
