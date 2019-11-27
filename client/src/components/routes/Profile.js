import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthNav from '../nav/AuthNav';
import MainNav from '../nav/MainNav';
import './Profile.scss';

class Profile extends Component {
  state = {
    profile: {
      avatar: '',
      coverPhoto: '',
    }
  }

  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;
    const { profile } = this.state;

    return (
      <div className="container">
        <AuthNav showSearch={true} history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          <div className="profile">
            <div className="pics">
              <div className="cover">
                {profile.coverPhoto ? (
                  <img src={profile.coverPhoto} alt="Cover Photo" />
                ) : (
                    <div className="cover-placeholder"></div>
                  )}
              </div>
              <div className="avatar">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile Picture" />
                ) : (
                    <div className="avatar-placeholder"></div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Profile);
