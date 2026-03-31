import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { poetryAPI } from '../utils/api';
import PoetryCard from '../components/PoetryCard';

const CARD_STYLES = [
  { color: 'from-indigo-400 to-indigo-600', icon: '💔' },
  { color: 'from-blue-400 to-blue-600', icon: '💙' },
  { color: 'from-pink-400 to-pink-600', icon: '💕' },
  { color: 'from-purple-400 to-purple-600', icon: '💜' },

  { color: 'from-indigo-400 to-indigo-600', icon: '👤' },
  { color: 'from-indigo-400 to-indigo-600', icon: '✨' },
  { color: 'from-indigo-400 to-indigo-600', icon: '😔' },
  
];

const CategoryPoetry = () => {
  const { slug } = useParams();
  const [poetry, setPoetry] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryMeta = useMemo(
    () => categories.find((c) => c.slug === slug),
    [categories, slug]
  );

  const accent = useMemo(() => {
    const idx = Math.max(
      0,
      categories.findIndex((c) => c.slug === slug)
    );
    return CARD_STYLES[idx % CARD_STYLES.length];
  }, [categories, slug]);

  useEffect(() => {
    let cancelled = false;
    const loadMeta = async () => {
      try {
        const res = await poetryAPI.getCategories();
        if (!cancelled) setCategories(res.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadMeta();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const fetchPoetry = async () => {
      try {
        setLoading(true);
        const response = await poetryAPI.getByCategory(slug);
        if (!cancelled) {
          setPoetry(response.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              'Failed to load poetry. Please try again later.'
          );
          setPoetry([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchPoetry();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleLikeUpdate = (poemId, newLikes) => {
    setPoetry((prev) =>
      prev.map((p) => (p._id === poemId ? { ...p, likes: newLikes } : p))
    );
  };

  const title = categoryMeta?.name || slug?.replace(/-/g, ' ') || 'Poetry';

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
        <div className="text-5xl mb-4">{accent.icon}</div>
        <h1 className="text-5xl md:text-6xl font-poetry font-bold text-gray-800 mb-4">
          {title}
        </h1>
        {/* <p className="text-xl text-gray-600 font-elegant">Words that speak to the heart</p> */}
      </div>

      {poetry.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            No poetry in this category yet. Check back soon!
          </p>
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

export default CategoryPoetry;
