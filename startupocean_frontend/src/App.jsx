import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage'
import CompanyPage from './pages/CompanyPage';
import SearchPage from './pages/SearchPage';
import EventsPage from './pages/EventsPage';
import CollaborationsPage from './pages/CollaborationsPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Register from './auth/Register';
import Login from './auth/Login';
import DashboardPage from './pages/Dashboard';
import VerifyOTP from './components/VerifyOTP';

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen pb-14">
      <Navbar />

      <main className="flex-grow pt-16 bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/company" element={<PrivateRoute><CompanyPage /></PrivateRoute>} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/collaborations" element={<PrivateRoute><CollaborationsPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;