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
            colors: {
                // Main palette
                'stardew-blue': {
                    light: '#8ECAE6',
                    DEFAULT: '#219EBC',
                    dark: '#126782',
                },
                'stardew-green': {
                    light: '#8FBC94',
                    DEFAULT: '#5E8C61',
                    dark: '#3A5E3D',
                },
                'stardew-brown': {
                    light: '#D4A373',
                    DEFAULT: '#A98467',
                    dark: '#6C584C',
                },
                'stardew-gold': {
                    light: '#FFD166',
                    DEFAULT: '#EF9D10',
                    dark: '#CC7722',
                },
                'stardew-red': {
                    light: '#E07A5F',
                    DEFAULT: '#B85C38',
                    dark: '#8A3324',
                },

                // UI elements
                'menu-wood': '#B68E65',
                'menu-border': '#6C5A49',
                'tooltip': '#F4E9CD',
                'energy-bar': '#FFB938',
                'health-bar': '#FF3838',

                // Environment colors
                'spring-sky': '#89CFF0',
                'summer-grass': '#7CB518',
                'fall-leaf': '#E76F51',
                'winter-snow': '#EDF2F4',
                'mine-stone': '#6D6875',
                'farm-soil': '#7F5539',
                'water': '#457B9D',
                'cave-purple': '#7D80DA',
            },
            fontFamily: {
                'pixel': ['VT323', 'monospace'],
                'stardew': ['Stardew', 'serif'],
            },
            borderRadius: {
                'stardew': '0.5rem',
            },
            boxShadow: {
                'stardew': '0 2px 0 #6C5A49',
                'stardew-lg': '0 4px 0 #6C5A49',
            },
        },
    },
    plugins: [],
} 