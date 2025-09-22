import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import Index from '@/pages/Index'
import './index.css'

console.log('[Main] Testing Index Component (Step 4B)...');

// Test Index Component (Step 4B)
const HomePage = () => {
  console.log('[HomePage] Rendering Index component test...');
  return <Index />;
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

// Create QueryClient with same config as original app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

const QueryApp = () => {
  console.log('[QueryApp] Wrapping with QueryClientProvider...');
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthApp />
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('[QueryApp] QueryClient error:', error);
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
          ❌ QueryClient Failed
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
  console.log('[Main] Rendering query app...');
  try {
    createRoot(rootElement).render(<QueryApp />);
    console.log('[Main] Query app rendered successfully');
  } catch (error) {
    console.error('[Main] Failed to render query app:', error);
    rootElement.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;">Error loading query app: ' + error.message + '</div>';
  }
}
