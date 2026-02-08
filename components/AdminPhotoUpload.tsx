import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle, Image as ImageIcon, Sparkles, LogOut } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const AdminPhotoUpload: React.FC = () => {
  const { logout } = useAdmin();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('Файл занадто великий (макс 10MB)');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError('');
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLogout = () => {
    logout();
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !previewUrl) return;

    // Save to localStorage as a product photo
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        try {
          const storedPhotos = JSON.parse(localStorage.getItem('productPhotos') || '[]');
          
          // Стискаємо фото якість (максимум 500x500, якість 0.7)
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxSize = 500;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedImage = canvas.toDataURL('image/jpeg', 0.7);

              const newPhoto = {
                id: Date.now().toString(),
                imageUrl: compressedImage,
                title: description.trim() || selectedFile.name.replace(/\.[^/.]+$/, ''),
                timestamp: new Date().toISOString(),
              };
              
              // Лімітуємо: максимум 10 фото
              if (storedPhotos.length >= 10) {
                storedPhotos.pop(); // Видаляємо найстарішу
              }
              
              storedPhotos.unshift(newPhoto);
              localStorage.setItem('productPhotos', JSON.stringify(storedPhotos));

              // Show success
              setTimeout(() => {
                setIsUploaded(true);
                setTimeout(() => {
                  handleClear();
                  setIsUploaded(false);
                  window.dispatchEvent(new Event('photosUpdated'));
                }, 2000);
              }, 800);
            }
          };
          img.src = event.target.result as string;
        } catch (e) {
          setError('Помилка: Недостатньо місця. Видаліть старі фото.');
          console.error(e);
        }
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-white/50 backdrop-blur-sm shadow-xl">
      <h3 className="text-3xl font-display font-black text-stone-800 mb-8 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-dream-pink rounded-xl text-white shadow-lg shadow-dream-pink/30">
              <UploadCloud size={28} />
          </div>
          Адмін Панель
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors font-bold text-sm"
        >
          <LogOut size={18} />
          Вихід
        </button>
      </h3>
      
      {isUploaded ? (
        // Success Message
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-dream-green/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle size={48} className="text-dream-green" />
            </div>
            <h4 className="text-2xl font-bold text-stone-800 mb-2">Фото завантажено!</h4>
            <p className="text-stone-500">Воно з'явилось на робочому столі 📸</p>
        </div>
      ) : (
        // Upload Form
        <form onSubmit={handleUpload} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium">
              {error}
            </div>
          )}
          
          {/* Upload Area */}
          <div className="relative group">
             {!previewUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-stone-200 rounded-2xl h-72 flex flex-col items-center justify-center cursor-pointer hover:border-dream-cyan hover:bg-cyan-50/50 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-dream-cyan/5 to-dream-pink/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all z-10">
                      <ImageIcon className="text-stone-300 group-hover:text-dream-cyan" size={40} />
                  </div>
                  <p className="text-stone-700 font-bold text-lg z-10">Завантажити фото твого виробу</p>
                  <p className="text-sm text-stone-400 mt-1 z-10">JPG, PNG до 10MB</p>
                </div>
             ) : (
                <div className="relative h-72 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={handleClear}
                        className="bg-white p-3 rounded-full text-red-500 hover:bg-red-50 hover:scale-110 transition-all shadow-lg"
                      >
                        <X size={24} />
                      </button>
                  </div>
                </div>
             )}
             <input 
               type="file" 
               ref={fileInputRef}
               onChange={handleFileChange}
               className="hidden"
               accept="image/*"
             />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2 ml-1">Назва виробу (опційно)</label>
            <div className="relative">
                <input 
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Наприклад: Чашка з логотипом, Свічка 'Love', Брелок..."
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 shadow-sm focus:border-dream-purple focus:ring focus:ring-dream-purple/20 transition-all"
                />
                <Sparkles className="absolute right-3 top-3 text-dream-purple/30 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              type="submit"
              disabled={!selectedFile}
              className={`flex-1 py-4 px-6 rounded-xl font-black text-lg text-white shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${
                selectedFile 
                ? 'bg-gradient-to-r from-dream-purple via-dream-pink to-dream-orange hover:shadow-dream-pink/40' 
                : 'bg-stone-200 cursor-not-allowed text-stone-400'
              }`}
            >
              ЗАВАНТАЖИТИ
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminPhotoUpload;
