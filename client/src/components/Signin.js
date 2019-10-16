//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signinUser } from '../redux_actions/authActions';

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  /**  @param {React.ChangeEvent<HTMLInputElement>} event */
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  /**  @param {React.FormEvent<HTMLFormElement>} event */
  onSubmit = (event) => {
    event.preventDefault();

    const userData = {
      email: this.state.email,
      passsword: this.state.passsword
    }
    this.props.signinUser(userData);
  }

  render() {
    return (
      <div className="container">
        <header>
          <nav>
            <h1>
              <img src={`./assets/img/logo-pri.svg`} alt="Logo" srcSet="" /> <span>BlazeChat</span>
            </h1>
          </nav>
        </header>

        <div className="content block">
          <div className="form-container">
            <h1>Sign In to BlazeChat</h1>
            <form onSubmit={this.onSubmit}>
              <input type="email" name="email" placeholder="email" className="text-input" onChange={this.onChange} />
              <input type="password" name="password" placeholder="password" className="text-input" onChange={this.onChange} />
              <input type="submit" value="Sign In" className="btn-input btn-pri" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { signinUser })(Signin);
