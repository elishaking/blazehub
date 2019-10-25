import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import './App.scss';
import store from './store';
import { setAuthToken, setCurrentUser, signoutUser, } from './redux_actions/authActions';

import PrivateRoute from './components/PrivateRoute';
import Landing from './components/routes/Landing';
import Signin from './components/routes/Signin';
import Home from './components/routes/Home';
import Chat from './components/routes/Chat';
import FindFriends from './components/routes/FindFriends';
import Profile from './components/routes/Profile';
import Bookmarks from './components/routes/Bookmarks';
import InviteFriends from './components/routes/InviteFriends';

const updateAuthToken = () => {
  if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);

    const decodedUserData = jwt_decode(localStorage.jwtToken);

    store.dispatch(setCurrentUser(decodedUserData));

    // Check for expired token
    const currentTime = Date.now() / 1000;
    if (decodedUserData.exp < currentTime) {
      store.dispatch(signoutUser());

      // Redirect to signin
      window.location.href = '/signin';
    }
  }
};

// upon page reload/refresh, update user authentication token
updateAuthToken();

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Route exact path="/" component={Landing} />
        <Route exact path="/signin" component={Signin} />
        <Switch>
          <PrivateRoute exact path="/home" component={Home} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/chat" component={Chat} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/find" component={FindFriends} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/profile" component={Profile} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/bookmarks" component={Bookmarks} />
        </Switch>
        <Switch>
          <PrivateRoute exact path="/invite" component={InviteFriends} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
