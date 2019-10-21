import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserAlt, faComments, faBookmark, faSignOutAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';

export default function MainNav({ user }) {
  const { firstName, lastName } = user;
  return (
    <div className="main-nav">
      <header>
        <h3>{`${firstName} ${lastName}`}</h3>
      </header>
      <nav>
        <ul>
          <li>
            <Link to="/home">
              <FontAwesomeIcon icon={faHome} /> <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/chat">
              <FontAwesomeIcon icon={faComments} /> <span>Chat</span>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <FontAwesomeIcon icon={faUserAlt} /> <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/bookmarks">
              <FontAwesomeIcon icon={faBookmark} /> <span>Bookmarks</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <FontAwesomeIcon icon={faSignOutAlt} /> <span>Sign Out</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <FontAwesomeIcon icon={faUserFriends} /> <span>Invite Friends</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
