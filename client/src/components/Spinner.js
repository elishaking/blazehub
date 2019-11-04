import React from 'react';

export default function Spinner({ full = true, padding = true }) {
  return (
    <div style={{
      display: full ? "block" : "inline-block",
      textAlign: "center",
      padding: padding ? "1em" : "0"
    }}>
      <img src="./assets/img/spinner.gif" alt="" srcSet="" style={{
        maxHeight: "4vh"
      }} />
    </div>
  );
}
