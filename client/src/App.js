import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import store from './store';

import Landing from './components/Landing';
import Signin from './components/Signin';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Route exact path="/" component={Landing} />
        <Route exact path="/signin" component={Signin} />
      </Router>
    </Provider>
  );
}

export default App;
