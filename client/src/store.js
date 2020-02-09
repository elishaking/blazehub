import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './redux_reducers';

const initialGlobalState = {};
export const middleware = [thunk];

const store = process.env.NODE_ENV == "development" && window.__REDUX_DEVTOOLS_EXTENSION__ ? createStore(
  rootReducer,
  initialGlobalState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
) : createStore(
  rootReducer,
  initialGlobalState,
  compose(applyMiddleware(...middleware))
);

export default store;