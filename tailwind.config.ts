
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
				// Sunset Canyon Luxury Palette
				slate: {
					50: 'hsl(var(--slate-50))',
					100: 'hsl(var(--slate-100))',
					200: 'hsl(var(--slate-200))',
					300: 'hsl(var(--slate-300))',
					400: 'hsl(var(--slate-400))',
					500: 'hsl(var(--slate-500))',
					600: 'hsl(var(--slate-600))',
					700: 'hsl(var(--slate-700))',
					800: 'hsl(var(--slate-800))',
					900: 'hsl(var(--slate-900))',
				},
				burgundy: {
					50: 'hsl(var(--burgundy-50))',
					100: 'hsl(var(--burgundy-100))',
					200: 'hsl(var(--burgundy-200))',
					300: 'hsl(var(--burgundy-300))',
					400: 'hsl(var(--burgundy-400))',
					500: 'hsl(var(--burgundy-500))',
					600: 'hsl(var(--burgundy-600))',
					700: 'hsl(var(--burgundy-700))',
					800: 'hsl(var(--burgundy-800))',
				},
				gold: {
					50: 'hsl(var(--gold-50))',
					100: 'hsl(var(--gold-100))',
					200: 'hsl(var(--gold-200))',
					300: 'hsl(var(--gold-300))',
					400: 'hsl(var(--gold-400))',
					500: 'hsl(var(--gold-500))',
					600: 'hsl(var(--gold-600))',
					700: 'hsl(var(--gold-700))',
				},
				amber: {
					50: 'hsl(var(--amber-50))',
					100: 'hsl(var(--amber-100))',
					200: 'hsl(var(--amber-200))',
					300: 'hsl(var(--amber-300))',
					400: 'hsl(var(--amber-400))',
					500: 'hsl(var(--amber-500))',
					600: 'hsl(var(--amber-600))',
					700: 'hsl(var(--amber-700))',
				},
				bronze: {
					50: 'hsl(var(--bronze-50))',
					100: 'hsl(var(--bronze-100))',
					200: 'hsl(var(--bronze-200))',
					300: 'hsl(var(--bronze-300))',
					400: 'hsl(var(--bronze-400))',
					500: 'hsl(var(--bronze-500))',
					600: 'hsl(var(--bronze-600))',
					700: 'hsl(var(--bronze-700))',
				},
				tan: {
					50: 'hsl(var(--tan-50))',
					100: 'hsl(var(--tan-100))',
					200: 'hsl(var(--tan-200))',
					300: 'hsl(var(--tan-300))',
					400: 'hsl(var(--tan-400))',
					500: 'hsl(var(--tan-500))',
					600: 'hsl(var(--tan-600))',
					700: 'hsl(var(--tan-700))',
				},
				orange: {
					50: 'hsl(var(--orange-50))',
					100: 'hsl(var(--orange-100))',
					200: 'hsl(var(--orange-200))',
					300: 'hsl(var(--orange-300))',
					400: 'hsl(var(--orange-400))',
					500: 'hsl(var(--orange-500))',
					600: 'hsl(var(--orange-600))',
					700: 'hsl(var(--orange-700))',
				},
				sage: {
					50: 'hsl(var(--sage-50))',
					100: 'hsl(var(--sage-100))',
					200: 'hsl(var(--sage-200))',
					300: 'hsl(var(--sage-300))',
					400: 'hsl(var(--sage-400))',
					500: 'hsl(var(--sage-500))',
					600: 'hsl(var(--sage-600))',
					700: 'hsl(var(--sage-700))',
				},
				champagne: {
					50: 'hsl(var(--champagne-50))',
					100: 'hsl(var(--champagne-100))',
					200: 'hsl(var(--champagne-200))',
					300: 'hsl(var(--champagne-300))',
					400: 'hsl(var(--champagne-400))',
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
