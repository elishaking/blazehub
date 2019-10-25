//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';
import axios from 'axios';

import { signoutUser } from '../../redux_actions/authActions';
import { getFriends } from '../../redux_actions/friendActions';
import MainNav from '../nav/MainNav';
import AuthNav from '../nav/AuthNav';
import Spinner from '../Spinner';

const SLIDE_IN = {
  display: "block",
  transform: "translateX(0)"
};

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatText: '',
      chats: [],
      friends: {},
      chatTitle: 'BlazeChat',
      loading: true,
      slideInStyle: {},
      chatsHeight: 300
    };

    this.userKey = this.getUserKey(props.auth.user.email);
    this.props.getFriends(this.userKey);

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

    this.setChatsHeight();

    window.addEventListener('resize', () => {
      this.setChatsHeight();
    });
  }

  componentWillReceiveProps(nextProps) {
    const { friends } = nextProps;
    if (Object.keys(friends).length > 0) {
      // console.log(friends)
      this.setState({
        friends: friends,
        loading: false
      })
    }

    this.setChatsHeight();
  }

  setChatsHeight = () => {
    // console
    const K = window.innerWidth > window.innerHeight ? 0.03 : 0.1;
    this.setState({
      chatsHeight: window.innerHeight - (170 + K * window.innerWidth)
    });
  };

  setupFirebase = () => {
    const db = app.database();
    this.chatRef = db.ref('chats');
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
    this.toggleFriends();

    this.currentChatKey = this.getChatKey(key);
    this.setState({
      chats: [],
      chatTitle: this.state.friends[key].name
    }, () => {
      this.chatRef.child(this.currentChatKey).on('child_added', (chatSnapShot) => {
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
    });
    //todo: listen for all chats from all friends
    // this.chatRef.child('chats').child(this.currentFriendKey).off('child_added');
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

      this.chatRef.child(this.currentChatKey).push(newChat, (err) => {
        if (err) console.error(err);
        // else console.log("chat added");
      });
    }
  };

  signOut = () => {
    this.props.signoutUser();
    this.props.history.push('/');
  };

  toggleFriends = () => {
    this.setState({
      slideInStyle: this.state.slideInStyle === SLIDE_IN ? {} : SLIDE_IN
    });
  };

  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;
    const { loading, friends, chatTitle, slideInStyle, chatsHeight } = this.state;

    return (
      <div className="container">
        <AuthNav history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          <div className="chat-space">
            <header>
              <div className="icon-text">
                <FontAwesomeIcon icon={faUserCircle} />
                <h3>{chatTitle}</h3>
              </div>

              <div id={this.state.slideInStyle === SLIDE_IN ? "burger-slided" : ""} className="burger" onClick={this.toggleFriends}>
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
              </div>
            </header>

            <div style={{ height: `${chatsHeight}px` }} className="chats">
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

          <div className="friends" style={slideInStyle}>
            {loading ? (<Spinner />) :
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
  auth: state.auth,
  friends: state.friends
});

export default connect(mapStateToProps, { signoutUser, getFriends })(Chat);
