import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

console.log('[Main] Testing React Router...');

// Test Basic React Router (Step 1)
const HomePage = () => {
  console.log('[HomePage] Rendering home page...');
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
        🔥 React Router Test
      </h1>
      <p>Step 1: Basic routing working!</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

const RouterApp = () => {
  console.log('[RouterApp] Rendering router app...');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[Main] Root element not found!');
  document.body.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error: Root element not found</div>';
} else {
  console.log('[Main] Rendering router app...');
  try {
    createRoot(rootElement).render(<RouterApp />);
    console.log('[Main] Router app rendered successfully');
  } catch (error) {
    console.error('[Main] Failed to render router app:', error);
    rootElement.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error loading router app: ' + error.message + '</div>';
  }
}
