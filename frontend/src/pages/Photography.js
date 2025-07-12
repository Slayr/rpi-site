import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhotoModal from '../components/PhotoModal';
import Masonry from '../components/Masonry'; // Import Masonry
import { gsap } from 'gsap';
import './Photography.css';

function Photography() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get('/api/photos');
        setPhotos(res.data);
        console.log('Fetched photos:', res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch photos.');
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        '.photography-page h1',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [loading]);

  const openModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  // Map photos to Masonry items format
  const masonryItems = photos.map(photo => ({
    id: photo.id,
    img: `http://localhost:5000/uploads/${photo.filepath}`,
    url: '#',
    originalWidth: photo.metadata.width, // Pass original width
    originalHeight: photo.metadata.height, // Pass original height
    originalPhoto: photo
  }));

  console.log('Masonry items:', masonryItems);

  if (loading) {
    return <div className="photography-page">Loading photography portfolio...</div>;
  }

  if (error) {
    return <div className="photography-page error-message">{error}</div>;
  }

  return (
    <div className="photography-page">
      <h1>My Photography Portfolio</h1>
      {photos.length > 0 ? (
        <Masonry
          items={masonryItems}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
          onItemClick={openModal}
        />
      ) : (
        <p>No photos yet. Check back soon!</p>
      )}

      {selectedPhoto && (
        <PhotoModal photo={selectedPhoto} onClose={closeModal} />
      )}
    </div>
  );
}

export default Photography;
