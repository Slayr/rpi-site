import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogPostManagement from '../components/BlogPostManagement';
import PhotoManagement from '../components/PhotoManagement';
import BlogEditor from '../components/BlogEditor';
import PhotoUploader from '../components/PhotoUploader';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './Admin.css';

// Simple icon components for the tabs
const BlogIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const PhotoIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;

function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('blog');
  const [postToEdit, setPostToEdit] = useState(null);
  const [photoRefreshKey, setPhotoRefreshKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { password });
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setPassword('');
    setPostToEdit(null);
  };

  const handleBlogSaveSuccess = () => {
    setPostToEdit(null);
  };

  const handlePhotoUploadSuccess = () => {
    setPhotoRefreshKey(prevKey => prevKey + 1);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-box">
          <h2>Admin Access</h2>
          <p>Enter your password to manage content.</p>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Unlocking...' : 'Login'}
            </button>
            {error && <p className="login-error">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <button
            className={`sidebar-button ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => { setActiveTab('blog'); setPostToEdit(null); }}
          >
            <BlogIcon />
            <span>Manage Blog</span>
          </button>
          <button
            className={`sidebar-button ${activeTab === 'photography' ? 'active' : ''}`}
            onClick={() => setActiveTab('photography')}
          >
            <PhotoIcon />
            <span>Manage Photos</span>
          </button>
        </aside>

        <main className="dashboard-main">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={40} minSize={25}>
              <div className="form-pane">
                {activeTab === 'blog' && <BlogEditor postToEdit={postToEdit} onSaveSuccess={handleBlogSaveSuccess} />}
                {activeTab === 'photography' && <PhotoUploader onUploadSuccess={handlePhotoUploadSuccess} />}
              </div>
            </Panel>
            <PanelResizeHandle className="resize-handle" />
            <Panel minSize={30}>
              <div className="list-pane">
                {activeTab === 'blog' && <BlogPostManagement onEditPost={setPostToEdit} />}
                {activeTab === 'photography' && <PhotoManagement refreshKey={photoRefreshKey} />}
              </div>
            </Panel>
          </PanelGroup>
        </main>
      </div>
    </div>
  );
}

export default Admin;
