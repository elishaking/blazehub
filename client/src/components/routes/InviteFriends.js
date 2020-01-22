//@ts-check
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
        { email: "" }
      ],
      loading: false
    };
  }

  addField = () => {
    const { friendEmails } = this.state;
    friendEmails.push({ email: "" });
    this.setState({
      friendEmails
    });
  };

  inviteFriends = (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    axios.post("/api/friends/invite", this.state.friendEmails)
      .then((res) => {
        this.setState({ loading: false, inviteSent: res.data.success });

      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };

  inviteMore = () => {
    this.setState({ inviteSent: false, friendEmails: [{ name: "" }] });
  };

  onChange = (e, index) => {
    let { friendEmails } = this.state;
    friendEmails[index].email = e.target.value;

    this.setState({
      friendEmails
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
              <div className="invite-friends">
                <h3 style={{ margin: "0.7em 0 1em 0" }}>Invite has been sent</h3>
                <button className="btn" onClick={this.inviteMore}>Invite More</button>
              </div>
            ) : (
                <div className="invite-friends">
                  <form className="add-friend" onSubmit={this.inviteFriends}>
                    <h3>Invite your friends</h3>

                    {friendEmails.map((_, index) => (
                      <input type="email" key={index} name={`email${index}`} placeholder="email" onChange={(e) => this.onChange(e, index)} />
                    ))}

                    <button type="button" className="btn" onClick={this.addField}>Add Input</button>

                    {
                      loading ? (
                        <div style={{ textAlign: "end" }}>
                          <Spinner full={false} />
                        </div>
                      ) : (
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
