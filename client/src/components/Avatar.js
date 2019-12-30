import React from 'react';

export default function Avatar({ avatar }) {
  return (
    <img
      src={avatar}
      alt="profile picture"
      style={{
        width: "40px",
        height: "40px",
        objectFit: "cover",
        border: "1px solid #a491c3",
        borderRadius: "100px",
        marginRight: "1em"
      }}
    />
  )
}