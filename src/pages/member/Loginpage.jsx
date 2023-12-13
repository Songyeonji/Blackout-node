import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { AppBar, Toolbar, createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6f48eb", // 보라색
    },
  },
});

const LoginForm = () => {
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
            <Toolbar style={{ justifyContent: "space-between" }}>
              <Link
                to="/diary-calendar"
                style={{ color: "white", textDecoration: "none" }}
              >
                <span className="font-bold">달력</span>
              </Link>
              {/* 로그인 버튼 및 이동 */}
              <Link to="/recommendation" style={{ color: "white", textDecoration: "none" }}>
                <span className="font-bold">오늘의 술 추천</span>
              </Link>
            </Toolbar>
          </AppBar>

        <div className='wrapper'>
            <form action="">
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder='Username' required />
                    <FaUser className='icon' />
                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' required />
                    <FaLock className='icon' />
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
        </div>
        </div>
        </ThemeProvider>
    );
};

export default LoginForm;
