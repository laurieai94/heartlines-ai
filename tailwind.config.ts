
import type { Config } from "tailwindcss";

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
			colors: {
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
				// Modern Botanical Minimalism Palette - Exact Hex Matches
				'green-gray': {
					50: 'hsl(68 39% 95%)',
					100: 'hsl(68 39% 88%)',
					200: 'hsl(68 39% 75%)',
					300: 'hsl(68 39% 62%)',
					400: 'hsl(68 39% 48%)',
					500: 'hsl(68 39% 35%)',
					600: 'hsl(68 39% 25%)',
					700: 'hsl(68 39% 18%)',
					800: 'hsl(68 39% 13%)',
					900: 'hsl(68 39% 8%)',
				},
				'gray-green': {
					50: 'hsl(60 8% 95%)',
					100: 'hsl(60 8% 88%)',
					200: 'hsl(60 8% 82%)',
					300: 'hsl(60 8% 75%)',
					400: 'hsl(60 8% 69%)',
					500: 'hsl(60 8% 62%)',
					600: 'hsl(60 8% 55%)',
					700: 'hsl(60 8% 48%)',
					800: 'hsl(60 8% 40%)',
					900: 'hsl(60 8% 32%)',
				},
				'soft-gray': {
					50: 'hsl(0 0% 98%)',
					100: 'hsl(0 0% 94%)',
					200: 'hsl(0 0% 88%)',
					300: 'hsl(0 0% 83%)',
					400: 'hsl(0 0% 78%)',
					500: 'hsl(0 0% 73%)',
					600: 'hsl(0 0% 68%)',
					700: 'hsl(0 0% 63%)',
					800: 'hsl(0 0% 58%)',
					900: 'hsl(0 0% 53%)',
				},
				'off-white': {
					50: 'hsl(40 20% 98%)',
					100: 'hsl(40 20% 96%)',
					200: 'hsl(40 20% 94%)',
					300: 'hsl(40 20% 92%)',
					400: 'hsl(40 20% 90%)',
				},
				orange: {
					50: 'hsl(42 100% 95%)',
					100: 'hsl(42 100% 88%)',
					200: 'hsl(42 100% 80%)',
					300: 'hsl(42 100% 75%)',
					400: 'hsl(42 100% 71%)',
					500: 'hsl(42 100% 65%)',
					600: 'hsl(42 95% 58%)',
					700: 'hsl(42 90% 52%)',
					800: 'hsl(42 85% 46%)',
					900: 'hsl(42 80% 40%)',
				},
				pink: {
					50: 'hsl(24 28% 95%)',
					100: 'hsl(24 28% 88%)',
					200: 'hsl(24 28% 80%)',
					300: 'hsl(24 28% 75%)',
					400: 'hsl(24 28% 70%)',
					500: 'hsl(24 28% 65%)',
					600: 'hsl(24 28% 60%)',
					700: 'hsl(24 28% 55%)',
					800: 'hsl(24 28% 50%)',
					900: 'hsl(24 28% 45%)',
				},
				peach: {
					50: 'hsl(32 100% 96%)',
					100: 'hsl(32 100% 94%)',
					200: 'hsl(32 100% 92%)',
					300: 'hsl(32 100% 88%)',
					400: 'hsl(32 100% 84%)',
					500: 'hsl(32 100% 80%)',
					600: 'hsl(32 95% 76%)',
					700: 'hsl(32 90% 72%)',
					800: 'hsl(32 85% 68%)',
					900: 'hsl(32 80% 64%)',
				},
			},
			fontFamily: {
				serif: ['Crimson Text', 'Georgia', 'Times New Roman', 'serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			scale: {
				'102': '1.02',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'bounce-gentle': {
					'0%, 20%, 50%, 80%, 100%': {
						transform: 'translateY(0)'
					},
					'40%': {
						transform: 'translateY(-3px)'
					},
					'60%': {
						transform: 'translateY(-1px)'
					}
				},
				'gradient-shift': {
					'0%, 100%': {
						transform: 'translateX(0%) translateY(0%)',
						opacity: '0.8'
					},
					'50%': {
						transform: 'translateX(-5%) translateY(-5%)',
						opacity: '0.6'
					}
				},
				'gradient-shift-reverse': {
					'0%, 100%': {
						transform: 'translateX(0%) translateY(0%)',
						opacity: '0.4'
					},
					'50%': {
						transform: 'translateX(5%) translateY(5%)',
						opacity: '0.8'
					}
				},
				'shimmer': {
					'0%, 100%': {
						backgroundPosition: '200% 200%'
					},
					'50%': {
						backgroundPosition: '0% 0%'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.6s ease-out',
				'bounce-gentle': 'bounce-gentle 2s infinite',
				'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
				'gradient-shift-reverse': 'gradient-shift-reverse 12s ease-in-out infinite',
				'shimmer': 'shimmer 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
