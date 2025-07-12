import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhotoModal from './PhotoModal';
import './ManagementTable.css'; // Reusing table styling

function PhotoManagement({ refreshKey }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get('/api/photos');
      setPhotos(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch photos.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [refreshKey]); // Depend on refreshKey

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this photo and its file?')) {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        await axios.delete(`/api/photos/${id}`, config);
        fetchPhotos(); // Refresh the list
      } catch (err) {
        console.error(err);
        setError('Failed to delete photo.');
      }
    }
  };

  const handleRename = async (id) => {
    const newName = prompt('Enter new name for the photo:');
    if (newName) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        await axios.put(`/api/photos/${id}/rename`, { newName }, config);
        fetchPhotos(); // Refresh the list
      } catch (err) {
        console.error(err);
        setError('Failed to rename photo.');
      }
    }
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  if (loading) {
    return <div>Loading photos...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="photo-management-list">
      <h2>Existing Photos</h2>
      {photos.length === 0 ? (
        <p>No photos found.</p>
      ) : (
        <table className="management-table">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Filename</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {photos.map((photo) => (
              <tr key={photo.id}>
                <td>
                  <img src={`http://localhost:5000/uploads/${photo.filepath}`} alt={photo.filename} className="thumbnail-image" />
                </td>
                <td>{photo.filename}</td>
                <td>{new Date(photo.upload_date * 1000).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => openModal(photo)} className="edit-button">View</button>
                  <button onClick={() => handleRename(photo.id)} className="edit-button">Rename</button>
                  <button onClick={() => handleDelete(photo.id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedPhoto && (
        <PhotoModal photo={selectedPhoto} onClose={closeModal} />
      )}
    </div>
  );
}

export default PhotoManagement;