import React from 'react';
import './Loader.css';

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <div className="medical-scan-animation">
          <div className="scan-area">
            <div className="lung-icon">🫁</div>
            <div className="scan-line"></div>
          </div>
        </div>
        <div className="progress-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <p className="loader-title">Analyzing X-Ray</p>
        <p className="loader-subtitle">AI model processing your image...</p>
      </div>
    </div>
  );
}

export default Loader;
