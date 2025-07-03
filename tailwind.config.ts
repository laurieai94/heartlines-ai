
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
				// Dramatic Emerald Scale (Deep Forest -> Jade)
				emerald: {
					50: 'hsl(var(--emerald-50))',
					100: 'hsl(var(--emerald-100))',
					200: 'hsl(var(--emerald-200))',
					300: 'hsl(var(--emerald-300))',
					400: 'hsl(var(--emerald-400))',
					500: 'hsl(var(--emerald-500))',
					600: 'hsl(var(--emerald-600))',
					700: 'hsl(var(--emerald-700))',
					800: 'hsl(var(--emerald-800))',
					900: 'hsl(var(--emerald-900))',
				},
				// Blazing Copper Scale (Rich Bronze -> Bright Copper)
				copper: {
					50: 'hsl(var(--copper-50))',
					100: 'hsl(var(--copper-100))',
					200: 'hsl(var(--copper-200))',
					300: 'hsl(var(--copper-300))',
					400: 'hsl(var(--copper-400))',
					500: 'hsl(var(--copper-500))',
					600: 'hsl(var(--copper-600))',
					700: 'hsl(var(--copper-700))',
					800: 'hsl(var(--copper-800))',
					900: 'hsl(var(--copper-900))',
				},
				// Molten Gold Scale (Rich Gold -> Brilliant Gold)
				gold: {
					50: 'hsl(var(--gold-50))',
					100: 'hsl(var(--gold-100))',
					200: 'hsl(var(--gold-200))',
					300: 'hsl(var(--gold-300))',
					400: 'hsl(var(--gold-400))',
					500: 'hsl(var(--gold-500))',
					600: 'hsl(var(--gold-600))',
					700: 'hsl(var(--gold-700))',
					800: 'hsl(var(--gold-800))',
					900: 'hsl(var(--gold-900))',
				},
				// Elegant Ivory Scale (Sophisticated neutrals)
				ivory: {
					50: 'hsl(var(--ivory-50))',
					100: 'hsl(var(--ivory-100))',
					200: 'hsl(var(--ivory-200))',
					300: 'hsl(var(--ivory-300))',
					400: 'hsl(var(--ivory-400))',
					500: 'hsl(var(--ivory-500))',
				}
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
			boxShadow: {
				'emerald-glow': '0 0 30px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.1)',
				'copper-glow': '0 0 30px rgba(194, 65, 12, 0.4), 0 0 60px rgba(194, 65, 12, 0.2)',
				'gold-glow': '0 0 30px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.2)',
				'power-3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(16, 185, 129, 0.1)',
				'power-4xl': '0 45px 80px -12px rgba(0, 0, 0, 0.5), 0 0 50px rgba(194, 65, 12, 0.15)',
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
				'power-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(194, 65, 12, 0.2), 0 0 60px rgba(245, 158, 11, 0.1)'
					},
					'50%': {
						boxShadow: '0 0 30px rgba(16, 185, 129, 0.5), 0 0 60px rgba(194, 65, 12, 0.3), 0 0 90px rgba(245, 158, 11, 0.2)'
					}
				},
				'dramatic-gradient': {
					'0%': {
						backgroundPosition: '0% 50%'
					},
					'25%': {
						backgroundPosition: '100% 50%'
					},
					'50%': {
						backgroundPosition: '100% 100%'
					},
					'75%': {
						backgroundPosition: '50% 100%'
					},
					'100%': {
						backgroundPosition: '0% 50%'
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
				'power-pulse': 'power-pulse 3s ease-in-out infinite',
				'dramatic-gradient': 'dramatic-gradient 8s ease infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
