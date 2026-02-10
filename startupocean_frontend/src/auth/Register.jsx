import { UserPlus, Plus, X, Building2, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    role: 'STARTUP',
    phoneNumber: '',
    description: '',
    offerings: [''],
    website: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
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
    if (formData.offerings.length > 1) {
      const newOfferings = formData.offerings.filter((_, i) => i !== index);
      setFormData({ ...formData, offerings: newOfferings });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setLoading(true);
    setError('');

    const registrationData = {
      name: formData.name,
      email: formData.email,
      companyName: formData.companyName,
      role: formData.role,
      phoneNumber: formData.phoneNumber || null,
    };

    try {
      const response = await authAPI.register(registrationData);

      if (response.data) {
        const companyData = {
          phoneNumber: formData.phoneNumber,
          description: formData.description,
          offerings: formData.offerings.filter(o => o.trim() !== ''),
          socialLinks: {
            website: formData.website,
            linkedin: formData.linkedin,
            facebook: formData.facebook,
            instagram: formData.instagram,
            twitter: formData.twitter,
          },
        };

        localStorage.setItem('pendingCompanyData', JSON.stringify(companyData));
        navigate('/verify-otp', {
          state: {
            email: formData.email,
            companyName: formData.companyName,
            role: formData.role,               
          },
          replace: true
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistering(false);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Invalid registration data. Please check your inputs.');
      } else if (error.response?.status === 409) {
        setError('Email already registered. Please use a different email or login.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      desc: 'Enter your basic details',
      icon: <UserPlus className="w-6 h-6" />,
    },
    {
      id: 2,
      title: 'Company Details',
      desc: 'Tell us about your company (Optional)',
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      id: 3,
      title: 'Social Networking',
      desc: 'Add your social media links (Optional)',
      icon: <Share2 className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        <div className="bg-gradient-to-b from-teal-600 to-teal-700 text-white p-10 flex flex-col ">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold mb-4">Registration Guide</h2>
          <p className="text-xs sm:text-sm text-teal-100 mb-10">
            Complete your StartupOcean registration in 3 easy steps.
          </p>

          <div className="space-y-6">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 transform
                ${step === s.id
                    ? 'bg-white text-teal-700 scale-105 shadow-lg'
                    : 'bg-teal-500 hover:bg-teal-400'
                  }`}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full font-bold transition-all duration-300
                  ${step === s.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-teal-700 text-white'
                    }`}
                >
                  {s.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg">{s.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 text-xs sm:text-sm text-teal-200">
            Step {step} of 3 • StartupOcean Registration
          </p>
        </div>
        <div className="p-10">
          <div className="text-center ">
            <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-800">Register on StartupOcean</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              {step === 1 && 'Step 1 of 3: Enter your basic details'}
              {step === 2 && 'Step 2 of 3: Tell us about your company'}
              {step === 3 && 'Step 3 of 3: Add your social media links'}
            </p>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs sm:text-sm text-red-800">{error}</p>
            </div>
          )}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Email Address (OTP Based) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
                <p className="text-xs sm:text-xs text-gray-500 mt-1">OTP will be sent to this email for verification</p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Register As *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="STARTUP">Startup Company</option>
                  <option value="SERVICE_PROVIDER">Service Provider</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
              >
                Next: Company Details →
              </button>

              <p className="text-center text-xs sm:text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <a href="/login" className="text-teal-600 font-semibold hover:underline">
                  Login here
                </a>
              </p>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
                <p className="text-xs sm:text-sm text-teal-800">
                  ℹ️ The following information is optional. You can complete it now or later from your profile.
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Description (Max 150 chars)
                </label>
                <textarea
                  maxLength={150}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={3}
                  placeholder="Short description (2-3 lines)"
                />
                <p className="text-xs sm:text-xs text-gray-500 mt-1 text-right">
                  {formData.description.length}/150
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Offerings / Specialization
                </label>
                <div className="space-y-3">
                  {formData.offerings.map((offering, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={offering}
                        onChange={(e) => updateOffering(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g. IT Consulting"
                      />
                      {formData.offerings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOffering(index)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOffering}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-100 transition"
                >
                  <Plus className="h-4 w-4" />
                  Add More
                </button>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="1234567890"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                >
                  Next: Social Networking →
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
                <p className="text-xs sm:text-sm text-teal-800">
                  ℹ️ Add your social media profiles to help others connect with you (Optional)
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://www.yourcompany.com"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">LinkedIn Page</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://facebook.com/yourcompany"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://instagram.com/yourcompany"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://twitter.com/yourcompany"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={registering}

                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50"
                >
                  {registering ? 'Creating Account...' : 'Complete Registration →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;