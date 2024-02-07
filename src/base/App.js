import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import DiaryCalendar from "../pages/DiaryCalendar";
import LoginDiaryCalendar from "../pages/LoginDiaryCalendar";
import DrinkRecommendation from "../pages/DrinkRecommendation";
import LearnMorePage from "../pages/article/LearnMorePage"
import WritePage from "../pages/article/WritePage"
import DetailPage from "../pages/article/DetailPage";
import LoginPage from "../pages/member/Loginpage"; 
import RegisterPage from "../pages/member/RegisterPage";
import EditPage from "../pages/article/EditPage";
import MyPage from "../pages/member/MyPage"
import Logo from '../pages/Logo'; // Logo 컴포넌트 임포트


const App = () => {
  return (
  
      <Router>
        <Switch>
          <Route exact path="/diary-calendar" component={DiaryCalendar} />
          <Route exact path="/login-diary-calendar" component={LoginDiaryCalendar} />
          <Route path="/drink-recommendation" component={DrinkRecommendation} />
          <Route path="/learn-more" component={LearnMorePage} />
          <Route path="/write-page" component={WritePage} />
          <Route path="/detail/:id" component={DetailPage} />
          <Route path="/edit/:id" component={EditPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/mypage" component={MyPage} />
          <Route path="/Blackout" component={Logo} /> 
        </Switch>
      </Router>

  );
};

export default App;