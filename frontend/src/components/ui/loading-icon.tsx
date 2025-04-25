import React from "react";
import PropTypes from "prop-types";

const LoadingIcon = ({ size = 1, className = "" }) => {
  const gradientId = `a12-${
    React.useId ? React.useId() : Math.random().toString(36).substring(7)
  }`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 200 200"
      className={className}
      aria-label="Loading"
      role="img"
      style={{ display: "block", transform: `scale(${size})` }} // Add display: block just in case it's treated as inline with extra space
    >
      <defs>
        <radialGradient
          id={gradientId}
          cx=".66"
          fx=".66"
          cy=".3125"
          fy=".3125"
          gradientTransform="scale(1.5)"
        >
          <stop offset="0" stopColor="#FFFFFF"></stop>
          <stop offset=".3" stopColor="#FFFFFF" stopOpacity=".9"></stop>
          <stop offset=".6" stopColor="#FFFFFF" stopOpacity=".6"></stop>
          <stop offset=".8" stopColor="#FFFFFF" stopOpacity=".3"></stop>
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0"></stop>
        </radialGradient>
      </defs>
      <circle
        fill="none"
        opacity=".2"
        stroke="#FFFFFF"
        strokeWidth="15"
        strokeLinecap="round"
        cx="100"
        cy="100"
        r="70"
      ></circle>
      <circle
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="15"
        strokeLinecap="round"
        strokeDasharray="200 1000"
        strokeDashoffset="0"
        cx="100"
        cy="100"
        r="70"
      >
        <animateTransform
          type="rotate"
          attributeName="transform"
          calcMode="spline"
          dur="2s"
          values="0 100 100;360 100 100" // Rotate around center (100, 100)
          keyTimes="0;1"
          keySplines="0.5 0 0.5 1"
          repeatCount="indefinite"
        ></animateTransform>
      </circle>
    </svg>
  );
};

LoadingIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

export default LoadingIcon;
