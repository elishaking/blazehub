import React from 'react';

export default function Spinner({ full = true }) {
  return (
    <div style={{
      display: full ? "block" : "inline-block",
      textAlign: "center",
      padding: "1em"
    }}>
      <img src="./assets/img/spinner.gif" alt="" srcSet="" style={{
        maxHeight: "4vh"
      }} />
    </div>
  );
}
