import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle, Image as ImageIcon, Sparkles } from 'lucide-react';

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSent, setIsSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsSent(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDescription('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    // Simulation of sending data (будемо пропрацьовувати пізніше)
    setTimeout(() => {
      setIsSent(true);
      setTimeout(() => {
        handleClear();
        setIsSent(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-white/50 backdrop-blur-sm shadow-xl">
      <h3 className="text-3xl font-display font-black text-stone-800 mb-8 flex items-center gap-3">
        <div className="p-2 bg-dream-pink rounded-xl text-white shadow-lg shadow-dream-pink/30">
            <UploadCloud size={28} />
        </div>
        Замовити Друк
      </h3>
      
      {isSent ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-dream-green/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle size={48} className="text-dream-green" />
            </div>
            <h4 className="text-2xl font-bold text-stone-800 mb-2">Замовлення надіслано!</h4>
            <p className="text-stone-500">Ми зв'яжемося з вами найближчим часом для уточнення деталей.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
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
                  <p className="text-stone-700 font-bold text-lg z-10">Завантажити фото</p>
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
            <label className="block text-sm font-bold text-stone-700 mb-2 ml-1">Ваші побажання</label>
            <div className="relative">
                <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Наприклад: хочу це фото на білій чашці з написом 'Найкращій Мамі'..."
                className="w-full rounded-2xl border border-stone-200 shadow-sm focus:border-dream-purple focus:ring focus:ring-dream-purple/20 min-h-[120px] p-4 resize-none transition-all"
                />
                <Sparkles className="absolute right-3 bottom-3 text-dream-purple/30 pointer-events-none" size={20} />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!selectedFile}
            className={`w-full py-4 px-6 rounded-xl font-black text-lg text-white shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${
              selectedFile 
              ? 'bg-gradient-to-r from-dream-purple via-dream-pink to-dream-orange hover:shadow-dream-pink/40' 
              : 'bg-stone-200 cursor-not-allowed text-stone-400'
            }`}
          >
            ВІДПРАВИТИ ЗАМОВЛЕННЯ
          </button>
        </form>
      )}
    </div>
  );
};

export default FileUpload;