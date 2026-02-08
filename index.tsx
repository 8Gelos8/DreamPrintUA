import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AdminProvider } from './contexts/AdminContext';
import { ContentProvider } from './contexts/ContentContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AdminProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </AdminProvider>
  </React.StrictMode>
);