//@ts-check
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';
import axios from 'axios';

import { signoutUser } from '../../redux_actions/authActions';
import MainNav from '../MainNav';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatText: '',
      chats: [],
      friends: {},
      chatTitle: 'BlazeChat'
    };

    this.userKey = this.getUserKey(props.auth.user.email);
    this.currentChatKey = '';
  }

  componentDidMount() {
    if (app.apps.length > 0) {
      this.setupFirebase();
    } else {
      axios.get('/api/users/firebase').then((res) => {
        app.initializeApp(res.data);
        this.setupFirebase();
      });
    }
  }

  setupFirebase = () => {
    const db = app.database();
    this.chatRef = db.ref('chats').child(this.userKey);
    db.ref('friends').once('value', (friendsSnapShot) => {
      this.setState({
        friends: friendsSnapShot.val()
      });
    });
  };

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  };

  /** @param {string} userEmail */
  getUserKey = (userEmail) =>
    userEmail.replace(/\./g, "~").replace(/@/g, "~~");

  /** @param {string} friendKey */
  getChatKey = (friendKey) => [this.userKey, friendKey].sort().join("_");

  openChat = (key) => {
    this.currentChatKey = this.getChatKey(key);
    this.setState({
      chats: [],
      chatTitle: this.state.friends[key].name
    });
    //todo: listen for all chats from all friends
    // this.chatRef.child('chats').child(this.currentFriendKey).off('child_added');

    this.chatRef.child('chats').child(this.currentChatKey).on('child_added', (chatSnapShot) => {
      this.setState({
        chats: [
          ...this.state.chats,
          {
            key: chatSnapShot.key,
            ...chatSnapShot.val()
          }
        ]
      });
    });
  };

  sendChat = (event) => {
    const { chatText } = this.state;
    if (event.which == 13 && chatText !== '') {
      const { user } = this.props.auth;
      const newChat = {
        text: chatText,
        date: Date.now(),
        // todo: add user url (from profile: auto-generate if not manually set by user)
        user: {
          name: `${user.firstName}`,
          key: this.userKey
        },
      };

      this.setState({ chatText: '' });
      event.target.value = '';

      this.chatRef.child('chats').child(this.currentChatKey).push(newChat, (err) => {
        if (err) console.error(err);
        else console.log("chat added");
      });
    }
  };

  signOut = () => {
    this.props.signoutUser();
    this.props.history.push('/');
  };

  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;
    const { firstName, lastName } = user;
    const { friends, chatTitle } = this.state;

    return (
      <div className="container">
        <header>
          <nav className="auth-nav">
            <h1 className="logo">
              <img src={`./assets/img/logo-pri.svg`} alt="Logo" srcSet="" /> <span>BlazeChat</span>
            </h1>

            <div className="auth-nav-right">
              {hasProfilePic ? <img src="" alt={firstName} srcSet="" /> : <FontAwesomeIcon icon={faUserCircle} className="icon" />} &nbsp;&nbsp;&nbsp;
              <span>{`${firstName} ${lastName}`}</span>
              <input type="button" value="Sign Out" className="btn-input" onClick={this.signOut} />
            </div>
          </nav>
        </header>

        <div className="main">
          <MainNav user={user} />

          <div className="chat-space">
            <header>
              <div>
                <FontAwesomeIcon icon={faUserCircle} />
                <h3>{chatTitle}</h3>
              </div>
            </header>

            <div className="chats">
              <div className="chat-messages">
                {
                  this.state.chats.map((chat) => (
                    <div className="chat">
                      <FontAwesomeIcon icon={faUserCircle} />
                      <div>
                        <p>{chat.text}</p>
                        <small>{new Date(chat.date).toLocaleTimeString()} </small>
                      </div>
                    </div>
                  ))
                }
              </div>

              {
                chatTitle != "BlazeChat" && (
                  <div className="chat-input">
                    <input type="text" name="chatText" placeholder="Type a message" onChange={this.onChange} onKeyPress={this.sendChat} />
                    {/* <button>
                  <FontAwesomeIcon icon={faSmile} className="icon" />
                </button> */}
                  </div>
                )
              }
            </div>
          </div>

          <div className="friends">
            {
              Object.keys(friends).map((friendKey) => {
                const friend = friends[friendKey];

                return (
                  <div key={friendKey} className="friend" onClick={(e) => this.openChat(friendKey)}>
                    <FontAwesomeIcon icon={faUserCircle} />
                    <p>{friend.name}</p>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { signoutUser })(Chat);
