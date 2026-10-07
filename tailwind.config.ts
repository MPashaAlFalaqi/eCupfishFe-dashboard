import type { Config } from "tailwindcss";
// NOTE: hex diambil dari estimasi screenshot. Cocokkan dengan Figma (Colour styles).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50:"#EEF6FF",100:"#D9E9FC",200:"#A9CBF8",300:"#6BA8E5",400:"#3AA0F2",500:"#2979B8",600:"#1F5E91",700:"#164A75",800:"#0E3556",900:"#082440",950:"#041A2E" },
        secondary: { 50:"#FFF8E6",100:"#FCEFC8",200:"#FBE29A",300:"#F8CE5E",400:"#F5BA1E",500:"#F2B407",600:"#C99700",700:"#9A7200",800:"#6E5000" },
        surface: "#F4F7FC",
      },
      fontFamily: { sans: ["var(--font-jakarta)", "system-ui", "sans-serif"] },
      borderRadius: { card: "14px" },
      boxShadow: { card: "0 1px 2px rgba(8,36,64,.04), 0 4px 16px rgba(8,36,64,.05)" },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        pop: { from: { opacity: "0", transform: "scale(.95) translateY(10px)" }, to: { opacity: "1", transform: "none" } },
        "grow-y": { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
        "grow-x": { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        progress: { "0%": { width: "0", opacity: "1" }, "70%": { width: "85%", opacity: "1" }, "100%": { width: "100%", opacity: "0" } },
      },
      animation: {
        "fade-in": "fade-in .25s ease-out backwards",
        pop: "pop .28s cubic-bezier(.2,.8,.2,1) backwards",
        "grow-y": "grow-y .7s cubic-bezier(.2,.8,.2,1) backwards",
        "grow-x": "grow-x .8s cubic-bezier(.2,.8,.2,1) backwards",
        progress: "progress .7s ease-out forwards",
        float: "float 3.5s ease-in-out infinite",
      },
      backgroundImage: {
        "gold": "linear-gradient(180deg,#F5BA1E,#C99700)",
        "navy": "linear-gradient(180deg,#164A75,#082440)",
      },
    },
  },
  plugins: [],
};
export default config;
