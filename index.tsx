import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AdminProvider } from './contexts/AdminContext';
import { ContentProvider } from './contexts/ContentContext';

console.log('[index.tsx v8f7d825] React app initializing - ' + new Date().toISOString());

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
console.log('[index.tsx] Creating React root');
root.render(
  <React.StrictMode>
    <AdminProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </AdminProvider>
  </React.StrictMode>
);
console.log('[index.tsx v8f7d825] React root rendered');