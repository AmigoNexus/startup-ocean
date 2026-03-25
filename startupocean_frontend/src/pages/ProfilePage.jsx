import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Briefcase, Building2, Edit2, Save, X, Shield, MapPin, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { companyAPI, locationAPI } from '../services/api';
import toast from 'react-hot-toast';

const API_HOST = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8025';

const ProfilePage = () => {
  const { user: authUser, setUser: setAuthUser } = useAuth();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [companyNameError, setCompanyNameError] = useState(false);
  const companyNameRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', phoneNumber: '', city: '', companyName: '' });
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState('');
  const activeService = user?.company?.services?.[0];

  useEffect(() => {
    let mounted = true;
    const fetchCities = async () => {
      setCitiesLoading(true);
      try {
        const res = await locationAPI.getCities();
        const data = res.data?.data ?? res.data ?? [];
        if (mounted) setCities(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch cities', err);
        if (mounted) setCitiesError('Failed to load cities');
      } finally {
        if (mounted) setCitiesLoading(false);
      }
    };
    fetchCities();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({
        name: authUser.name || '',
        phoneNumber: authUser.phoneNumber || '',
        city: authUser.company?.city || '',
        companyName: authUser.company?.companyName || '',
      });
      fetchCompany();
    }
  }, [authUser]);

  const fetchCompany = async () => {
    try {
      const res = await companyAPI.getMyCompany();
      if (res.data?.success && res.data?.data) {
        const companyData = res.data.data;
        setImgError(false);
        setUser((prev) => ({
          ...prev,
          company: companyData,
        }));
        setFormData((prev) => ({
          ...prev,
          phoneNumber: companyData.phoneNumber || '',
          city: companyData.city || '',
        }));
      }
    } catch (err) {
      console.error('Failed to fetch company:', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setCompanyNameError(false);
    setFormData({
      name: user.name || '',
      phoneNumber: user.company?.phoneNumber || user.phoneNumber || '',
      city: user.company?.city || '',
      companyName: user.company?.companyName || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCompanyNameError(false);
    setFormData({
      name: user.name || '',
      phoneNumber: user.company?.phoneNumber || user.phoneNumber || '',
      companyName: user.company?.companyName || '',
      city: user.company?.city || '',
    });
  };

  const handleSave = async () => {
    if (user.company && user.company.companyId && (!formData.companyName || formData.companyName.trim() === '')) {
      toast.error('Company Name cannot be empty');
      setCompanyNameError(true);
      setTimeout(() => {
        companyNameRef.current?.focus();
      }, 0);
      return;
    }

    setLoading(true);
    try {
      const updatedAuthUser = {
        ...authUser,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      };

      sessionStorage.setItem('user', JSON.stringify(updatedAuthUser));
      setAuthUser(updatedAuthUser);
      if (user.company && user.company.companyId) {
        const companyPayload = {
          companyName: formData.companyName,
          phoneNumber: formData.phoneNumber,
          city: formData.city,
          socialLinks: user.company.socialLinks || {},

          services: user.company.services?.map(s => ({
            type: s.type,
            description: s.description || "",
            offerings: s.offerings || []
          })) || []
        };
        await companyAPI.update(user.company.companyId, companyPayload);
        const updatedCompany = {
          ...user.company,
          phoneNumber: formData.phoneNumber,
          city: formData.city,
          companyName: formData.companyName,
        };
        const finalAuthUserWithCompany = {
          ...updatedAuthUser,
          company: updatedCompany,
        };
        setAuthUser(finalAuthUserWithCompany);
        sessionStorage.setItem('user', JSON.stringify(finalAuthUserWithCompany));
        setUser(finalAuthUserWithCompany);
        toast.success('Profile updated successfully!');
      } else {
        setUser(updatedAuthUser);
        toast.success('Name updated successfully!');
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8 pt-24">
      <div className="container mx-auto px-4 max-w-5xl">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and settings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-32"></div>

              <div className="relative px-6 pb-6">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
                    {user?.company?.companyId && !imgError ? (
                      <img
                        src={`${API_HOST}/upload/logo/${user.company.companyId}?t=${Date.now()}`}
                        alt="Company Logo"
                        className="w-full h-full object-cover rounded-full"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-14 w-14 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Camera icon overlay */}
                  <Link
                    to="/company"
                    title="Change Logo"
                    className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-teal-50 transition"
                  >
                    <Camera className="h-4 w-4 text-teal-600" />
                  </Link>
                </div>

                <div className="pt-20 text-center">
                  <h2 className="text-2xl font-bold text-gray-800">{user.company?.companyName}</h2>

                  <div className="flex justify-center gap-2 my-3">
                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {user.role}
                    </span>
                    {user.role === 'ADMIN' && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <User className="h-6 w-6 text-teal-600" />
                  Company Information
                </h3>

                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-teal-600 text-white items-center px-4 py-2 rounded-lg flex gap-2 hover:bg-teal-700 transition"
                  >
                    <Edit2 className="h-4 w-4" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-green-600 text-white items-center px-4 py-2 rounded-lg flex gap-2 hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" /> {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-200 items-center px-4 py-2 rounded-lg flex gap-2 hover:bg-gray-300 transition"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <Label label="Company Name">
                {isEditing && user.company ? (
                  <input
                    ref={companyNameRef}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${companyNameError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-teal-500'
                      }`}
                    value={formData.companyName || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, companyName: e.target.value });
                      if (companyNameError) setCompanyNameError(false);
                    }}
                  />
                ) : (
                  <Value icon={<Building2 className="h-5 w-5 text-blue-600" />} value={user.company?.companyName || 'Not provided'} />
                )}
              </Label>

              <Label label="Email Address">
                <Value icon={<Mail className="h-5 w-5 text-red-500" />} value={user.email} />
              </Label>

              <Label label="City">
                {isEditing && user.company ? (
                  citiesLoading ? (
                    <div className="text-sm text-gray-500 animate-pulse bg-gray-100 p-3 rounded-lg">Loading cities...</div>
                  ) : citiesError ? (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{citiesError}</div>
                  ) : (
                    <div className="relative overflow-visible">
                      <input
                        type="text"
                        placeholder="Search or select city..."
                        value={formData.city || ''}
                        autoComplete="off"
                        onFocus={() => {
                          const dropdown = document.getElementById('profile-city-dropdown');
                          const overlay = document.getElementById('profile-city-dropdown-overlay');
                          if (dropdown) dropdown.classList.remove('hidden');
                          if (overlay) overlay.classList.remove('hidden');
                        }}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      />
                      <div
                        id="profile-city-dropdown"
                        className="absolute z-[100] mt-1 w-full max-h-60 bg-white border border-gray-200 rounded-lg shadow-xl overflow-y-auto hidden animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                          <p className="text-[10px] text-gray-400 font-bold tracking-wider px-2 py-1">Available Cities</p>
                        </div>
                        {cities.filter(c =>
                          !formData.city || c.cityName.toLowerCase().includes(formData.city.toLowerCase())
                        ).length > 0 ? (
                          cities.filter(c =>
                            !formData.city || c.cityName.toLowerCase().includes(formData.city.toLowerCase())
                          ).map((c) => (
                            <button
                              key={c.cityId}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, city: c.cityName });
                                document.getElementById('profile-city-dropdown').classList.add('hidden');
                                document.getElementById('profile-city-dropdown-overlay').classList.add('hidden');
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-teal-50 hover:text-teal-700 transition-colors text-sm flex items-center justify-between group"
                            >
                              <span>{c.cityName}</span>
                              {formData.city === c.cityName && (
                                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <p className="text-sm text-gray-500 italic">No cities found matching "{formData.city}"</p>
                            <p className="text-xs text-gray-400 mt-1">You can keep typing to add a custom city.</p>
                          </div>
                        )}
                      </div>
                      <div
                        id="profile-city-dropdown-overlay"
                        className="fixed inset-0 z-[90] hidden"
                        onClick={() => {
                          document.getElementById('profile-city-dropdown').classList.add('hidden');
                          document.getElementById('profile-city-dropdown-overlay').classList.add('hidden');
                        }}
                      ></div>
                    </div>
                  )
                ) : (
                  <Value icon={<MapPin className="h-5 w-5 text-orange-500" />} value={user.company?.city || 'Not provided'} />
                )}
              </Label>

              <Label label="Company Logo">
                <div className="flex items-center gap-4 bg-gray-50 px-4 py-3 rounded-lg">
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-teal-200 shadow bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                    {user?.company?.companyId && !imgError ? (
                      <img
                        src={`${API_HOST}${user.company.logoUrl}`}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <Building2 className="h-7 w-7 text-white" />
                    )}
                  </div>
                  <Link
                    to="/company"
                    className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1 hover:underline"
                  >
                    <Camera className="h-4 w-4" />
                    {user?.company?.companyId && !imgError ? 'Change Logo' : 'Upload Logo'}
                  </Link>
                </div>
              </Label>

            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  Company Services
                </h3>
                <Link
                  to="/company"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                >
                  Manage Services <Edit2 className="h-3 w-3" />
                </Link>
              </div>

              {user.company?.services?.length > 0 ? (
                <div className="space-y-4">
                  {user.company.services.map((service, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-teal-200 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                          {service.type === 'STARTUP' ? <Building2 className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">
                            {service.type === 'STARTUP' ? 'Startup Company' : 'Service Provider'}
                          </h4>
                          <p className="text-xs font-semibold text-teal-600 flex items-center gap-1.5 mt-0.5">
                            <Phone className="h-3 w-3 text-teal-500" />
                            {service.phoneNumber || user.company?.phoneNumber || user.phoneNumber || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {service.description || 'No description provided.'}
                      </p>
                      {service.offerings?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {service.offerings.map((offering, idx) => (
                            <span
                              key={idx}
                              className="bg-white px-3 py-1 rounded-full text-xs font-medium text-teal-700 border border-teal-100 shadow-sm"
                            >
                              {offering}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 text-sm">No services registered yet.</p>
                  <Link to="/company" className="text-teal-600 font-bold text-sm mt-2 block hover:underline">
                    Setup Profile →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm text-gray-600 mb-2">{label}</label>
    {children}
  </div>
);

const Value = ({ icon, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg">
    {icon}
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);

export default ProfilePage;