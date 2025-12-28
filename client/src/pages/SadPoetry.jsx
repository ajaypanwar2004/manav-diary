import { useState, useEffect } from 'react';
import { poetryAPI } from '../utils/api';
import PoetryCard from '../components/PoetryCard';

const SadPoetry = () => {
  const [poetry, setPoetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPoetry();
  }, []);

  const fetchPoetry = async () => {
    try {
      setLoading(true);
      const response = await poetryAPI.getByCategory('sad');
      setPoetry(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load poetry. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeUpdate = (poemId, newLikes) => {
    setPoetry(poetry.map(p => 
      p._id === poemId ? { ...p, likes: newLikes } : p
    ));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading poetry...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-poetry font-bold text-gray-800 mb-4">Sad Poetry</h1>
        <p className="text-xl text-gray-600 font-elegant">Words that speak to the heart</p>
      </div>

      {poetry.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No poetry available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poetry.map((poem, index) => (
            <div
              key={poem._id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PoetryCard poem={poem} onLikeUpdate={handleLikeUpdate} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SadPoetry;



