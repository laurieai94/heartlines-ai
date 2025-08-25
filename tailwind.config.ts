
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
				coral: {
					50: 'hsl(var(--coral-50))',
					100: 'hsl(var(--coral-100))',
					200: 'hsl(var(--coral-200))',
					300: 'hsl(var(--coral-300))',
					400: 'hsl(var(--coral-400))',
					500: 'hsl(var(--coral-500))',
					600: 'hsl(var(--coral-600))',
				},
				peach: {
					50: 'hsl(var(--peach-50))',
					100: 'hsl(var(--peach-100))',
					200: 'hsl(var(--peach-200))',
					300: 'hsl(var(--peach-300))',
					400: 'hsl(var(--peach-400))',
					500: 'hsl(var(--peach-500))',
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
					900: 'hsl(var(--burgundy-900))',
				}
			},
			fontFamily: {
				serif: ['Crimson Text', 'Georgia', 'Times New Roman', 'serif'],
				brand: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.6s ease-out',
				'bounce-gentle': 'bounce-gentle 2s infinite',
				'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
				'gradient-shift-reverse': 'gradient-shift-reverse 12s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
