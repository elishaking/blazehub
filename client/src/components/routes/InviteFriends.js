import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthNav from '../nav/AuthNav';
import MainNav from '../nav/MainNav';

class InviteFriends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friendEmails: [
        { name: "" }
      ]
    };
  }

  addField = () => {
    const { friendEmails } = this.state;
    friendEmails.push({ name: "" });
    this.setState({
      friendEmails
    });
  }

  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;

    return (
      <div className="container">
        <AuthNav showSearch={true} history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          <div className="invite-friends">
            <form className="add-friend">
              <h3>Invite your friends</h3>

              {this.state.friendEmails.map((_, index) => (
                <input type="text" name={`friend${index}`} placeholder="email" />
              ))}

              <button type="button" className="btn" onClick={this.addField}>Add Input</button>

              <button type="submit" className="btn" onClick={this.addField} style={{ marginLeft: "auto" }}>Invite</button>
            </form>
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
