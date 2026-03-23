import { useState, useEffect } from 'react';
import { Briefcase, Search, Filter, Globe, Building2, Rocket, ArrowRight, X } from 'lucide-react';
import { collaborationAPI, companyAPI, trackActivity } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSearchParams } from "react-router-dom";
import CompanyCard from '../components/CompanyCard';
import CompanyDetailsModal from '../components/CompanyDetailsModal';
import ConnectModal from '../components/ConnectModal';

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
  const [showHero, setShowHero] = useState(true);

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

  const filterOptions = [
    { id: 'ALL', label: 'All Businesses', icon: Globe },
    { id: 'STARTUP', label: 'Startups', icon: Rocket },
    { id: 'SERVICE_PROVIDER', label: 'Service Providers', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      {/* Hero Section */}
      {showHero && (
        <div className="relative mb-8 px-4 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8 md:py-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 relative group/hero">
              <button
                onClick={() => setShowHero(false)}
                className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover/hero:opacity-100 z-20"
                title="Dismiss hero"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-50"></div>

              <div className="relative z-10 max-w-2xl text-center md:text-left">
                <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-wider text-teal-600 uppercase bg-teal-50 rounded-full">
                  Ecosystem Search
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-[1.1]">
                  Find Your Perfect <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600">Business Connections</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-lg mb-8 mx-auto md:mx-0">
                  Discover innovative startups and expert service providers across the globe. Seamlessly connect and grow your network.
                </p>
              </div>

              <div className="hidden lg:block relative z-10">
                <div className="bg-teal-50 p-8 rounded-full">
                  <div className="bg-teal-100 p-8 rounded-full">
                    <Search className="h-16 w-16 text-teal-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4">
        {/* Search and Filter Experience */}
        <div className="flex flex-col gap-6 mb-10">
          {/* Main Search Input */}
          <div className="relative max-w-3xl mx-auto w-full group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by name, specialization, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 md:py-5 bg-white border border-gray-200 rounded-2xl md:rounded-3xl shadow-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none text-gray-700 md:text-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <span className="bg-gray-100 p-1 rounded-full text-[10px] font-bold">CLEAR</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 text-gray-400 mr-2 md:mr-4">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-bold uppercase tracking-widest">Filter:</span>
            </div>
            {filterOptions.map((option) => {
              const Icon = option.icon;
              const isActive = companyType === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setCompanyType(option.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                       ${isActive
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 translate-y-[-2px]'
                      : 'bg-white text-gray-600 border border-gray-100 hover:border-teal-200 hover:bg-teal-50/30'
                    }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-teal-500'}`} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-8 h-[2px] bg-teal-500"></div>
            {filteredCompanies.length} result{filteredCompanies.length !== 1 ? 's' : ''} found
          </h2>
          <div className="text-xs text-gray-400 italic">
            Showing all registered {companyType.toLowerCase().replace('_', ' ')}s
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-teal-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-400 font-medium animate-pulse">Loading amazing businesses...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="text-center py-20 px-8 bg-white rounded-[2rem] border border-dashed border-gray-200 max-w-2xl mx-auto shadow-sm">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              We couldn't find any companies matching your search or filters. Try broadening your keywords or exploring other categories.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setCompanyType('ALL'); }}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-600 transition-colors flex items-center gap-2 mx-auto"
            >
              Reset All Filters
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

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
        <ConnectModal
          company={selectedCompany}
          onClose={() => setShowConnectModal(false)}
          onConnect={handleConnect}
          connectMessage={connectMessage}
          setConnectMessage={setConnectMessage}
          sendingRequest={sendingRequest}
        />
      )}
    </div>
  );
};

export default SearchPage;
