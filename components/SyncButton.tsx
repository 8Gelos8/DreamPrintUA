import React from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const SyncButton: React.FC = () => {
  const { syncToGitHub, isSyncing, syncError } = useContent();

  return (
    <div className="bg-white rounded-3xl p-8 border border-white/50 backdrop-blur-sm shadow-xl mb-8">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-dream-blue rounded-xl text-white shadow-lg">
          <Upload size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-stone-800">Синхронізація з GitHub</h3>
          <p className="text-sm text-stone-500">Всі зміни будуть зкомічені на GitHub</p>
        </div>
        <button
          onClick={syncToGitHub}
          disabled={isSyncing}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center gap-2 ${
            isSyncing
              ? 'bg-stone-300 cursor-not-allowed'
              : 'bg-dream-blue hover:shadow-lg active:scale-95'
          }`}
        >
          <Upload size={18} />
          {isSyncing ? 'Синхронізація...' : 'Синхронізувати'}
        </button>
      </div>

      {syncError && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm">{syncError}</p>
        </div>
      )}
    </div>
  );
};

export default SyncButton;
