import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faImage, faSmile } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';
// import axios from 'axios';
// import { initializeApp, updateUsername } from '../../utils/firebase';

import { signoutUser } from '../../redux_actions/authActions';
import { getProfilePic } from '../../redux_actions/profileActions';

import { resizeImage } from '../../utils/resizeImage';

import MainNav from '../nav/MainNav';
import AuthNav from '../nav/AuthNav';
import Posts from '../Posts';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postText: '',
      postImgDataUrl: '',
      notifications: [],
      loadingNotifications: true
    }

    this.setupFirebase();
  }

  componentDidMount() {
    // initializeApp(this);
    // updateUsername();

    // this.setupFirebase();

    const { profile, auth } = this.props;
    if (!profile.avatar)
      this.props.getProfilePic(auth.user.id, "avatar");
  }

  /**
   * Initialize firebase references
   */
  setupFirebase = () => {
    this.db = app.database();
    this.postsRef = this.db.ref('posts');
    this.postImagesRef = this.db.ref('post-images');
    // this.notificationsRef = this.db.ref('notifications');
  }

  /**
   * Opens file explorer for image attachment to new post
   */
  selectImage = () => {
    const postImgInput = document.getElementById("post-img");
    postImgInput.click();
  };

  /**
   * Remove image attached to new post
   */
  removeImage = () => {
    this.setState({ postImgDataUrl: '' });
  };

  /** 
   * Display image attached to new post
   * @param {React.ChangeEvent<HTMLInputElement>} e 
   */
  showImage = (e) => {
    const postImgInput = e.target;

    if (postImgInput.files && postImgInput.files[0]) {
      const imgReader = new FileReader();

      imgReader.onload = (e) => {
        if (postImgInput.files[0].size > 100000)
          resizeImage(e.target.result.toString(), postImgInput.files[0].type).then((dataUrl) => {
            this.setState({ postImgDataUrl: dataUrl });
          });

        else this.setState({ postImgDataUrl: e.target.result });
      };

      imgReader.readAsDataURL(postImgInput.files[0]);
    }
  };

  /**
   * Create new post.
   * Updates database with new post
   */
  createPost = () => {
    const { postText, postImgDataUrl } = this.state;
    const newPost = {
      user: this.props.auth.user,
      text: postText,
      isBookmarked: false,
      date: 1e+15 - Date.now(),
      imageUrl: postImgDataUrl !== "",
      // likes: { name: "likes" },
      // comments: { name: "comments" },
      // shares: { name: "shares" }
    };
    this.postsRef.push(newPost)
      .then((post) => {
        if (newPost.imageUrl)
          this.postImagesRef.child(post.key).set(postImgDataUrl);
      })
      .catch((err) => console.log(err));

    this.setState({
      postText: '',
      postImgDataUrl: ''
    });
  };

  /**
   * Updates react-state with new data 
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event 
   */
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { user } = this.props.auth;
    const { postText, postImgDataUrl } = this.state;
    const { avatar } = this.props.profile || '';

    return (
      <div className="container" data-test="homeComponent">
        <AuthNav
          showSearch={true}
          hello="hello"
          avatar={avatar}
          notificationsRef={this.db.ref('notifications')} />

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
                  <button
                    className="btn"
                    onClick={this.createPost}
                    data-test="createPostBtn">Post</button>
                </div>
              </div>
            </header>

            <div className="posts">
              <Posts user={user} />
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
 * @param {{ auth: any; profile: any }} state
 */
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { signoutUser, getProfilePic })(Home);