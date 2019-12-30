import React from 'react';

export default function Avatar({ avatar }) {
  return (
    <img
      src={avatar}
      alt="profile picture"
      style={{
        width: "37px",
        height: "37px",
        objectFit: "cover",
        border: "1px solid #a491c3",
        borderRadius: "100px"
      }}
    />
  )
}
