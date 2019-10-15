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
            <div className="info">
              <ul>
                <li>
                  <img src="" alt="" srcset="" />
                  <p>Connect With Friends</p>
                </li>
                <li>
                  <img src="" alt="" srcset="" />
                  <p>Chat, Share Photos, Videos and more</p>
                </li>
                <li>
                  <img src="" alt="" srcset="" />
                  <p>Be a part of a growing community</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="right">
            <div className="welcome">
              <img src="" alt="" srcset="" />
              <h1>Join BlazeChat Today</h1>
            </div>

            <form action="/signup">
              <div className="name">
                <input type="text" name="firstName" id="firstName" placeholder="first name" />
                <input type="text" name="lastName" id="lastName" placeholder="last name" />
              </div>
              <input type="email" name="email" id="email" placeholder="email" />
              <input type="password" name="password" id="password" placeholder="password" />
              <select name="gender" id="gender">
                <option hidden disabled selected value="other">gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input type="submit" value="Sign Up" className="btn-input" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}
