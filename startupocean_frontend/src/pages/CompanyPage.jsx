import { useState, useEffect, useRef } from 'react';
import { companyAPI } from '../services/api';
import toast from 'react-hot-toast';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            My Company Details
          </h1>
        </div>

        <div className="w-full">
          <form onSubmit={handleSave} className="bg-white rounded-lg shadow-lg p-8 space-y-8">

            {/* ── Logo Upload Section ── */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Company Logo</h3>
              <div className="flex items-center gap-6">
                {/* Preview */}
                <div className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                  {company?.logoUrl && !imgError ? (
                    <img
                      src={`${API_HOST}${company.logoUrl}?t=${logoTimestamp}`}
                      alt="Company Logo"
                      className="w-full h-full object-cover rounded-full"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="text-gray-400 text-xs text-center px-2">No Logo</span>
                  )}
                </div>

                {/* Upload button */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    className="hidden"
                    onChange={handleLogoUpload}
                    id="logo-upload-input"
                  />
                  <button
                    type="button"
                    disabled={logoUploading}
                    onClick={() => logoInputRef.current?.click()}
                    className="px-5 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition disabled:opacity-50"
                  >
                    {logoUploading ? 'Uploading...' : (company?.companyId && !imgError) ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </div>
            </div>
            <div>
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
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Social Links</h3>
              <div className="space-y-4">
                {['website', 'linkedin', 'facebook', 'instagram', 'twitter'].map((platform) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {platform}
                    </label>
                    <input
                      type="text"
                      placeholder={`https://${platform}.com/yourcompany`}
                      value={formData.socialLinks[platform] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, [platform]: e.target.value },
                        })
                      }
                      onBlur={(e) => {
                        let val = e.target.value.trim();
                        if (val && !/^https?:\/\//i.test(val)) {
                          setFormData({
                            ...formData,
                            socialLinks: { ...formData.socialLinks, [platform]: `https://${val}` },
                          });
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Update Services & Links'}
              </button>
              <button
                type="button"
                onClick={() => fetchCompany()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;