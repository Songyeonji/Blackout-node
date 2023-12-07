import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, createTheme, ThemeProvider, Snackbar, Alert } from "@mui/material";

const theme = createTheme({
    palette: {
      primary: {
        main: "#6f48eb", // 보라색
      },
    },
  });

const LearnMorePage = () => {
  return (
    <ThemeProvider theme={theme}>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <AppBar position="fixed">
        <Toolbar>
          <div className="flex-1"></div>
          <Link
            to="/drink-recommendation"
            style={{ color: "white", textDecoration: "none" }}
          >
            <span className="font-bold">오늘의 술 추천</span>
          </Link>
          <div className="flex-1"></div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
    
    <div>
      <h2>카드뉴스</h2>
      <ul>
        <li>
          <Link to="/board/food">맛집</Link>
        </li>
        <li>
          <Link to="/board/drink">술</Link>
        </li>
        <li>
          <Link to="/board/snack">안주</Link>
        </li>
      </ul>
    </div>
    </ThemeProvider>
  );
};

export default LearnMorePage;