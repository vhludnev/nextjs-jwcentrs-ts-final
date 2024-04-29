import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  important: true,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: ['rounded', 'rounded-t', 'rounded-b', 'xs:rounded-lg', 'xs:rounded-t-lg', 'xs:rounded-b-lg'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        satoshi: ['var(--font-satoshi)'],
        inter: ['var(--font-inter)'],
      },
      colors: {
        'primary-orange': '#EFF5722',
        'primary-white': '#f5f3f0',
      },
      borderColor: {
        'primary-white': '#f5f3f0',
      },
      width: {
        fitContent: 'fit-content',
      },
      height: {
        18: '4.5rem',
      },
      minWidth: {
        fitContent: 'fit-content',
      },
      maxWidth: {
        resp: 'calc(100vw - 8rem)',
      },
      minHeight: {
        8: '2rem',
        9: '2.25rem',
        11: '2.75rem',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'ping-slow': 'ping 4s linear 250ms infinite',
        /* fade: "fadeIn .5s ease-in-out", */
      },
      invert: {
        25: '.25',
        75: '.75',
      },
      gridTemplateColumns: {
        newauto: 'repeat(auto-fill, minmax(8rem, 400px))',
        autoSquares: 'repeat(auto-fit, minmax(130px, auto))',
        twoSquares: 'repeat(2, minmax(130px, 190px))',
        reducedWidth: 'repeat(1, minmax(640px, 60vw))',
      },
      margin: {
        18: '4.5rem',
        '-4.5': '-1.125rem',
      },
      gap: {
        38: '9.5rem',
      },
      boxShadow: {
        main: 'inset 0px 2px 20px 2px rgba(88, 164, 176, 0.4)',
        formBox: 'inset 0px 2px 15px 2px rgba(37, 100, 235, 0.2)',
        menu: '0px 159px 95px rgba(13,12,34,0.01), 0px 71px 71px rgba(13,12,34,0.02), 0px 18px 39px rgba(13,12,34,0.02), 0px 0px 0px rgba(13,12,34,0.02)',
      },
      screens: {
        xxs: '334px',
        xs: '400px',
        ...defaultTheme.screens,
      },
      /* keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      }, */
    },
  },
  plugins: [],
  darkMode: 'class',
}
export default config
