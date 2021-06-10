import React from 'react';
import './style.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './Components/Loginpage';
import Homepage from './Components/homepage/Homepage';
import DetailPage from './Components/DetailsPage/DetailPage';

export default function App() {
  
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/repo/:user/:repoId">
            <DetailPage />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/">
            <Homepage />
          </Route>
        </Switch>
      </Router>
    </>
  );
}
