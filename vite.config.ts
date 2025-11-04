import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Aggressive production optimizations
    minify: 'esbuild', // Faster than terser with excellent compression
    target: 'es2020', // Better optimization for modern browsers
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React - highest priority, loaded first
          'vendor-react': ['react', 'react-dom'],
          
          // Essential routing and state - loaded early
          'vendor-router': ['react-router-dom', '@tanstack/react-query'],
          
          // UI Framework - merged for fewer HTTP requests
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
            '@radix-ui/react-popover',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-select',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
            '@radix-ui/react-separator',
            '@radix-ui/react-progress',
            '@radix-ui/react-scroll-area',
          ],
          
          // Styling utilities - small but frequently used
          'vendor-styling': [
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'next-themes'
          ],
          
          // Backend and external services - can be lazy loaded
          'vendor-backend': ['@supabase/supabase-js'],
          
          // Icons - heavy and can be split
          'vendor-icons': ['lucide-react'],
          
          // Utilities - lower priority
          'vendor-utils': ['date-fns', 'zod', 'sonner']
        },
        // Optimize chunk file names for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '') ?? 'chunk'
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          const info = assetInfo.name.split('.');
          const extension = info[info.length - 1];
          
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash].${extension}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `img/[name]-[hash].${extension}`;
          }
          return `assets/[name]-[hash].${extension}`;
        }
      }
    },
    // Aggressive tree shaking and dead code elimination
    sourcemap: false, // Disable sourcemaps for smaller bundle size
    chunkSizeWarningLimit: 800, // Stricter warning limit
    reportCompressedSize: false, // Disable for faster builds
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
}));
