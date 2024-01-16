import { useEffect } from "react";
import { ThemeProvider, CssBaseline} from "@mui/material";
import { RecoilRoot } from "recoil";
import { HashRouter } from "react-router-dom";

import App from "./base/App";



export default function Root() {



  return (
    <>

        <CssBaseline />
        <RecoilRoot>
          <HashRouter>
            <App />
          </HashRouter>
        </RecoilRoot>
    </>
  );
}
