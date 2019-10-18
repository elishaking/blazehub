//@ts-check
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle, faHome, faUserAlt, faComments, faBookmark, faSignOutAlt, faImage, faSmile, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';

import Post from './Post';

class Home extends Component {
  /**
   * @param {any} props
   */
  constructor(props) {
    super(props);

    this.state = {
      postText: '',
      posts: []
    }

    this.postsRef = app.database().ref('posts');
  }

  componentDidMount() {
    this.postsRef.on('child_added', (newPostSnapShot) => {
      const newPost = {
        key: newPostSnapShot.key,
        ...newPostSnapShot.val()
      }
      this.setState({
        posts: [
          newPost,
          ...this.state.posts
        ]
      });
    });
  }

  createPost = () => {
    const newPost = {
      user: this.props.auth.user,
      text: this.state.postText,
      date: Date.now(),
      imageUrl: '',
      // likes: { name: "likes" },
      // comments: { name: "comments" },
      // shares: { name: "shares" }
    };
    this.postsRef.push(newPost, (err) => {
      if (err) console.error(err);
      else console.log('post created');
    });
  };

  /** @param {React.ChangeEvent<HTMLTextAreaElement>} event */
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;
    const { firstName, lastName } = user;
    return (
      <div className="container">
        <header>
          <nav className="auth-nav">
            <h1 className="logo">
              <img src={`./assets/img/logo-pri.svg`} alt="Logo" srcSet="" /> <span>BlazeChat</span>
            </h1>

            <div className="search">
              <div className="icon-input">
                <input type="text" placeholder="Search" />
                <FontAwesomeIcon icon={faSearch} className="icon" />
              </div>
            </div>

            <div className="auth-nav-right">
              {hasProfilePic ? <img src="" alt={firstName} srcSet="" /> : <FontAwesomeIcon icon={faUserCircle} className="icon" />} &nbsp;&nbsp;&nbsp;
              <span>{`${firstName} ${lastName}`}</span>
              <input type="button" value="Sign Out" className="btn-input" />
            </div>
          </nav>
        </header>

        <div className="main">
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

          <div className="main-feed">
            <header>
              <div className="create-post">
                <h3>Create Post</h3>

                <div className="icon-input">
                  <textarea name="postText" placeholder="Share your thoughts" rows={3} onChange={this.onChange}></textarea>
                  <FontAwesomeIcon icon={faUserAlt} className="icon" />
                </div>

                <div className="create-post-actions">
                  <div className="icon-btns">
                    <button>
                      <FontAwesomeIcon icon={faImage} />
                    </button>

                    <button>
                      <FontAwesomeIcon icon={faSmile} />
                    </button>
                  </div>
                  <button className="btn" onClick={this.createPost}>Post</button>
                </div>
              </div>
            </header>

            <div className="posts">
              {
                this.state.posts.map((post) => (
                  <Post
                    key={post.key}
                    postRef={this.postsRef.child(post.key)}
                    post={post}
                    user={user} />
                ))
              }
            </div>
          </div>

          <div className="extras">

          </div>
        </div>
      </div>
    )
  }
}

/**
 * @param {{ auth: any; }} state
 */
const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Home);