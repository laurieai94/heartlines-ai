import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import './index.css'

console.log('[Main] Testing Supabase AuthProvider (Step 2)...');

// Test Supabase AuthProvider (Step 2)
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
        🔥 AuthProvider Test
      </h1>
      <p>Step 2: Testing Supabase auth initialization!</p>
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

const AuthApp = () => {
  console.log('[AuthApp] Wrapping with AuthProvider...');
  try {
    return (
      <AuthProvider>
        <RouterApp />
      </AuthProvider>
    );
  } catch (error) {
    console.error('[AuthApp] AuthProvider error:', error);
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
          ❌ AuthProvider Failed
        </h1>
        <p>Error: {error.message}</p>
      </div>
    );
  }
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('[Main] Root element not found!');
  document.body.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error: Root element not found</div>';
} else {
  console.log('[Main] Rendering auth app...');
  try {
    createRoot(rootElement).render(<AuthApp />);
    console.log('[Main] Auth app rendered successfully');
  } catch (error) {
    console.error('[Main] Failed to render auth app:', error);
    rootElement.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error loading auth app: ' + error.message + '</div>';
  }
}
