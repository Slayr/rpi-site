import React from 'react';
import './PhotoThumbnail.css'; // Create this CSS file for thumbnail specific styles

function PhotoThumbnail({ photo, onClick }) {
  return (
    <div className="photo-thumbnail" onClick={onClick}>
      <img src={photo.filepath} alt={photo.filename} className="thumbnail-image" />
    </div>
  );
}

export default PhotoThumbnail;
