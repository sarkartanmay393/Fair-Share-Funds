import { common } from "@mui/material/colors";
import { type PaletteMode, type ThemeOptions } from "@mui/material";

const Theme = (mode: PaletteMode) => {
  return {
    components: {},
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: "#ffffff",
            },
            secondary: {
              main: "#1959d1",
            },
            text: {
              primary: common.white,
            },
            divider: "rgba(210,205,205,1)",
            background: {
              default: "rgba(256,256,256,0.1)",
            },
          }
        : {
            primary: {
              main: "#ffffff",
            },
            secondary: {
              main: "#109c51",
            },
            text: {
              primary: common.black,
            },
            divider: "rgba(0,0,0,0.6)",
            background: {
              default: "#f8f8ff",
            },
          }),
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 420,
        md: 680,
        lg: 920,
        xl: 1200,
        big: 2000,
      },
    },
    typography: {
      fontFamily: "Manrope, sans-serif",
      fontSize: 14,
    },
  } as ThemeOptions;
};

declare module "@mui/material/styles" {
  interface Theme {
    custom: {};
  }

  interface ThemeOptions {
    custom?: {};
  }
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    big: true;
  }
}

export default Theme;
