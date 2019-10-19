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
import Chat from './components/Chat';
import Spinner from './components/Spinner';

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

//todo: implement server auth token storage -> convert to class component (return loading UI until token fetched)
function App() {
  return (
    <Spinner />
    // <Provider store={store}>
    //   <Router>
    //     <Route exact path="/" component={Landing} />
    //     <Route exact path="/signin" component={Signin} />
    //     <Route exact path="/home" component={Home} />
    //     <Route exact path="/chat" component={Chat} />
    //   </Router>
    // </Provider>
  );
}

export default App;
