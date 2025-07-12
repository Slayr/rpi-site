import React, { useEffect } from 'react';
import './BlogPostModal.css';

function BlogPostModal({ post, onClose }) {
  // Effect to handle the Escape key press for closing the modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!post) {
    return null;
  }

  // Function to format the date if you decide to add it back later
  const formatDate = (unixTimestamp) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    // Convert seconds to milliseconds
    return new Date(unixTimestamp * 1000).toLocaleDateString(undefined, options);
  };

  return (
    <div className="blog-modal-overlay" onClick={onClose}>
      <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="blog-modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h1 className="blog-modal-title">{post.title}</h1>
        <p className="blog-modal-date">{formatDate(post.date)}</p>
        <div className="blog-modal-body">
          {/* Split content by newlines and render as paragraphs */}
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogPostModal;
