//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faImage, faSmile } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';
// import axios from 'axios';

import { signoutUser } from '../../redux_actions/authActions';

import Post from '../Post';
import Spinner from '../Spinner';
import MainNav from '../nav/MainNav';
import AuthNav from '../nav/AuthNav';

class Home extends Component {
  /**
   * @param {any} props
   */
  constructor(props) {
    super(props);

    this.state = {
      postText: '',
      postImgDataUrl: '',
      posts: [],
      loading: true
    }
  }

  componentDidMount() {
    // if (app.apps.length > 0) {
    //   this.setupFirebase();
    // } else {
    //   axios.get('/api/users/firebase').then((res) => {
    //     app.initializeApp(res.data);
    //     this.setupFirebase();
    //   });
    // }
    this.setupFirebase();
  }

  setupFirebase = () => {
    this.postsRef = app.database().ref('posts');
    this.bookmarksRef = app.database().ref("bookmarks").child(this.props.auth.user.id);

    this.postsRef.on('child_added', (newPostSnapShot) => {
      // console.log('child_added');
      const newPost = {
        key: newPostSnapShot.key,
        ...newPostSnapShot.val()
      };
      if (this.state.loading) this.setState({ loading: false });
      const { posts } = this.state;
      posts.unshift(newPost);
      this.setState({
        posts
      });
    });

    this.postsRef.on('child_removed', (removedPostSnapShot) => {
      const { posts } = this.state;

      posts.splice(posts.map((post) => post.key).indexOf(removedPostSnapShot.key), 1);

      this.setState({ posts });
    });
  }

  selectImage = (e) => {
    const postImgInput = document.getElementById("post-img");
    postImgInput.click();
  };

  removeImage = () => {
    this.setState({ postImgDataUrl: '' });
  };

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  showImage = (e) => {
    const postImgInput = e.target;

    if (postImgInput.files && postImgInput.files[0]) {
      const imgReader = new FileReader();

      imgReader.onload = (e) => {
        this.setState({ postImgDataUrl: e.target.result });
      };

      imgReader.readAsDataURL(postImgInput.files[0]);
    }
  };

  createPost = () => {
    const { postText, postImgDataUrl } = this.state;
    const newPost = {
      user: this.props.auth.user,
      text: postText,
      isBookmarked: false,
      date: Date.now(),
      imageUrl: postImgDataUrl,
      // likes: { name: "likes" },
      // comments: { name: "comments" },
      // shares: { name: "shares" }
    };
    this.postsRef.push(newPost, (err) => {
      if (err) console.error(err);
    });
    this.setState({
      postText: '',
      postImgDataUrl: ''
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
    const { postText, postImgDataUrl } = this.state;

    return (
      <div className="container">
        <AuthNav showSearch={true} history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          <div className="main-feed">
            <header>
              <div className="create-post">
                <h3>Create Post</h3>

                <div className="icon-input">
                  <textarea
                    name="postText"
                    placeholder="Share your thoughts"
                    rows={3}
                    value={postText}
                    onChange={this.onChange}></textarea>
                  <FontAwesomeIcon icon={faUserAlt} className="icon" />
                </div>

                <div className="post-img">
                  {
                    postImgDataUrl && (
                      <div className="img-container">
                        <img src={postImgDataUrl} alt="Post Image" />
                        <div className="close" onClick={this.removeImage}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 35.086 35.086">
                            <g id="Group_11" data-name="Group 11" transform="translate(-2725.457 -148.457)">
                              <line id="Line_1" data-name="Line 1" x2="28.015" y2="28.015" transform="translate(2728.993 151.993)" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="5" />
                              <line id="Line_2" data-name="Line 2" x1="28.015" y2="28.015" transform="translate(2728.993 151.993)" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="5" />
                            </g>
                          </svg>
                        </div>
                      </div>
                    )
                  }
                </div>

                <div className="create-post-actions">
                  <div className="icon-btns">
                    <div id="select-image">
                      <input type="file" name="image" id="post-img" onChange={this.showImage} accept="image/*" />
                      <button onClick={this.selectImage}>
                        <FontAwesomeIcon icon={faImage} />
                      </button>
                    </div>

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
                this.state.loading ? (<Spinner />) : this.state.posts.map((post, idx) => (
                  <Post
                    key={post.key}
                    postRef={this.postsRef.child(post.key)}
                    bookmarkRef={this.bookmarksRef.child(post.key)}
                    post={post}
                    user={user}
                    canBookmark={true} />
                ))
              }
            </div>
          </div>

          {/* <div className="extras">

          </div> */}
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

export default connect(mapStateToProps, { signoutUser })(Home);