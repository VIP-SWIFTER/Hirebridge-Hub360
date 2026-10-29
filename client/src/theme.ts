import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const DISPLAY = '"Bricolage Grotesque", system-ui, sans-serif';
const BODY = '"Manrope", system-ui, sans-serif';

export type Mode = "light" | "dark";

export function makeTheme(mode: Mode) {
  const dark = mode === "dark";
  const edge = dark ? "#FFFFFF" : "#000000";
  let theme = createTheme({
  palette: {
    mode,
    primary: { main: "#FFC81E", light: "#FFE27A", dark: dark ? "#FFC81E" : "#A06C00", contrastText: "#111111" },
    secondary: { main: "#E4202D", contrastText: "#FFFFFF" },
    background: dark ? { default: "#050505", paper: "#101010" } : { default: "#F6F7F9", paper: "#FFFFFF" },
    text: dark ? { primary: "#F6F5F0", secondary: "#A3A3AD" } : { primary: "#14161A", secondary: "#5B6270" },
    divider: dark ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.10)",
  },
  shape: { borderRadius: 16 },
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
  typography: {
    fontFamily: BODY,
    h1: { fontFamily: DISPLAY, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1 },
    h2: { fontFamily: DISPLAY, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.06 },
    h3: { fontFamily: DISPLAY, fontWeight: 800, letterSpacing: "-0.01em" },
    h4: { fontFamily: DISPLAY, fontWeight: 800 },
    h5: { fontFamily: DISPLAY, fontWeight: 700 },
    h6: { fontFamily: DISPLAY, fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        containedPrimary: { "&:hover": { backgroundColor: "#FFD84A" } },
        root: { borderRadius: "14px", padding: "13px 26px", fontSize: "0.98rem" },
        sizeSmall: { padding: "9px 18px", fontSize: "0.9rem", borderRadius: "12px" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
          backgroundColor: dark ? "#0A0A0A" : "#FFFFFF",
          // every text box: white border in dark mode, black border in light mode
          "& .MuiOutlinedInput-notchedOutline": { borderColor: edge, borderWidth: 1.5 },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: edge },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: edge, borderWidth: 2 },
          "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(255,200,30,.38)" },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: "#E4202D" },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": { borderColor: dark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)" },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { "&.Mui-focused": { color: dark ? "#FFFFFF" : "#000000" } } },
    },
    MuiAccordion: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { fontWeight: 700 } },
    },
  },
});

  theme = responsiveFontSizes(theme, { factor: 2.4 });
  return theme;
}





















// import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// const DISPLAY = '"Bricolage Grotesque", system-ui, sans-serif';
// const BODY = '"Manrope", system-ui, sans-serif';

// export type Mode = "light" | "dark";

// export function makeTheme(mode: Mode) {
//   const dark = mode === "dark";
//   let theme = createTheme({
//   palette: {
//     mode,
//     primary: { main: "#FFC81E", light: "#FFE27A", dark: dark ? "#FFC81E" : "#A06C00", contrastText: "#111111" },
//     secondary: { main: "#E4202D", contrastText: "#FFFFFF" },
//     background: dark ? { default: "#050505", paper: "#101010" } : { default: "#F6F7F9", paper: "#FFFFFF" },
//     text: dark ? { primary: "#F6F5F0", secondary: "#A3A3AD" } : { primary: "#14161A", secondary: "#5B6270" },
//     divider: dark ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.10)",
//   },
//   shape: { borderRadius: 16 },
//   breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
//   typography: {
//     fontFamily: BODY,
//     h1: { fontFamily: DISPLAY, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1 },
//     h2: { fontFamily: DISPLAY, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.06 },
//     h3: { fontFamily: DISPLAY, fontWeight: 800, letterSpacing: "-0.01em" },
//     h4: { fontFamily: DISPLAY, fontWeight: 800 },
//     h5: { fontFamily: DISPLAY, fontWeight: 700 },
//     h6: { fontFamily: DISPLAY, fontWeight: 700 },
//     button: { textTransform: "none", fontWeight: 700 },
//   },
//   components: {
//     MuiButton: {
//       defaultProps: { disableElevation: true },
//       styleOverrides: {
//         containedPrimary: { "&:hover": { backgroundColor: "#FFD84A" } },
//         root: { borderRadius: "14px", padding: "13px 26px", fontSize: "0.98rem" },
//         sizeSmall: { padding: "9px 18px", fontSize: "0.9rem", borderRadius: "12px" },
//       },
//     },
//     MuiOutlinedInput: {
//       styleOverrides: {
//         root: {
//           borderRadius: "14px",
//           backgroundColor: dark ? "#0A0A0A" : "#FFFFFF",
//           "& fieldset": { borderColor: dark ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.16)" },
//           "&:hover fieldset": { borderColor: dark ? "rgba(255,255,255,0.22)" : "rgba(15,23,42,0.4)" },
//         },
//       },
//     },
//     MuiAccordion: {
//       styleOverrides: { root: { backgroundImage: "none" } },
//     },
//     MuiTooltip: {
//       styleOverrides: { tooltip: { fontWeight: 700 } },
//     },
//   },
// });

//   theme = responsiveFontSizes(theme, { factor: 2.4 });
//   return theme;
// }
