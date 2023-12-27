import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import DiaryCalendar from "./pages/DiaryCalendar";
import DrinkRecommendation from "./pages/DrinkRecommendation";
import LearnMorePage from "./pages/article/LearnMorePage"
import WritePage from "./pages/article/WritePage"
import DetailPage from "./pages/article/DetailPage";
import LoginPage from "./pages/member/Loginpage"; 
import RegisterPage from "./pages/member/RegisterPage";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/diary-calendar" component={DiaryCalendar} />
        <Route path="/drink-recommendation" component={DrinkRecommendation} />
        <Route path="/learn-more" component={LearnMorePage} />
        <Route path="/write-page" component={WritePage} />
        <Route path="/detail/:id" component={DetailPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} /> 
        
        <Redirect to="/diary-calendar" />
      </Switch>
    </Router>
  );
};

export default App;
