//@ts-check
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faComments, faThumbsUp, faShare } from '@fortawesome/free-solid-svg-icons';

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: {
        ...this.props.post
      },
      showComments: false
    };
  }

  componentDidMount() {
    this.props.postRef.on('value', (updatedPostSnapShot) => {
      this.setState({
        post: updatedPostSnapShot.val()
      })
    });
  }

  likePost = () => {
    if (this.state.post.likes[this.props.user.firstName]) {
      this.props.postRef.child('likes').child(this.props.user.firstName).remove();
    } else {
      this.props.postRef.child('likes').update({
        [this.props.user.firstName]: 1
      });
    }
  };

  toggleComments = () => {
    this.setState({
      showComments: !this.state.showComments
    });
  };

  render() {
    const { post, showComments } = this.state;
    return (
      <div className="post">
        <header>
          <FontAwesomeIcon icon={faUserCircle} />
          <div>
            <h4>{`${post.user.firstName}  ${post.user.lastName}`}</h4>
            <small>{new Date(post.date).toTimeString()}</small>
          </div>
        </header>

        <p>{post.text}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="" srcSet="" />
        )}

        <hr />

        <div className="post-actions">
          <button className="post-action" onClick={this.likePost}>
            <FontAwesomeIcon icon={faThumbsUp} />
            <span>{Object.keys(post.likes).length - 1}</span>
          </button>
          <button className="post-action" onClick={this.toggleComments}>
            <FontAwesomeIcon icon={faComments} />
            <span>{Object.keys(post.comments).length - 1}</span>
          </button>
          <button className="post-action">
            <FontAwesomeIcon icon={faShare} />
            <span>{Object.keys(post.shares).length - 1}</span>
          </button>
        </div>

        {
          showComments &&
          (
            <div className="comments">
              <hr />
              <div className="comment-input">
                <FontAwesomeIcon icon={faUserCircle} />
                <input type="text" placeholder="Write a comment" />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}
