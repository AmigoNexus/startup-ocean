import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Search, Calendar, Home, UserPlus } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary-500 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="StartupOcean Logo"
              className="h-20 w-auto"
            />
            <span className="text-xl font-bold">StartupOcean</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-1 hover:text-primary-100 transition">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link to="/search" className="flex items-center space-x-1 hover:text-primary-100 transition">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>

            <Link to="/events" className="flex items-center space-x-1 hover:text-primary-100 transition">
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-primary-100 transition">
                  Dashboard
                </Link>

                <Link to="/company" className="hover:text-primary-100 transition">
                  {user?.role === 'ADMIN' ? 'All Companies' : 'My Company'}
                </Link>

                <Link to="/collaborations" className="hover:text-primary-100 transition">
                  Collaborations
                </Link>

                <div className="flex items-center space-x-4 ml-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 hover:text-primary-100 transition"
                  >
                    {isAuthenticated && (
                      <p >
                        Welcome,&nbsp;
                        <span >
                          {user?.name || user?.email}
                        </span>
                      </p>
                    )}
                  </Link>

                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 hover:text-primary-100 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow hover:bg-gray-100 transition"
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full font-medium shadow
                  hover:bg-white hover:text-black transition"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </Link>

              </>

            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;