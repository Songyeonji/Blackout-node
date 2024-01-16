import React, { useContext } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { AppBar, Toolbar } from '@mui/material';
import { AuthContext } from '../AuthContext';


const NavigationBar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('loginMemberName');
    history.push('/login');
  };

  return (
    <div style={{ marginTop: "64px" }}>
      <AppBar position="fixed">
        <Toolbar style={{ justifyContent: "space-between" }}>

        <Link to="/Logo" style={{ color: "white", textDecoration: "none" }}>
              <span className="font-bold">Blackout</span>
            </Link>
          
          {location.pathname.includes('/drink-recommendation') ? (
            <Link to="/diary-calendar" style={{ color: "white", textDecoration: "none" }}>
              <span className="font-bold">달력</span>
            </Link>
          ) : (
            <Link to="/drink-recommendation" style={{ color: "white", textDecoration: "none" }}>
              <span className="font-bold">오늘의 술 추천</span>
            </Link>
          )}
          <div>
            {isLoggedIn ? (
              <>
                <Link to="/mypage" style={{ marginRight: "10px" }}>MyPage</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavigationBar;
