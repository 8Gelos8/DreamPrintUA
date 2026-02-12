import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Edit2, Save, X, Trash2, Plus, Upload } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { useAdmin } from '../contexts/AdminContext';
import { PRODUCTS } from '../constants';

const Products: React.FC = () => {
  const { content, updateContent } = useContent();
  const { isAdmin } = useAdmin();
  const [displayProducts, setDisplayProducts] = useState(PRODUCTS);
  const [filter, setFilter] = useState<'all' | 'printing' | 'handmade' | 'souvenir'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'printing',
    imageUrl: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  console.log('[Products] Component rendered');

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

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      title: product.title,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl
    });
  };

  const handleSave = (productId: string) => {
    const updatedProducts = displayProducts.map(p =>
      p.id === productId
        ? { ...p, ...editForm }
        : p
    );
    updateContent({ products: updatedProducts });
    setEditingId(null);
  };

  const handleDelete = (productId: string) => {
    const updatedProducts = displayProducts.filter(p => p.id !== productId);
    updateContent({ products: updatedProducts });
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      ...editForm
    };
    updateContent({ products: [...displayProducts, newProduct] });
    setEditForm({ title: '', description: '', category: 'printing', imageUrl: '' });
    setPreviewImage(null);
    setEditingId(null);
  };

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Будь ласка, виберіть зображення');
      return;
    }
    const compressed = await compressImage(file);
    setEditForm({ ...editForm, imageUrl: compressed });
    setPreviewImage(compressed);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 flex items-center justify-center gap-4">
        <div>
          <h1 className="text-5xl font-display font-black text-stone-800 mb-6">
              Наша <span className="text-dream-purple">Продукція</span>
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">
            Обирайте серцем! Від персоналізованого одягу до затишного декору для дому.
          </p>
        </div>
        {isAdmin && editingId !== 'new' && (
          <button
            onClick={() => {
              setEditingId('new');
              setEditForm({ title: '', description: '', category: 'printing', imageUrl: '' });
            }}
            className="p-3 bg-dream-green text-white rounded-full hover:shadow-lg transition-all h-fit"
            title="Додати новий товар"
          >
            <Plus size={28} />
          </button>
        )}
      </div>

      {/* Add/Edit Product Form */}
      {isAdmin && editingId === 'new' && (
        <div className="mb-16 bg-white p-8 rounded-3xl border-2 border-dream-green shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Додати новий товар</h3>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-bold mb-2">Назва</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-dream-cyan"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Опис</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-dream-cyan"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Категорія</label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-dream-cyan"
              >
                <option value="printing">Друк</option>
                <option value="handmade">Handmade</option>
                <option value="souvenir">Сувенір</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Завантажити Картинку</label>
              <div
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-dream-cyan bg-cyan-50'
                    : 'border-stone-200 bg-stone-50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="product-image-upload"
                />
                <label htmlFor="product-image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={32} className="text-dream-cyan" />
                    <p className="font-bold text-stone-700">Перетягніть картинку сюди</p>
                    <p className="text-sm text-stone-500">або клікніть для вибору</p>
                  </div>
                </label>
              </div>
              {previewImage && (
                <div className="mt-4">
                  <p className="text-sm font-bold mb-2">Попередній перегляд:</p>
                  <img src={previewImage} alt="Preview" className="max-w-xs h-auto rounded-lg border-2 border-dream-cyan" />
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddProduct}
                className="px-6 py-3 bg-dream-green text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save size={18} /> Додати
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="px-6 py-3 bg-stone-400 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <X size={18} /> Скасувати
              </button>
            </div>
          </div>
        </div>
      )}

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
            {editingId === product.id ? (
              // Edit Mode
              <div className="p-8 space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Назва</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-dream-cyan rounded-lg focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Опис</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-dream-cyan rounded-lg focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Категорія</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-dream-cyan rounded-lg focus:outline-none text-sm"
                  >
                    <option value="printing">Друк</option>
                    <option value="handmade">Handmade</option>
                    <option value="souvenir">Сувенір</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(product.id)}
                    className="flex-1 px-3 py-2 bg-dream-green text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1 text-sm"
                  >
                    <Save size={16} /> Зберегти
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 px-3 py-2 bg-stone-400 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1 text-sm"
                  >
                    <X size={16} /> Скасувати
                  </button>
                </div>
              </div>
            ) : (
              // Display Mode
              <>
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
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 bg-dream-blue text-white rounded-full hover:shadow-lg transition-all"
                        title="Редагувати"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:shadow-lg transition-all"
                        title="Видалити"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
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
              </>
            )}
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