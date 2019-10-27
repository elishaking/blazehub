//@ts-check
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faComments, faThumbsUp, faBookmark } from '@fortawesome/free-solid-svg-icons';

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
      isBookmarked: false
    };
  }

  componentDidMount() {
    // this.props.postRef.on('value', (updatedPostSnapShot) => {
    //   this.setState({
    //     post: updatedPostSnapShot.val()
    //   });
    // });
    const { bookmarkRef, postRef } = this.props;

    bookmarkRef.once("value", (bookmarkSnapShot) => {
      if (bookmarkSnapShot.exists()) {
        this.setState({ isBookmarked: bookmarkSnapShot.val() });
      }
    });

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
    const { post, showComments, transitionStyle, isBookmarked } = this.state;
    return (
      <div className="post" style={transitionStyle}>
        <header>
          <FontAwesomeIcon icon={faUserCircle} />
          <div>
            <h4>{`${post.user.firstName}  ${post.user.lastName}`}</h4>
            <small>{new Date(post.date).toLocaleTimeString()}</small>
          </div>
        </header>

        <p>{post.text}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="" srcSet="" />
        )}

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
          <button style={{ marginRight: 0, color: isBookmarked ? "#7C62A9" : "#b1a3e1" }} className="post-action" onClick={this.toggleBookmarkPost}>
            <FontAwesomeIcon icon={faBookmark} />
          </button>
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
