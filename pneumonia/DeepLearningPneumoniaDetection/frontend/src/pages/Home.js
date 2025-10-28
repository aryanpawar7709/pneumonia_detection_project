import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="home-container">
        <div className="hero-section">
          <h1 className="hero-title">
            Pneumonia Detection {" "}
            <span className="gradient-text"> with AI </span>
          </h1>
          <p className="hero-subtitle">
            Advanced deep learning system for accurate pneumonia diagnosis from chest X-ray images
          </p>
          <Link to="/detection" className="cta-button">
            Start Detection
            <span className="arrow">→</span>
          </Link>
        </div>

        <div className="features-section">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📤</div>
              <h3>Upload X-Ray</h3>
              <p>Upload a chest X-ray image in JPEG, JPG, or PNG format</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI Analysis</h3>
              <p>Our ensemble model analyzes the image using ResNet50 and DenseNet121</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Get Results</h3>
              <p>Receive instant diagnosis with confidence score</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2 className="section-title">About the Technology</h2>
          <div className="info-content">
            <div className="info-card">
              <h3>🎯 Accuracy</h3>
              <p>
                Our ensemble deep learning model combines multiple state-of-the-art 
                CNN architectures to achieve high accuracy in pneumonia detection.
              </p>
            </div>
            <div className="info-card">
              <h3>⚡ Fast Processing</h3>
              <p>
                Get results in seconds. Our optimized pipeline processes images 
                quickly without compromising on accuracy.
              </p>
            </div>
            <div className="info-card">
              <h3>🔬 Research-Based</h3>
              <p>
                Trained on the Kaggle Chest X-Ray Pneumonia dataset with thousands 
                of validated medical images.
              </p>
            </div>
            <div className="info-card">
              <h3>📚 Educational Purpose</h3>
              <p>
                This tool is designed for educational and research purposes. 
                Always consult healthcare professionals for medical diagnosis.
              </p>
            </div>
          </div>
        </div>

        <div className="disclaimer">
          <p>
            <strong>Disclaimer:</strong> This application is for educational purposes only. 
            It is not intended to replace professional medical diagnosis. Always consult 
            with qualified healthcare providers for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
