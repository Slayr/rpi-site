import React, { useState } from 'react';
import axios from 'axios';
import './Form.css'; // Generic form styling

function PhotoUploader({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('source', 'portfolio'); // Specify source as portfolio

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      await axios.post('/api/photos/upload', formData, config);
      setSuccess('Photo uploaded and processed successfully!');
      setSelectedFile(null);
      onUploadSuccess(); // Callback to refresh photo list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Upload New Photo</h2>
      <div className="form-group">
        <label htmlFor="photo-file">Select Image File (.tiff, .jpeg, .png, etc.):</label>
        <input
          type="file"
          id="photo-file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Photo'}
      </button>
    </form>
  );
}

export default PhotoUploader;