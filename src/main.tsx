import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Emergency console log to verify JavaScript execution
console.log('[Main] JavaScript is executing...');

// Simple, non-blocking app setup
const app = <App />;

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[Main] Root element not found!');
  document.body.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error: Root element not found</div>';
} else {
  console.log('[Main] Rendering app...');
  try {
    createRoot(rootElement).render(app);
    console.log('[Main] App rendered successfully');
    
    // Initialize reliability systems AFTER React renders
    setTimeout(() => {
      try {
        import('./utils/reliabilityInit').then(({ initReliabilitySystems }) => {
          console.log('[Main] Initializing reliability systems...');
          initReliabilitySystems();
        }).catch(error => {
          console.log('[Main] Reliability systems failed to initialize:', error);
        });
      } catch (error) {
        console.log('[Main] Failed to load reliability systems:', error);
      }
    }, 0);
  } catch (error) {
    console.error('[Main] Failed to render app:', error);
    rootElement.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error loading app: ' + error.message + '</div>';
  }
}
