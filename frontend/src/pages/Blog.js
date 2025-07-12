import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogPostCard from '../components/BlogPostCard';
import BlogPostModal from '../components/BlogPostModal'; // Import the modal
import { gsap } from 'gsap';
import './Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null); // State for the selected post

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/blog');
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch blog posts.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!loading && posts.length > 0) {
      gsap.fromTo(
        '.blog-page h1, .blog-intro',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.2 }
      );

      gsap.fromTo(
        '.blog-post-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.4 }
      );
    }
  }, [loading, posts]);

  const handleCardClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  if (loading) {
    return <div className="blog-page">Loading blog posts...</div>;
  }

  if (error) {
    return <div className="blog-page error-message">{error}</div>;
  }

  return (
    <>
      <div className="blog-page">
        <h1>My Blog</h1>
        <p className="blog-intro">A collection of thoughts, stories, and ideas.</p>
        <div className="blog-posts-container">
          {posts.length > 0 ? (
            posts.map(post => (
              <BlogPostCard 
                key={post.id} 
                post={post} 
                onClick={() => handleCardClick(post)} // Pass click handler
              />
            ))
          ) : (
            <p>No blog posts yet. Check back soon!</p>
          )}
        </div>
      </div>
      <BlogPostModal post={selectedPost} onClose={handleCloseModal} />
    </>
  );
}

export default Blog;
