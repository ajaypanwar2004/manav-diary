import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { poetryAPI } from '../utils/api';

const DEFAULT_HERO_LINES = [
  'Udas nazro me khawab milenge',
  'Kabhi kante to kabhi gulab milenge',
  'Meri dil ki kitab ko meri nazro se padhke to dekho',
  'Kahi aapki yaden to kahi sirf aap milenge',
];

const CARD_STYLES = [
  { color: 'from-blue-400 to-blue-600', icon: '💙' },
  { color: 'from-pink-400 to-pink-600', icon: '💕' },
  { color: 'from-gray-400 to-gray-600', icon: '💔' },
  { color: 'from-purple-400 to-purple-600', icon: '💜' },
  { color: 'from-red-400 to-red-600', icon: '❤️' },
  { color: 'from-indigo-400 to-indigo-600', icon: '✨' },
  { color: 'from-teal-400 to-teal-600', icon: '🌿' },
  { color: 'from-rose-400 to-rose-600', icon: '🌸' },
];

const Home = () => {
  const [showHeading, setShowHeading] = useState(false);
  const [showSubheading, setShowSubheading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState('');
  const [heroLines, setHeroLines] = useState(DEFAULT_HERO_LINES);

  useEffect(() => {
    const headingTimer = setTimeout(() => {
      setShowHeading(true);
    }, 300);

    const subheadingTimer = setTimeout(() => {
      setShowSubheading(true);
    }, 1000);

    return () => {
      clearTimeout(headingTimer);
      clearTimeout(subheadingTimer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await poetryAPI.getCategories();
        if (!cancelled) {
          setCategories(res.data || []);
          setCategoriesError('');
        }
      } catch (e) {
        if (!cancelled) {
          setCategoriesError('Could not load categories. Please refresh.');
          console.error(e);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadHero = async () => {
      try {
        const res = await poetryAPI.getHomeHero();
        if (!cancelled && Array.isArray(res.data?.lines) && res.data.lines.length > 0) {
          setHeroLines(res.data.lines);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
        }
      }
    };
    loadHero();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <h1
          className={`text-5xl md:text-6xl lg:text-7xl font-poetry font-bold text-gray-800 mb-6 transition-all duration-1000 ease-out ${
            showHeading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Hey, I'm Manav
        </h1>

        <p
          className={`text-lg md:text-xl lg:text-2xl text-gray-700 font-elegant max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ease-out delay-300 ${
            showSubheading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {heroLines.map((line, i) => (
            <span key={`${i}-${line.slice(0, 12)}`} className="block mb-3 last:mb-0">
              {line}
            </span>
          ))}
        </p>
      </div>

      <div
        className={`flex justify-center items-center gap-6 mb-16 transition-all duration-1000 ease-out delay-500 ${
          showSubheading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <a
          href="https://www.instagram.com/manav_diary001"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50">
            <svg
              className="w-8 h-8 md:w-9 md:h-9 text-white transition-transform duration-300 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
        </a>
        <a
          href="https://www.snapchat.com/add/im_manav04"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-yellow-500/50">
            <svg
              className="w-8 h-8 md:w-9 md:h-9 text-white transition-transform duration-300 group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.166 1c-2.56 0-4.331.771-5.708 1.708C4.81 3.771 3.801 5.542 3.801 8.5c0 2.97 1.009 4.74 2.657 5.792 1.377.937 3.148 1.708 5.708 1.708 2.56 0 4.331-.771 5.708-1.708 1.648-1.052 2.657-2.822 2.657-5.792 0-2.958-1.009-4.729-2.657-5.792C16.497 1.771 14.726 1 12.166 1zm-1.138 3.375c.208 0 .375.167.375.375v1.75c0 .208-.167.375-.375.375H9.153c-.208 0-.375-.167-.375-.375v-1.75c0-.208.167-.375.375-.375h1.875zm5.25 0c.208 0 .375.167.375.375v1.75c0 .208-.167.375-.375.375h-1.875c-.208 0-.375-.167-.375-.375v-1.75c0-.208.167-.375.375-.375h1.875zM12 8.625c-2.617 0-4.75 2.133-4.75 4.75S9.383 18.125 12 18.125s4.75-2.133 4.75-4.75S14.617 8.625 12 8.625zm0 1.5c.208 0 .375.167.375.375a1.125 1.125 0 0 1 2.25 0c0 1.034-.841 1.875-1.875 1.875a.375.375 0 1 0 0 .75c1.447 0 2.625-1.178 2.625-2.625a1.875 1.875 0 0 0-3.656-.563.375.375 0 1 0 .712.231c.108-.333.42-.563.769-.563z" />
            </svg>
          </div>
        </a>
      </div>

      {categoriesError && (
        <div className="mb-8 text-center text-red-600 text-sm font-medium">{categoriesError}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {categories.length === 0 && !categoriesError ? (
          <div className="col-span-full text-center py-12 bg-white/80 rounded-2xl shadow border border-gray-100">
            <p className="text-gray-600 font-elegant">Categories will appear here once they are added.</p>
          </div>
        ) : (
          categories.map((category, index) => {
            const style = CARD_STYLES[index % CARD_STYLES.length];
            return (
              <Link
                key={category._id || category.slug}
                to={`/c/${category.slug}`}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.color} p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4">{style.icon}</div>
                <h2 className="text-2xl font-poetry font-semibold text-white mb-2">{category.name}</h2>
                <p className="text-white/90 font-elegant">Explore heartfelt verses</p>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;
