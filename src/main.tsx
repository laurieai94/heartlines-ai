import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initReliabilitySystems } from './utils/reliabilityInit'

// Initialize reliability systems for data sync
initReliabilitySystems();

const isDev = import.meta.env.DEV;

const app = isDev ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : <App />;

createRoot(document.getElementById("root")!).render(app);
