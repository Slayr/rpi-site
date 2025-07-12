import React from "react";
import "./BlogPostCard.css";

function BlogPostCard({ post, onClick }) {
  // The entire card is now a clickable button-like element
  return (
    <div
      className="blog-post-card animated-card"
      onClick={onClick}
      role="button"
      tabIndex="0"
    >
      <div className="card-content">
        <h2 className="blog-post-title">{post.title}</h2>
        <p className="blog-post-snippet">{post.content.substring(0, 120)}...</p>
      </div>
    </div>
  );
}

export default BlogPostCard;
