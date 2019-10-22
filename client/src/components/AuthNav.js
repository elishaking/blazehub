import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default function AuthNav({ user, signoutUser, history, hasProfilePic, showSearch = false }) {
  const signOut = () => {
    signoutUser();
    history.push('/');
  };

  const { firstName, lastName } = user;
  return (
    <header>
      <nav className="auth-nav">
        <h1 className="logo">
          <img src={`./assets/img/logo-pri.svg`} alt="Logo" srcSet="" /> <span>BlazeChat</span>
        </h1>

        {
          showSearch && (
            <div className="search">
              <div className="icon-input">
                <input type="text" placeholder="Search" />
                <FontAwesomeIcon icon={faSearch} className="icon" />
              </div>
            </div>
          )
        }

        <div className="auth-nav-right">
          {hasProfilePic ? <img src="" alt={firstName} srcSet="" /> : <FontAwesomeIcon icon={faUserCircle} className="icon" />} &nbsp;&nbsp;&nbsp;
              <span>{`${firstName} ${lastName}`}</span>
          <input type="button" value="Sign Out" className="btn-input" onClick={signOut} />
        </div>
      </nav>

      {
        showSearch && (
          <div className="alt-search">
            <div className="icon-input">
              <input type="text" placeholder="Search" />
              <FontAwesomeIcon icon={faSearch} className="icon" />
            </div>
          </div>
        )
      }
    </header>
  )
}
