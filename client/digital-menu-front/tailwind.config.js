// tailwind.config.js
module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            400: { max: '400px' },
            450: { max: '450px' },
            500: { max: '500px' },
            550: { max: '550px' },
            600: { max: '600px' },
            650: { max: '650px' },
            700: { max: '700px' },
            800: { max: '800px' },
            850: { max: '850px' },
            1700: { min: '1700px' },
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
