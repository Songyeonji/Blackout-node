import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import Title from './Title';


const NavigationBar = () => {
  
  const history = useHistory();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // 서버에 로그인 상태 확인 요청
    axios.get('http://localhost:8081/usr/member/getLoggedUser', { withCredentials: true })
      .then(response => {
        if (response.data && response.data.id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(error => {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      });
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:8081/usr/member/doLogout', {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        history.push('/login');
      })
      .catch(error => console.error('Logout error:', error));
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div style={{ marginTop: "64px" }}>
      <AppBar position="fixed" className="navbar-mainbg">
        <Toolbar className="custom-navbar-collapse" style={{ justifyContent: 'space-between' }}>
          <Link to="/Blackout" className={`nav-link ${isActive('/Blackout') ? 'active' : ''}`} style={{ color: 'white' }}>
            <Title />
          </Link>


          <div className="custom-navbar-nav">
            <Link to="/diary-calendar" className={`nav-link ${isActive('/diary-calendar') ? 'active' : ''}`}>
              <span className="font-bold">달력</span>
            </Link>
            <Link to="/drink-recommendation" className={`nav-link ${isActive('/drink-recommendation') ? 'active' : ''}`}>
              <span className="font-bold">오늘의 술 추천</span> 
            </Link>
            <Link to="/learn-more" className={`nav-link ${isActive('/learn-more') ? 'active' : ''}`} onClick={handleMenu}>
              <span className="font-bold">술 정보</span>
            </Link>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { handleClose(); history.push('/write'); }}>글쓰기</MenuItem>
              </Menu>
            
            {isLoggedIn ? (
              <>
                <Link to="/mypage" className={`nav-link ${isActive('/mypage') ? 'active' : ''}`}>MyPage</Link>
                <button onClick={handleLogout} className="nav-link">Logout</button>
              </>
            ) : (
              <Link to="/login"  className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavigationBar;