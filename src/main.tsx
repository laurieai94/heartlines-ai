import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initReliabilitySystems } from './utils/reliabilityInit'

// Initialize reliability systems for data sync
console.log('[Main] Initializing app...');
initReliabilitySystems();

const isDev = import.meta.env.DEV;

const app = isDev ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : <App />;

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[Main] Root element not found!');
  throw new Error('Root element not found');
}

console.log('[Main] Rendering app...');
createRoot(rootElement).render(app);
