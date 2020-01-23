//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import app from 'firebase/app';
import 'firebase/database';

import AuthNav from '../nav/AuthNav';
import MainNav from '../nav/MainNav';
import Spinner from '../Spinner';
import Post from '../Post';

class Bookmarks extends Component {
  state = {
    bookmarkedPosts: [],
    loading: true
  };

  componentDidMount() {
    this.setupFirebase();
  }

  setupFirebase = () => {
    this.db = app.database();

    this.db.ref('bookmarks').child(this.props.auth.user.id).orderByValue().equalTo(true).once("value", (bookmarksSnapShot) => {
      // console.log(bookmarksSnapShot.val());
      if (bookmarksSnapShot.exists()) {
        const bookmarks = bookmarksSnapShot.val();
        const bookmarkKeys = Object.keys(bookmarks);
        Promise.all(
          bookmarkKeys.map(
            (_, i, bookmarkKeys) => this.db.ref('posts')
              .child(bookmarkKeys[bookmarkKeys.length - i - 1]).once('value')
          )
        ).then((bookmarkedPostSnapshots) => {
          let { bookmarkedPosts } = this.state;
          bookmarkedPostSnapshots.forEach((bookmarkedPostSnapshot) => {
            bookmarkedPosts.push({
              key: bookmarkedPostSnapshot.key,
              ...bookmarkedPostSnapshot.val()
            });
          });
          this.setState({ bookmarkedPosts, loading: false });
        });
      } else {
        this.setState({
          loading: false
        });
      }
    });
  }

  render() {
    const { user } = this.props.auth;
    const { bookmarkedPosts, loading } = this.state;

    return (
      <div className="container">
        <AuthNav showSearch={true} history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          <div className="bookmarks">
            {/* <h3 style={{ textAlign: "center", fontWeight: "500", padding: "1em 0" }}>Bookmarks Coming Soon</h3> */}
            {
              loading ? (<Spinner />) : bookmarkedPosts.length == 0 ? (
                <h3 style={{
                  textAlign: "center",
                  padding: "1em 0",
                  fontWeight: 500
                }}>You have not bookmarked any posts yet</h3>
              ) : bookmarkedPosts.map((bookmarkedPost) => (
                <Post
                  key={bookmarkedPost.key}
                  postRef={this.db.ref('posts').child(bookmarkedPost.key)}
                  postImageRef={this.db.ref('post-images').child(bookmarkedPost.key)}
                  bookmarkRef={this.db.ref('bookmarks').child(bookmarkedPost.key)}
                  profilePhotosRef={this.db.ref('profile-photos')}
                  post={bookmarkedPost}
                  user={user} />
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Bookmarks);
