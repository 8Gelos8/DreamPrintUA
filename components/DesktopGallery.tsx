import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen, RefreshCw, Trash2 } from 'lucide-react';
import { GALLERY_ITEMS as DEFAULT_ITEMS, GITHUB_CONFIG } from '../constants';
import { GalleryItem } from '../types';

const COLORS = [
  'border-dream-pink',
  'border-dream-cyan',
  'border-dream-yellow',
  'border-dream-purple',
  'border-dream-green',
  'border-dream-orange',
];

const DesktopGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPhotos, setUserPhotos] = useState<GalleryItem[]>([]);

  // Helper to randomize positions (deterministic based on ID)
  const processItems = useCallback((rawItems: GalleryItem[]) => {
    return rawItems.map((item, index) => {
      // If we already have positions (from constants), keep them
      if (item.top && item.left) return item;

      const seed = item.id.charCodeAt(0) + index;
      const randomRot = (seed % 30) - 15;
      const randomTop = (seed % 60) + 10;
      const randomLeft = ((seed * 17) % 70) + 5;

      return {
        ...item,
        rotation: item.rotation ?? randomRot,
        top: item.top ?? `${randomTop}%`,
        left: item.left ?? `${randomLeft}%`,
        zIndex: item.zIndex ?? index + 1,
      };
    });
  }, []);

  const loadFromGitHub = useCallback(async () => {
    setLoading(true);
    // If config isn't set, use defaults immediately
    if (GITHUB_CONFIG.username === 'YOUR_GITHUB_USERNAME') {
      setItems(processItems(DEFAULT_ITEMS));
      setLoading(false);
      return;
    }

    try {
      // Fetch the file list from GitHub API
      // Add timestamp to prevent caching
      const apiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/public/${GITHUB_CONFIG.path}?t=${Date.now()}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
          // If 404 (folder empty or doesn't exist yet) or 403 (rate limit), fall back
          console.warn(`GitHub API status: ${response.status}`);
          setItems(processItems(DEFAULT_ITEMS));
          return;
      }

      const files = await response.json();

      if (!Array.isArray(files)) throw new Error('Invalid response');

      // Filter for images
      const imageFiles = files.filter((file: any) => 
        file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      );

      if (imageFiles.length === 0) {
         setItems(processItems(DEFAULT_ITEMS));
      } else {
         const newItems: GalleryItem[] = imageFiles.map((file: any) => {
           // Clean up filename to create a title: "Cool_Cup-1.jpg" -> "Cool Cup 1"
           // Decodes URI components to handle Cyrillic filenames from Telegram
           let safeName = decodeURIComponent(file.name);
           const title = safeName
              .replace(/\.[^/.]+$/, "") // Remove extension
              .replace(/[-_]/g, " ");   // Replace dashes/underscores with spaces

           return {
             id: file.sha, // Use GitHub SHA as ID
             // We construct the path relative to the site root
             imageUrl: `./${GITHUB_CONFIG.path}/${file.name}`, 
             title: title
           };
         });
         setItems(processItems(newItems));
      }

    } catch (error) {
      console.warn("Could not load from GitHub folder, utilizing defaults.", error);
      setItems(processItems(DEFAULT_ITEMS));
    } finally {
      setLoading(false);
    }
  }, [processItems]);

  useEffect(() => {
    loadFromGitHub();
    loadUserPhotos();
    
    // Listen for updates from FileUpload
    const handlePhotosUpdate = () => {
      loadUserPhotos();
    };
    window.addEventListener('photosUpdated', handlePhotosUpdate);
    return () => window.removeEventListener('photosUpdated', handlePhotosUpdate);
  }, [loadFromGitHub]);

  const loadUserPhotos = useCallback(() => {
    const stored = localStorage.getItem('productPhotos_v2') || '[]';
    try {
      const photos = JSON.parse(stored);
      console.log('[DesktopGallery] Loaded photos from storage:', photos.length, photos);
      // Процесуємо фото щоб додати позиціонування та ротацію
      const processedPhotos = photos.map((photo: any) => {
        const seed = photo.id.charCodeAt(0);
        return {
          ...photo,
          rotation: photo.rotation ?? (seed % 30) - 15,
          top: photo.top ?? `${(seed % 60) + 10}%`,
          left: photo.left ?? `${((seed * 17) % 70) + 5}%`,
          zIndex: photo.zIndex ?? 1,
        };
      });
      console.log('[DesktopGallery] Processed photos:', processedPhotos);
      setUserPhotos(processedPhotos);
    } catch (e) {
      console.error('Failed to parse user photos', e);
    }
  }, []);

  const deleteUserPhoto = (id: string) => {
    const updated = userPhotos.filter(p => p.id !== id);
    localStorage.setItem('productPhotos_v2', JSON.stringify(updated));
    setUserPhotos(updated);
  };

  // Combine user photos and default items
  const allItems = [...userPhotos, ...items];
  
  React.useEffect(() => {
    console.log('[DesktopGallery] allItems updated:', {
      userPhotos: userPhotos.length,
      items: items.length,
      total: allItems.length,
      allItems
    });
  }, [allItems, userPhotos, items]);

  const selectedItem = allItems.find(item => item.id === selectedId);

  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-stone-100 rounded-3xl shadow-inner border-4 border-white perspective-1000 group">
      {/* Desk texture hint */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #a8a29e 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Controls */}
      <div className="absolute top-8 left-8 z-10 max-w-xs pointer-events-none">
         <h2 className="font-display font-black text-4xl text-stone-300 select-none">Наш Робочий Стіл</h2>
         <div className="mt-2 flex items-center gap-3 pointer-events-auto">
         <p className="text-stone-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                {loading ? 'Оновлення...' : `Всього фото: ${allItems.length}`}
                {!loading && allItems.length > 0 && <FolderOpen size={16} />}
             </p>
             <button 
                onClick={loadFromGitHub}
                disabled={loading}
                className="p-2 bg-white rounded-full text-stone-400 hover:text-dream-pink hover:bg-pink-50 shadow-sm transition-all active:scale-90"
                title="Оновити галерею"
             >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
             </button>
         </div>
      </div>

      {/* Scattered Photos with Scrollable Container */}
      <div className="absolute inset-0 overflow-x-auto overflow-y-hidden scroll-smooth">
        <div className="flex gap-6 p-8 min-w-max h-full items-center">
          {allItems.map((item, index) => {
            const borderColor = COLORS[index % COLORS.length];
            const isUserPhoto = userPhotos.some(p => p.id === item.id);
            return (
              <motion.div
                key={item.id}
                layoutId={`card-${item.id}`}
                onClick={() => setSelectedId(item.id)}
                className={`flex-shrink-0 cursor-pointer shadow-lg hover:shadow-2xl transition-shadow bg-white p-2 md:p-3 pb-8 md:pb-12 border-b-4 ${borderColor} group`}
                style={{
                  maxWidth: '220px',
                }}
                initial={{ 
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                   opacity: 1,
                   scale: 1,
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
              {/* Tape effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-12 bg-white/40 backdrop-blur-sm shadow-sm rotate-3 border-l border-r border-white/50"></div>

              {/* Delete button for user photos */}
              {isUserPhoto && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteUserPhoto(item.id);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                  title="Видалити фото"
                >
                  <X size={14} />
                </button>
              )}

              <div className="aspect-square w-36 md:w-44 bg-stone-100 overflow-hidden mb-3 border border-stone-100 relative group/img">
                   <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover pointer-events-none" />
                   {/* Shine effect */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="font-handwriting text-center text-sm md:text-base text-stone-700 font-bold font-display line-clamp-2 capitalize break-words">
                  {item.title}
              </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal View */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md" onClick={() => setSelectedId(null)}>
            <motion.div
              layoutId={`card-${selectedId}`}
              className="bg-white p-4 pb-8 shadow-2xl relative max-w-lg w-full rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-dream-pink via-dream-yellow to-dream-cyan`}></div>
              
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full hover:bg-dream-pink hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="aspect-square w-full bg-stone-100 rounded-xl overflow-hidden mb-6 mt-6 shadow-inner">
                  <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-center px-4">
                  <h3 className="font-display font-bold text-2xl text-stone-800 mb-2 capitalize">{selectedItem.title}</h3>
                  <p className="text-stone-500 font-medium">Ми створюємо це з любов'ю та увагою до деталей!</p>
                  <button className="mt-6 px-6 py-2 bg-stone-900 text-white rounded-lg font-bold hover:bg-dream-purple transition-colors">
                    Хочу таке!
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopGallery;