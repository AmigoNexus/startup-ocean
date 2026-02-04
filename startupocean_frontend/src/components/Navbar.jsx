import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Search, Calendar, Home, UserPlus, Building2, Handshake, ChevronDown, LayoutDashboard, } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const companyRoute =
    user?.role === "ADMIN" ? "/companies" : "/company";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary-500 text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="StartupOcean Logo" className="h-14 w-auto" />
            <span className="text-xl font-bold">StartupOcean</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 hover:text-primary-100 transition"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/search"
              className="flex items-center space-x-1 hover:text-primary-100 transition"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center space-x-1 hover:text-primary-100 transition"
            >
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </Link>
            <Link
              to="/TrendingNews"
              className="flex items-center space-x-1 hover:text-primary-100 transition"
            >
              <Calendar className="h-4 w-4" />
              <span>Trending</span>
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 hover:text-primary-100 transition"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex items-center gap-2 text-gray-800 px-4 py-2 rounded-full  hover:bg-teal-100 transition"
                >
                  <User className="h-5 w-5 text-teal-400" />
                  <ChevronDown className="h-4 w-4" />
                </button>
                {openMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <Link
                      to="/profile"
                      onClick={() => setOpenMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition"
                    >
                      <User className="h-4 w-4 text-teal-600" />
                      My Profile
                    </Link>
                    <Link
                      to={companyRoute}
                      onClick={() => setOpenMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition"
                    >
                      <Building2 className="h-4 w-4 text-blue-600" />
                      {user?.role === "ADMIN"
                        ? "All Companies"
                        : "My Company"}
                    </Link>
                    <Link
                      to="/collaborations"
                      onClick={() => setOpenMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition"
                    >
                      <Handshake className="h-4 w-4 text-purple-600" />
                      Collaborations
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full font-medium shadow hover:bg-teal-700 transition"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
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