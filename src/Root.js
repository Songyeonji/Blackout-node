import { useEffect } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { RecoilRoot } from "recoil";
import { HashRouter } from "react-router-dom";

import App from "./App";

const muiThemePaletteKeys = [
  "background",
  "common",
  "error",
  "grey",
  "info",
  "primary",
  "secondary",
  "success",
  "text",
  "warning",
];

export default function Root() {
  const theme = createTheme({
    typography: {
      fontFamily: ["GmarketSansMedium"],
    },
    palette: {
      primary: {
        main: "#668cff",
      },
    },
  });

  useEffect(() => {
    const r = document.querySelector(":root");

    muiThemePaletteKeys.forEach((paletteKey) => {
      const themeColorObj = theme.palette[paletteKey];

      for (const key in themeColorObj) {
        if (Object.hasOwnProperty.call(themeColorObj, key)) {
          const colorVal = themeColorObj[key];
          r.style.setProperty(`--mui-color-${paletteKey}-${key}`, colorVal);
        }
      }
    });
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RecoilRoot>
          <HashRouter>
            <App />
          </HashRouter>
        </RecoilRoot>
      </ThemeProvider>
    </>
  );
}