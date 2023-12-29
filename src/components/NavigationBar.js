import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar } from '@mui/material';
import { AuthContext } from '../AuthContext';


const NavigationBar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AppBar position="fixed">
      <Toolbar style={{ justifyContent: "space-between" }}>
        {location.pathname.includes('/drink-recommendation') ? (
          <Link to="/diary-calendar" style={{ color: "white", textDecoration: "none" }}>
            <span className="font-bold">달력</span>
          </Link>
        ) : (
          <Link to="/drink-recommendation" style={{ color: "white", textDecoration: "none" }}>
            <span className="font-bold">오늘의 술 추천</span>
          </Link>
        )}
        {isLoggedIn ? (
          <>
            <Link to="/mypage">MyPage</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
