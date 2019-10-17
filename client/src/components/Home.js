//@ts-check
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle, faHome, faUserAlt, faComments, faBookmark, faSignOutAlt, faImage, faSmile, faThumbsUp, faShare } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';

class Home extends Component {
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
      console.log(newPostSnapShot.val());
    });

    // this.setState({
    //   posts: [
    //     {
    //       user: this.props.auth.user,
    //       text: "New Post",
    //       date: Date.now(),
    //       imageUrl: '',
    //       likes: [],
    //       comments: [],
    //       shares: []
    //     },
    //     ...this.state.posts
    //   ]
    // });
  }

  createPost = () => {
    const newPost = {
      user: this.props.auth.user,
      text: this.state.postText,
      date: Date.now(),
      imageUrl: '',
      likes: [],
      comments: [],
      shares: []
    };
    this.postsRef.push(newPost, (err) => {
      if (err) console.error(err);
      else console.log('post created');
    });
    // this.setState({
    //   posts: [
    //     {
    //       user: this.props.auth.user,
    //       text: this.state.postText,
    //       date: Date.now(),
    //       imageUrl: '',
    //       likes: [],
    //       comments: [],
    //       shares: []
    //     },
    //     ...this.state.posts
    //   ]
    // });
  };

  /** @param {React.ChangeEvent<HTMLTextAreaElement>} event */
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const hasProfilePic = false;
    const { firstName, lastName } = this.props.auth.user;
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
              <h2>
                {hasProfilePic ? <img src="" alt={firstName} srcSet="" /> : <FontAwesomeIcon icon={faUserCircle} className="icon" />} &nbsp;&nbsp;&nbsp;
                <span>{`${firstName} ${lastName}`}</span>
              </h2>
            </header>
            <nav>
              <ul>
                <li>
                  <Link to="/home">
                    <FontAwesomeIcon icon={faHome} /> &nbsp;&nbsp;&nbsp; Home
                  </Link>
                </li>
                <li>
                  <Link to="/chat">
                    <FontAwesomeIcon icon={faComments} /> &nbsp;&nbsp;&nbsp; Chat
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <FontAwesomeIcon icon={faUserAlt} /> &nbsp;&nbsp;&nbsp; Profile
                  </Link>
                </li>
                <li>
                  <Link to="/bookmarks">
                    <FontAwesomeIcon icon={faBookmark} /> &nbsp;&nbsp;&nbsp; Bookmarks
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <FontAwesomeIcon icon={faSignOutAlt} /> &nbsp;&nbsp;&nbsp; Sign Out
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
                  <div className="post">
                    <header>
                      <FontAwesomeIcon icon={faUserCircle} />
                      <div>
                        <h4>{`${post.user.firstName}  ${post.user.lastName}`}</h4>
                        <small>{new Date(post.date).toTimeString()}</small>
                      </div>
                    </header>

                    <p>{post.text}</p>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt="" srcSet="" />
                    )}

                    <hr />

                    <div className="post-actions">
                      <button className="post-action">
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span>{post.likes.length}</span>
                      </button>
                      <button className="post-action">
                        <FontAwesomeIcon icon={faComments} />
                        <span>{post.comments.length}</span>
                      </button>
                      <button className="post-action">
                        <FontAwesomeIcon icon={faShare} />
                        <span>{post.shares.length}</span>
                      </button>
                    </div>
                  </div>
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

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Home);