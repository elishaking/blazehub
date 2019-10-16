import React, { Component } from 'react';
import logo from './logo.svg'

export default class Landing extends Component {
  render() {
    return (
      <div className="container landing-bg">
        <header>
          <nav>
            <h1>
              <img src={logo} alt="Logo" srcset="" /> BlazeChat
            </h1>

            <div className="nav-right">
              <form action="/signin">
                <input type="email" name="email" placeholder="email" className="text-input" />
                <input type="password" name="password" placeholder="password" className="text-input" />
                <input type="submit" value="Sign In" className="btn-input" />
              </form>
            </div>
          </nav>
        </header>

        <div className="content">
          <div className="left">
            <div className="inner">
              <div className="info">
                <ul>
                  <li>
                    <img src="./assets/img/connect.svg" alt="Connection" srcset="" />
                    <p>Connect With Friends</p>
                  </li>
                  <li>
                    <img src="./assets/img/converse.svg" alt="Conversation" srcset="" />
                    <p>Chat, Share Photos, Videos and more</p>
                  </li>
                  <li>
                    <img src="./assets/img/commune.svg" alt="Community" srcset="" />
                    <p>Be a part of a growing community</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="inner">
              <div className="welcome">
                <img src={logo} alt="Logo" srcset="" />
                <h1>Join BlazeChat Today</h1>
              </div>

              <form action="/signup">
                <div>
                  <div className="name">
                    <input type="text" name="firstName" id="firstName" placeholder="first name" />
                    <input type="text" name="lastName" id="lastName" placeholder="last name" />
                  </div>
                  <input type="email" name="email" id="email" placeholder="email" className="fill-parent" />
                  <input type="password" name="password" id="password" placeholder="password" className="fill-parent" />
                  <select name="gender" id="gender" className="fill-parent">
                    <option hidden disabled selected value="other">gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <input type="submit" value="Sign Up" className="btn-input btn-pri" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
