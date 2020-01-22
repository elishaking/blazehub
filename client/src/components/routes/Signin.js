//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signinUser } from '../../redux_actions/authActions';
import Spinner from '../Spinner';
import { TextFormInput } from '../form/TextFormInput';

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
    this.redirectIfAuthenticated(nextProps.auth.isAuthenticated);

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
      // this.props.history.push('/home');
      window.location.href = "/home";
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
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="container">
        <header>
          <nav>
            <h1>
              <img src={`./assets/img/logo-pri.svg`} alt="Logo" srcSet="" /> <span>BlazeHub</span>
            </h1>
          </nav>
        </header>

        <div className="content block">
          <div className="form-container">
            <h1 className="mb-1">Sign In to BlazeHub</h1>
            <form onSubmit={this.onSubmit}>
              <TextFormInput
                type="email"
                name="email"
                placeholder="email"
                error={errors.signinEmail}
                onChange={this.onChange} />

              <TextFormInput
                type="password"
                name="password"
                placeholder="password"
                error={errors.signinPassword}
                onChange={this.onChange} />
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
