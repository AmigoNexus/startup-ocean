import { useState, useEffect, useRef } from 'react';
import { companyAPI } from '../services/api';
import toast from 'react-hot-toast';
import { 
  Building2, 
  Globe, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Camera, 
  Save, 
  RotateCcw, 
  Info,
  ExternalLink
} from 'lucide-react';
const API_HOST = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8025';
import CompanyDetails from '../components/CompanyDetails';

const CompanyPage = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    city: '',
    description: '',
    companyType: '',
    companyDetails: [],
    offerings: [],
    socialLinks: {
      website: '',
      linkedin: '',
      facebook: '',
      instagram: '',
      twitter: '',
    },
    phoneNumber: '',
    isPhoneHidden: false,
    email: '',
  });
  const [requireSequentialFill, setRequireSequentialFill] = useState(false);
  const [showCompanyTypeSelection, setShowCompanyTypeSelection] = useState(false);
  const [editingIndex, setEditingIndex] = useState(0);
  const [logoUploading, setLogoUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const logoInputRef = useRef(null);
  const [phoneError, setPhoneError] = useState('');
  const [logoTimestamp, setLogoTimestamp] = useState(Date.now());

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const response = await companyAPI.getMyCompany();
      if (response.data.success) {
        const data = response.data.data;
        setCompany(data);

        let initialCompanyDetails = [];
        if (data.services && data.services.length > 0) {
          initialCompanyDetails = data.services.map(s => {
            const type = typeof s === 'object' ? s.type : s;
            let serviceOfferings = (s.offerings && s.offerings.length > 0) ? s.offerings : [];

            if (serviceOfferings.length === 0 && data.offerings && data.offerings.length > 0 && type === data.companyType) {
              serviceOfferings = data.offerings;
            }

            return {
              type: type,
              description: s.description || '',
              offerings: serviceOfferings.length > 0 ? [...serviceOfferings] : [''],
              phoneNumber: s.phoneNumber || data.phoneNumber || '',
              isPhoneHidden: s.isPhoneHidden ?? data.isPhoneHidden ?? false
            };
          });
        } else {
          initialCompanyDetails = [{
            type: data.companyType || 'STARTUP',
            description: data.description || '',
            offerings: data.offerings && data.offerings.length > 0 ? [...data.offerings] : [''],
            phoneNumber: data.phoneNumber || '',
            isPhoneHidden: data.isPhoneHidden ?? false
          }];
        }

        setFormData({
          companyName: data.companyName || '',
          city: data.city || '',
          description: data.description || '',
          companyType: data.companyType || 'STARTUP',
          offerings: data.offerings || [''],
          companyDetails: initialCompanyDetails,
          socialLinks: data.socialLinks || {
            website: '',
            linkedin: '',
            facebook: '',
            instagram: '',
            twitter: '',
          },
          phoneNumber: data.phoneNumber || '',
          isPhoneHidden: data.isPhoneHidden ?? false,
          email: data.email || '',
        });


      } else {
        toast.error("Company profile not found");
      }
    }
    catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!company?.companyId) {
      toast.error('Company not found. Please save first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLogoUploading(true);
    try {
      await companyAPI.uploadLogo(company.companyId, formData);
      toast.success('Logo updated successfully! 🎉');
      setLogoTimestamp(Date.now());
      setImgError(false);
      await fetchCompany();
    } catch (err) {
      console.error(err);
      toast.error('Logo upload failed. Please try again.');
    } finally {
      setLogoUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.companyDetails || formData.companyDetails.length === 0) {
        toast.error("Please select at least one company type (Startup or Service Provider)");
        setLoading(false);
        return;
      }

      // Check if all descriptions are present
      const missingDescription = formData.companyDetails.find(d => !d.description || !d.description.trim());
      if (missingDescription) {
        toast.error(`Please provide a description for ${missingDescription.type.replace('_', ' ')}`);
        setLoading(false);
        return;
      }

      const payload = {
        companyName: formData.companyName,
        city: formData.city,
        phoneNumber: formData.phoneNumber,
        isPhoneHidden: formData.isPhoneHidden,
        socialLinks: formData.socialLinks,

        services: formData.companyDetails.map(d => ({
          type: typeof d.type === "object" ? d.type.type : String(d.type),

          description: d.description || "",
          offerings: d.offerings?.filter(o => o && o.trim()) || [],
          phoneNumber: d.phoneNumber,
          isPhoneHidden: d.isPhoneHidden
        }))
      };

      if (!company?.companyId) {
        toast.error("Company profile not found. Please contact admin.");
        return;
      }

      await companyAPI.update(company.companyId, payload);
      toast.success('Company updated successfully');

      await fetchCompany();


    } catch (error) {
      console.error(error);
      toast.error('Failed to save company');
    } finally {
      setLoading(false);
    }
  };

  const addCompanyDetail = () => {
    const existingTypes = formData.companyDetails.map(c => c.type);
    const availableTypes = ['STARTUP', 'SERVICE_PROVIDER'].filter(t => !existingTypes.includes(t));

    if (availableTypes.length === 1) {
      confirmAddCompanyDetail(availableTypes[0]);
    } else if (availableTypes.length > 1) {
      setShowCompanyTypeSelection(true);
    } else {
      toast.error("All company types added.");
    }
  };

  const confirmAddCompanyDetail = (type) => {
    const newIndex = formData.companyDetails.length;
    setFormData({
      ...formData,
      companyDetails: [
        ...formData.companyDetails,
        {
          type: type,
          description: '',
          offerings: [''],
          phoneNumber: formData.phoneNumber || '',
          isPhoneHidden: formData.isPhoneHidden ?? false
        }
      ]
    });
    setEditingIndex(newIndex);
    setShowCompanyTypeSelection(false);
  };

  const removeCompanyDetail = (index) => {
    const newDetails = formData.companyDetails.filter((_, i) => i !== index);
    setFormData({ ...formData, companyDetails: newDetails });
  };

  const updateCompanyDetail = (index, field, value) => {
    const newDetails = [...formData.companyDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData({ ...formData, companyDetails: newDetails });
  };

  const addOffering = (companyIndex) => {
    const newDetails = [...formData.companyDetails];
    newDetails[companyIndex] = {
      ...newDetails[companyIndex],
      offerings: [...newDetails[companyIndex].offerings, '']
    };
    setFormData({ ...formData, companyDetails: newDetails });
  };

  const updateOffering = (companyIndex, offeringIndex, value) => {
    const newDetails = [...formData.companyDetails];
    const newOfferings = [...newDetails[companyIndex].offerings];
    newOfferings[offeringIndex] = value;
    newDetails[companyIndex] = { ...newDetails[companyIndex], offerings: newOfferings };
    setFormData({ ...formData, companyDetails: newDetails });
  };

  const removeOffering = (companyIndex, offeringIndex) => {
    const newDetails = [...formData.companyDetails];
    if (newDetails[companyIndex].offerings.length > 1) {
      const newOfferings = newDetails[companyIndex].offerings.filter((_, i) => i !== offeringIndex);
      newDetails[companyIndex] = { ...newDetails[companyIndex], offerings: newOfferings };
      setFormData({ ...formData, companyDetails: newDetails });
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-100 border-t-teal-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-teal-600" />
          </div>
        </div>
        <p className="mt-4 text-teal-800 font-medium animate-pulse text-sm">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-900 pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-teal-200 mb-2">
            <Building2 className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Company <span className="text-teal-400">Profile</span>
          </h1>
          <p className="mt-4 text-teal-100 max-w-2xl text-lg font-light">
            Manage your company's identity, services, and online presence to build credibility with potential partners and clients.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left Column: Logo & Social ── */}
            <div className="lg:col-span-1 space-y-8">
              {/* Logo Upload Section */}
              <div className="bg-white rounded-2xl shadow-xl shadow-teal-900/5 p-8 border border-gray-100 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Camera size={80} />
                </div>
                
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-teal-600" />
                  Logo Upload
                </h3>

                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative group/logo">
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-teal-200 flex items-center justify-center overflow-hidden bg-teal-50/30 group-hover/logo:border-teal-400 transition-colors shadow-inner">
                      {company?.logoUrl && !imgError ? (
                        <img
                          src={`${API_HOST}${company.logoUrl}?t=${logoTimestamp}`}
                          alt="Company Logo"
                          className="w-full h-full object-cover"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-teal-600/50">
                          <Building2 size={32} />
                          <span className="text-xs font-semibold tracking-tight">NO LOGO</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      disabled={logoUploading}
                      onClick={() => logoInputRef.current?.click()}
                      className="absolute -bottom-3 -right-3 p-3 bg-teal-600 text-white rounded-xl shadow-lg hover:bg-teal-700 transition transform hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    className="hidden"
                    onChange={handleLogoUpload}
                    id="logo-upload-input"
                  />
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm font-semibold text-gray-700">Brand Identity</p>
                    <p className="text-xs text-gray-400 mt-1">Recommended: Square PNG or JPG</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tighter">Max Size: 5MB</p>
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div className="bg-white rounded-2xl shadow-xl shadow-teal-900/5 p-8 border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-teal-600" />
                  Social Presence
                </h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'website', icon: Globe, label: 'Website', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700', bg: 'bg-blue-50' },
                    { key: 'facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-800', bg: 'bg-blue-50' },
                    { key: 'instagram', icon: Instagram, label: 'Instagram', color: 'text-pink-600', bg: 'bg-pink-50' },
                    { key: 'twitter', icon: Twitter, label: 'Twitter / X', color: 'text-gray-900', bg: 'bg-gray-100' }
                  ].map(({ key, icon: Icon, label, color, bg }) => (
                    <div key={key} className="group/item">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1.5 ml-1 transition-colors group-hover/item:text-teal-600 uppercase tracking-wider">
                        <Icon className={`h-3.5 w-3.5 ${color}`} />
                        {label}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={`${label === 'Website' ? 'https://yourwebsite.com' : `@yourcompany`}`}
                          value={formData.socialLinks[key] || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              socialLinks: { ...formData.socialLinks, [key]: e.target.value },
                            })
                          }
                          onBlur={(e) => {
                            let val = e.target.value.trim();
                            if (val && !/^https?:\/\//i.test(val) && key === 'website') {
                              setFormData({
                                ...formData,
                                socialLinks: { ...formData.socialLinks, [key]: `https://${val}` },
                              });
                            }
                          }}
                          className="w-full pl-4 pr-10 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition-all text-sm outline-none"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right Column: Company Details ── */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-xl shadow-teal-900/5 p-8 border border-gray-100 min-h-full flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-teal-600" />
                    Business Offerings
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Live Updates</span>
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="bg-teal-50/30 rounded-xl p-4 mb-8 border border-teal-100 flex items-start gap-3">
                    <Info className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-teal-800">Complete your profile</h4>
                      <p className="text-xs text-teal-700/80 leading-relaxed mt-1">
                        Select your company type and fill in the specifics. Companies with detailed descriptions and offerings get 10x more engagement on our platform.
                      </p>
                    </div>
                  </div>

                  <CompanyDetails
                    formData={formData}
                    setFormData={setFormData}
                    showCompanyTypeSelection={showCompanyTypeSelection}
                    setShowCompanyTypeSelection={setShowCompanyTypeSelection}
                    addCompanyDetail={addCompanyDetail}
                    removeCompanyDetail={removeCompanyDetail}
                    updateCompanyDetail={updateCompanyDetail}
                    addOffering={addOffering}
                    updateOffering={updateOffering}
                    removeOffering={removeOffering}
                    confirmAddCompanyDetail={confirmAddCompanyDetail}
                    requireSequentialFill={requireSequentialFill}
                    setRequireSequentialFill={setRequireSequentialFill}
                    editingIndex={editingIndex}
                    setEditingIndex={setEditingIndex}
                    phoneError={phoneError}
                    setPhoneError={setPhoneError}
                    onAllSaved={() => { }}
                  />
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span>Update Profile & Settings</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => fetchCompany()}
                    className="px-8 py-4 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all border border-gray-200 flex items-center justify-center gap-2 group"
                  >
                    <RotateCcw className="h-5 w-5 group-hover:rotate-[-45deg] transition-transform" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;