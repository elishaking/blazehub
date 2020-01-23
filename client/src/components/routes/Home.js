//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faImage, faSmile } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';
// import axios from 'axios';

import { signoutUser } from '../../redux_actions/authActions';
import { getProfilePic } from '../../redux_actions/profileActions';

import MainNav from '../nav/MainNav';
import AuthNav from '../nav/AuthNav';
import Posts from '../Posts';

class Home extends Component {
  /**
   * @param {any} props
   */
  constructor(props) {
    super(props);

    this.state = {
      postText: '',
      postImgDataUrl: '',
      notifications: [],
      loadingNotifications: true,
      avatar: "",
      loadingAvatar: true
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
    // console.log("mounter");

    const { profile, auth } = this.props;
    if (profile.avatar) {
      this.setState({
        loadingAvatar: false,
        avatar: profile.avatar
      });
    } else {
      this.props.getProfilePic(auth.user.id, "avatar");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.avatar && nextProps.profile.avatar !== this.state.avatar) {
      this.setState({
        loadingAvatar: false,
        avatar: nextProps.profile.avatar
      });
    }
  }

  setupFirebase = () => {
    // const { user } = this.props.auth;

    this.postsRef = app.database().ref('posts');
    this.postImagesRef = app.database().ref('post-images');

    // this.notificationsRef = app.database().ref('notifications');
  }

  selectImage = () => {
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
        if (postImgInput.files[0].size > 100000)
          this.resizeImage(e.target.result, postImgInput.files[0].type).then((dataUrl) => {
            this.setState({ postImgDataUrl: dataUrl });
          });

        else this.setState({ postImgDataUrl: e.target.result });
      };

      imgReader.readAsDataURL(postImgInput.files[0]);
    }
  };

  resizeImage = (dataUrl, type, maxSize = 1000) => {
    const img = document.createElement("img");
    img.src = dataUrl;
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // console.log(img.height);
        const canvas = document.createElement('canvas');
        const max = img.height > img.width ? img.height : img.width;
        if (max > maxSize) {
          canvas.height = (img.height / max) * maxSize;
          canvas.width = (img.width / max) * maxSize;

          const context = canvas.getContext('2d');
          context.scale(maxSize / max, maxSize / max);
          context.drawImage(img, 0, 0);
          // return canvas.toDataURL();
          resolve(canvas.toDataURL(type, 0.5));
        } else {
          // return dataUrl;
          resolve(dataUrl);
        }
      }
    });
  };

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
    this.postsRef.push(newPost, (err) => {
      if (err) console.error(err);
    }).then((post) => {
      if (newPost.imageUrl)
        this.postImagesRef.child(post.key).set(postImgDataUrl);
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
    const { user } = this.props.auth;
    const { postText, postImgDataUrl, avatar } = this.state;

    return (
      <div className="container">
        <AuthNav
          showSearch={true}
          hello="hello"
          avatar={avatar}
          notificationsRef={app.database().ref('notifications')} />

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