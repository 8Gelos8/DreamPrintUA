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
    setIsSyncing(true);
    setSyncError(null);
    try {
      const config = getGitHubConfig();
      if (!config) {
        throw new Error('GitHub не налаштований. Перейдіть до GitHub Config.');
      }

      // Додаємо фото з localStorage до контенту перед синхронізацією
      const photos = JSON.parse(localStorage.getItem('productPhotos_v2') || '[]');
      const contentWithPhotos = {
        ...content,
        photos: photos,
      };

      await syncContentToGitHub(contentWithPhotos, config.token, config.username, config.repo);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Помилка синхронізації');
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
