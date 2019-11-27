//@ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import app from 'firebase/app';
import 'firebase/database';
import AuthNav from '../nav/AuthNav';
import MainNav from '../nav/MainNav';
import './Profile.scss';

class Profile extends Component {
  state = {
    avatar: '',
    coverPhoto: '',
  }

  updateCover = false;

  componentDidMount() {

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
          this.resizeImage(e.target.result, imgInput.files[0].type).then((dataUrl) => {
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

  render() {
    const hasProfilePic = false;
    const { user } = this.props.auth;
    const { avatar, coverPhoto } = this.state;

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
