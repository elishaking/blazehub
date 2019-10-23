import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthNav from '../nav/AuthNav';
import MainNav from '../nav/MainNav';

class Bookmarks extends Component {
  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;

    return (
      <div className="container">
        <AuthNav showSearch={true} history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          <div className="bookmarks">
            <h3 style={{ textAlign: "center", fontWeight: "500", padding: "1em 0" }}>Bookmarks Coming Soon</h3>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Bookmarks);
