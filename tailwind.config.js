/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            animation: {
                clouds: 'clouds 20s linear infinite',
                beach: 'beach 5s linear infinite',
                flame: 'flame 0.3s linear infinite'
            },
            keyframes: {
                clouds: {
                    '0%': { backgroundPosition: '0%' },
                    '100%': { backgroundPosition: '-100%' }
                },
                beach: {
                    '0%': { backgroundPosition: '0%' },
                    '100%': { backgroundPosition: '-100%' }
                },

                flame: {
                    '0%, 100%': { transform: 'translateX(0%)' },
                    '50%': { transform: 'translateX(50%)' }
                }
            },
            colors: {
                'button-disabled': 'var(--grey)',
                'button-danger': 'var(--red)',
                'button-other': 'var(--accent1)'
            }
        }
    },
    plugins: []
}