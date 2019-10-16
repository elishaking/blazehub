import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle, faHome, faUserAlt, faComments, faBookmark, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

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
                <input type="text" placeholder="Search" />
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

        <div className="main">
          <div className="main-nav">
            <header>
              <h2>
                {hasProfilePic ? <img src="" alt={firstName} srcset="" /> : <FontAwesomeIcon icon={faUserCircle} className="icon" />} &nbsp;&nbsp;&nbsp;
                <span>{`${firstName} ${lastName}`}</span>
              </h2>
            </header>
            <nav>
              <ul>
                <li>
                  <Link to="/home">
                    <FontAwesomeIcon icon={faHome} /> &nbsp;&nbsp;&nbsp; Home
                  </Link>
                </li>
                <li>
                  <Link to="/chat">
                    <FontAwesomeIcon icon={faComments} /> &nbsp;&nbsp;&nbsp; Chat
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <FontAwesomeIcon icon={faUserAlt} /> &nbsp;&nbsp;&nbsp; Profile
                  </Link>
                </li>
                <li>
                  <Link to="/bookmarks">
                    <FontAwesomeIcon icon={faBookmark} /> &nbsp;&nbsp;&nbsp; Bookmarks
                  </Link>
                </li>
                <li>
                  <Link onClick={((e) => { console.log(e) })}>
                    <FontAwesomeIcon icon={faSignOutAlt} /> &nbsp;&nbsp;&nbsp; Sign Out
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="main-feed">

          </div>

          <div className="extras">

          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Home);