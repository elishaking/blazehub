//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUser } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';
import AuthNav from '../nav/AuthNav';
import MainNav from '../nav/MainNav';
import './Profile.scss';
import Post from '../Post';
import Spinner from '../Spinner';
import { TextFormInput, TextAreaFormInput } from '../form/TextFormInput';

class Profile extends Component {
  updateCover = false;

  constructor(props) {
    super(props);

    const { user } = this.props.auth;

    this.state = {
      avatar: '',
      coverPhoto: '',
      posts: [],
      loadingPosts: true,

      name: `${user.firstName} ${user.lastName}`,
      bio: '',
      errors: {},
    }
  }

  componentDidMount() {
    // this.loadData();
  }

  loadData = () => {
    const { user } = this.props.auth;

    this.postsRef = app.database().ref('posts');
    this.postImagesRef = app.database().ref('post-images');
    this.bookmarksRef = app.database().ref("bookmarks").child(user.id);

    this.postsRef.orderByChild('user/id')
      .equalTo(user.id).once("value", (postsSnapShot) => {
        const posts = postsSnapShot.val();

        this.setState({
          posts: Object.keys(posts).map((_, i, postKeys) => {
            const postKey = postKeys[postKeys.length - i - 1];
            const newPost = {
              key: postKey,
              ...posts[postKey]
            };
            // set date
            newPost.date = 1e+15 - newPost.date;

            if (this.state.loadingPosts) this.setState({ loadingPosts: false });

            return newPost;
          })
        })
      });
  }

  selectCoverPhoto = () => {
    this.updateCover = true;
    document.getElementById("img-input").click();
  };

  selectAvatar = () => {
    this.updateCover = false;
    document.getElementById("img-input").click();
  };


  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  updatePic = (e) => {
    const imgInput = e.target;
    if (imgInput.files && imgInput.files[0]) {
      const imgReader = new FileReader();
      const key = this.updateCover ? "coverPhoto" : "avatar"

      imgReader.onload = (e) => {
        if (imgInput.files[0].size > 100000)
          this.resizeImage(e.target.result.toString(), imgInput.files[0].type).then((dataUrl) => {
            this.setState({ [key]: dataUrl });
          });

        else this.setState({ [key]: e.target.result });
      };

      imgReader.readAsDataURL(imgInput.files[0]);
    }
  };

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  updateAvatar = (e) => {
  };

  /**
   * @param {string} dataUrl
   * @param {string} type
   */
  resizeImage = (dataUrl, type) => {
    const img = document.createElement("img");
    img.src = dataUrl;
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // console.log(img.height);
        const canvas = document.createElement('canvas');
        const max = img.height > img.width ? img.height : img.width;
        if (max > 1000) {
          canvas.height = (img.height / max) * 1000;
          canvas.width = (img.width / max) * 1000;

          const context = canvas.getContext('2d');
          context.scale(1000 / max, 1000 / max);
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

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  editProfile = () => {

  };

  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;
    const { avatar, coverPhoto, posts, loadingPosts, name, errors } = this.state;

    return (
      <div className="container">
        <AuthNav showSearch={true} history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          <div className="profile">
            <div className="pics">
              <div className="cover main">
                <input accept="image/*" type="file" name="img-input" id="img-input" onChange={this.updatePic} />
                {coverPhoto ? (
                  <div className="cover-img main">
                    <img src={coverPhoto} alt="Cover Photo" />
                  </div>
                ) : (
                    <div className="cover-placeholder">
                    </div>
                  )}
                <button onClick={this.selectCoverPhoto}>
                  <div>
                    <FontAwesomeIcon icon={faCamera} />
                    <span>Update Cover Photo</span>
                  </div>
                </button>
              </div>
              <div className="avatar">
                <div className="avatar-container main">
                  {avatar ? (
                    <div className="avatar-img main">
                      <img src={avatar} alt="Profile Picture" />
                    </div>
                  ) : (
                      <div className="avatar-placeholder"></div>
                    )}

                  <div className="btn-container">
                    <button onClick={this.selectAvatar}>
                      <FontAwesomeIcon icon={faCamera} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-content">
              <div className="user-posts">
                {
                  loadingPosts ? (
                    <div className="loading-container"><Spinner /></div>
                  ) : posts.map((post) => (
                    <Post
                      key={post.key}
                      postRef={this.postsRef.child(post.key)}
                      postImageRef={this.postImagesRef.child(post.key)}
                      bookmarkRef={this.bookmarksRef.child(post.key)}
                      notificationsRef={app.database().ref('notifications')}
                      post={post}
                      user={user}
                      canBookmark={true} />
                  ))
                }
              </div>

              <div className="user-data">
                <h3>
                  <FontAwesomeIcon icon={faUser} />
                  <span>{`${user.firstName} ${user.lastName}`}</span>
                </h3>
                <button className="btn" onClick={this.editProfile}>Edit Profile</button>
              </div>
            </div>
          </div>
        </div>

        <div className="edit-profile">
          <div className="inner-content">
            <div className="modal">
              <form>
                <label htmlFor="name">Name</label>
                <TextFormInput
                  name="name"
                  placeholder="name"
                  type="text"
                  value={name}
                  onChange={this.onChange}
                  error={errors.name}
                />

                <label htmlFor="name">Bio</label>
                <TextAreaFormInput
                  name="bio"
                  placeholder="bio"
                  onChange={this.onChange}
                  error={errors.bio}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Profile);
