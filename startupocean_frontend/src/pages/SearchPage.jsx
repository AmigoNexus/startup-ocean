import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8 pt-24">
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