import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Globe, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 pt-24 pb-12 text-slate-400">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="bg-teal-600 p-2 rounded-xl">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Startup<span className="text-teal-500">Ocean</span></span>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              The premier ecosystem for high-growth startups and strategic service providers. Connect, collaborate, and scale your vision globally.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook />, href: 'https://facebook.com/amigonexus' },
                { icon: <Twitter />, href: 'https://twitter.com/amigonexus' },
                { icon: <Linkedin />, href: 'https://linkedin.com/company/amigo-nexus' },
                { icon: <Instagram />, href: 'https://instagram.com/amigonexus' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noreferrer"
                  className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold mb-8 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              {[
                { label: 'Platform Home', to: '/' },
                { label: 'Search Startups', to: '/search?type=STARTUP' },
                { label: 'Service Marketplace', to: '/search?type=SERVICE_PROVIDER' },
                { label: 'Events Calendar', to: '/events' },
                { label: 'Admin Dashboard', to: '/dashboard' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="hover:text-teal-500 hover:translate-x-1 transition-all flex items-center group">
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 ml-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-8 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
              Join Us
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              {[
                { label: 'Register Startup', to: '/register' },
                { label: 'Become a Partner', to: '/register' },
                { label: 'Collaboration Hub', to: '/collaborations' },
                { label: 'Help Center', to: '/messages' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="hover:text-cyan-400 hover:translate-x-1 transition-all flex items-center group">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-8 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
              Contact Office
            </h3>
            <ul className="space-y-6 text-sm">
              <li className="flex gap-4">
                <MapPin className="h-5 w-5 text-teal-500 shrink-0" />
                <span>129, Goodwill Tower, <br/>Dhanori, Pune – 411003</span>
              </li>
              <li className="flex gap-4">
                <Mail className="h-5 w-5 text-teal-500 shrink-0" />
                <a href="mailto:connect@amigonexus.com" className="hover:text-white transition">connect@amigonexus.com</a>
              </li>
              <li className="flex gap-4">
                <Phone className="h-5 w-5 text-teal-500 shrink-0" />
                <a href="tel:+919588400305" className="hover:text-white transition">+91 95884 00305</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-medium">
            © {currentYear} StartupOcean. Engineered with ❤️ by 
            <a href="https://amigonexus.com" className="text-teal-500 hover:text-teal-400 ml-1">Amigo Nexus</a>
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;