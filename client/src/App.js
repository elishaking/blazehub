import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import './App.css';
import store from './store';
import { setAuthToken, setCurrentUser, signoutUser, } from './redux_actions/authActions';

import Landing from './components/Landing';
import Signin from './components/Signin';
import Home from './components/Home';

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
        <Route exact path="/home" component={Home} />
      </Router>
    </Provider>
  );
}

export default App;
