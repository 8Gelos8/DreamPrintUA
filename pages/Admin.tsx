import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import AdminPhotoUpload from '../components/AdminPhotoUpload';
import GitHubConfig from '../components/GitHubConfig';

const Admin: React.FC = () => {
  const { isAdmin, login, isLoading } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setPassword('');
      setError('');
    } else {
      setError('Неправильний пароль');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-stone-500">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 border border-white/50 backdrop-blur-sm shadow-xl">
          <h1 className="text-3xl font-display font-black text-stone-800 mb-8 flex items-center gap-3">
            <div className="p-2 bg-dream-purple rounded-xl text-white shadow-lg">
              <Lock size={28} />
            </div>
            Адмін Панель
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex items-center justify-center p-8 bg-gradient-to-br from-dream-pink/10 to-dream-purple/10 rounded-2xl border-2 border-dashed border-stone-300">
              <Lock className="text-stone-400 mr-3" size={24} />
              <p className="text-stone-600 font-medium">Введіть пароль для доступу</p>
            </div>
            
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введіть пароль..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 shadow-sm focus:border-dream-purple focus:ring focus:ring-dream-purple/20 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl font-black text-lg text-white bg-gradient-to-r from-dream-purple via-dream-pink to-dream-orange hover:shadow-lg shadow-dream-pink/40 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              УВІЙТИ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <GitHubConfig />
      <AdminPhotoUpload />
    </div>
  );
};

export default Admin;
