//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUser, faBible, faAddressBook, faGlobe, faBaby, faPeopleCarry } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';
import AuthNav from '../nav/AuthNav';
import MainNav from '../nav/MainNav';
import './Profile.scss';
import Post from '../Post';
import Spinner from '../Spinner';
import { TextFormInput, TextAreaFormInput } from '../form/TextFormInput';
import { DateFormInput } from '../form/DateFormInput';
import { getFriends } from '../../redux_actions/friendActions';

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

      loadingProfile: true,
      editProfile: false,
      name: `${user.firstName} ${user.lastName}`,
      bio: '',
      location: '',
      website: '',
      birth: '',
      errors: {},

      loadingFriends: true,
      friends: []
    }
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.friends) {
      const { friends } = this.state;
      const friendKeys = Object.keys(nextProps.friends);
      if (friends.length !== friendKeys.length) {
        this.setState({
          friends: friendKeys.map((friendKey) => ({
            key: friendKey,
            ...nextProps.friends[friendKey]
          }))
        })
      }
    }
  }

  loadData = () => {
    const { user } = this.props.auth;

    this.props.getFriends(user.id);

    this.postsRef = app.database().ref('posts');
    this.postImagesRef = app.database().ref('post-images');
    this.bookmarksRef = app.database().ref("bookmarks").child(user.id);

    this.profileRef = app.database().ref('profiles').child(user.id);

    this.profileRef.once("value", (profileSnapShot) => {
      const profile = profileSnapShot.val() || {
        name: `${user.firstName} ${user.lastName}`,
        bio: '',
        location: '',
        website: '',
        birth: ''
      };

      this.setState({
        loadingProfile: false,
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        birth: profile.birth
      });
    });

    // this.postsRef.orderByChild('user/id')
    //   .equalTo(user.id).once("value", (postsSnapShot) => {
    //     const posts = postsSnapShot.val();

    //     this.setState({
    //       posts: Object.keys(posts).map((_, i, postKeys) => {
    //         const postKey = postKeys[postKeys.length - i - 1];
    //         const newPost = {
    //           key: postKey,
    //           ...posts[postKey]
    //         };
    //         // set date
    //         newPost.date = 1e+15 - newPost.date;

    //         if (this.state.loadingPosts) this.setState({ loadingPosts: false });

    //         return newPost;
    //       })
    //     })
    //   });
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

  toggleEditProfile = () => {
    this.setState({ editProfile: !this.state.editProfile });
  };

  /** @param {React.FormEvent<HTMLFormElement>} e */
  editProfile = (e) => {
    e.preventDefault();
    this.setState({ loadingProfile: true });

    const { name, bio, location, website, birth } = this.state;

    const { isValid, errors } = this.validateInput({ name, bio, location, website, birth });

    // console.log({ isValid, errors });

    this.setState({ errors });

    if (isValid) {
      this.profileRef.update({
        name, bio, location, website, birth
      }, (err) => {
        this.setState({ loadingProfile: false });

        if (err) return console.log(err);

        this.toggleEditProfile();
      });
    } else {
      this.setState({ loadingProfile: false });
    }
  };

  /** @param {{name: string, bio: string, location: string, website: string,  birth: string,}} formData */
  validateInput = (formData) => {
    const errors = {};

    if (formData.name === '')
      errors.name = 'Your name is required';
    else if (formData.name.length < 5 || formData.name.length > 30)
      errors.name = 'Your name should be between 5-30 characters';

    // if (formData.email === '')
    //   errors.email = 'Your email is required';
    // else if (!(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(formData.email)))
    //   errors.email = 'Please enter a valid email';
    // else if (formData.email.length < 5 || formData.email.length > 30)
    //   errors.email = 'Your email should be between 5-30 characters';

    // if (formData.phone.length > 30)
    //   errors.phone = 'Your phone number should be less than 30 characters';
    // else if (formData.phone !== '' && !(new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/).test(formData.phone)))
    //   errors.phone = 'Please enter a valid phone number';


    // if (formData.bio === '')
    //   errors.bio = 'Your project needs a bio';
    if (formData.bio !== '' && (formData.bio.length < 20 || formData.bio.length > 300))
      errors.bio = 'Your bio should be between 20-300 characters';

    if (formData.location.length > 300)
      errors.location = 'Your location should be less than 300 characters';

    if (formData.website.length > 100)
      errors.website = 'Your website should be less than 100 characters';

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  };

  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;
    const { avatar, coverPhoto, posts, loadingPosts, loadingProfile, loadingFriends, friends,
      editProfile, name, bio, location, website, birth, errors } = this.state;

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
                <div className="data-container">
                  <h3>
                    <FontAwesomeIcon icon={faUser} />
                    <span>{name}</span>
                  </h3>
                  {bio !== '' && (
                    <div className="data">
                      <FontAwesomeIcon icon={faBible} />
                      <small>{bio}</small>
                    </div>
                  )}
                  {location !== '' && (
                    <div className="data">
                      <FontAwesomeIcon icon={faAddressBook} />
                      <small>{location}</small>
                    </div>
                  )}
                  {website !== '' && (
                    <div className="data">
                      <FontAwesomeIcon icon={faGlobe} />
                      <small>{website}</small>
                    </div>
                  )}
                  {birth && (
                    <div className="data">
                      <FontAwesomeIcon icon={faBaby} />
                      <small>{birth}</small>
                    </div>
                  )}
                  <button className="btn" onClick={this.toggleEditProfile}>Edit Profile</button>
                </div>

                <div className="data-container">
                  <h3>
                    <FontAwesomeIcon icon={faPeopleCarry} />
                    <span>Friends</span>
                  </h3>

                  {
                    friends.length > 0 && friends.map((friend) => (
                      <div key={friend.key} className="data">
                        <FontAwesomeIcon icon={faUser} />
                        <small>{friend.name}</small>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {
          editProfile && (
            <div className="edit-profile">
              <div className="inner-content">
                <div className="modal">
                  <div className="close" onClick={this.toggleEditProfile}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 49.243 49.243">
                      <g id="Group_153" data-name="Group 153" transform="translate(-2307.379 -2002.379)">
                        <line id="Line_1" data-name="Line 1" x2="45" y2="45" transform="translate(2309.5 2004.5)" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="7" />
                        <line id="Line_2" data-name="Line 2" x1="45" y2="45" transform="translate(2309.5 2004.5)" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="7" />
                      </g>
                    </svg>
                  </div>

                  <form onSubmit={this.editProfile}>
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
                      value={bio}
                      onChange={this.onChange}
                      error={errors.bio}
                    />

                    <label htmlFor="location">Location</label>
                    <TextFormInput
                      name="location"
                      placeholder="location"
                      value={location}
                      type="text"
                      onChange={this.onChange}
                      error={errors.location}
                    />

                    <label htmlFor="website">Website</label>
                    <TextFormInput
                      name="website"
                      placeholder="website"
                      value={website}
                      type="text"
                      onChange={this.onChange}
                      error={errors.website}
                    />

                    <label htmlFor="birth">Birth Date</label>
                    <DateFormInput
                      name="birth"
                      placeholder="birth"
                      value={birth}
                      onChange={this.onChange}
                      error={errors.birth}
                    />

                    {
                      loadingProfile ? (<Spinner />) : (<input type="submit" value="Save" className="btn" />)
                    }
                  </form>
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  friends: state.friends
});

export default connect(mapStateToProps, { getFriends })(Profile);
