//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';
// import axios from 'axios';

import { getFriends } from '../../redux_actions/friendActions';
import { listenForNewChats } from '../../redux_actions/chatActions';
import { getProfilePic } from '../../redux_actions/profileActions';

import MainNav from '../nav/MainNav';
import AuthNav from '../nav/AuthNav';
import Spinner from '../Spinner';
import Avatar from '../Avatar';

// @ts-ignore
import notificationSound from './notification.ogg';
import './Chat.scss';

const SLIDE_IN = {
  display: "block",
  transform: "translateX(0)"
};

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageText: '',
      chats: {},
      currentChatKey: '',
      currentFriendKey: '',
      friends: {},
      chatTitle: 'BlazeHub',
      loading: true,
      loadingChat: false,
      slideInStyle: {},
      chatsHeight: 300,
      avatar: ""
    };

    this.userKey = this.getUserKey(props.auth.user.email);
    this.props.getFriends(this.userKey);
    this.notificationSound = new Audio(notificationSound);
  }

  componentDidMount() {
    this.setupFirebase();

    const { profile, auth } = this.props;
    if (profile.avatar) {
      this.setState({
        // loadingAvatar: false,
        avatar: profile.avatar
      });
    } else {
      this.props.getProfilePic(auth.user.id, "avatar");
    }

    this.setChatsHeight();

    window.addEventListener('resize', () => {
      this.setChatsHeight();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.avatar && nextProps.profile.avatar !== this.state.avatar) {
      this.setState({
        // loadingAvatar: false,
        avatar: nextProps.profile.avatar
      });
    }

    this.updateFriends(nextProps);
    this.updateChats(nextProps);

    this.setChatsHeight();
  }

  updateFriends = ({ friends }) => {
    // const { friends } = nextProps;
    const friendKeys = Object.keys(friends);

    if (friendKeys.length > 0) {
      const newFriendKeys = this.arrayDiff(friendKeys, Object.keys(this.state.friends));
      if (newFriendKeys.length > 0) {
        this.props.listenForNewChats(newFriendKeys.map((friendKey) => this.getChatKey(friendKey)));

        // update UI with new friends
        this.setState({
          friends: friends,
          loading: false
        });
      } else if (JSON.stringify(friends) !== JSON.stringify(this.state.friends)) {
        this.setState({
          friends: friends,
          loading: false
        });
      } else {
        this.setState({ loading: false });
      }
    }
  };

  updateChats = ({ chats }) => {

    const { currentChatKey } = this.state;
    let stateChats = this.state.chats;
    if (chats[currentChatKey]) {
      const messageKeys = Object.keys(chats[currentChatKey]);
      const newMessageKey = messageKeys[messageKeys.length - 1];
      stateChats[currentChatKey][newMessageKey] = chats[currentChatKey][newMessageKey]
      this.setState({ chats: stateChats }, () => {
        const chatMessagesDiv = document.getElementById('chat-messages');
        // this.pageSmootScroll(chatMessagesDiv, chatMessagesDiv.scrollHeight);
        chatMessagesDiv.scrollTo({
          behavior: "smooth",
          top: chatMessagesDiv.scrollHeight - chatMessagesDiv.clientHeight
        });
        if (chats[currentChatKey][newMessageKey].user.key !== this.userKey) this.notificationSound.play();
      });
    } else {
      // update UI with notification indicating message from another user
    }
  };

  pageSmootScroll = (elem, to, current = -1) => {
    if (current === -1) current = elem.scrollTop + elem.clientHeight;
    // document.getElementById('').clientHeight
    elem.scrollBy(0, 10);
    // console.log("scrolling")
    if (elem.scrollTop < to + elem.clientHeight && current !== elem.scrollHeight)
      setTimeout(this.pageSmootScroll, 10, elem, to, (elem.scrollTop + elem.clientHeight));
  }

  /**
   * @param {any[]} a
   * @param {any[]} b
   */
  arrayDiff = (a, b) => a.filter((val) => b.indexOf(val) < 0);

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

    // this.setState({  });
    this.setState({
      // chats: [],
      currentFriendKey: key,
      currentChatKey: this.getChatKey(key),
      loadingChat: true,
      chatTitle: this.state.friends[key].name
    }, () => {
      this.chatRef.child(this.state.currentChatKey).once('value', (chatSnapShot) => {
        let { chats } = this.state;
        chats[this.state.currentChatKey] = chatSnapShot.val() || {};
        this.setState({
          loadingChat: false,
          chats
        }, () => {
          const chatMessagesDiv = document.getElementById('chat-messages');
          chatMessagesDiv.scrollTo({
            behavior: "auto",
            top: chatMessagesDiv.scrollHeight - chatMessagesDiv.clientHeight
          });
        });
      });
    });
  };

  sendMessage = (event) => {
    const { messageText, currentChatKey } = this.state;
    if (event.which === 13 && messageText !== '') {
      const { user } = this.props.auth;
      const newMessage = {
        text: messageText,
        date: Date.now(),
        // todo: add user url (from profile: auto-generate if not manually set by user)
        user: {
          name: `${user.firstName}`,
          key: this.userKey
        },
      };

      this.setState({ messageText: '' });
      event.target.value = '';

      this.chatRef.child(currentChatKey).push(newMessage, (err) => {
        if (err) console.error(err);
        // this.notificationSound.play();
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
    const { user } = this.props.auth;
    const { loading, avatar, friends, chatTitle, slideInStyle, chatsHeight, currentFriendKey, currentChatKey, chats, loadingChat } = this.state;
    const friendKeys = Object.keys(friends);

    return (
      <div className="container">
        <AuthNav
          history={this.props.history}
          avatar={avatar}
        />

        <div className="main">
          <MainNav user={user} />

          <div className="chat-space">
            <header>
              <div className="icon-text">
                {/* <FontAwesomeIcon icon={faUserCircle} /> */}
                {
                  friends[currentFriendKey] && friends[currentFriendKey].avatar ? (
                    <Avatar
                      avatar={friends[currentFriendKey].avatar}
                      marginRight="0.5em" />
                  ) : <FontAwesomeIcon icon={faUserCircle} className="icon" />
                }
                <h3>{chatTitle}</h3>
              </div>

              <div id={this.state.slideInStyle === SLIDE_IN ? "burger-slided" : ""} className="burger" onClick={this.toggleFriends}>
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
              </div>
            </header>

            <div style={{ height: `${chatsHeight}px` }} className="chats">
              <div id="chat-messages" className="chat-messages">
                {
                  loadingChat ? (<Spinner />) :
                    chats[currentChatKey] &&
                    Object.keys(chats[currentChatKey]).map((messageKey, idx, messageKeys) => {
                      const message = chats[currentChatKey][messageKey];
                      const timeString = new Date(message.date).toLocaleTimeString().split(":");
                      const meridiem = timeString[2].split(" ")[1];
                      const time = `${timeString[0]}:${timeString[1]} ${meridiem || ""}`;
                      const prevMessageKey = messageKeys[idx - 1];

                      if (message.user.key === this.userKey) return (
                        <div key={messageKey} className="chat chat-me"
                          style={{
                            marginTop: prevMessageKey &&
                              chats[currentChatKey][prevMessageKey].user.key !== message.user.key ? "1.3em" : "0.5em"
                          }}>
                          {
                            avatar ? (
                              <Avatar avatar={avatar} />
                            ) : <FontAwesomeIcon icon={faUserCircle} className="icon" />
                          }
                          <div>
                            <p>{message.text}</p>
                            <small>{time}</small>
                          </div>
                        </div>
                      );
                      else return (
                        <div key={messageKey} className="chat chat-other"
                          style={{
                            marginTop: prevMessageKey &&
                              chats[currentChatKey][prevMessageKey].user.key !== message.user.key ? "1.3em" : "0.5em"
                          }}>
                          {
                            friends[currentFriendKey] && friends[currentFriendKey].avatar ?
                              <Avatar
                                avatar={friends[currentFriendKey].avatar}
                                marginRight="0"
                                marginLeft="1em"
                              /> : <FontAwesomeIcon icon={faUserCircle} className="icon" />
                          }
                          <div>
                            {/* <h5>{message.user.name}</h5> */}
                            <p>{message.text}</p>
                            <small>{time}</small>
                          </div>

                        </div>
                      );
                    })
                }
              </div>

              {
                chatTitle !== "BlazeHub" && (
                  <div className="chat-input">
                    <input type="text" name="messageText" placeholder="Type a message" onChange={this.onChange} onKeyPress={this.sendMessage} />
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
              friendKeys.map((friendKey) => {
                const friend = friends[friendKey];
                // console.log(friend);

                return (
                  <div key={friendKey}>
                    <div className="friend" onClick={(e) => this.openChat(friendKey)}>
                      {friend.avatar ? <Avatar avatar={friend.avatar} /> : <FontAwesomeIcon icon={faUserCircle} className="icon" />}
                      <p>{friend.name}</p>
                    </div>

                    {
                      friendKeys.length === 1 &&
                      <div style={{ textAlign: "center", marginTop: "2em" }}>
                        <Link to="/find"><button className="btn">Find Friends</button></Link>
                      </div>
                    }
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
  profile: state.profile,
  friends: state.friends,
  chats: state.chats
});

export default connect(mapStateToProps, { getProfilePic, getFriends, listenForNewChats })(Chat);
