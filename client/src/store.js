import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './redux_reducers';

const initialGlobalState = {};
const middleware = [thunk];

const reduxExt = process.env.NODE_ENV == "development" ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : null;

const store = createStore(
  rootReducer,
  initialGlobalState,
  compose(
    applyMiddleware(...middleware),
    reduxExt
  )
);

export default store;