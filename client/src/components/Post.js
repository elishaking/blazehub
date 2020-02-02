//@ts-check
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faComments, faThumbsUp, faBookmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from './Spinner';
import Avatar from './Avatar';

class Post extends Component {
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
        ...props.post
      },
      showComments: false,
      liked: props.post.likes && props.post.likes[props.user.firstName],
      commentText: '',
      transitionStyle: this.beforeMountStyle,
      isBookmarked: false,
      postUserImage: '',
      loadingImage: props.post.imageUrl,
      postImage: '',
      postTextMaxHeight: '7em',
      postTextOverflows: false,
      viewImage: false
    };
  }

  componentDidMount() {
    // this.props.postRef.on('value', (updatedPostSnapShot) => {
    //   this.setState({
    //     post: updatedPostSnapShot.val()
    //   });
    // });
    const { bookmarkRef, postRef, profilePhotosRef, postImageRef } = this.props;

    // profilesRef.child(this.state.post.user.id).child("username").once("value", (sn) => {
    //   postRef.child("user").child("username").set(sn.val());
    // });

    profilePhotosRef.child(this.state.post.user.id).child("avatar-small")
      .once("value", (postUserImageSnapShot) => {
        this.setState({ postUserImage: postUserImageSnapShot.val() });
      });

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

    this.setPostTextAction();
  }

  setPostTextAction = () => {
    const pText = document.getElementById(this.state.post.key);

    if (pText.clientHeight < pText.scrollHeight) {
      this.setState({
        postTextMaxHeight: '7em',
        postTextOverflows: true
      });
    }
  };

  deletePost = (key) => {
    this.props.postRef.remove((err) => {
      if (err) console.log(err.message)
    });
  };

  likePost = () => {
    const { postRef, user } = this.props;
    const { liked, post } = this.state;
    // if (this.state.post.likes && this.state.post.likes[user.firstName]) {
    if (liked) {
      postRef.child('likes').child(user.firstName).remove((err) => {
        if (err) return console.log(err);

        this.setState({ liked: false });
      });
    } else {
      postRef.child('likes').update({
        [user.firstName]: 1  //todo: change to user_id
      }, (err) => {
        if (err) return console.log(err);

        const newNotification = {
          type: "new_like",
          user: user,
          post: post.key,
          read: false,
          date: 1e+15 - Date.now()
        }
        this.props.notificationsRef.child(post.user.id).push(newNotification, (err) => {
          if (err) return console.log(err);
        });

        this.setState({ liked: true });
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
    if (event.which === 13 && this.state.commentText !== '') {
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

  formatPostDate = (date) => {
    let now = Date.now();
    // date = 1e+15 - date;

    if ((now - date) > 86400000) return new Date(date).toDateString().split(" ").slice(1, 3).join(" ");

    now /= 1000;
    date /= 1000;

    // console.log(date);
    // console.log(now - date);
    // console.log(new Date(now))
    // console.log(new Date(date))

    if ((now - date) > 3600) return `${Math.floor((now - date) / 60 / 60)} hrs ago`;

    if ((now - date) > 60) return `${Math.floor((now - date) / 60)} mins ago`

    return "now";
  };

  viewPostUserProfile = () => {
    const { post } = this.state;

    if (post.user.username)
      this.props.history.push(`/p/${post.user.username}`);
  }

  togglePostImage = () => {
    this.setState({ viewImage: !this.state.viewImage });
  }

  toggleSeeMore = () => {
    this.setState({
      postTextMaxHeight: this.state.postTextMaxHeight ? '' : '7em',
    });
  };

  render() {
    const { post, postTextMaxHeight, postTextOverflows, liked, loadingImage,
      postUserImage, postImage, viewImage, showComments, transitionStyle, isBookmarked } = this.state;
    return (
      <div>
        <div className="post" style={transitionStyle}>
          <header>
            <div className="user-post">
              {
                postUserImage ? (
                  <Avatar
                    avatar={postUserImage}
                    marginRight="0.5em" />
                ) : (<FontAwesomeIcon icon={faUserCircle} />)
              }
              <div>
                {/* {
                post.user.username ? (
                  <Link to={`/p/${post.user.username}`}><h4>{`${post.user.firstName}  ${post.user.lastName}`}</h4></Link>
                ) : (
                    <h4>{`${post.user.firstName}  ${post.user.lastName}`}</h4>
                  )
              } */}
                <h4 onClick={this.viewPostUserProfile}>{`${post.user.firstName}  ${post.user.lastName}`}</h4>

                {/* <small>{new Date(post.date).toLocaleTimeString()}</small> */}
                <small>{this.formatPostDate(post.date)}</small>
              </div>
            </div>

            {
              !this.props.otherUser && post.user.email === this.props.user.email && (
                <div className="delete-post" onClick={() => { this.deletePost(post.key) }}>
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              )
            }
          </header>

          <p id={post.key} style={{
            maxHeight: postTextMaxHeight,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{post.text}</p>
          {
            postTextOverflows && (
              <button className="see-more" onClick={this.toggleSeeMore}>
                {
                  postTextMaxHeight ? 'See more' : 'See less'
                }
              </button>
            )
          }
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
                  <img onClick={this.togglePostImage} src={postImage} alt="Post" srcSet="" />
                </div>
              ))
          }

          <hr />

          <div className="post-actions">
            <div>
              <button className="post-action" onClick={this.likePost}>
                <FontAwesomeIcon icon={faThumbsUp} style={{ color: liked ? "#7c62a9" : "#888888" }} />
                <span style={{ color: liked ? "#7c62a9" : "#888888" }}>{post.likes ? Object.keys(post.likes).length : 0}</span>
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

        {
          viewImage && (
            <div className="modal-container">
              <div className="close" onClick={this.togglePostImage}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 49.243 49.243">
                  <g id="Group_153" data-name="Group 153" transform="translate(-2307.379 -2002.379)">
                    <line id="Line_1" data-name="Line 1" x2="45" y2="45" transform="translate(2309.5 2004.5)" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="7" />
                    <line id="Line_2" data-name="Line 2" x1="45" y2="45" transform="translate(2309.5 2004.5)" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="7" />
                  </g>
                </svg>
              </div>

              <div className="inner-content">
                <div className="modal">
                  <div>
                    <img src={postImage} alt="Post Image" />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <div className="actions">
                  <button className="post-action" onClick={this.likePost}>
                    <FontAwesomeIcon icon={faThumbsUp} style={{ color: liked ? "#7c62a9" : "#888888" }} />
                    <span style={{ color: liked ? "#7c62a9" : "#888888" }}>{post.likes ? Object.keys(post.likes).length : 0}</span>
                  </button>
                  {/* <button className="post-action" onClick={this.toggleComments}>
                  <FontAwesomeIcon icon={faComments} />
                  <span>{post.comments ? Object.keys(post.comments).length : 0}</span>
                </button> */}
                  {
                    this.props.canBookmark && <button style={{ marginRight: 0, color: isBookmarked ? "#7C62A9" : "#b1a3e1" }} className="post-action" onClick={this.toggleBookmarkPost}>
                      <FontAwesomeIcon icon={faBookmark} />
                    </button>
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default withRouter(Post);