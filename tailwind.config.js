module.exports = {
  mode: "jit",
  purge: {
    enabled: !process.env.ROLLUP_WATCH,
    content: ["./public/index.html", "./src/**/*.svelte"],
    options: {
      defaultExtractor: (content) => [
        ...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
        ...(content.match(/(?<=class:)[^=>\/\s]*/g) || []),
      ],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['"Poppins"', "sans-serif"],
    },
  },
  variants: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/public/bg.png')",
      },
    },
  },
  plugins: [require("daisyui")],
};
