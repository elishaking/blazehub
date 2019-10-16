import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default class Home extends Component {
  render() {
    return (
      <div className="container">
        <header>
          <nav>
            <h1>
              <img src={`./assets/img/logo-pri.svg`} alt="Logo" srcSet="" /> <span>BlazeChat</span>
            </h1>

            <div>
              <div className="icon-input">
                <input type="text" />
                <FontAwesomeIcon icon={faSearch} className="icon" />
              </div>
            </div>
          </nav>
        </header>


      </div>
    )
  }
}
