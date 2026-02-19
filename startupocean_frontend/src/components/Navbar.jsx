import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Search, Calendar, Home, UserPlus, Building2, Handshake, ChevronDown, LayoutDashboard, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const companyRoute = user?.role === "ADMIN" ? "/companies" : "/company";

  const navLinks = [
    { to: "/", icon: <Home className="h-4 w-4" />, label: "Home" },
    { to: "/search", icon: <Search className="h-4 w-4" />, label: "Search" },
    { to: "/TrendingNews", icon: <Calendar className="h-4 w-4" />, label: "Trending" },
  ];

  if (isAuthenticated) {
    navLinks.push({ to: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, label: "Dashboard" });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary-500 text-white shadow-lg z-50 py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <img src={logo} alt="StartupOcean Logo" className="h-10 w-auto" />
            <span className="text-lg font-semibold hidden sm:block">StartupOcean</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="flex items-center space-x-1 hover:text-primary-100 transition text-sm font-medium">
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            {isAuthenticated && (
              <h2 className="text-sm  font-semibold text-center border-l-2 pl-4">
                Welcome, <span className="font-bold">{user?.name || user?.email}</span>!
              </h2>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition border border-white/20"
                >
                  <div className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center text-white">
                    <User className="h-4 w-4" />
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openMenu ? 'rotate-180' : ''}`} />
                </button>

                {openMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Account</p>
                      <p className="text-sm font-bold truncate text-teal-600">{user?.name || user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setOpenMenu(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition">
                      <User className="h-4 w-4 text-teal-600" />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    <Link to={companyRoute} onClick={() => setOpenMenu(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{user?.role === "ADMIN" ? "All Companies" : "My Company"}</span>
                    </Link>
                    <Link to="/collaborations" onClick={() => setOpenMenu(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition">
                      <Handshake className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Collaborations</span>
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition">
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-medium hover:text-primary-100 transition">Login</Link>
                <Link to="/register" className="bg-white text-primary-500 px-5 py-2 rounded-full text-sm font-bold shadow-md hover:bg-gray-100 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-600 border-t border-primary-400 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-4 p-3 hover:bg-white/10 rounded-xl transition text-lg"
              >
                <div className="p-2 bg-white/10 rounded-lg">{link.icon}</div>
                <span>{link.label}</span>
              </Link>
            ))}

            <div className="h-px bg-white/10 my-4"></div>

            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 mb-2">
                  <p className="text-xs text-primary-200 uppercase font-bold tracking-wider">User Account</p>
                  <p className="text-sm font-bold truncate text-white">{user?.name || user?.email}</p>
                </div>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-4 p-3 hover:bg-white/10 rounded-xl transition">
                  <User className="h-5 w-5 text-primary-100" />
                  <span>My Profile</span>
                </Link>
                <Link to={companyRoute} onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-4 p-3 hover:bg-white/10 rounded-xl transition">
                  <Building2 className="h-5 w-5 text-primary-100" />
                  <span>{user?.role === "ADMIN" ? "All Companies" : "My Company"}</span>
                </Link>
                <Link to="/collaborations" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-4 p-3 hover:bg-white/10 rounded-xl transition">
                  <Handshake className="h-5 w-5 text-primary-100" />
                  <span>Collaborations</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-4 p-3 hover:bg-red-500/20 text-red-100 rounded-xl transition mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-bold">Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-3 bg-white text-primary-500 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;