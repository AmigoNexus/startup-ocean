import { useState, useEffect } from 'react';
import { Briefcase, Mail, Phone, Globe, UserPlus, Eye, X, Building2, Linkedin, Facebook, Instagram, Twitter, Lock, MapPin, Share2 } from 'lucide-react';
import { collaborationAPI, companyAPI, trackActivity } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyType, setCompanyType] = useState('ALL');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectMessage, setConnectMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);

  const [searchParams] = useSearchParams();


  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    trackActivity({
      activityType: "PAGE_VISIT",
      pageUrl: window.location.pathname,
    });
  }, []);
  useEffect(() => {
    const query = searchParams.get("q");
    const type = searchParams.get("type");

    if (query) {
      setSearchTerm(query);
    }

    if (type) {
      setCompanyType(type);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await companyAPI.getAll(null);
      const list = res.data.data || [];
      const realCompanies = list.map((c) => {
        const serviceOfferings = c.services?.reduce((acc, service) => {
          if (service.offerings && Array.isArray(service.offerings)) {
            return [...acc, ...service.offerings];
          }
          return acc;
        }, []) || [];

        const allOfferings = [...new Set([...(c.offerings || []), ...serviceOfferings])].filter(o => o && o.trim() !== "");

        return {
          companyId: c.companyId,
          companyName: c.companyName,
          companyType: c.services?.[0]?.type || "UNKNOWN",
          description: c.services?.[0]?.description || c.description || "",
          offerings: allOfferings,
          email: c.email,
          phoneNumber: c.services?.[0]?.phoneNumber || c.phoneNumber,
          isPhoneHidden: c.services?.[0]?.isPhoneHidden ?? c.isPhoneHidden ?? false,
          socialLinks: c.socialLinks || {},
          services: c.services || [],
          city: c.city
        };
      });
      setCompanies(realCompanies);
    } catch (err) {
      console.error("Failed to fetch companies", err);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (company) => {
    if (!isAuthenticated) {
      toast('Please login to view company profile');
      navigate('/login');
      return;
    }
    setSelectedCompany(company);
    setShowDetailsModal(true);
  };

  const openConnectModal = (company) => {
    if (!isAuthenticated) {
      toast('Please login to send connection request');
      navigate('/login');
      return;
    }

    setSelectedCompany(company);
    setShowDetailsModal(false);
    setShowConnectModal(true);
  };

  const handleConnect = async () => {
    try {
      setSendingRequest(true);
      await collaborationAPI.send({
        targetCompanyId: selectedCompany.companyId,
        message: connectMessage
      });

      toast.success('Connection request sent successfully!');
      setShowConnectModal(false);
      setConnectMessage('');
    } catch (error) {
      console.error('Failed to send request:', error);
      toast('Failed to send request');
    } finally {
      setSendingRequest(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesType = companyType === "ALL" || company.services?.some(s => s.type === companyType);
    const matchesSearch = !searchTerm ||
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.offerings?.some(o => o.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8  ">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Search Companies</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          >
            <option value="ALL">All Companies</option>
            <option value="STARTUP">Startups</option>
            <option value="SERVICE_PROVIDER">Service Providers</option>
          </select>

          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search by name, specialization, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.companyId}
              company={company}
              onViewDetails={viewDetails}
              onConnect={openConnectModal}
              isAuthenticated={isAuthenticated}
              navigate={navigate}
              activeFilter={companyType}
            />
          ))}
        </div>
      )}

      {!loading && filteredCompanies.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-base">No companies found</p>
          <p className="text-gray-400 text-xs mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
      {showDetailsModal && selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany}
          onClose={() => setShowDetailsModal(false)}
          onConnect={openConnectModal}
          isAuthenticated={isAuthenticated}
          navigate={navigate}
        />
      )}
      {showConnectModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Send Connection Request
              </h2>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-teal-50 rounded-lg p-4 mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-400 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{selectedCompany.companyName}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCompany.services?.map((s, idx) => (
                    <span key={idx} className="text-[10px]   font-bold text-teal-600">
                      {s.type.replace('_', ' ')}
                      {idx < selectedCompany.services.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Tell them why you'd like to connect..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleConnect}
                disabled={sendingRequest}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition
                ${sendingRequest ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500 text-white'} `} >
                {sendingRequest ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  'Send Request'
                )}
              </button>
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const maskPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return 'Not provided';
  return '**********';
};

const CompanyCard = ({ company, onViewDetails, onConnect, isAuthenticated, navigate, activeFilter }) => {
  const handleViewProfile = () => {
    if (!isAuthenticated) {
      toast('Please login to view company profile');
      navigate('/login');
      return;
    }
    onViewDetails(company);
  };

  const displayService = (activeFilter === 'ALL' || !activeFilter)
    ? company.services?.[0]
    : company.services?.find(s => s.type === activeFilter) || company.services?.[0];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col relative overflow-hidden">
      {company.city && (
        <div className="absolute top-0 right-0 bg-teal-200 text-gray-900 px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm z-10">
          <MapPin className="h-3 w-3" />
          <span className="text-[10px] font-bold   tracking-wider">{company.city}</span>
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
            {displayService?.type === 'SERVICE_PROVIDER' ? <Share2 className="h-6 w-6 text-teal-400" /> : <Briefcase className="h-6 w-6 text-teal-400" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{company.companyName}</h3>
            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="text-xs font-medium text-teal-600 flex items-center gap-1.5 mt-1 hover:text-teal-700 transition"
              >
                <Mail className="h-3.5 w-3.5 text-teal-500" />
                <span className="truncate max-w-[180px]">{company.email}</span>
              </a>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {company.services?.map((s, idx) => (
                <span key={idx} className="text-[10px]   font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {s.type.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {company.offerings && company.offerings.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Offerings / Specialization:</p>
          <div className="flex flex-wrap gap-2">
            {company.offerings.slice(0, 3).map((offering, idx) => (
              <span
                key={idx}
                className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm"
              >
                {offering}
              </span>
            ))}
            {company.offerings.length > 3 && (
              <span className="text-sm text-gray-500">+{company.offerings.length - 3} more</span>
            )}
          </div>
        </div>
      )}
      <div className="mt-auto flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleViewProfile}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-teal-300 text-teal-400 px-4 py-2 rounded-lg hover:bg-teal-50 transition font-bold text-sm"
        >
          <Eye className="h-4 w-4" />
          View Profile
        </button>

        <button
          onClick={() => onConnect(company)}
          className="flex-1 flex items-center justify-center gap-2 bg-teal-300 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition font-bold text-sm shadow-md shadow-teal-100"
        >
          <UserPlus className="h-4 w-4" />
          Connect
        </button>
      </div>
    </div>
  );
};

const CompanyDetailsModal = ({ company, onClose, onConnect, isAuthenticated, navigate }) => {
  const hasSocialLinks = company.socialLinks && Object.values(company.socialLinks).some(v => !!v);

  const socialIconMap = {
    website: <Globe className="h-5 w-5 text-teal-400" />,
    linkedin: <Linkedin className="h-5 w-5 text-teal-400" />,
    facebook: <Facebook className="h-5 w-5 text-teal-400" />,
    instagram: <Instagram className="h-5 w-5 text-teal-400" />,
    twitter: <Twitter className="h-5 w-5 text-teal-400" />,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{company.companyName}</h2>
            {company.city && (
              <p className="text-xs font-bold text-gray-500 flex items-center gap-1   mt-1 tracking-wider">
                <MapPin className="h-3 w-3 text-teal-200" /> {company.city}
              </p>
            )}
            {company.email && (
              <p className="text-xs font-medium text-teal-600 flex items-center gap-1 mt-1 lowercase">
                <Mail className="h-3 w-3 text-teal-500" /> {company.email}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-6">
            {company.services?.map((service, sIdx) => (
              <div key={sIdx} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-teal-400 text-white px-3 py-1 text-[10px] font-bold   rounded-bl-lg">
                  {service.type.replace('_', ' ')}
                </div>

                <div className="space-y-4">
                  {service.description && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400   mb-1">Description</h4>
                      <p className="text-gray-700 leading-relaxed text-sm italic">"{service.description}"</p>
                    </div>
                  )}

                  {service.offerings && service.offerings.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400   mb-2">Offerings & Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.offerings.map((o, oIdx) => (
                          <span key={oIdx} className="bg-white border border-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                            {o}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-xs font-bold text-gray-400   mb-2">Contact Details</h4>
                    <div className="space-y-2">
                      {isAuthenticated ? (
                        <div className="space-y-3">
                          {service.phoneNumber && (
                            <div className="flex items-center gap-3 text-gray-700">
                              <Phone className="h-5 w-5 text-teal-400" />
                              <span className="text-sm font-bold text-gray-800 tracking-wide">
                                {!service.isPhoneHidden ? service.phoneNumber : maskPhoneNumber(service.phoneNumber)}
                              </span>
                              {service.isPhoneHidden && <Lock className="h-3 w-3 text-gray-300" />}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                          <Lock className="h-3 w-3 text-gray-300" />
                          <span>Login to view specific contacts</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-yellow-600" />
                <p className="text-xs text-yellow-700">Detailed contact information is restricted to logged-in users only.</p>
              </div>
              <button
                onClick={() => { onClose(); navigate('/login'); }}
                className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-200 transition whitespace-nowrap"
              >
                Login Now
              </button>
            </div>
          )}

          {/* Social Links Section */}
          {company.socialLinks && Object.values(company.socialLinks).some(v => v) && (
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 tracking-widest mb-4">Connect with Us</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(company.socialLinks).map(([key, value]) => {
                  if (!value) return null;

                  // Ensure URL has protocol
                  const url = value.startsWith('http') ? value : `https://${value}`;

                  return (
                    <div key={key} className="flex items-center gap-4 group bg-gray-50/50 p-3 rounded-xl border border-transparent hover:border-teal-100 hover:bg-teal-50/30 transition-all">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {socialIconMap[key]}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black text-gray-400 tracking-wider mb-0.5">
                          {key === 'website' ? 'Official Website' : key}
                        </span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-teal-600 hover:text-teal-700 break-all leading-tight"
                        >
                          {value.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 flex gap-4 border-t border-gray-100">
          <button
            onClick={() => onConnect(company)}
            className="flex-1 bg-teal-500 text-white py-3 rounded-xl hover:bg-teal-700 transition font-bold shadow-lg shadow-teal-100 flex items-center justify-center gap-2"
          >
            <UserPlus className="h-5 w-5" /> Send Connection
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;