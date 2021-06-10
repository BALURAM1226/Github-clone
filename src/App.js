import React from 'react';
import './style.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './Components/Loginpage';
import Homepage from './Components/homepage/Homepage';
import DetailPage from './Components/DetailsPage/DetailPage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './Firebase/config';

export default function App() {
  const [user] = useAuthState(auth);
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/repo/:repoId">
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
