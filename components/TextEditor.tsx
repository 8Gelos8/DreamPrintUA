import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const TextEditor: React.FC = () => {
  const { content, updateContent } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [homeTitle, setHomeTitle] = useState(content.homeTitle);
  const [homeDescription, setHomeDescription] = useState(content.homeDescription);
  const [aboutText, setAboutText] = useState(content.aboutText);

  const handleSave = () => {
    updateContent({
      homeTitle,
      homeDescription,
      aboutText,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setHomeTitle(content.homeTitle);
    setHomeDescription(content.homeDescription);
    setAboutText(content.aboutText);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-white/50 backdrop-blur-sm shadow-xl mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-display font-black text-stone-800 flex items-center gap-3">
          <div className="p-2 bg-dream-purple rounded-xl text-white shadow-lg">
            <Edit2 size={24} />
          </div>
          Редагування Текстів
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-lg bg-dream-purple text-white font-bold hover:shadow-lg transition-all"
          >
            <Edit2 size={18} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Заголовок Головної</label>
            <input
              type="text"
              value={homeTitle}
              onChange={(e) => setHomeTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 shadow-sm focus:border-dream-purple focus:ring focus:ring-dream-purple/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Опис Головної</label>
            <textarea
              value={homeDescription}
              onChange={(e) => setHomeDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 shadow-sm focus:border-dream-purple focus:ring focus:ring-dream-purple/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Текст Про Нас</label>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 shadow-sm focus:border-dream-purple focus:ring focus:ring-dream-purple/20 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Зберегти
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-4 rounded-lg font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
            >
              <X size={18} />
              Скасувати
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-stone-500 uppercase font-bold">Заголовок</p>
            <p className="text-lg text-stone-800 font-semibold">{content.homeTitle}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500 uppercase font-bold">Опис</p>
            <p className="text-stone-700">{content.homeDescription}</p>
          </div>
          <div>
            <p className="text-sm text-stone-500 uppercase font-bold">Про Нас</p>
            <p className="text-stone-700 whitespace-pre-wrap">{content.aboutText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
