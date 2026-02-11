import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen, RefreshCw } from 'lucide-react';
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

interface PositionedItem extends GalleryItem {
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
}

const DesktopGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPhotos, setUserPhotos] = useState<GalleryItem[]>([]);
  const [positionedItems, setPositionedItems] = useState<PositionedItem[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Generate random positions with collision detection
  const generatePositions = useCallback((allItems: GalleryItem[], containerWidth: number, containerHeight: number) => {
    const CARD_WIDTHS = [140, 160, 180];
    const CARD_HEIGHTS = [180, 200, 220];
    const PADDING = 20;

    // Simple pseudo-random number generator for deterministic but varied positions
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const positioned: PositionedItem[] = [];
    
    // Divide container into a grid and distribute items
    const cols = Math.floor((containerWidth - PADDING * 2) / 200);
    const rows = Math.floor((containerHeight - PADDING * 2) / 250);
    const cellWidth = (containerWidth - PADDING * 2) / Math.max(1, cols);
    const cellHeight = (containerHeight - PADDING * 2) / Math.max(1, rows);
    
    let gridIndex = 0;
    
    for (const item of allItems) {
      // Deterministic size based on item ID
      const seed = item.id.charCodeAt(0) + item.id.charCodeAt(1) || 0;
      const widthIdx = seed % CARD_WIDTHS.length;
      const heightIdx = (seed * 2) % CARD_HEIGHTS.length;
      const width = CARD_WIDTHS[widthIdx];
      const height = CARD_HEIGHTS[heightIdx];

      // Position based on grid cell with randomization
      const row = Math.floor(gridIndex / Math.max(1, cols));
      const col = gridIndex % Math.max(1, cols);
      
      const cellX = PADDING + col * cellWidth;
      const cellY = PADDING + row * cellHeight;
      
      // Add randomness within the cell
      const randomX = seededRandom(seed + 1) * (cellWidth - width - 20);
      const randomY = seededRandom(seed + 2) * (cellHeight - height - 20);
      
      const x = Math.max(PADDING, Math.min(containerWidth - width - PADDING, cellX + randomX));
      const y = Math.max(PADDING, Math.min(containerHeight - height - PADDING, cellY + randomY));
      const rotation = (seededRandom(seed + 3) - 0.5) * 30;

      positioned.push({
        ...item,
        x,
        y,
        rotation,
        width,
        height,
      });
      
      gridIndex++;
    }

    return positioned;
  }, []);

  const loadFromGitHub = useCallback(async () => {
    setLoading(true);
    if (GITHUB_CONFIG.username === 'YOUR_GITHUB_USERNAME') {
      setItems(DEFAULT_ITEMS);
      setLoading(false);
      return;
    }

    try {
      const apiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/public/${GITHUB_CONFIG.path}?t=${Date.now()}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.warn(`GitHub API status: ${response.status}`);
        setItems(DEFAULT_ITEMS);
        return;
      }

      const files = await response.json();

      if (!Array.isArray(files)) throw new Error('Invalid response');

      const imageFiles = files.filter((file: any) => 
        file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      );

      if (imageFiles.length === 0) {
        setItems(DEFAULT_ITEMS);
      } else {
        const newItems: GalleryItem[] = imageFiles.map((file: any) => {
          let safeName = decodeURIComponent(file.name);
          const title = safeName
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ");

          return {
            id: file.sha,
            imageUrl: `./${GITHUB_CONFIG.path}/${file.name}`, 
            title: title
          };
        });
        setItems(newItems);
      }
    } catch (error) {
      console.warn("Could not load from GitHub folder, utilizing defaults.", error);
      setItems(DEFAULT_ITEMS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFromGitHub();
    loadUserPhotos();
    
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
      setUserPhotos(photos);
    } catch (e) {
      console.error('Failed to parse user photos', e);
    }
  }, []);

  const deleteUserPhoto = (id: string) => {
    const updated = userPhotos.filter(p => p.id !== id);
    localStorage.setItem('productPhotos_v2', JSON.stringify(updated));
    setUserPhotos(updated);
  };

  const allItems = [...userPhotos, ...items];
  const selectedItem = allItems.find(item => item.id === selectedId);

  // Generate positions on mount and when items change
  useEffect(() => {
    if (containerRef.current && allItems.length > 0) {
      const rect = containerRef.current.getBoundingClientRect();
      // Use container dimensions or fallback to defaults
      const width = rect.width > 0 ? rect.width : 1200;
      const height = rect.height > 0 ? rect.height : 700;
      const positioned = generatePositions(allItems, width, height);
      setPositionedItems(positioned);
    }
  }, [allItems, generatePositions]);

  const handleCardHover = (id: string | null) => {
    setHoveredId(id);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100 rounded-3xl shadow-inner border-4 border-white perspective-1000"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Desk texture */}
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

      {/* Scattered Cards Masonry Layout */}
      {positionedItems.map((item) => {
        const isHovered = hoveredId === item.id;
        const borderColor = COLORS[Math.abs(item.id.charCodeAt(0)) % COLORS.length];
        const isUserPhoto = userPhotos.some(p => p.id === item.id);

        return (
          <motion.div
            key={item.id}
            layoutId={`card-${item.id}`}
            onHoverStart={() => handleCardHover(item.id)}
            onHoverEnd={() => handleCardHover(null)}
            onClick={() => {
              if (isHovered) {
                setSelectedId(item.id);
              } else {
                handleCardHover(item.id);
              }
            }}
            animate={
              isHovered
                ? {
                    scale: 1.3,
                    zIndex: 50,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  }
                : {
                    scale: 1,
                    zIndex: 1,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }
            }
            transition={{
              duration: 0.3,
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className={`absolute cursor-pointer bg-white rounded-lg overflow-hidden ${borderColor} border-b-4 hover:shadow-2xl transition-all`}
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: item.width,
              height: item.height,
              rotate: isHovered ? 0 : item.rotation,
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          >
            {/* Tape effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-12 bg-white/40 backdrop-blur-sm shadow-sm rotate-3 border-l border-r border-white/50 z-10"></div>

            {/* Delete button */}
            {isUserPhoto && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteUserPhoto(item.id);
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white shadow-lg opacity-0 hover:opacity-100 transition-opacity z-20 hover:bg-red-600"
                title="Видалити фото"
              >
                <X size={14} />
              </button>
            )}

            <div className="w-full h-full bg-stone-100 overflow-hidden relative group/img">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover pointer-events-none" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Label on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900 to-transparent p-3 text-white"
                >
                  <p className="font-display font-bold text-sm line-clamp-2 capitalize">{item.title}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Empty State */}
      {allItems.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <FolderOpen size={64} className="text-stone-300 mx-auto mb-4" />
            <p className="text-stone-400 font-bold text-lg">Поки що немає фото</p>
            <p className="text-stone-500 text-sm">Завантажте свої першi фото в адмінпанелі!</p>
          </div>
        </div>
      )}

      {/* Modal View */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              layoutId={`card-${selectedId}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 pb-8 shadow-2xl relative max-w-lg w-full rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-dream-pink via-dream-yellow to-dream-cyan"></div>
              
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full hover:bg-dream-pink hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="aspect-square w-full bg-stone-100 rounded-xl overflow-hidden mb-6 mt-6 shadow-inner">
                <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-center px-4">
                <h3 className="font-display font-bold text-2xl text-stone-800 mb-2 capitalize">{selectedItem.title}</h3>
                <p className="text-stone-500 font-medium mb-6">Ми створюємо це з любов'ю та увагою до деталей!</p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-dream-pink to-dream-purple text-white rounded-lg font-bold hover:shadow-lg hover:shadow-dream-pink/40 transition-all">
                  Хочу таке!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopGallery;
