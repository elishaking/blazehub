import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class Home extends Component {
  render() {
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
              <img src="" alt={firstName} srcset="" />
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