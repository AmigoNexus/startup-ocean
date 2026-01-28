import { useState, useEffect } from 'react';
import { companyAPI } from '../services/api';
import { Briefcase, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CompanyPage = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    companyType: 'STARTUP',
    offerings: [''],
    socialLinks: {
      website: '',
      linkedin: '',
      facebook: '',
      instagram: '',
      twitter: '',
    },
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const response = await companyAPI.getMyCompany();
      if (response.data.success) {
        setCompany(response.data.data);
        setFormData({
          companyName: response.data.data.companyName,
          description: response.data.data.description,
          companyType: response.data.data.companyType,
          offerings: response.data.data.offerings || [''],
          socialLinks: response.data.data.socialLinks || {
            website: '',
            linkedin: '',
            facebook: '',
            instagram: '',
            twitter: '',
          },
        });
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch {
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        offerings: formData.offerings.filter((o) => o.trim()),
      };

      if (company) {
        await companyAPI.update(company.companyId, payload);
        toast.success('Company updated successfully');
      } else {
        await companyAPI.create(payload);
        toast.success('Company created successfully');
      }
      fetchCompany();
    } catch {
      toast.error('Failed to save company');
    } finally {
      setLoading(false);
    }
  };

  const addOffering = () => {
    setFormData({
      ...formData,
      offerings: [...formData.offerings, ''],
    });
  };

  const updateOffering = (index, value) => {
    const newOfferings = [...formData.offerings];
    newOfferings[index] = value;
    setFormData({ ...formData, offerings: newOfferings });
  };

  const removeOffering = (index) => {
    const newOfferings = formData.offerings.filter((_, i) => i !== index);
    setFormData({ ...formData, offerings: newOfferings });
  };

  if (loading && !isEditing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            {company ? 'My Company' : 'Create Company Profile'}
          </h1>
          {company && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Max 150 chars) *
              </label>
              <textarea
                required
                maxLength={150}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/150 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Type *
              </label>
              <select
                value={formData.companyType}
                onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={!!company}
              >
                <option value="STARTUP">Startup</option>
                <option value="SERVICE_PROVIDER">Service Provider</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offerings / Specializations *
              </label>
              {formData.offerings.map((offering, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={offering}
                    onChange={(e) => updateOffering(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., IT Consulting"
                  />
                  {formData.offerings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOffering(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOffering}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add More
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Social Links (Optional)</h3>
              <div className="space-y-4">
                {['website', 'linkedin', 'facebook', 'instagram', 'twitter'].map((platform) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {platform}
                    </label>
                    <input
                      type="url"
                      placeholder={`https://${platform}.com/yourcompany`}
                      value={formData.socialLinks[platform] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, [platform]: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
              </button>
              {company && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchCompany();
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{company.companyName}</h2>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {company.companyType}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{company.description}</p>
              </div>

              {company.offerings && company.offerings.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Offerings</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.offerings.map((offering, idx) => (
                      <span
                        key={idx}
                        className="bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-sm"
                      >
                        {offering}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {company.socialLinks && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Social Links</h3>
                  <div className="space-y-2">
                    {Object.entries(company.socialLinks).map(([key, value]) => 
                      value ? (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-gray-600 capitalize min-w-24">{key}:</span>
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-500 hover:underline truncate"
                          >
                            {value}
                          </a>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPage;