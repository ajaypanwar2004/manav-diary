import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [allPoetry, setAllPoetry] = useState([]);
  const [pendingPoetry, setPendingPoetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'
  const [showForm, setShowForm] = useState(false);
  const [editingPoem, setEditingPoem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'sad',
    date: new Date().toISOString().split('T')[0],
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewingComments, setViewingComments] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate, sortBy, sortOrder, filterCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allRes, pendingRes] = await Promise.all([
        adminAPI.getAllPoetry({ sortBy, order: sortOrder, category: filterCategory }),
        adminAPI.getPendingPoetry()
      ]);
      setAllPoetry(allRes.data);
      setPendingPoetry(pendingRes.data);
    } catch (err) {
      setError('Failed to load poetry.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingPoem) {
        await adminAPI.editPoetry(editingPoem._id, formData);
        setSuccess('Poetry updated successfully!');
      } else {
        await adminAPI.addPoetry(formData);
        setSuccess('Poetry added successfully!');
      }
      
      resetForm();
      fetchData();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save poetry.');
    }
  };

  const handleEdit = (poem) => {
    setEditingPoem(poem);
    setFormData({
      title: poem.title,
      content: poem.content,
      category: poem.category,
      date: poem.date ? new Date(poem.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this poetry? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deletePoetry(id);
      setSuccess('Poetry deleted successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete poetry.');
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approvePoetry(id);
      setSuccess('Poetry approved successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to approve poetry.');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this poetry?')) {
      return;
    }

    try {
      await adminAPI.rejectPoetry(id);
      setSuccess('Poetry rejected successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to reject poetry.');
    }
  };

  const handleViewComments = async (poetryId) => {
    try {
      const response = await adminAPI.getComments(poetryId);
      setComments(response.data);
      setViewingComments(poetryId);
    } catch (err) {
      setError('Failed to load comments.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await adminAPI.deleteComment(commentId);
      setSuccess('Comment deleted successfully!');
      if (viewingComments) {
        handleViewComments(viewingComments);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete comment.');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPoem(null);
    setFormData({
      title: '',
      content: '',
      category: 'sad',
      date: new Date().toISOString().split('T')[0],
    });
    setError('');
  };

  const categories = [
    { value: 'sad', label: 'Sad Poetry' },
    { value: 'romantic', label: 'Romantic Poetry' },
    { value: 'broken', label: 'Broken Poetry' },
    { value: 'mother', label: 'Mother Poetry' },
    { value: 'love', label: 'Love Poetry' },
  ];

  const getStatusBadge = (poem) => {
    if (poem.approved || poem.status === 'approved') {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Approved</span>;
    } else if (poem.status === 'rejected') {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Rejected</span>;
    } else {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Pending</span>;
    }
  };

  const displayPoetry = activeTab === 'all' ? allPoetry : pendingPoetry;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-poetry font-bold mb-2">Admin Dashboard</h1>
            <p className="text-purple-100 font-elegant">Manage your poetry collection</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              + Add New Poetry
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 animate-slide-up shadow-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4 animate-slide-up shadow-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{success}</span>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 mb-8 animate-slide-up border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-poetry font-bold text-gray-800">
              {editingPoem ? 'Edit Poetry' : 'Add New Poetry'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter poetry title"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Poetry Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="12"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none font-elegant"
                placeholder="Write your poetry here..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {editingPoem ? 'Update Poetry' : 'Publish Poetry'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'all'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Poetry ({allPoetry.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 relative ${
            activeTab === 'pending'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending Poetry
          {pendingPoetry.length > 0 && (
            <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingPoetry.length}
            </span>
          )}
        </button>
      </div>

      {/* Filters and Sort (only for All Poetry) */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="date">Date</option>
              <option value="category">Category</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Poetry List */}
      {displayPoetry.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow border border-gray-100">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg font-elegant">
            {activeTab === 'pending' ? 'No pending poetry. All caught up!' : 'No poetry found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayPoetry.map((poem) => (
            <div
              key={poem._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-2xl font-poetry font-bold text-gray-800 mb-2">
                        {poem.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                          {poem.category.charAt(0).toUpperCase() + poem.category.slice(1)}
                        </span>
                        {getStatusBadge(poem)}
                        <span className="text-sm text-gray-500">
                          {new Date(poem.date || poem.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {poem.likes > 0 && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            {poem.likes} likes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line font-elegant mb-4 line-clamp-3">
                    {poem.content}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 md:flex-col">
                  {activeTab === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(poem._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(poem._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(poem)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewComments(poem._id)}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Comments
                      </button>
                      <button
                        onClick={() => handleDelete(poem._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              {viewingComments === poem._id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800">Comments ({comments.length})</h4>
                    <button
                      onClick={() => {
                        setViewingComments(null);
                        setComments([]);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {comments.length === 0 ? (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 mb-1">{comment.author}</p>
                              <p className="text-gray-700 text-sm">{comment.text}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-500 hover:text-red-700 ml-4"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
