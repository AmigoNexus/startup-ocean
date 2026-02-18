import { UserPlus, Plus, X, Building2, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, companyAPI } from '../services/api';
import toast from 'react-hot-toast';
import BasicInformation from '../components/BasicInformation';
import CompanyDetails from '../components/CompanyDetails';
import SocialNetworking from '../components/SocialNetworking';

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState(1);
  const [stepHistory, setStepHistory] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    phoneNumber: '',
    isPhoneVisible: true,
    companyDetails: [],
    website: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showCompanyTypeSelection, setShowCompanyTypeSelection] = useState(false);
  const [requireSequentialFill, setRequireSequentialFill] = useState(false);
  const [isCompanyDetailsSaved, setIsCompanyDetailsSaved] = useState(false);
  const [editingIndex, setEditingIndex] = useState(0);
  const [tempVerifiedData, setTempVerifiedData] = useState(null);

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');
    if (step === 1 && !isEmailVerified) {
      toast.error('Please verify your email address to continue');
      return;
    }
    if (step === 2) {
      if (formData.companyDetails.length === 0) {
        toast.error('Please select at least one company type');
        return;
      }
      setIsCompanyDetailsSaved(false);
      setEditingIndex(0);
    }

    if (step === 3) {
      if (!isCompanyDetailsSaved) {
        toast.error('Please save your company details to continue');
        return;
      }
    }

    if (step < 4) {
      setStepHistory((h) => [...h, step]);
      setStep(step + 1);
    }
  };

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (isSendingOtp) return;

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast('Please enter a valid email address');
      return;
    }

    try {
      setIsSendingOtp(true);
      const response = await authAPI.sendOtp(formData.email);
      if (response.data.success) {
        setIsOtpSent(true);
        setResendTimer(30);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }

    } catch (err) {
      console.error('Failed to send OTP', err);
      toast.error('Failed to send OTP. Try again later');
    } finally {
      setIsSendingOtp(false);
    }
  };


  const handleVerifyOtp = async () => {
    if (isVerifyingOtp) return;
    if (!otp || otp.trim().length === 0) {
      toast.error('Please enter the OTP');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const response = await authAPI.verifyOtp({
        email: formData.email,
        otp: otp.trim(),
      });

      if (response.data.success) {
        if (response.data.data) {
          setTempVerifiedData(response.data.data);
        }

        setIsEmailVerified(true);
        setIsOtpSent(false);
        toast.success('Email verified');
      } else {
        toast.error(response.data.message || "Invalid OTP");
        setOtp('');
      }

    } catch (err) {
      console.error('OTP verify failed', err);
      toast.error('Invalid OTP. Please try again');
      setOtp('');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handlePrevStep = () => {
    if (stepHistory.length > 0) {
      const prev = stepHistory[stepHistory.length - 1];
      setStepHistory((h) => h.slice(0, -1));
      setStep(prev);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const addCompanyDetail = () => {
    const existingTypes = formData.companyDetails.map(c => c.type);
    const availableTypes = [
      { value: 'STARTUP', label: 'Startup Company' },
      { value: 'SERVICE_PROVIDER', label: 'Service Provider' }
    ].filter(t => !existingTypes.includes(t.value));

    if (availableTypes.length === 0) {
      toast.error('You can only add Startup and Service Provider once each');
      return;
    }

    if (availableTypes.length === 1) {
      confirmAddCompanyDetail(availableTypes[0].value);
    } else {
      setShowCompanyTypeSelection(true);
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
          isPhoneVisible: formData.isPhoneVisible ?? true
        }
      ]
    });
    setShowCompanyTypeSelection(false);

    setEditingIndex(newIndex);
    setRequireSequentialFill(true);
  };

  const removeCompanyDetail = (index) => {
    if (formData.companyDetails.length > 1) {
      setFormData({
        ...formData,
        companyDetails: formData.companyDetails.filter((_, i) => i !== index)
      });
    }
  };

  const updateCompanyDetail = (index, field, value) => {
    const newCompanyDetails = [...formData.companyDetails];
    newCompanyDetails[index] = { ...newCompanyDetails[index], [field]: value };
    setFormData({ ...formData, companyDetails: newCompanyDetails });
  };

  const addOffering = (companyIndex) => {
    const newCompanyDetails = [...formData.companyDetails];
    newCompanyDetails[companyIndex] = {
      ...newCompanyDetails[companyIndex],
      offerings: [...newCompanyDetails[companyIndex].offerings, '']
    };
    setFormData({ ...formData, companyDetails: newCompanyDetails });
  };

  const updateOffering = (companyIndex, offeringIndex, value) => {
    const newCompanyDetails = [...formData.companyDetails];
    const newOfferings = [...newCompanyDetails[companyIndex].offerings];
    newOfferings[offeringIndex] = value;
    newCompanyDetails[companyIndex] = { ...newCompanyDetails[companyIndex], offerings: newOfferings };
    setFormData({ ...formData, companyDetails: newCompanyDetails });
  };

  const removeOffering = (companyIndex, offeringIndex) => {
    const newCompanyDetails = [...formData.companyDetails];
    if (newCompanyDetails[companyIndex].offerings.length > 1) {
      const newOfferings = newCompanyDetails[companyIndex].offerings.filter((_, i) => i !== offeringIndex);
      newCompanyDetails[companyIndex] = { ...newCompanyDetails[companyIndex], offerings: newOfferings };
      setFormData({ ...formData, companyDetails: newCompanyDetails });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError('');

    try {
      if (tempVerifiedData?.token) {
        localStorage.setItem('token', tempVerifiedData.token);
        localStorage.setItem('user', JSON.stringify(tempVerifiedData));
      }

      await companyAPI.create({
        email: formData.email,
        companyName: formData.companyName,
        phoneNumber: formData.companyDetails[0]?.phoneNumber || formData.phoneNumber,
        isPhoneVisible: formData.companyDetails[0]?.isPhoneVisible ?? formData.isPhoneVisible,
        city: formData.city,

        services: formData.companyDetails.map(detail => ({
          type: detail.type,
          description: detail.description,
          offerings: detail.offerings.filter(o => o.trim() !== ""),
          phoneNumber: detail.phoneNumber?.trim() || null,
          isPhoneVisible: detail.isPhoneVisible ?? true
        })),

        socialLinks: {
          website: formData.website,
          linkedin: formData.linkedin,
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
        }
      });

      if (tempVerifiedData) {
        const { token, ...userData } = tempVerifiedData;
        setUser(userData);
      }

      toast.success("Company Registered!");
      navigate("/dashboard");
    } catch (error) {
      console.error('Registration error:', error);

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
      setRegistering(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Basic Info',
      desc: 'Account details',
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      id: 2,
      title: 'Company Types',
      desc: 'Select roles',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 3,
      title: 'Details',
      desc: 'Company specifics',
      icon: <Plus className="w-5 h-5" />,
    },
    {
      id: 4,
      title: 'Socials',
      desc: 'Networking',
      icon: <Share2 className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[650px]">

        <div className="md:col-span-4 bg-gradient-to-br from-teal-600 to-teal-800 text-white p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">StartupOcean</h2>
            <p className="text-teal-100 text-sm mb-12">Connect and grow with the ecosystem.</p>

            <div className="space-y-4">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300
                ${step === s.id ? 'bg-white/20 border border-white/30 backdrop-blur-sm' : 'opacity-60'}`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold
                  ${step === s.id ? 'bg-white text-teal-700' : 'bg-teal-700/50 text-white border border-teal-500/50'}`}>
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide">{s.title}</h3>
                    <p className="text-[10px] opacity-80 uppercase font-semibold">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-teal-500/30">
            <p className="text-xs text-teal-200">
              Registration Progress: {Math.round((step / 4) * 100)}%
            </p>
            <div className="w-full bg-teal-900/50 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-8 p-10 flex flex-col">
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-gray-900">{steps[step - 1].title}</h2>
              <p className="text-gray-500 mt-1">{steps[step - 1].desc}</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <BasicInformation
                  formData={formData}
                  setFormData={setFormData}
                  isEmailVerified={isEmailVerified}
                  isOtpSent={isOtpSent}
                  isSendingOtp={isSendingOtp}
                  isVerifyingOtp={isVerifyingOtp}
                  otp={otp}
                  setOtp={setOtp}
                  resendTimer={resendTimer}
                  phoneError={phoneError}
                  setPhoneError={setPhoneError}
                  handleSendOtp={handleSendOtp}
                  handleVerifyOtp={handleVerifyOtp}
                />
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold shadow-teal-100 shadow-xl hover:bg-teal-700 transition transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Next: Selection →
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <a href="/login" className="text-teal-600 font-bold hover:underline">Log in</a>
                  </p>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <CompanyDetails
                  formData={formData}
                  setFormData={setFormData}
                  removeCompanyDetail={removeCompanyDetail}
                  updateCompanyDetail={updateCompanyDetail}
                  addOffering={addOffering}
                  updateOffering={updateOffering}
                  removeOffering={removeOffering}
                  confirmAddCompanyDetail={confirmAddCompanyDetail}
                  viewMode="SELECTION"
                />
                <div className="flex gap-4 pt-8 border-t">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 text-white py-4 rounded-xl font-bold shadow-teal-100 shadow-xl hover:bg-teal-700 transition transform hover:-translate-y-0.5"
                  >
                    Next: Fill Details →
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleNextStep} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <CompanyDetails
                  formData={formData}
                  setFormData={setFormData}
                  updateCompanyDetail={updateCompanyDetail}
                  addOffering={addOffering}
                  updateOffering={updateOffering}
                  removeOffering={removeOffering}
                  editingIndex={editingIndex}
                  setEditingIndex={setEditingIndex}
                  phoneError={phoneError}
                  setPhoneError={setPhoneError}
                  onAllSaved={() => {
                    setIsCompanyDetailsSaved(true);
                    toast.success('All details saved successfully!');
                  }}
                  viewMode="FORM"
                />
                <div className="flex gap-4 pt-8 border-t">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-4 rounded-xl font-bold transition transform shadow-xl
                    ${isCompanyDetailsSaved ? 'bg-teal-600 text-white hover:bg-teal-700 hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    disabled={!isCompanyDetailsSaved}
                  >
                    Next: Socials →
                  </button>
                </div>
              </form>
            )}

            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <SocialNetworking formData={formData} setFormData={setFormData} />
                <div className="flex gap-4 pt-8 border-t">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={registering}
                    className="flex-1 bg-teal-600 text-white py-4 rounded-xl font-bold shadow-teal-100 shadow-xl hover:bg-teal-700 transition transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {registering ? 'Creating Account...' : 'Complete Registration →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;