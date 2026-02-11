import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle, Image as ImageIcon, Sparkles, LogOut } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useContent } from '../contexts/ContentContext';

const AdminPhotoUpload: React.FC = () => {
  const { logout } = useAdmin();
  const { syncToGitHub, isSyncing } = useContent();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(Array.from(event.target.files));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const newPreviews: string[] = [];
    const newDescriptions: string[] = [];

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name} - файл занадто великий (макс 10MB)`);
        return;
      }
      validFiles.push(file);
      const url = URL.createObjectURL(file);
      newPreviews.push(url);
      newDescriptions.push('');
    });

    if (validFiles.length > 0) {
      setSelectedFiles([...selectedFiles, ...validFiles]);
      setPreviews([...previews, ...newPreviews]);
      setDescriptions([...descriptions, ...newDescriptions]);
      setError('');
    }
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
    setDescriptions(descriptions.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const handleClear = () => {
    previews.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviews([]);
    setDescriptions([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLogout = () => {
    logout();
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => {
        reject(new Error('Помилка при читанні файлу'));
      };
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          const img = new Image();
          img.onerror = () => {
            reject(new Error('Помилка при завантаженні зображення'));
          };
          img.onload = () => {
            try {
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
              if (!ctx) {
                reject(new Error('Помилка при обробці зображення'));
                return;
              }

              ctx.drawImage(img, 0, 0, width, height);
              const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
              resolve(compressedImage);
            } catch (e) {
              reject(e);
            }
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      let storedPhotos = JSON.parse(localStorage.getItem('productPhotos_v2') || '[]');
      
      // Process all files
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const description = descriptions[i];

        try {
          const compressedImage = await compressImage(file);

          const newPhoto = {
            id: Date.now().toString() + i,
            imageUrl: compressedImage,
            title: description.trim() || file.name.replace(/\.[^/.]+$/, ''),
            timestamp: new Date().toISOString(),
          };

          // Limit to 10 photos
          if (storedPhotos.length >= 10) {
            storedPhotos = storedPhotos.slice(0, 9);
          }

          // Check quota
          const testString = JSON.stringify([...storedPhotos, newPhoto]);
          try {
            const testKey = 'quota_test_' + Date.now() + i;
            localStorage.setItem(testKey, testString);
            localStorage.removeItem(testKey);
          } catch (e) {
            if (e instanceof Error && e.name === 'QuotaExceededError') {
              storedPhotos = storedPhotos.slice(0, Math.max(0, storedPhotos.length - 3));
            } else {
              throw e;
            }
          }

          storedPhotos.unshift(newPhoto);
        } catch (err) {
          setError(`Помилка при завантаженні ${file.name}`);
          setIsUploading(false);
          return;
        }
      }

      // Save all at once
      const finalData = JSON.stringify(storedPhotos);
      localStorage.setItem('productPhotos_v2', finalData);

      // Sync to GitHub so other devices see the update
      try {
        await syncToGitHub();
      } catch (syncErr) {
        console.warn('GitHub sync failed, but photos saved locally', syncErr);
      }

      setTimeout(() => {
        setIsUploaded(true);
        setTimeout(() => {
          handleClear();
          setIsUploaded(false);
          window.dispatchEvent(new Event('photosUpdated'));
          setIsUploading(false);
        }, 2000);
      }, 800);
    } catch (storageError) {
      console.error('[AdminPhotoUpload] Storage error:', storageError);
      if (storageError instanceof Error && storageError.name === 'QuotaExceededError') {
        setError('Помилка: Недостатньо місця. Видаліть старі фото.');
      } else {
        setError('Помилка при збереженні фото');
      }
      setIsUploading(false);
    }
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
            <p className="text-stone-500">{selectedFiles.length} фото з'явилось на робочому столі 📸</p>
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
          {selectedFiles.length === 0 ? (
            <div className="relative group">
              <div 
                ref={dragRef}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-4 border-dashed rounded-2xl h-72 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  isDragActive 
                    ? 'border-dream-cyan bg-cyan-50 shadow-lg shadow-dream-cyan/30' 
                    : 'border-stone-200 hover:border-dream-cyan hover:bg-cyan-50/50'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-dream-cyan/5 to-dream-pink/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all z-10 ${
                  isDragActive 
                    ? 'bg-dream-cyan/20 shadow-lg' 
                    : 'bg-white'
                }`}>
                    <ImageIcon className={`group-hover:scale-125 transition-all z-10 ${isDragActive ? 'text-dream-cyan scale-125' : 'text-stone-300 group-hover:text-dream-cyan'}`} size={40} />
                </div>
                <p className={`font-bold text-lg z-10 ${isDragActive ? 'text-dream-cyan' : 'text-stone-700'}`}>
                  {isDragActive ? 'Кидай фото сюди!' : 'Завантажити фото твого виробу'}
                </p>
                <p className="text-sm text-stone-400 mt-1 z-10">JPG, PNG до 10MB (можна багато сразу)</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple
              />
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-800 text-lg">Вибрано {selectedFiles.length} фото</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all">
                    <img src={preview} alt={`Preview ${index}`} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="bg-white p-2 rounded-full text-red-500 hover:bg-red-50 hover:scale-110 transition-all shadow-lg"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <input 
                      type="text"
                      value={descriptions[index]}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      placeholder="Назва..."
                      className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-dream-purple"
                    />
                  </div>
                ))}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-stone-300 text-stone-600 hover:border-dream-cyan hover:text-dream-cyan transition-all font-bold"
              >
                + Додати ще фото
              </button>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="flex gap-3">
              <button 
                type="submit"
                disabled={isUploading || isSyncing}
                className={`flex-1 py-4 px-6 rounded-xl font-black text-lg text-white shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${
                  isUploading || isSyncing
                    ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                    : 'bg-gradient-to-r from-dream-purple via-dream-pink to-dream-orange hover:shadow-dream-pink/40'
                }`}
              >
                {isUploading ? 'Завантажую...' : isSyncing ? 'Синхронізую...' : `ЗАВАНТАЖИТИ ${selectedFiles.length}`}
              </button>
              <button 
                type="button"
                onClick={handleClear}
                disabled={isUploading || isSyncing}
                className="py-4 px-6 rounded-xl font-bold bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Скасувати
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default AdminPhotoUpload;
