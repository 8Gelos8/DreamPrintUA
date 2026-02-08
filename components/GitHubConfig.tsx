import React, { useState, useEffect } from 'react';
import { Key, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { saveGitHubConfig, getGitHubConfig } from '../utils/github';

const GitHubConfig: React.FC = () => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [repo, setRepo] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const config = getGitHubConfig();
    if (config) {
      setUsername(config.username);
      setRepo(config.repo);
      // Для безпеки не показуємо токен
      setToken('••••••••••••••••');
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !username || !repo) {
      setError('Всі поля обов\'язкові');
      return;
    }

    if (token.includes('•')) {
      setError('Введіть новий токен або залиште як є');
      return;
    }

    saveGitHubConfig({ token, username, repo });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    setError('');
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-white/50 backdrop-blur-sm shadow-xl mb-8">
      <h3 className="text-2xl font-display font-black text-stone-800 mb-6 flex items-center gap-3">
        <div className="p-2 bg-dream-cyan rounded-xl text-white shadow-lg">
          <Key size={24} />
        </div>
        GitHub Конфіг
      </h3>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
          <p className="text-sm text-blue-800">
            <strong>GitHub Personal Access Token:</strong> Його можна створити на <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">github.com/settings/tokens</a>. Потрібен доступ до <code className="bg-white px-1 rounded">repo</code>.
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">GitHub Token</label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxx"
            autoComplete="new-password"
            className="w-full px-4 py-2 rounded-lg border border-stone-200 shadow-sm focus:border-dream-cyan focus:ring focus:ring-dream-cyan/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">GitHub Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="8Gelos8"
              className="w-full px-4 py-2 rounded-lg border border-stone-200 shadow-sm focus:border-dream-cyan focus:ring focus:ring-dream-cyan/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Repo Name</label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="DreamPrintUA"
              className="w-full px-4 py-2 rounded-lg border border-stone-200 shadow-sm focus:border-dream-cyan focus:ring focus:ring-dream-cyan/20 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {isSaved && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
            <CheckCircle size={18} />
            Конфіг збережено! ✨
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-dream-cyan to-dream-blue hover:shadow-lg shadow-dream-cyan/40 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Зберегти
        </button>
      </form>
    </div>
  );
};

export default GitHubConfig;
