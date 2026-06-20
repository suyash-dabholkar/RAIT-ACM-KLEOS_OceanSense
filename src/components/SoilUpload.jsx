import { useState, useRef } from 'react';

function SoilUpload({ t, district, onResult, onSkip }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // Validate type
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(selected.type)) {
      setError('Please upload a PDF, JPG, or PNG file');
      return;
    }

    setFile(selected);
    setError('');

    // Show preview for images
    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:8000/api/parse-soil-report', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to parse soil report');
      }

      const soilData = await res.json();
      onResult(soilData);
    } catch (err) {
      console.error(err);
      setError('Could not parse the report. Try a clearer image or enter values manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      const fakeEvent = { target: { files: [dropped] } };
      handleFile(fakeEvent);
    }
  };

  return (
    <div className="soil-upload">
      <h2>📄 {t?.soilUploadTitle || 'Upload Soil Health Card'}</h2>
      <p className="soil-subtitle">
        {t?.soilUploadDesc || `Get personalized crop recommendations for ${district} based on your actual soil data`}
      </p>

      {/* Upload Area */}
      <div
        className="upload-zone"
        onClick={() => fileRef.current.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <img src={preview} alt="Soil report preview" className="upload-preview" />
        ) : file ? (
          <div className="file-info">
            <span className="file-icon">📄</span>
            <span className="file-name">{file.name}</span>
          </div>
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon">📤</span>
            <p>{t?.dropFile || 'Tap to select or drag & drop'}</p>
            <p className="upload-formats">PDF, JPG, PNG</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFile}
          hidden
        />
      </div>

      {error && <p className="upload-error">⚠️ {error}</p>}

      {/* Action Buttons */}
      <div className="soil-actions">
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? (
            <span className="spinner">⏳ {t?.analyzing || 'Analyzing soil...'}</span>
          ) : (
            `🔍 ${t?.analyzeSoil || 'Analyze Soil Report'}`
          )}
        </button>

        <button className="skip-btn" onClick={onSkip}>
          {t?.skipSoil || 'Skip — use general soil data'}
        </button>
      </div>

      <p className="soil-note">
        {t?.soilNote || "Don't have a soil card? You can get one free from your nearest Krishi Vigyan Kendra."}
      </p>
    </div>
  );
}

export default SoilUpload;
