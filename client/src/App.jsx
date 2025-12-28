import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import SadPoetry from './pages/SadPoetry';
import RomanticPoetry from './pages/RomanticPoetry';
import BrokenPoetry from './pages/BrokenPoetry';
import MotherPoetry from './pages/MotherPoetry';
import LovePoetry from './pages/LovePoetry';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sad" element={<SadPoetry />} />
            <Route path="/romantic" element={<RomanticPoetry />} />
            <Route path="/broken" element={<BrokenPoetry />} />
            <Route path="/mother" element={<MotherPoetry />} />
            <Route path="/love" element={<LovePoetry />} />
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

