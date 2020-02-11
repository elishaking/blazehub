//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUser, faBible, faAddressBook, faGlobe, faBaby, faPeopleCarry, faImages } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';
import AuthNav from '../nav/AuthNav';
import MainNav from '../nav/MainNav';
import './Profile.scss';
import Spinner from '../Spinner';
import { TextFormInput, TextAreaFormInput } from '../form/TextFormInput';
import { DateFormInput } from '../form/DateFormInput';
import { getFriends } from '../../redux_actions/friendActions';
import { getProfilePic, updateProfilePic } from '../../redux_actions/profileActions';
import Posts from '../Posts';

import { resizeImage } from '../../utils/resizeImage';
import { validateProfileEditInput } from '../../validation/profile';
// import { createProfileForExistingUser, createSmallAvatar } from '../../utils/firebase';

class Profile extends Component {
  updateCover = false;
  otherUser = true;

  constructor(props) {
    super(props);

    this.state = {
      loadingAvatar: true,
      loadingCoverPhoto: true,
      avatar: '',
      coverPhoto: '',

      loadingProfile: true,
      editProfile: false,
      username: '',
      name: '',
      bio: '',
      location: '',
      website: '',
      birth: '',
      errors: {},

      loadingFriends: true,
      friends: [],

      loadingOtherUserId: true,
    }
  }

  componentDidMount() {
    // createSmallAvatar();

    if (this.props.match.params && this.props.match.params.username) {
      this.loadOtherUserProfileData();
    }
    else {
      this.otherUser = false;
      const { user } = this.props.auth;
      this.setState({ name: `${user.firstName} ${user.lastName}` })
      this.loadUserProfileData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.avatar !== this.state.avatar) {
      this.setPic("avatar", nextProps.profile.avatar);
    }

    if (nextProps.profile.coverPhoto !== this.state.coverPhoto) {
      this.setPic("coverPhoto", nextProps.profile.coverPhoto);
    }

    if (nextProps.friends) {
      const { friends } = this.state;
      const friendKeys = Object.keys(nextProps.friends);
      if (friends.length !== friendKeys.length) {
        this.setFriends(friendKeys, nextProps.friends);
      }
    }
  }

  setPic = (key, dataUrl) => {
    key === "avatar" ? this.setState({ avatar: dataUrl, loadingAvatar: false }) : this.setState({ coverPhoto: dataUrl, loadingCoverPhoto: false });
  }

  setFriends = (friendKeys, friends) => {
    this.setState({
      friends: friendKeys.map((friendKey) => ({
        key: friendKey,
        ...friends[friendKey]
      }))
    })
  };

  loadOtherUserFriends = () => {
    app.database().ref('friends')
      .child(this.otherUserId)
      .once("value")
      .then((friendsSnapShot) => {
        if (friendsSnapShot.exists()) {
          const friends = friendsSnapShot.val();
          this.setFriends(Object.keys(friends), friends);
        }
      });
  };

  loadOtherUserProfilePhotos = () => {
    app.database().ref('profile-photos')
      .child(this.otherUserId)
      .once("value")
      .then((photosSnapShot) => {
        const photos = photosSnapShot.exists() ? photosSnapShot.val() : { avatar: '', coverPhoto: '' };
        this.setPic("avatar", photos.avatar);
        this.setPic("coverPhoto", photos.coverPhoto);
      });
  };

  loadOtherUserProfileData = () => {
    app.database().ref('profiles')
      .orderByChild('username')
      .equalTo(this.props.match.params.username)
      .once("value")
      .then((profileSnapShot) => {
        if (!profileSnapShot.exists()) return window.location.href = "/home";

        const profile = profileSnapShot.val();
        this.otherUserId = Object.keys(profile)[0];
        this.setProfile(profile[this.otherUserId]);
        // console.log(profileSnapShot.val())
        this.setState({ loadingOtherUserId: false });

        this.loadOtherUserFriends();

        this.loadOtherUserProfilePhotos();
      });
  };

  loadUserProfileData = () => {
    const { user } = this.props.auth;
    const { friends, profile } = this.props;

    const friendKeys = Object.keys(friends);
    friendKeys.length === 0 ? this.props.getFriends(user.id) : this.setFriends(friendKeys, friends);

    const avatar = profile.avatar;
    avatar ? this.setPic("avatar", avatar) : this.props.getProfilePic(user.id, "avatar");
    const coverPhoto = profile.coverPhoto;
    coverPhoto ? this.setPic("coverPhoto", coverPhoto) : this.props.getProfilePic(user.id, "coverPhoto");

    // createProfileForExistingUser();

    this.profileRef = app.database().ref('profiles').child(user.id);

    this.profileRef.once("value", (profileSnapShot) => {
      this.setProfile(profileSnapShot.val());
    });
  }

  /**
   * @param {{ name: string; username: string; bio: string; location: string; website: string; birth: string; }} profile
   */
  setProfile = (profile) => {
    this.setState({
      loadingProfile: false,
      username: profile.username,
      name: profile.name,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
      birth: profile.birth
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
  processPic = (e) => {
    const imgInput = e.target;
    if (imgInput.files && imgInput.files[0]) {
      const imgReader = new FileReader();
      // const key = this.updateCover ? "coverPhoto" : "avatar";

      imgReader.onload = (e) => {
        if (imgInput.files[0].size > 100000)
          resizeImage(e.target.result.toString(), imgInput.files[0].type).then((dataUrl) => {
            if (this.updateCover) {
              this.updatePic(dataUrl);
            } else {
              resizeImage(e.target.result.toString(), imgInput.files[0].type, 50)
                .then((dataUrlSmall) => {
                  this.updatePic(dataUrl, dataUrlSmall);
                });
            }
          });

        else this.updatePic(e.target.result);
      };

      imgReader.readAsDataURL(imgInput.files[0]);
    }
  };

  updatePic = (dataUrl, dataUrlSmall = "") => {
    if (this.updateCover) {
      this.setState({ loadingCoverPhoto: true });
      this.props.updateProfilePic(this.props.auth.user.id, "coverPhoto", dataUrl);
    } else {
      this.setState({ loadingAvatar: true });
      this.props.updateProfilePic(this.props.auth.user.id, "avatar", dataUrl, dataUrlSmall);
    }
  }

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

    const { isValid, errors } = validateProfileEditInput(
      { name, bio, location, website, birth }
    );

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

  findFriends = () => {
    this.props.history.push("/find");
  }

  render() {
    const { user } = this.props.auth;
    const { loadingAvatar, loadingCoverPhoto, avatar, coverPhoto, loadingProfile, loadingFriends, friends,
      editProfile, username, name, bio, location, website, birth, errors, loadingOtherUserId } = this.state;

    return (
      <div className="container">
        <AuthNav showSearch={true} history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          <div className="profile">
            <div className="pics">
              <div className={`cover main ${loadingCoverPhoto ? "disable" : ""}`}>
                <input accept="image/*" type="file" name="img-input" id="img-input" onChange={this.processPic} />
                {coverPhoto ? (
                  <div className="cover-img main">
                    <img src={coverPhoto} alt="Cover Photo" />
                  </div>
                ) : (
                    <div className={`cover-placeholder ${loadingCoverPhoto ? "loading-pic" : ""}`}>
                    </div>
                  )}
                {
                  !this.otherUser && (
                    <button onClick={this.selectCoverPhoto}>
                      <div>
                        <FontAwesomeIcon icon={faCamera} />
                        <span>Update Cover Photo</span>
                      </div>
                    </button>
                  )
                }
              </div>
              <div className="avatar">
                <div className={`avatar-container main ${loadingAvatar ? "disable" : ""}`}>
                  {avatar ? (
                    <div className="avatar-img main">
                      <img src={avatar} alt="Profile Picture" />
                    </div>
                  ) : (
                      <div className={`avatar-placeholder ${loadingAvatar ? "loading-pic" : ""}`}></div>
                    )}

                  {
                    !this.otherUser && (
                      <div className="btn-container">
                        <button onClick={this.selectAvatar}>
                          <FontAwesomeIcon icon={faCamera} />
                        </button>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>

            <div className="profile-content">
              <div className="user-posts">
                {
                  this.otherUser ?
                    !loadingOtherUserId && (
                      <Posts
                        user={user}
                        forProfile={true}
                        otherUser={this.otherUser}
                        otherUserId={this.otherUserId} />
                    ) : (
                      <Posts
                        user={user}
                        forProfile={true} />
                    )
                }
              </div>

              <div className="user-data">
                <div className="data-container">
                  <h3>
                    <FontAwesomeIcon icon={faUser} />
                    <span>{name}</span>
                  </h3>
                  {bio && (
                    <div className="data">
                      <FontAwesomeIcon icon={faBible} />
                      <small>{bio}</small>
                    </div>
                  )}
                  {location && (
                    <div className="data">
                      <FontAwesomeIcon icon={faAddressBook} />
                      <small>{location}</small>
                    </div>
                  )}
                  {website && (
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
                  {
                    !this.otherUser && <button className="btn" onClick={this.toggleEditProfile}>Edit Profile</button>
                  }
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

                  {
                    !this.otherUser && <button className="btn" onClick={this.findFriends}>Find Friends</button>
                  }
                </div>

                <div className="data-container">
                  <h3>
                    <FontAwesomeIcon icon={faImages} />
                    <span>Photos</span>
                  </h3>

                  {/* {
                    friends.length > 0 && friends.map((friend) => (
                      <div key={friend.key} className="data">
                        <FontAwesomeIcon icon={faUser} />
                        <small>{friend.name}</small>
                      </div>
                    ))
                  } */}

                  {
                    !this.otherUser && <button className="btn">Add Photo</button>
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
                    <label htmlFor="username">Username</label>
                    <TextFormInput
                      name="username"
                      placeholder="username"
                      type="text"
                      value={username}
                      onChange={this.onChange}
                      error={errors.username}
                    />

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
  friends: state.friends,
  profile: state.profile
});

export default connect(mapStateToProps, { getFriends, getProfilePic, updateProfilePic })(Profile);
