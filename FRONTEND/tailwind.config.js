/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
  	container: {
  		center: 'true',
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
		spacing: {
			'3/10': '30%'
		  },
  		height: {
  			'100': '390px',
  			'200': '200px',
  			'250': '250px',
  			'500': '500px'
  		},
		width:{
			'15':'3.75rem',
		},
  		variants: {
  			extend: {
  				display: ["group-hover"]
  			}
  		},
  		colors: {
			stone: {
				50: '#FAFAFA', // Set custom color for gray-50
			},
			gray: {
				50: '#FAFAFA', // Set custom color for gray-50
			},
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
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
			expand: {
				'0%': { width: '0', height: '0', opacity: '0' },
				'50%': { width: '20rem', height: '20rem', opacity: '1' },
				'100%': { width: '200vw', height: '200vw', opacity: '1' },
			  },
			'fade-line': {
			'0%': { opacity: '0' },
			'50%': { opacity: '1' },
			'100%': { opacity: '0' },
  			},
  			gradientFlow: {
  				'0%': {
  					backgroundPosition: '200% 0%'
  				},
  				'100%': {
  					backgroundPosition: '-200% 0%'
  				}
  			},
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
  			}
  		},
  		animation: {
  			gradientFlow: 'gradientFlow 5s ease-in-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
			'fade-line': 'fade-line 3s forwards',
			expand: 'expand 1s ease-out forwards',
  		},
		
  		backgroundSize: {
  			'200': '200% 200%'
  		},
  		
		
  },
  plugins: [require('tailwind-scrollbar-hide')],
}}