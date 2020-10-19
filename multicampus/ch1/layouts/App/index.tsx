import Workspace from '@layouts/Workspace';
import LogIn from '@pages/LogIn';
import SignUp from '@pages/SignUp';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const App: React.FC = () => {
  const isLoggedIn = false;
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={Workspace} />
    </Switch>
  );
};

export default App;
