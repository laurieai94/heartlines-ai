import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initReliabilitySystems } from './utils/reliabilityInit'

// Defer reliability systems initialization to after initial render
const deferInit = () => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      initReliabilitySystems();
    }, { timeout: 1500 });
  } else {
    setTimeout(initReliabilitySystems, 800);
  }
};

deferInit();

const isDev = import.meta.env.DEV;

const app = isDev ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : <App />;

createRoot(document.getElementById("root")!).render(app);
