import app from 'firebase/app';
import 'firebase/database';
import axios from 'axios';

export const initializeApp = () => {
  if (app.apps.length > 0) {
    this.setupFirebase();
  } else {
    axios.get('/api/users/firebase').then((res) => {
      app.initializeApp(res.data);
      this.setupFirebase();
    });
  }
};

export const updateUsername = () => {
  app.database().ref('users').once('value')
    .then((usersSnapShot) => {
      const users = usersSnapShot.val();
      Object.keys(users)
        .forEach((userKey) => {
          const newUsername = `${users[userKey].firstName.replace(/ /g, "")}.${users[userKey].lastName.replace(/ /g, "")}`
            .toLowerCase();
          usersSnapShot.child(userKey).child('username').ref
            .set(newUsername);
        });
      // console.log(usersSnapShot.val());
    });
};
