import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const categories = [
    { name: 'Sad', path: '/sad' },
    { name: 'Romantic', path: '/romantic' },
    { name: 'Broken', path: '/broken' },
    { name: 'Mother', path: '/mother' },
    { name: 'Love', path: '/love' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-poetry font-bold text-purple-600 hover:text-purple-800 transition-colors">
              Manav Diary
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(category.path)
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {category.name}
              </Link>
            ))}
            {isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin/dashboard')
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/login')
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                const menu = document.getElementById('mobile-menu');
                menu?.classList.toggle('hidden');
              }}
              className="text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden md:hidden pb-4">
          <div className="flex flex-col space-y-2 mt-2">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isActive(category.path)
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {category.name}
              </Link>
            ))}
            {isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isActive('/admin/dashboard')
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
