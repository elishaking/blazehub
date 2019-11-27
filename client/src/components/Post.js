//@ts-check
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faComments, faThumbsUp, faBookmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from './Spinner';

export default class Post extends Component {
  beforeMountStyle = {
    opacity: 0,
    transform: "scale(0.7)",
    transition: "0.3s ease-in-out"
  };

  mountStyle = {
    opacity: 1,
    transform: "scale(1)",
    transition: "0.3s ease-in-out"
  };

  constructor(props) {
    super(props);

    this.state = {
      post: {
        ...this.props.post
      },
      showComments: false,
      commentText: '',
      transitionStyle: this.beforeMountStyle,
      isBookmarked: false,
      loadingImage: this.props.post.imageUrl,
      postImage: ''
    };
  }

  componentDidMount() {
    // this.props.postRef.on('value', (updatedPostSnapShot) => {
    //   this.setState({
    //     post: updatedPostSnapShot.val()
    //   });
    // });
    const { bookmarkRef, postRef, postImageRef } = this.props;

    if (this.state.loadingImage) {
      postImageRef.once("value", (postImageSnapShot) => {
        // compress images in database
        // this.resizeImage(postImageSnapShot.val(), this.base64MimeType(postImageSnapShot.val()) || "image/png")
        //   .then((dataUrl) => {
        //     postImageRef.set(dataUrl).then(() => {
        //       this.setState({ postImage: dataUrl, loadingImage: false });
        //     })
        //   });

        this.setState({ postImage: postImageSnapShot.val(), loadingImage: false });
      });
    }

    if (this.props.canBookmark) {
      bookmarkRef.once("value", (bookmarkSnapShot) => {
        if (bookmarkSnapShot.exists()) {
          this.setState({ isBookmarked: bookmarkSnapShot.val() });
        }
      });
    }

    postRef.child('likes').on('value', (updatedLikesSnapShot) => {
      const { post } = this.state;
      post.likes = updatedLikesSnapShot.val();
      this.setState({
        post
      });
      setTimeout(() => {
        this.setState({
          transitionStyle: this.mountStyle
        });
      })
    });

    postRef.child('comments').on('child_added', (newCommentSnapShot) => {
      const { post } = this.state;
      post.comments = {
        [newCommentSnapShot.key]: newCommentSnapShot.val(),
        ...post.comments
      };
      this.setState({
        post
      });
    });
  }

  deletePost = (key) => {
    this.props.postRef.remove((err) => {
      if (err) console.log(err.message)
    });
  };

  likePost = () => {
    const { postRef, user } = this.props;
    if (this.state.post.likes && this.state.post.likes[user.firstName]) {
      postRef.child('likes').child(user.firstName).remove();
    } else {
      postRef.child('likes').update({
        [user.firstName]: 1  //todo: change to user_id
      });
    }
  };

  toggleComments = () => {
    this.setState({
      showComments: !this.state.showComments
    });
  };

  /** @param {React.KeyboardEvent<HTMLInputElement>} event */
  addComment = (event) => {
    if (event.which == 13 && this.state.commentText !== '') {
      let { commentText } = this.state;
      const { user } = this.props;
      const newComment = {
        text: commentText,
        date: Date.now(),
        user: user
      };
      commentText = '';
      // @ts-ignore
      event.target.value = '';
      this.props.postRef.child('comments').push(newComment, (err) => {
        if (err) return console.error(err);
        else console.log("comment added");
      });
    }
  }

  toggleBookmarkPost = () => {
    const { bookmarkRef } = this.props;
    bookmarkRef.once("value", (bookmarkSnapShot) => {
      if (bookmarkSnapShot.exists()) {
        bookmarkRef.set(!bookmarkSnapShot.val(), (err) => {
          if (err) console.log(err);
          else this.setState({ isBookmarked: !this.state.isBookmarked });
        });
      } else {
        bookmarkRef.set(true, (err) => {
          if (err) console.log(err);
          else this.setState({ isBookmarked: !this.state.isBookmarked });
        });
      }
    });
  };

  /** @param {React.ChangeEvent<HTMLInputElement>} event */
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    const { post, loadingImage, postImage, showComments, transitionStyle, isBookmarked } = this.state;
    return (
      <div className="post" style={transitionStyle}>
        <header>
          <div className="user-post">
            <FontAwesomeIcon icon={faUserCircle} />
            <div>
              <h4>{`${post.user.firstName}  ${post.user.lastName}`}</h4>
              <small>{new Date(post.date).toLocaleTimeString()}</small>
            </div>
          </div>

          {
            post.user.email == this.props.user.email && (
              <div className="delete-post" onClick={() => { this.deletePost(post.key) }}>
                <FontAwesomeIcon icon={faTrash} />
              </div>
            )
          }
        </header>

        <p>{post.text}</p>
        {/* {post.imageUrl && (
          <div className="post-image">
            <img src={post.imageUrl} alt="" srcSet="" />
          </div>
        )} */}
        {
          post.imageUrl && (loadingImage ? (
            <div className="image-loading">
              <Spinner />
            </div>
          ) : (
              <div className="post-image">
                <img src={postImage} alt="" srcSet="" />
              </div>
            ))
        }

        <hr />

        <div className="post-actions">
          <div>
            <button className="post-action" onClick={this.likePost}>
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>{post.likes ? Object.keys(post.likes).length : 0}</span>
            </button>
            <button className="post-action" onClick={this.toggleComments}>
              <FontAwesomeIcon icon={faComments} />
              <span>{post.comments ? Object.keys(post.comments).length : 0}</span>
            </button>
          </div>
          {/* <button className="post-action">
            <FontAwesomeIcon icon={faShare} />
            <span>{post.shares ? Object.keys(post.shares).length : 0}</span>
          </button> */}
          {
            this.props.canBookmark && <button style={{ marginRight: 0, color: isBookmarked ? "#7C62A9" : "#b1a3e1" }} className="post-action" onClick={this.toggleBookmarkPost}>
              <FontAwesomeIcon icon={faBookmark} />
            </button>
          }
        </div>

        {
          showComments &&
          (
            <div className="comments">
              <hr />
              <div className="comment-input">
                <FontAwesomeIcon icon={faUserCircle} />
                <input type="text" name="commentText" placeholder="Write a comment" onKeyPress={this.addComment} onChange={this.onChange} />
              </div>

              {
                post.comments && Object.keys(post.comments).map((commentKey) => {
                  const comment = post.comments[commentKey];
                  return (
                    <div key={commentKey} className="comment">
                      <div className="comment-display">
                        <FontAwesomeIcon icon={faUserCircle} />
                        <div>
                          <p><span>{`${comment.user.firstName} ${comment.user.lastName}`}</span> {comment.text}</p>
                          <small>{new Date(comment.date).toLocaleTimeString()}</small>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          )
        }
      </div>

    );
  }
}

// resizeImage = (dataUrl, type) => {
//   const img = document.createElement("img");
//   img.src = dataUrl;
//   return new Promise((resolve, reject) => {
//     img.onload = () => {
//       // console.log(img.height);
//       const canvas = document.createElement('canvas');
//       const max = img.height > img.width ? img.height : img.width;
//       if (max > 1000) {
//         canvas.height = (img.height / max) * 1000;
//         canvas.width = (img.width / max) * 1000;

//         const context = canvas.getContext('2d');
//         context.scale(1000 / max, 1000 / max);
//         context.drawImage(img, 0, 0);
//         // return canvas.toDataURL();
//         resolve(canvas.toDataURL(type, 0.5));
//       } else {
//         // return dataUrl;
//         resolve(dataUrl);
//       }
//     }
//   });
// };

// base64MimeType = (encoded) => {
//   var result = null;

//   if (typeof encoded !== 'string') {
//     return result;
//   }

//   var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

//   if (mime && mime.length) {
//     result = mime[1];
//   }

//   return result;
// }