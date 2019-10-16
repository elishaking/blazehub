import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';

class Home extends Component {
  render() {
    const hasProfilePic = false;
    const { firstName, lastName } = this.props.auth.user;
    return (
      <div className="container">
        <header>
          <nav className="auth-nav">
            <h1 className="logo">
              <img src={`./assets/img/logo-pri.svg`} alt="Logo" srcSet="" /> <span>BlazeChat</span>
            </h1>

            <div className="search">
              <div className="icon-input">
                <input type="text" />
                <FontAwesomeIcon icon={faSearch} className="icon" />
              </div>
            </div>

            <div className="auth-nav-right">
              {hasProfilePic ? <img src="" alt={firstName} srcset="" /> : <FontAwesomeIcon icon={faUserCircle} className="icon" />} &nbsp;&nbsp;&nbsp;
              <span>{`${firstName} ${lastName}`}</span>
              <input type="button" value="Sign Out" className="btn-input" />
            </div>
          </nav>
        </header>


      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Home);