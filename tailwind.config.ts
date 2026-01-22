
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
				'2xl': '1400px',
				'3xl': '1800px'
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
				brand: ['Shrikhand', 'Inter', 'system-ui', 'sans-serif'],
				playfair: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
				glacial: ['Glacial Indifference', 'Inter', 'system-ui', 'sans-serif'],
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
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
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
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1'
					},
					'100%': {
						opacity: '0'
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
				'line-grow': {
					'0%': {
						width: '0%'
					},
					'100%': {
						width: '100%'
					}
				},
				'line-grow-center': {
					'0%': {
						transform: 'scaleX(0)',
						opacity: '0.6'
					},
					'100%': {
						transform: 'scaleX(1)',
						opacity: '1'
					}
				},
				'line-open-left': {
					'0%': {
						transform: 'scaleX(1) translateX(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'scaleX(1) translateX(-12px)',
						opacity: '0'
					}
				},
				'line-open-right': {
					'0%': {
						transform: 'scaleX(1) translateX(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'scaleX(1) translateX(12px)',
						opacity: '0'
					}
				},
				'soft-glow': {
					'0%, 100%': {
						transform: 'translateY(0px)',
						boxShadow: '0 0 20px hsl(var(--emerald-400) / 0.3), 0 0 40px hsl(var(--emerald-400) / 0.1)'
					},
					'50%': {
						transform: 'translateY(-2px)',
						boxShadow: '0 0 25px hsl(var(--emerald-400) / 0.4), 0 0 50px hsl(var(--emerald-400) / 0.15)'
					}
				},
				'fadeInOut': {
					'0%, 100%': { opacity: '0' },
					'50%': { opacity: '1' }
				},
				'dotPulse': {
					'0%, 80%, 100%': { 
						transform: 'translateY(0)',
						opacity: '0.4'
					},
					'40%': { 
						transform: 'translateY(-4px)',
						opacity: '1'
					}
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(-4deg)' },
					'75%': { transform: 'rotate(4deg)' }
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 12px rgba(251, 146, 60, 0.25), 0 0 24px rgba(236, 72, 153, 0.2), 0 0 36px rgba(251, 113, 133, 0.15)'
					},
					'50%': {
						boxShadow: '0 0 16px rgba(251, 146, 60, 0.35), 0 0 32px rgba(236, 72, 153, 0.3), 0 0 48px rgba(251, 113, 133, 0.25)'
					}
				},
				'soft-pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 8px rgba(251, 146, 60, 0.2), 0 0 16px rgba(236, 72, 153, 0.15), 0 0 24px rgba(251, 113, 133, 0.1)'
					},
					'50%': {
						boxShadow: '0 0 12px rgba(251, 146, 60, 0.3), 0 0 24px rgba(236, 72, 153, 0.25), 0 0 36px rgba(251, 113, 133, 0.2)'
					}
				},
				'emerald-soft-glow': {
					'0%, 100%': {
						boxShadow: '0 0 6px rgba(52, 211, 153, 0.15), 0 0 12px rgba(52, 211, 153, 0.1), 0 0 20px rgba(59, 130, 246, 0.08)'
					},
					'50%': {
						boxShadow: '0 0 10px rgba(52, 211, 153, 0.25), 0 0 20px rgba(52, 211, 153, 0.15), 0 0 32px rgba(59, 130, 246, 0.12)'
					}
				},
				'shimmer': {
					'0%': {
						transform: 'translateX(-200%)'
					},
					'100%': {
						transform: 'translateX(200%)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-8px)'
					}
				},
        'breathe': {
          '0%, 100%': {
            transform: 'scale(1)'
          },
          '50%': {
            transform: 'scale(1.02)'
          }
        },
				'breathe-glow': {
					'0%, 100%': {
						filter: 'drop-shadow(0 0 15px rgba(251,146,140,0.3)) drop-shadow(0 0 30px rgba(255,182,193,0.2)) drop-shadow(0 0 50px rgba(255,255,255,0.1))'
					},
				'50%': {
					filter: 'drop-shadow(0 0 15px rgba(251,146,140,0.4)) drop-shadow(0 0 25px rgba(255,182,193,0.25)) drop-shadow(0 0 40px rgba(255,255,255,0.1))'
				}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in': 'fade-in 0.9s ease-out',
				'slide-up': 'slide-up 0.6s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'fade-out': 'fade-out 0.2s ease-out',
				'bounce-gentle': 'bounce-gentle 2s infinite',
				'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
				'gradient-shift-reverse': 'gradient-shift-reverse 12s ease-in-out infinite',
				'line-grow': 'line-grow 1.1s ease-in-out forwards',
				'line-left-sequence': 'line-grow-center 0.9s ease-out forwards, line-open-left 0.6s ease-in 1.1s forwards',
				'line-right-sequence': 'line-grow-center 0.9s ease-out forwards, line-open-right 0.6s ease-in 1.1s forwards',
				'soft-glow': 'soft-glow 6s ease-in-out infinite',
				'fadeInOut': 'fadeInOut 1.4s ease-in-out infinite',
				'wiggle': 'wiggle 6s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'soft-pulse-glow': 'soft-pulse-glow 8s ease-in-out infinite',
				'emerald-soft-glow': 'emerald-soft-glow 6s ease-in-out infinite',
				'shimmer': 'shimmer 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'breathe': 'breathe 18s ease-in-out infinite',
				'breathe-glow': 'breathe-glow 18s ease-in-out infinite',
				'dot-pulse': 'dotPulse 1.4s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
