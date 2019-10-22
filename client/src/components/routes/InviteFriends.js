import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import AuthNav from '../nav/AuthNav';
import MainNav from '../nav/MainNav';
import Spinner from '../Spinner';

class InviteFriends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inviteSent: false,
      friendEmails: [
        { name: "" }
      ],
      loading: false
    };
  }

  addField = () => {
    const { friendEmails } = this.state;
    friendEmails.push({ name: "" });
    this.setState({
      friendEmails
    });
  };

  inviteFriends = (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    axios.post("/api/users/invite", this.state.friendEmails)
      .then((res) => {
        this.setState({ loading: false, inviteSent: true });

      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };

  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;
    const { inviteSent, friendEmails, loading } = this.state;

    return (
      <div className="container">
        <AuthNav showSearch={true} history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          {
            inviteSent ? (
              <div>
                <h3 className="h3">Invite has been sent</h3>
                <button className="btn">Invite More</button>
              </div>
            ) : (
                <div className="invite-friends" onSubmit={this.inviteFriends}>
                  <form className="add-friend">
                    <h3>Invite your friends</h3>

                    {friendEmails.map((_, index) => (
                      <input type="text" name={`friend${index}`} placeholder="email" />
                    ))}

                    <button type="button" className="btn" onClick={this.addField}>Add Input</button>

                    {
                      loading ? <Spinner full={false} /> : (
                        <button type="submit" className="btn" style={{ marginLeft: "auto" }}>Invite</button>
                      )
                    }
                  </form>
                </div>
              )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(InviteFriends);
