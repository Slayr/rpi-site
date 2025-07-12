import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Form.css';

function BlogEditor({ postToEdit, onSaveSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [postToEdit]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      const res = await axios.post('/api/photos/upload', formData, config);
      return res.data.photo.filepath; // Get the filename
    } catch (err) {
      console.error('Upload failed:', err);
      throw new Error('Image upload failed');
    }
  };

  const insertText = (text) => {
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    setContent(newContent);
    // Move cursor to after the inserted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const handleFileAction = async (file) => {
    if (!file.type.startsWith('image/')) return;

    setUploading(true);
    setError(null);
    try {
      const filename = await uploadFile(file);
      const markdownLink = `
![${file.name}](http://localhost:5000/uploads/${filename})
`;
      insertText(markdownLink);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          handleFileAction(file);
          break;
        }
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileAction(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow drop
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
    };

    try {
      if (postToEdit) {
        await axios.put(`/api/blog/${postToEdit.id}`, { title, content }, config);
      } else {
        await axios.post('/api/blog', { title, content }, config);
      }
      onSaveSuccess();
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{postToEdit ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content:</label>
        <textarea
          ref={contentRef}
          id="content"
          value={content}
          onChange={handleContentChange}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          rows="15"
          placeholder="Write your post... Drag or paste images here."
          required
        ></textarea>
        {uploading && <p className="upload-status">Uploading image...</p>}
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={loading || uploading}>
        {loading ? 'Saving...' : 'Save Post'}
      </button>
    </form>
  );
}

export default BlogEditor;
