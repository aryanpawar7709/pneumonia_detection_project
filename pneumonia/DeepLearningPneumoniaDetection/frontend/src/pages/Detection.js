import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import './Detection.css';

function Detection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      console.error('Error:', err);
      setError(
        err.response?.data?.error || 
        'Failed to analyze image. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="detection">
      <div className="detection-container">
        <h1 className="page-title">Pneumonia Detection</h1>
        <p className="page-subtitle">Upload a chest X-ray image for analysis</p>

        <div className="upload-section">
          <div className="upload-area">
            <input
              type="file"
              id="file-input"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            {!preview ? (
              <label htmlFor="file-input" className="upload-label">
                <div className="upload-icon">📁</div>
                <p className="upload-text">Click to upload X-ray image</p>
                <p className="upload-hint">Supported: JPEG, JPG, PNG (Max 10MB)</p>
              </label>
            ) : (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="preview-image" />
                <button onClick={handleReset} className="reset-button">
                  ✕ Remove Image
                </button>
              </div>
            )}
          </div>

          {selectedFile && !loading && !result && (
            <button onClick={handleUpload} className="analyze-button">
              🔬 Analyze X-Ray
            </button>
          )}
        </div>

        {loading && <Loader />}

        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
          </div>
        )}

        {result && (
          <div className="result-container">
            <div className={`result-card ${result.result.includes('Pneumonia') ? 'pneumonia' : 'normal'}`}>
              <div className="result-icon">
                {result.result.includes('Pneumonia') ? '🚨' : '✅'}
              </div>
              <h2 className="result-title">{result.result}</h2>
              <div className="confidence-bar">
                <div className="confidence-label">
                  Confidence: {(result.confidence * 100).toFixed(2)}%
                </div>
                <div className="confidence-track">
                  <div 
                    className="confidence-fill"
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
              <button onClick={handleReset} className="new-analysis-button">
                Analyze Another Image
              </button>
            </div>
            <div className="result-disclaimer">
              <strong>Note:</strong> This is an AI-generated result for educational purposes. 
              Please consult a healthcare professional for accurate medical diagnosis.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detection;
