import React, { useEffect, useState, useRef } from 'react';
import './PhotoModal.css';

function PhotoModal({ photo, onClose }) {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const contentRef = useRef(null);

  useEffect(() => {
    if (photo) {
      const img = new Image();
      img.src = `/uploads/${photo.filepath}`;
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
    }
  }, [photo]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!photo) return null;

  const { filename, filepath } = photo;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/uploads/${filepath}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate aspect ratio to apply to the modal content
  const aspectRatio = imageDimensions.width / imageDimensions.height;

  return (
    <div className="photo-modal-overlay" onClick={onClose}>
      <div 
        ref={contentRef} 
        className="photo-modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ aspectRatio: aspectRatio > 0 ? `${aspectRatio}` : 'auto' }} // Set aspect ratio dynamically
      >
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <div className="modal-image-container">
          <img src={`http://localhost:5000/uploads/${filepath}`} alt={filename} className="modal-image" />
        </div>

        <div className="modal-footer">
          <p className="modal-filename">{filename}</p>
          <button onClick={handleDownload} className="download-button">Download</button>
        </div>
      </div>
    </div>
  );
}

export default PhotoModal;
