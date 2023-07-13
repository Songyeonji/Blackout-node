import React from "react";
import { AppBar, Toolbar, createTheme, ThemeProvider } from "@mui/material";
import { Link } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

const DrinkRecommendation = () => {
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
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              <span className="font-bold">달력</span>
            </Link>
            <div className="flex-1"></div>
          </Toolbar>
        </AppBar>
        <Toolbar />

        <div>
          <h1>오늘의 술 추천 페이지입니다.</h1>
          {/* 술 추천 로직을 구현해주세요. */}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DrinkRecommendation;
