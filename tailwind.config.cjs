const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		screens: {
			mobile: { min: '0', max: '640px' },
			...defaultTheme.screens
		},
		extend: {
			backgroundImage: {
				'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))'
			},
			keyframes: {
				disco: {
					'0%': { transform: 'translateY(-50%) rotate(0deg)' },
					'100%': { transform: 'translateY(-50%) rotate(360deg)' }
				}
			},
			animation: {
				disco: 'disco 1s linear infinite'
			}
		}
	},
	daisyui: {
		themes: false
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')]
};
