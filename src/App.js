import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import DiaryCalendar from "./DiaryCalendar";
import DrinkRecommendation from "./DrinkRecommendation";
import LearnMorePage from "./LearnMorePage"
import WritePage from "./WritePage"

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/diary-calendar" component={DiaryCalendar} />
        <Route path="/drink-recommendation" component={DrinkRecommendation} />
        <Route path="/learn-more" component={LearnMorePage} />
        <Route path="/write-page" component={WritePage} />
        <Redirect to="/diary-calendar" />
      </Switch>
    </Router>
  );
};

export default App;
