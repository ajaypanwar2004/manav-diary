import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CategoryPoetry from './pages/CategoryPoetry';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserLogin from './pages/UserLogin';
import UserProtectedRoute from './components/UserProtectedRoute';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserLogin />} />
            <Route
              path="/c/:slug"
              element={
                <UserProtectedRoute>
                  <CategoryPoetry />
                </UserProtectedRoute>
              }
            />
            {/* <Route path="/sad" element={<Navigate to="/c/sad" replace />} />
            <Route path="/romantic" element={<Navigate to="/c/romantic" replace />} />
            <Route path="/broken" element={<Navigate to="/c/broken" replace />} />
            <Route path="/mother" element={<Navigate to="/c/mother" replace />} />
            <Route path="/love" element={<Navigate to="/c/love" replace />} /> */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
