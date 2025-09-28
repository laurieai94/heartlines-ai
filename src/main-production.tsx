import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import { initializeProductionOptimizations } from '@/utils/bundleOptimization';
import '@/index.css';

// Initialize production optimizations
initializeProductionOptimizations();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);