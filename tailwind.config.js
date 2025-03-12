/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./**/*.html",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            /**
             * COLOR PALETTE
             * A carefully selected palette inspired by Stardew Valley's vibrant and warm aesthetic
             */
            colors: {
                // Main palette - Core colors used throughout the game
                'stardew-blue': {
                    50: '#E6F4F9',
                    100: '#C0E3F0',
                    200: '#8ECAE6', // light
                    300: '#5FB0D3',
                    400: '#219EBC', // default
                    500: '#1A7D96',
                    600: '#126782', // dark
                    700: '#0D4F64',
                    800: '#083746',
                    900: '#041E28',
                },
                'stardew-green': {
                    50: '#EFF5F0',
                    100: '#D6E6D8',
                    200: '#B0CDB4',
                    300: '#8FBC94', // light
                    400: '#75A87A',
                    500: '#5E8C61', // default
                    600: '#4A7049',
                    700: '#3A5E3D', // dark
                    800: '#294030',
                    900: '#192A1F',
                },
                'stardew-brown': {
                    50: '#F7F3EF',
                    100: '#EBE2D7',
                    200: '#D4A373', // light
                    300: '#C49069',
                    400: '#A98467', // default
                    500: '#8D6E56',
                    600: '#6C584C', // dark
                    700: '#574738',
                    800: '#3F3329',
                    900: '#28201A',
                },
                'stardew-gold': {
                    50: '#FFFAED',
                    100: '#FFF2D1',
                    200: '#FFE4A3',
                    300: '#FFD166', // light
                    400: '#F7BE38',
                    500: '#EF9D10', // default
                    600: '#CC7722', // dark
                    700: '#A35A1B',
                    800: '#7A4015',
                    900: '#52290E',
                },
                'stardew-red': {
                    50: '#FCEEE9',
                    100: '#F8D5C9',
                    200: '#E07A5F', // light
                    300: '#D65F3E',
                    400: '#B85C38', // default
                    500: '#A04A2A',
                    600: '#8A3324', // dark
                    700: '#6F291D',
                    800: '#541F16',
                    900: '#39150F',
                },

                // UI elements - Colors used in the game's interface
                'menu': {
                    'wood': '#B68E65',
                    'border': '#6C5A49',
                    'paper': '#F4E9CD',
                    'highlight': '#FFE8B3',
                    'shadow': '#5C4B3A',
                },
                'status': {
                    'energy': '#FFB938',
                    'health': '#FF3838',
                    'stamina': '#4CAF50',
                    'experience': '#64B5F6',
                },

                // Environment colors - Seasonal and location-specific colors
                'season': {
                    'spring': '#89CFF0',
                    'summer': '#7CB518',
                    'fall': '#E76F51',
                    'winter': '#EDF2F4',
                },
                'location': {
                    'farm-soil': '#7F5539',
                    'water': '#457B9D',
                    'mine': '#6D6875',
                    'cave': '#7D80DA',
                    'forest': '#2D6A4F',
                },
            },

            /**
             * TYPOGRAPHY
             * Improved font settings for better readability while maintaining the game's charm
             */
            fontFamily: {
                'pixel': ['VT323', 'monospace', 'ui-monospace'],
                'stardew': ['Stardew', 'serif', 'ui-serif'],
                'body': ['Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                // Larger, more readable font sizes
                'xs': ['0.875rem', { lineHeight: '1.25rem' }],
                'sm': ['1rem', { lineHeight: '1.5rem' }],
                'base': ['1.125rem', { lineHeight: '1.75rem' }],
                'lg': ['1.25rem', { lineHeight: '1.75rem' }],
                'xl': ['1.5rem', { lineHeight: '2rem' }],
                '2xl': ['1.75rem', { lineHeight: '2.25rem' }],
                '3xl': ['2rem', { lineHeight: '2.5rem' }],
                '4xl': ['2.5rem', { lineHeight: '3rem' }],
                '5xl': ['3rem', { lineHeight: '3.5rem' }],
            },
            letterSpacing: {
                'pixel': '-0.025em',
                'stardew': '0.05em',
            },

            /**
             * SPACING & LAYOUT
             * Consistent spacing system for better layout control
             */
            spacing: {
                'pixel': '4px',
                'pixel-2': '8px',
                'pixel-3': '12px',
                'pixel-4': '16px',
            },
            borderRadius: {
                'stardew-sm': '0.25rem',
                'stardew': '0.5rem',
                'stardew-lg': '0.75rem',
                'stardew-xl': '1rem',
            },
            boxShadow: {
                'stardew-sm': '0 1px 0 #6C5A49',
                'stardew': '0 2px 0 #6C5A49',
                'stardew-lg': '0 4px 0 #6C5A49',
                'stardew-xl': '0 6px 0 #6C5A49, 0 0 10px rgba(0, 0, 0, 0.1)',
                'stardew-inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            },

            /**
             * ANIMATIONS & EFFECTS
             * Game-inspired animations and visual effects
             */
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'bounce-slow': 'bounce 3s infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fadeIn': 'fadeIn 0.3s ease-out forwards',
                'slideUp': 'slideUp 0.4s ease-out forwards',
                'popIn': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                popIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            backgroundImage: {
                'wood-pattern': "url('/textures/wood-pattern.png')",
                'paper-texture': "url('/textures/paper-texture.png')",
                'pixel-border': "url('/textures/pixel-border.png')",
            },

            /**
             * TYPOGRAPHY PLUGIN CUSTOMIZATION
             * Tailored typography settings for markdown content
             */
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.stardew-brown.800'),
                        maxWidth: '100%',
                        h1: {
                            color: theme('colors.stardew-brown.700'),
                            fontFamily: theme('fontFamily.pixel').join(', '),
                            fontSize: theme('fontSize.2xl')[0],
                            marginBottom: theme('spacing.2'),
                            fontWeight: '600',
                        },
                        h2: {
                            color: theme('colors.stardew-brown.700'),
                            fontFamily: theme('fontFamily.pixel').join(', '),
                            fontSize: theme('fontSize.xl')[0],
                            marginBottom: theme('spacing.2'),
                            fontWeight: '600',
                        },
                        h3: {
                            color: theme('colors.stardew-brown.700'),
                            fontFamily: theme('fontFamily.pixel').join(', '),
                            fontSize: theme('fontSize.lg')[0],
                            marginBottom: theme('spacing.2'),
                            fontWeight: '600',
                        },
                        p: {
                            marginBottom: theme('spacing.3'),
                            lineHeight: '1.6',
                        },
                        a: {
                            color: theme('colors.stardew-blue.500'),
                            textDecoration: 'underline',
                            '&:hover': {
                                color: theme('colors.stardew-blue.600'),
                            },
                        },
                        strong: {
                            color: theme('colors.stardew-brown.900'),
                            fontWeight: '600',
                        },
                        ul: {
                            listStyleType: 'disc',
                            paddingLeft: theme('spacing.5'),
                            marginBottom: theme('spacing.3'),
                        },
                        ol: {
                            paddingLeft: theme('spacing.5'),
                            marginBottom: theme('spacing.3'),
                        },
                        li: {
                            marginBottom: theme('spacing.1'),
                        },
                        blockquote: {
                            borderLeftColor: theme('colors.stardew-brown.300'),
                            borderLeftWidth: '4px',
                            paddingLeft: theme('spacing.4'),
                            fontStyle: 'italic',
                            color: theme('colors.stardew-brown.700'),
                        },
                        code: {
                            color: theme('colors.stardew-brown.800'),
                            backgroundColor: theme('colors.stardew-brown.100'),
                            padding: `${theme('spacing.0.5')} ${theme('spacing.1')}`,
                            borderRadius: theme('borderRadius.DEFAULT'),
                            fontFamily: theme('fontFamily.mono').join(', '),
                        },
                        pre: {
                            backgroundColor: theme('colors.stardew-brown.100'),
                            borderRadius: theme('borderRadius.stardew'),
                            padding: theme('spacing.4'),
                            overflowX: 'auto',
                        },
                        hr: {
                            borderColor: theme('colors.stardew-brown.200'),
                            marginTop: theme('spacing.4'),
                            marginBottom: theme('spacing.4'),
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
} 