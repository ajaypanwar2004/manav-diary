import { useState } from 'react';
import { poetryAPI, commentAPI } from '../utils/api';

const PoetryCard = ({ poem, onLikeUpdate }) => {
  const [liked, setLiked] = useState(() => {
    const savedLikes = localStorage.getItem('likedPoems');
    return savedLikes ? JSON.parse(savedLikes).includes(poem._id) : false;
  });
  const [likes, setLikes] = useState(poem.likes || 0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLike = async () => {
    if (liked) return;

    try {
      const response = await poetryAPI.likePoetry(poem._id);
      setLiked(true);
      setLikes(response.data.likes);
      
      // Save to localStorage
      const savedLikes = localStorage.getItem('likedPoems');
      const likedSet = savedLikes ? new Set(JSON.parse(savedLikes)) : new Set();
      likedSet.add(poem._id);
      localStorage.setItem('likedPoems', JSON.stringify([...likedSet]));
      
      if (onLikeUpdate) {
        onLikeUpdate(poem._id, response.data.likes);
      }
    } catch (err) {
      console.error('Failed to like poetry:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.target);
    const text = formData.get('comment');
    const author = formData.get('author') || 'Anonymous';

    if (!text.trim()) {
      setSubmitting(false);
      return;
    }

    try {
      await commentAPI.addComment({
        poetryId: poem._id,
        text: text.trim(),
        author: author.trim()
      });
      
      e.target.reset();
      setShowCommentForm(false);
      alert('Comment submitted! It will be reviewed by admin.');
    } catch (err) {
      console.error('Failed to submit comment:', err);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h2 className="text-2xl font-poetry font-bold text-gray-800 mb-3">
        {poem.title}
      </h2>
      <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line font-elegant mb-4">
        {poem.content}
      </div>
      
      {/* Like and Comment Section */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              liked
                ? 'text-red-500 bg-red-50 cursor-not-allowed'
                : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm font-medium">{likes}</span>
          </button>
          
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">Comment</span>
          </button>
        </div>
        
        {/* Comment Form */}
        {showCommentForm && (
          <form onSubmit={handleCommentSubmit} className="mt-3 pt-3 border-t">
            <input
              type="text"
              name="author"
              placeholder="Your name (optional)"
              className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <textarea
              name="comment"
              rows="2"
              placeholder="Write a comment..."
              required
              className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        
        <div className="text-sm text-gray-500 mt-2">
          {new Date(poem.date || poem.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};

export default PoetryCard;





