/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#0087D3",
          secondary: {
            DEFAULT: "#FF9C01",
            100: "#FF9001",
            200: "#FF8E01",
          },
          success: {
            DEFAULT: "#46e086",
          },
          error: {
            DEFAULT: "#f74d4d",
          },
          neutral: {
            DEFAULT: "#5C5C5C",
          },
          black: {
            DEFAULT: "#000",
            100: "#1E1E2D",
            200: "#232533",
          },
          gray: {
            100: "#CDCDE0",
          },
          background: {
            DEFAULT: "#0C0316",
          },
        },
      },
    },
  };