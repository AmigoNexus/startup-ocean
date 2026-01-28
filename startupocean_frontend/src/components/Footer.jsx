import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-white">StartupOcean</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting startups and service providers under one platform.
              Build your network, collaborate, and grow together.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://amigonexus.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition"
                aria-label="Facebook"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/people/Amigo-Nexus/pfbid0ohgCLLpbA9hhSadamnkmBZM6aqHE4oVqaXESCZY8BJo6x5tQ1QKxjt5oQfvQ3s9Zl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://amigonexus.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://in.linkedin.com/company/amigo-nexus-technologyv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/amigonexustechnology/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-primary-500 transition">
                  Search Companies
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-primary-500 transition">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-primary-500 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/company" className="text-gray-400 hover:text-primary-500 transition">
                  My Company
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Startups</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?type=STARTUP" className="text-gray-400 hover:text-primary-500 transition">
                  Find Startups
                </Link>
              </li>
              <li>
                <Link to="/search?type=SERVICE_PROVIDER" className="text-gray-400 hover:text-primary-500 transition">
                  Find Service Providers
                </Link>
              </li>
              <li>
                <Link to="/collaborations" className="text-gray-400 hover:text-primary-500 transition">
                  Collaborations
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary-500 transition">
                  Register Your Company
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  129, 1st Floor, Goodwill Tower, Dhanori, Pune – 411003, Maharashtra, India
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                <a
                  href="mailto:support@startupocean.in"
                  className="text-gray-400 hover:text-primary-500 transition"
                >
                  amigonexusofficial@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                <a
                  href="tel:+919588400305"
                  className="text-gray-400 hover:text-primary-500 transition"
                >
                  +91 95884 00305
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 fixed bottom-0 left-0 w-full bg-gray-800 z-50">
        <div className="container mx-auto px-2 py-2">
          <div className="md:flex-row items-center justify-between gap-2">

            <div className="text-gray-400 text-sm text-center w-full">
              © {currentYear} StartupOcean. All rights reserved.
            </div>

            <div className="text-gray-400 text-sm text-right">
              Powered by{' '}
              <a
                href="https://amigonexus.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-500 font-semibold transition"
              >
                Amigo Nexus Technology LLP
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;