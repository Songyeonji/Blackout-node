import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from '../AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DiaryCalendar from "../pages/DiaryCalendar";
import DrinkRecommendation from "../pages/DrinkRecommendation";
import LearnMorePage from "../pages/article/LearnMorePage"
import WritePage from "../pages/article/WritePage"
import DetailPage from "../pages/article/DetailPage";
import LoginPage from "../pages/member/Loginpage"; 
import RegisterPage from "../pages/member/RegisterPage";
import EditPage from "../pages/article/EditPage";
import MyPage from "../pages/member/MyPage"

const AppContent = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  // 로그아웃 핸들러
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  return (
    <AuthProvider>
      <AppBar position="fixed">
        <Toolbar>
          <Link to={window.location.pathname.includes('drink-recommendation') ? "/diary-calendar" : "/drink-recommendation"}>
            {window.location.pathname.includes('drink-recommendation') ? "달력" : "오늘의 술 추천"}
          </Link>
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
  
      <Router>
        <Switch>
          <Route exact path="/diary-calendar" component={DiaryCalendar} />
          <Route path="/drink-recommendation" component={DrinkRecommendation} />
          <Route path="/learn-more" component={LearnMorePage} />
          <Route path="/write-page" component={WritePage} />
          <Route path="/detail/:id" component={DetailPage} />
          <Route path="/edit/:id" component={EditPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} /> 
          <Route path="/mypage" component={MyPage} /> 
          
          <Redirect to="/diary-calendar" />
        </Switch>
      </Router>
     </AuthProvider>
    );
  };

  const App = () => {
    return (
      <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
    );
  };
  

export default App;
