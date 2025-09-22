import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

console.log('[Main] Testing Full App.tsx Logic (Step 5)...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[Main] Root element not found!');
  document.body.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error: Root element not found</div>';
} else {
  console.log('[Main] Rendering App component...');
  try {
    createRoot(rootElement).render(<App />);
    console.log('[Main] App rendered successfully');
  } catch (error) {
    console.error('[Main] Failed to render App:', error);
    rootElement.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error loading App: ' + error.message + '</div>';
  }
}
