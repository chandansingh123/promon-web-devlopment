
import React from 'react';
import { Router, Switch } from 'react-router';
import { Route, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import AuthRoot from 'components/Auth';
import HouseholdDetail from 'components/Map/HouseholdDetail';
import ApplicationContainer from './components/ApplicationContainer';

const AuthenticatedRoute = ({component: Component, ...rest}) => {
  const token = localStorage.getItem('token');

  return (
    <Route {...rest} render={props => (
      token ? <Component {...props}/> : <Redirect to='/auth/login'/>
    )}/>
  );
}

export default (
  <Router history={createBrowserHistory()} >
    <Switch>
      <Route path='/auth' render={(props) => <AuthRoot {...props}/>}/>
      <Route path='/:countryCode/projects/:projectCode/households/:householdId'><HouseholdDetail /></Route>
      <AuthenticatedRoute path='/' component={ApplicationContainer}/>
    </Switch>
  </Router>
);
