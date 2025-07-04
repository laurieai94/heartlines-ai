
import type { Config } from "tailwindcss";

// === COLOR PALETTE CONSTANTS ===
const MONOCHROME_COLORS = {
  'rich-black': { DEFAULT: 'hsl(var(--rich-black))' },
  'warm-white': { DEFAULT: 'hsl(var(--warm-white))' },
  'graphite': { DEFAULT: 'hsl(var(--graphite))' },
  'soft-gray': { DEFAULT: 'hsl(var(--soft-gray))' },
  'medium-gray': { DEFAULT: 'hsl(var(--medium-gray))' },
  'dark-gray': { DEFAULT: 'hsl(var(--dark-gray))' },
};

const LAVENDER_COLORS = {
  'lavender': { DEFAULT: 'hsl(var(--lavender))' },
  'lavender-soft': { DEFAULT: 'hsl(var(--lavender-soft))' },
  'lavender-deep': { DEFAULT: 'hsl(var(--lavender-deep))' },
  'lavender-mist': { DEFAULT: 'hsl(var(--lavender-mist))' },
};

const ELECTRIC_COLORS = {
  'electric-blue': { DEFAULT: 'hsl(var(--electric-blue))' },
  'neon-cyan': { DEFAULT: 'hsl(var(--neon-cyan))' },
  'electric-purple': { DEFAULT: 'hsl(var(--electric-purple))' },
  'hot-pink': { DEFAULT: 'hsl(var(--hot-pink))' },
  'electric-lime': { DEFAULT: 'hsl(var(--electric-lime))' },
  'neon-blue': { DEFAULT: 'hsl(var(--neon-blue))' },
  'royal-blue': { DEFAULT: 'hsl(var(--royal-blue))' },
  'deep-purple': { DEFAULT: 'hsl(var(--deep-purple))' },
  'midnight-blue': { DEFAULT: 'hsl(var(--midnight-blue))' },
  'indigo': { DEFAULT: 'hsl(var(--indigo))' },
  'steel-blue': { DEFAULT: 'hsl(var(--steel-blue))' },
};

const SHADCN_COLORS = {
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))'
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))'
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))'
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))'
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))'
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))'
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))'
  },
  sidebar: {
    DEFAULT: 'hsl(var(--sidebar-background))',
    foreground: 'hsl(var(--sidebar-foreground))',
    primary: 'hsl(var(--sidebar-primary))',
    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    accent: 'hsl(var(--sidebar-accent))',
    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    border: 'hsl(var(--sidebar-border))',
    ring: 'hsl(var(--sidebar-ring))'
  },
};

// === ANIMATION KEYFRAMES ===
const KEYFRAMES = {
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' }
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' }
  },
  'fade-in': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  },
  'slide-up': {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  },
  'bounce-gentle': {
    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
    '40%': { transform: 'translateY(-3px)' },
    '60%': { transform: 'translateY(-1px)' }
  },
  'gradient-shift': {
    '0%, 100%': { transform: 'translateX(0%) translateY(0%)', opacity: '0.8' },
    '50%': { transform: 'translateX(-5%) translateY(-5%)', opacity: '0.6' }
  },
  'gradient-shift-reverse': {
    '0%, 100%': { transform: 'translateX(0%) translateY(0%)', opacity: '0.4' },
    '50%': { transform: 'translateX(5%) translateY(5%)', opacity: '0.8' }
  },
  'monochrome-pulse': {
    '0%, 100%': { opacity: '0.1' },
    '50%': { opacity: '0.3' }
  },
  'lavender-pulse': {
    '0%, 100%': { opacity: '0.3' },
    '50%': { opacity: '0.6' }
  },
  'electric-pulse': {
    '0%, 100%': { opacity: '0.4' },
    '50%': { opacity: '0.8' }
  },
  'neon-glow': {
    '0%, 100%': { 
      boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
      opacity: '0.8'
    },
    '50%': { 
      boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
      opacity: '1'
    }
  }
};

// === ANIMATION UTILITIES ===
const ANIMATIONS = {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'fade-in': 'fade-in 0.6s ease-out',
  'slide-up': 'slide-up 0.6s ease-out',
  'bounce-gentle': 'bounce-gentle 2s infinite',
  'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
  'gradient-shift-reverse': 'gradient-shift-reverse 12s ease-in-out infinite',
  'monochrome-pulse': 'monochrome-pulse 3s ease-in-out infinite',
  'lavender-pulse': 'lavender-pulse 4s ease-in-out infinite',
  'electric-pulse': 'electric-pulse 2s ease-in-out infinite',
  'neon-glow': 'neon-glow 2s ease-in-out infinite'
};

// === MAIN CONFIGURATION ===
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      // === COLORS ===
      colors: {
        ...SHADCN_COLORS,
        ...MONOCHROME_COLORS,
        ...LAVENDER_COLORS,
        ...ELECTRIC_COLORS,
      },

      // === TYPOGRAPHY ===
      fontFamily: {
        serif: ['Crimson Text', 'Georgia', 'Times New Roman', 'serif'],
      },

      // === LAYOUT ===
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      scale: {
        '102': '1.02',
      },

      // === ANIMATIONS ===
      keyframes: KEYFRAMES,
      animation: ANIMATIONS
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
