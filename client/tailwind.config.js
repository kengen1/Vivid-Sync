export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    position: {
      fixed: "fixed",
    },
    colors: {
      white: "white",
      none: "none",
    },
    borderWidth: {
      1: "1px",
    },
    fontFamily: {
      quicksand: ["Quicksand", "sans-serif"],
      k2d: ["K2D", "sans-serif"],
    },
  },
};
export const plugins = [require("daisyui")];
