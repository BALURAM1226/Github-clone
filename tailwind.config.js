module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            colors: {
                github: {
                    bg: '#0d1117',
                    dark: '#010409',
                    border: '#30363d',
                    blue: '#1f6feb',
                    text: '#c9d1d9',
                    muted: '#8b949e',
                }
            },
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
