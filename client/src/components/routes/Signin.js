//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signinUser } from '../../redux_actions/authActions';
import Spinner from '../Spinner';

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {},
      loading: false
    };
  }

  componentDidMount() {
    this.redirectIfAuthenticated(this.props.auth.isAuthenticated);
  }

  // after redux store is updated, this life cycle method will be called
  componentWillReceiveProps(nextProps) {
    this.redirectIfAuthenticated(this.props.auth.isAuthenticated);

    if (nextProps.auth.errors) {
      this.setState({
        errors: nextProps.auth.errors,
        loading: false
      });
    }
  }

  /** @param {boolean} isAuthenticated */
  redirectIfAuthenticated = (isAuthenticated) => {
    // redirect authenticated user to home-page
    if (isAuthenticated) {
      this.props.history.push('/home');
    }
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

    this.setState({ loading: true });

    const userData = {
      email: this.state.email,
      password: this.state.password
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
            <h1 className="mb-1">Sign In to BlazeChat</h1>
            <form onSubmit={this.onSubmit}>
              <input type="email" name="email" placeholder="email" className="text-input" onChange={this.onChange} />
              <input type="password" name="password" placeholder="password" className="text-input" onChange={this.onChange} />
              {
                this.state.loading ? <Spinner full={false} /> : <input type="submit" value="Sign In" className="btn-input btn-pri" />
              }
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
