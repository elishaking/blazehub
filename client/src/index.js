import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import app from 'firebase/app';
// import { firebaseKeys } from './keys.env';

// app.initializeApp({
//   apiKey: firebaseKeys.FIREBASE_API_KEY,
//   authDomain: firebaseKeys.FIREBASE_AUTH_DOMAIN,
//   databaseURL: firebaseKeys.FIREBASE_DATABASE_URL,
//   projectId: firebaseKeys.FIREBASE_PROJECT_ID,
//   storageBucket: firebaseKeys.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: firebaseKeys.FIREBASE_MESSEGING_SENDER_ID,
// });

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
