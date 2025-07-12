// src/components/ScrollButton.jsx

import React from "react";

const ScrollButton = () => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px",
        borderRadius: "50%",
        background: "#007bff",
        color: "white",
        border: "none",
        cursor: "pointer",
      }}
    >
      ↑
    </button>
  );
};

export default ScrollButton;
