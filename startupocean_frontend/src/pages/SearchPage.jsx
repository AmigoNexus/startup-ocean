import { useState, useEffect } from 'react';
import { Search, Briefcase, Mail, Phone, Globe, UserPlus, Eye, X, Building2, Linkedin, Facebook, Instagram, Twitter, Lock } from 'lucide-react';
import { collaborationAPI, companyAPI, trackActivity } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SearchPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyType, setCompanyType] = useState('ALL');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectMessage, setConnectMessage] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCompanies();
      return;
    }

    try {
      setLoading(true);

      const res = await companyAPI.search(searchTerm);
      const list = res.data.data || [];

      const realCompanies = list.map((c) => ({
        companyId: c.companyId,
        companyName: c.companyName,
        companyType: c.companyType,
        description: c.description,
        offerings: c.offerings || [],
        email: c.email,
        phoneNumber: c.phoneNumber,
        socialLinks: c.socialLinks || {}
      }));

      setCompanies(realCompanies);
    } catch (err) {
      console.error("Search failed", err);
      toast('Search not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    trackActivity({
      activityType: "PAGE_VISIT",
      pageUrl: window.location.pathname,
    });
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [companyType]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const res = await companyAPI.getAll(
        companyType !== "ALL" ? companyType : null
      );

      const list = res.data.data || [];
      const realCompanies = list.map((c) => ({
        companyId: c.companyId,
        companyName: c.companyName,
        companyType: c.companyType,
        description: c.description,
        offerings: c.offerings || [],
        email: c.email,
        phoneNumber: c.phoneNumber,
        socialLinks: c.socialLinks || {}
      }));

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
    }
  };

  const filteredCompanies = companyType === 'ALL'
    ? companies
    : companies.filter(c => c.companyType === companyType);

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
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleSearch}
              className="bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-teal-500 transition flex items-center gap-2 text-sm"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
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
              <h2 className="text-2xl font-bold text-gray-800">
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
                <p className="text-sm text-gray-600">{selectedCompany.companyType}</p>
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
                className="flex-1 bg-teal-400 text-white py-3 rounded-lg hover:bg-teal-500 transition font-semibold"
              >
                Send Request
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

  const length = phoneNumber.length;
  if (length <= 4) return phoneNumber;

  const visibleDigits = phoneNumber.slice(-4);
  const maskedPart = '*'.repeat(length - 4);
  return maskedPart + visibleDigits;
};

const CompanyCard = ({ company, onViewDetails, onConnect, isAuthenticated, navigate }) => {
  const handleViewProfile = () => {
    if (!isAuthenticated) {
      toast('Please login to view company profile');
      navigate('/login');
      return;
    }
    onViewDetails(company);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-teal-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{company.companyName}</h3>
            <span className="text-sm text-gray-500">{company.companyType}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">{company.description}</p>

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
          className="flex-1 flex items-center justify-center gap-2 border border-teal-400 text-teal-400 px-4 py-2 rounded-lg hover:bg-teal-50 transition font-medium"
        >
          <Eye className="h-4 w-4" />
          View Profile
        </button>

        <button
          onClick={() => onConnect(company)}
          className="flex-1 flex items-center justify-center gap-2 bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-teal-500 transition font-medium"
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
  const hasContact = !!(company.email || company.phoneNumber);

  const socialIconMap = {
    website: <Globe className="h-5 w-5 text-teal-400" />,
    linkedin: <Linkedin className="h-5 w-5 text-teal-400" />,
    facebook: <Facebook className="h-5 w-5 text-teal-400" />,
    instagram: <Instagram className="h-5 w-5 text-teal-400" />,
    twitter: <Twitter className="h-5 w-5 text-teal-400" />,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Company Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-teal-400 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{company.companyName}</h3>
              <p className="text-gray-600">{company.companyType}</p>
            </div>
          </div>

          {company.description && (
            <div className="mt-4">
              <p className="text-gray-700 leading-relaxed">{company.description}</p>
            </div>
          )}
        </div>
        {hasContact && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h4>

            {isAuthenticated ? (
              <div className="space-y-3">
                {company.email && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="h-5 w-5 text-teal-400" />
                    <a href={`mailto:${company.email}`} className="text-teal-400 hover:underline">
                      {company.email}
                    </a>
                  </div>
                )}
                {company.phoneNumber && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="h-5 w-5 text-teal-400" />
                    <span className="text-teal-500 font-medium">
                      {maskPhoneNumber(company.phoneNumber)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {company.email && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-500">***@***.com</span>
                  </div>
                )}
                {company.phoneNumber && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-500">{maskPhoneNumber(company.phoneNumber)}</span>
                  </div>
                )}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3 mt-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      Full contact details are visible to logged-in users only.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/login');
                    }}
                    className="text-sm bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-teal-500 transition font-medium whitespace-nowrap"
                  >
                    Login to view
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {company.offerings && company.offerings.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Offerings / Specialization</h4>
            <div className="flex flex-wrap gap-2">
              {company.offerings.map((offering, index) => (
                <span
                  key={index}
                  className="bg-teal-100 text-teal-500 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {offering}
                </span>
              ))}
            </div>
          </div>
        )}
        {hasSocialLinks && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Social Links</h4>

            {isAuthenticated ? (
              <div className="space-y-3">
                {Object.entries(company.socialLinks).map(([key, value]) =>
                  value ? (
                    <div key={key} className="flex items-center gap-3">
                      {socialIconMap[key] || <Globe className="h-5 w-5 text-teal-400" />}
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:underline truncate capitalize"
                      >
                        {key} — {value}
                      </a>
                    </div>
                  ) : null
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Social links are visible to logged-in users only.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                  className="text-sm bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-teal-500 transition font-medium whitespace-nowrap"
                >
                  Login to view
                </button>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => onConnect(company)}
            className="flex-1 flex items-center justify-center gap-2 bg-teal-400 text-white py-3 rounded-lg hover:bg-teal-500 transition font-semibold"
          >
            <UserPlus className="h-5 w-5" />
            Send Connection Request
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;