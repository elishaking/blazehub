import React from 'react';

export default function Spinner({ full = true, padding = true }) {
  return (
    <div style={{
      display: full ? "block" : "inline-block",
      textAlign: "center",
      padding: padding ? "1em" : "0"
    }}>
      {/* <img src="./assets/img/spinner.gif" alt="" srcSet="" style={{
        maxHeight: "4vh"
      }} /> */}
      <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 595.44 595.44">
        <defs>
          <linearGradient id="linear-gradient" x1="0.646" y1="0.068" x2="0.96" y2="0.811" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor="#7c62a9" />
            <stop offset="1" stopColor="#ede0ff" />
          </linearGradient>
        </defs>
        <g id="Group_1" data-name="Group 1" transform="translate(-202.28 -202.28)">
          <path id="bottom" d="M500,202.28c-164.43,0-297.72,133.29-297.72,297.72S335.57,797.72,500,797.72,797.72,664.43,797.72,500,664.43,202.28,500,202.28Zm0,515.84c-120.47,0-218.12-97.65-218.12-218.12S379.53,281.88,500,281.88,718.12,379.53,718.12,500,620.47,718.12,500,718.12Z" fill="#ede0ff" />
          <path id="top" d="M616.179,684.643a217.145,217.145,0,0,1-118.445,33.465C377.281,716.886,280.087,617.086,281.9,496.641,283.7,377.72,380.652,281.88,500,281.88A217.15,217.15,0,0,1,615.307,314.8a39.943,39.943,0,0,0,51.423-7.543h0a39.789,39.789,0,0,0-8.919-59.762A297.776,297.776,0,0,0,202.284,501.525C203.1,665.253,336.079,797.72,500,797.72a296.268,296.268,0,0,0,158.464-45.63,39.793,39.793,0,0,0,8.825-59.708h0A39.691,39.691,0,0,0,616.179,684.643Z" fill="url(#linear-gradient)" />
        </g>
      </svg>



    </div >
  );
}
