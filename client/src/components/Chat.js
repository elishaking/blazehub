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
      commentText: '',
      chats: {},
      friends: {}
    };

    this.userRef = app.database().ref('users').child(this.getUserKey(props.auth.user.email));
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


  signOut = () => {
    this.props.signoutUser();
    this.props.history.push('/');
  }

  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;
    const { firstName, lastName } = user;

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
                <h3>{`${firstName} ${lastName}`}</h3>
              </div>
            </header>

            <div className="chats">
              <div className="chat-messages">

              </div>

              <div className="chat-input">
                <input type="text" name="messageText" placeholder="Type a message" onChange={this.onChange} />
                {/* <button>
                  <FontAwesomeIcon icon={faSmile} className="icon" />
                </button> */}
              </div>
            </div>
          </div>

          <div className="friends">

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
