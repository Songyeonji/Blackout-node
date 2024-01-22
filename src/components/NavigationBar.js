import React, { useContext, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import { AuthContext } from '../AuthContext';
import Title from './Title';


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

    // 드롭다운 메뉴 상태
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
     // 드롭다운 메뉴 핸들러
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