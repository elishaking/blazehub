import React, { Component } from 'react';
import axios from 'axios';

export default class FindFriends extends Component {
  componentDidMount() {
    axios.get("/api/users").then((res) => {
      console.log(res.data);
    })
  }

  render() {
    return (
      <div className="container">

      </div>
    )
  }
}
