import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentData, getContent, saveContent, syncContentToGitHub } from '../utils/content';
import { getGitHubConfig } from '../utils/github';

interface ContentContextType {
  content: ContentData;
  updateContent: (content: Partial<ContentData>) => void;
  syncToGitHub: () => Promise<void>;
  isSyncing: boolean;
  syncError: string | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentData>(getContent());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Зберігаємо локально при змінах
  useEffect(() => {
    saveContent(content);
  }, [content]);

  const updateContent = (updates: Partial<ContentData>) => {
    setContent(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const syncToGitHub = async () => {
    console.log('[ContentContext] syncToGitHub called');
    setIsSyncing(true);
    setSyncError(null);
    try {
      const config = getGitHubConfig();
      console.log('[ContentContext] GitHub config loaded:', { username: config?.username, repo: config?.repo });
      
      if (!config) {
        throw new Error('GitHub не налаштований. Перейдіть до GitHub Config.');
      }

      // Додаємо фото з localStorage до контенту перед синхронізацією
      const photos = JSON.parse(localStorage.getItem('productPhotos_v2') || '[]');
      console.log('[ContentContext] Photos from localStorage:', photos.length);
      
      const contentWithPhotos = {
        ...content,
        photos: photos,
      };

      console.log('[ContentContext] Syncing with content:', {
        homeTitle: contentWithPhotos.homeTitle,
        products: contentWithPhotos.products.length,
        prices: contentWithPhotos.prices.length,
        photos: contentWithPhotos.photos.length,
      });

      await syncContentToGitHub(contentWithPhotos, config.token, config.username, config.repo);
      console.log('[ContentContext] Sync completed successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Помилка синхронізації';
      console.error('[ContentContext] Sync error:', errorMsg);
      setSyncError(errorMsg);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, syncToGitHub, isSyncing, syncError }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
};
