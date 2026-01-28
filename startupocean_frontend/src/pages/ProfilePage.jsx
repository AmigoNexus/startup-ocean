import { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Briefcase,
  Building2, Calendar, Edit2, Save, X, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { companyAPI } from '../services/api';


const ProfilePage = () => {
  const { user: authUser, setUser: setAuthUser } = useAuth();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phoneNumber: '' });
  const [loading, setLoading] = useState(false);

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
      if (res.data?.success) {
        setUser((prev) => ({
          ...prev,
          company: res.data.data,
        }));
      }
    } catch {
      // no company
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user.name || '',
      phoneNumber: user.phoneNumber || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || '',
      phoneNumber: user.phoneNumber || '',
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      setAuthUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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
                  Personal Information
                </h3>

                {!isEditing ? (
                  <button onClick={handleEdit}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg flex gap-2">
                    <Edit2 className="h-4 w-4" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleSave} disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex gap-2">
                      <Save className="h-4 w-4" /> Save
                    </button>
                    <button onClick={handleCancel}
                      className="bg-gray-200 px-4 py-2 rounded-lg flex gap-2">
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <Label label="Full Name">
                {isEditing ? (
                  <input
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <Value icon={<User />} value={user.name} />
                )}
              </Label>

              <Label label="Email Address">
                <Value icon={<Mail />} value={user.email} />
              </Label>

              <Label label="Phone Number">
                {isEditing ? (
                  <input
                    className="input"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                ) : (
                  <Value icon={<Phone />} value={user.phoneNumber || 'Not provided'} />
                )}
              </Label>
            </div>

            {user.company && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-4 flex gap-2">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  Company Information
                </h3>

                <p className="font-bold">{user.company.companyName}</p>
                <p className="text-gray-600">{user.company.companyType}</p>
              </div>
            )}

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
    <span className="font-medium">{value}</span>
  </div>
);

export default ProfilePage;