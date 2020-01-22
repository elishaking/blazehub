import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

function PrivateRoute({ component: Component, auth, ...rest }) {
  // const checkRoute = (props) => {
  //   if (props.match.path.indexOf(":") !== -1 && ["/home", "/chat", "/find", "/profile", "/bookmarks", "/invite"].indexOf(props.match.url) !== -1) return (<div></div>);

  //   return <Component {...props} />
  // };

  return (
    <Route {...rest} render={
      (props) => auth.isAuthenticated === true ? <Component {...props} /> : <Redirect to="/" />
    } />
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
