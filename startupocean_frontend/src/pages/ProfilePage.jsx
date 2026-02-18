import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Briefcase, Building2, Edit2, Save, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { companyAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user: authUser, setUser: setAuthUser } = useAuth();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phoneNumber: '' });
  const [loading, setLoading] = useState(false);
  const activeService = user?.company?.services?.[0];

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({
        name: authUser.name || '',
        phoneNumber: authUser.phoneNumber || '',
      });
      fetchCompany();
    }
  }, [authUser]);

  const fetchCompany = async () => {
    try {
      const res = await companyAPI.getMyCompany();
      if (res.data?.success && res.data?.data) {
        const companyData = res.data.data;
        setUser((prev) => ({
          ...prev,
          company: companyData,
        }));
        setFormData((prev) => ({
          ...prev,
          phoneNumber: companyData.phoneNumber || '',
        }));
      }
    } catch (err) {
      console.error('Failed to fetch company:', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user.name || '',
      phoneNumber: user.company?.phoneNumber || user.phoneNumber || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || '',
      phoneNumber: user.company?.phoneNumber || user.phoneNumber || '',
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedAuthUser = {
        ...authUser,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      };

      localStorage.setItem('user', JSON.stringify(updatedAuthUser));
      setAuthUser(updatedAuthUser);
      if (user.company && user.company.companyId) {
        const companyPayload = {
          companyName: user.company.companyName,
          phoneNumber: formData.phoneNumber,
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
        };
        setUser({
          ...updatedAuthUser,
          company: updatedCompany,
        });
        toast.success('Profile updated successfully!');
      } else {
        setUser(updatedAuthUser);
        toast.success('Name updated successfully!');
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8">
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
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <div className="w-28 h-28 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-14 w-14 text-white" />
                    </div>
                  </div>
                </div>

                <div className="pt-20 text-center">
                  <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>

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
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg flex gap-2 hover:bg-teal-700 transition"
                  >
                    <Edit2 className="h-4 w-4" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex gap-2 hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" /> {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-200 px-4 py-2 rounded-lg flex gap-2 hover:bg-gray-300 transition"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <Label label="Full Name">
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <Value icon={<User className="h-5 w-5 text-teal-600" />} value={user.name} />
                )}
              </Label>

              <Label label="Email Address">
                <Value icon={<Mail className="h-5 w-5 text-red-500" />} value={user.email} />
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