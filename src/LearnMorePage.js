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
  );
};

export default LearnMorePage;