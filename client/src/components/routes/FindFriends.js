import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import MainNav from '../MainNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';

class FindFriends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {}
    };
  }

  componentDidMount() {
    axios.get("/api/users").then((res) => {
      this.setState({
        users: res.data.users
      });
    });
  }

  addFriend = (userKey) => {
    // todo: adds friends to redux
  };

  render() {
    const { users } = this.state;
    const { user } = this.props.auth;
    const { firstName, lastName } = user;
    const hasProfilePic = false;
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

          <div className="friends-main">
            {
              Object.keys(users).map((userKey) => {
                const user = users[userKey];
                return (
                  <div className="friend-container" key={userKey}>
                    <div className="friend-main">
                      <div className="friend-inner">
                        <FontAwesomeIcon icon={faUserCircle} />
                        <p>{user.firstName} </p>
                      </div>
                      <button className="btn"><FontAwesomeIcon icon={faUserPlus} onClick={(e) => { this.addFriend(userKey) }} /> Add Friend</button>
                    </div>
                    <hr />
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

export default connect(mapStateToProps)(FindFriends);
