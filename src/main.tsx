import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Emergency console log to verify JavaScript execution
console.log('[Main] JavaScript is executing - MINIMAL VERSION...');

// Absolute minimal app for debugging
const MinimalApp = () => {
  console.log('[MinimalApp] Rendering minimal app...');
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dc2626, #991b1b)',
      color: 'white',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        🔥 Minimal App Running
      </h1>
      <p>JavaScript execution successful!</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[Main] Root element not found!');
  document.body.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error: Root element not found</div>';
} else {
  console.log('[Main] Rendering minimal app...');
  try {
    createRoot(rootElement).render(<MinimalApp />);
    console.log('[Main] Minimal app rendered successfully');
  } catch (error) {
    console.error('[Main] Failed to render minimal app:', error);
    rootElement.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error loading minimal app: ' + error.message + '</div>';
  }
}
