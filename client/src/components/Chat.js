//@ts-check
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle, faHome, faUserAlt, faComments, faBookmark, faSignOutAlt, faImage, faSmile } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';

import { signoutUser } from '../redux_actions/authActions';

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
    this.userRef = app.database().ref('users').child(this.userKey);
    this.currentChatKey = '';
  }

  componentDidMount() {
    this.userRef.child('friends').once('value', (friendsSnapShot) => {
      this.setState({
        friends: friendsSnapShot.val()
      });
    });
  }

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
    this.state.chats = [];
    this.currentChatKey = this.getChatKey(key);
    this.setState({
      chats: [],
      chatTitle: this.state.friends[key].name
    });
    //todo: listen for all chats from all friends
    // this.userRef.child('chats').child(this.currentFriendKey).off('child_added');

    this.userRef.child('chats').child(this.currentChatKey).on('child_added', (chatSnapShot) => {
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

      this.state.chatText = '';
      event.target.value = '';

      this.userRef.child('chats').child(this.currentChatKey).push(newChat, (err) => {
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
          <div className="main-nav">
            <header>
              <h2>
                {hasProfilePic ? <img src="" alt={firstName} srcSet="" /> : <FontAwesomeIcon icon={faUserCircle} className="icon" />} &nbsp;&nbsp;&nbsp;
                <span>{`${firstName} ${lastName}`}</span>
              </h2>
            </header>
            <nav>
              <ul>
                <li>
                  <Link to="/home">
                    <FontAwesomeIcon icon={faHome} /> &nbsp;&nbsp;&nbsp; Home
                  </Link>
                </li>
                <li>
                  <Link to="/chat">
                    <FontAwesomeIcon icon={faComments} /> &nbsp;&nbsp;&nbsp; Chat
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <FontAwesomeIcon icon={faUserAlt} /> &nbsp;&nbsp;&nbsp; Profile
                  </Link>
                </li>
                <li>
                  <Link to="/bookmarks">
                    <FontAwesomeIcon icon={faBookmark} /> &nbsp;&nbsp;&nbsp; Bookmarks
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <FontAwesomeIcon icon={faSignOutAlt} /> &nbsp;&nbsp;&nbsp; Sign Out
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <FontAwesomeIcon icon={faSignOutAlt} /> &nbsp;&nbsp;&nbsp; Invite Friends
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

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
