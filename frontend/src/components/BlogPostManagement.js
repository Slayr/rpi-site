import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagementTable.css';

function BlogPostManagement({ onEditPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        };
        await axios.delete(`/api/blog/${id}`, config);
        fetchPosts(); // Refresh the list
      } catch (err) {
        console.error(err);
        setError('Failed to delete blog post.');
      }
    }
  };

  if (loading) {
    return <div>Loading blog posts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="blog-management-list">
      <h2>Existing Blog Posts</h2>
      {posts.length === 0 ? (
        <p>No blog posts found.</p>
      ) : (
        <table className="management-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{new Date(post.date * 1000).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => onEditPost(post)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(post.id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BlogPostManagement;