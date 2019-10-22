import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import MainNav from '../MainNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { getFriends } from '../../redux_actions/friendActions';
import AuthNav from '../AuthNav';
import Spinner from '../Spinner';

class FindFriends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {},
      loading: true
    };

    this.userKey = this.getUserKey(this.props.auth.user.email);
  }

  componentDidMount() {
    if (Object.keys(this.props.friends).length == 0) {
      this.props.getFriends(this.userKey);
    }

    axios.get("/api/users").then((res) => {
      let { users } = res.data;
      delete users["blazebot"];
      delete users[this.userKey];
      // if (Object.keys(users).length == 2) users = {}
      this.setState({
        users,
        loading: false
      });
    });
  }

  componentWillReceiveProps(nextProps) {
  }

  /** @param {string} userEmail */
  getUserKey = (userEmail) =>
    userEmail.replace(/\./g, "~").replace(/@/g, "~~");

  addFriend = (userKey) => {

  };

  render() {
    const { users, loading } = this.state;
    const { user } = this.props.auth;
    const userKeys = Object.keys(users);
    const hasProfilePic = false;

    return (
      <div className="container">
        <AuthNav />

        <div className="main">
          <MainNav user={user} />

          <div className="friends-main">
            {
              loading ? <Spinner /> :
                (
                  userKeys.length == 0 ? (
                    <div style={{ textAlign: "center", padding: "1em 0" }}>
                      <h3 style={{ fontWeight: "500" }}>No Friends</h3>
                    </div>
                  ) :
                    userKeys.map((userKey) => {
                      const user = users[userKey];
                      return (
                        <div className="friend-container" key={userKey}>
                          <div className="friend-main">
                            <div className="friend-inner">
                              <FontAwesomeIcon icon={faUserCircle} />
                              <p>{user.firstName} {user.lastName}</p>
                            </div>
                            <button className="btn"><FontAwesomeIcon icon={faUserPlus} onClick={(e) => { this.addFriend(userKey) }} /> Add Friend</button>
                          </div>
                          <hr />
                        </div>
                      );
                    })
                )
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

export default connect(mapStateToProps, { getFriends })(FindFriends);
