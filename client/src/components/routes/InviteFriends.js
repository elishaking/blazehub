import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthNav from '../nav/AuthNav';
import MainNav from '../nav/MainNav';

class InviteFriends extends Component {
  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;

    return (
      <div className="container">
        <AuthNav showSearch={true} history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          <div className="invite-friends">

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(InviteFriends);
