import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Search, Calendar, Home, UserPlus, Building2, Handshake, ChevronDown, LayoutDashboard, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleNavLinkClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { to: "/TrendingNews", icon: <Calendar className="h-4 w-4" />, label: "Trending" },
  ];

  const isDarkHeaderPage = location.pathname === '/company';

  if (isAuthenticated) {
    navLinks.push({ to: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, label: "Dashboard" });
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-2'
      }`}>
      <div className="container mx-auto px-4">
        <div className={`flex justify-between items-center px-6 rounded-2xl gap-4 transition-all duration-300 ${scrolled ? 'glass h-16 shadow-lg' : 'h-12'
          }`}>
          {/* Logo */}
          <Link to="/" onClick={(e) => handleNavLinkClick(e, "/")} className="flex items-center space-x-2 shrink-0 group">
            <div className={`p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg ${isDarkHeaderPage && !scrolled ? 'bg-white/10 shadow-none ring-1 ring-white/20' : 'bg-teal-600 shadow-teal-200'}`}>
              <img src={logo} alt="L" className="h-6 w-auto" />
            </div>
            <span className={`text-xl font-bold transition-colors ${scrolled ? 'text-slate-900' : (isDarkHeaderPage ? 'text-white' : 'text-slate-900')}`}>
              Startup<span className={scrolled ? 'text-teal-600' : (isDarkHeaderPage ? 'text-teal-300' : 'text-teal-600')}>Ocean</span>
            </span>
          </Link>

          {/* Central Search Bar (Desktop) */}
          {location.pathname !== '/search' && (
            <div className="hidden lg:flex flex-1 justify-center px-4 max-w-md min-w-[200px] w-full mx-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search by name, city..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchInput.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
                    }
                  }}
                  className={`w-full pl-4 pr-10 py-2 border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm font-medium transition-all ${scrolled ? 'bg-white' : 'bg-slate-50/80 backdrop-blur-sm'}`}
                />
                <button
                  onClick={() => {
                    if (searchInput.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors p-1"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 shrink-0">

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={(e) => handleNavLinkClick(e, link.to)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-semibold text-sm ${scrolled
                  ? 'text-slate-600 hover:text-teal-600 hover:bg-teal-50'
                  : (isDarkHeaderPage ? 'text-white hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50')
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            <div className={`mx-4 h-6 w-px ${scrolled ? 'bg-slate-200' : (isDarkHeaderPage ? 'bg-white/20' : 'bg-slate-200')}`}></div>

            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition border ${scrolled
                    ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    : (isDarkHeaderPage ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')
                    }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-tr from-teal-500 to-cyan-400 rounded-full flex items-center justify-center text-white shadow-md">
                    <User className="h-4 w-4" />
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openMenu ? 'rotate-180' : ''} ${scrolled ? 'text-slate-600' : (isDarkHeaderPage ? 'text-white' : 'text-slate-600')}`} />
                </button>

                {openMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-5 py-4 border-b border-slate-50 mb-1">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name || user?.email}</p>
                    </div>

                    <div className="px-2">
                      <Link to="/profile" onClick={() => setOpenMenu(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition text-sm text-slate-700">
                        <User className="h-4 w-4 text-teal-500" />
                        My Profile
                      </Link>
                      <Link to={companyRoute} onClick={() => setOpenMenu(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition text-sm text-slate-700">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        {user?.role === "ADMIN" ? "All Companies" : "My Company"}
                      </Link>
                      <Link to="/collaborations" onClick={() => setOpenMenu(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition text-sm text-slate-700">
                        <Handshake className="h-4 w-4 text-purple-500" />
                        Collaborations
                      </Link>
                    </div>

                    <div className="h-px bg-slate-100 my-2 mx-2"></div>

                    <div className="px-2">
                      <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition text-sm font-semibold">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className={`text-sm font-bold px-4 py-2 transition ${scrolled ? 'text-slate-600 hover:text-teal-600' : (isDarkHeaderPage ? 'text-white hover:text-teal-200' : 'text-slate-600 hover:text-teal-600')}`}>
                  Login
                </Link>
                <Link to="/register" className={`px-6 py-2.5 rounded-xl text-sm font-bold transition shadow-lg ${scrolled
                  ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-200'
                  : (isDarkHeaderPage ? 'bg-white text-teal-600 hover:bg-slate-50' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-200')
                  }`}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition ${scrolled ? 'bg-slate-100 text-slate-900' : (isDarkHeaderPage ? 'bg-white/10 text-white border border-white/20' : 'bg-slate-100 text-slate-900')}`}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 px-4 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 space-y-4">
              {location.pathname !== '/search' && (
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Search by name, city..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchInput.trim()) {
                        setMobileMenuOpen(false);
                        navigate(`/search?q=${encodeURIComponent(searchInput)}`);
                      }
                    }}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm font-medium transition-all outline-none"
                  />
                  <button
                    onClick={() => {
                      if (searchInput.trim()) {
                        setMobileMenuOpen(false);
                        navigate(`/search?q=${encodeURIComponent(searchInput)}`);
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={(e) => handleNavLinkClick(e, link.to)}
                  className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-2xl transition group"
                >
                  <div className="p-2 transition-colors bg-slate-50 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-600 rounded-xl">
                    {link.icon}
                  </div>
                  <span className="font-bold text-slate-700">{link.label}</span>
                </Link>
              ))}

              <div className="h-px bg-slate-100 my-4"></div>

              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 mb-4">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">User Account</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name || user?.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-teal-200 transition">
                      <User className="h-6 w-6 text-teal-500 mb-2" />
                      <span className="text-xs font-bold text-slate-600">Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-2xl border border-transparent hover:border-red-200 transition"
                    >
                      <LogOut className="h-6 w-6 text-red-500 mb-2" />
                      <span className="text-xs font-bold text-red-600">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-4 bg-teal-600 text-white rounded-2xl font-bold shadow-xl shadow-teal-100 transition"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-4 bg-slate-50 text-slate-700 rounded-2xl font-bold hover:bg-slate-100 transition"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;