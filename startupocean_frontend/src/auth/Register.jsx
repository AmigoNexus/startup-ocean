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

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');
    if (step === 1 && !isEmailVerified) {
      toast.error('Please verify your email address to continue');
      return;
    }
    if (step === 2) {
      const phone = formData.phoneNumber?.trim();
      if (phone) {
        const digits = phone.replace(/\D/g, '');
        const isMobile = /^\d{10}$/.test(digits);
        const isLandline = /^\d{6,12}$/.test(digits);
        if (!isMobile && !isLandline) {
          setPhoneError('Enter a valid phone number: 10-digit mobile or 6–12 digit landline');
          return;
        }
      }
      setPhoneError('');

      if (formData.companyDetails.length === 0) {
        setError('Please select at least one company type');
        return;
      }

      // Check for incomplete company details and show specific error
      const incompleteIndex = formData.companyDetails.findIndex(c => {
        const descEmpty = !c.description || c.description.trim() === '';
        return descEmpty;
      });

      if (incompleteIndex !== -1) {
        const incompleteType = formData.companyDetails[incompleteIndex].type;
        const typeName = incompleteType === 'STARTUP' ? 'Startup Company' : 'Service Provider';

        // Scroll to top to show the error
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setRequireSequentialFill(true);
        setEditingIndex(incompleteIndex);
        toast.error(`Please fill the description for ${typeName}`);
        setError(`⚠️ Incomplete Details: Please fill the description for "${typeName}" before proceeding.`);
        return;
      }
    }

    if (step < 3) {
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

      if (response.data.success && response.data.data) {
        const { token, ...userData } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }

      setIsEmailVerified(true);
      setIsOtpSent(false);
      toast.success('Email verified');
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
          offerings: ['']
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
    newCompanyDetails[index][field] = value;
    setFormData({ ...formData, companyDetails: newCompanyDetails });
  };

  const addOffering = (companyIndex) => {
    const newCompanyDetails = [...formData.companyDetails];
    newCompanyDetails[companyIndex].offerings.push('');
    setFormData({ ...formData, companyDetails: newCompanyDetails });
  };

  const updateOffering = (companyIndex, offeringIndex, value) => {
    const newCompanyDetails = [...formData.companyDetails];
    newCompanyDetails[companyIndex].offerings[offeringIndex] = value;
    setFormData({ ...formData, companyDetails: newCompanyDetails });
  };

  const removeOffering = (companyIndex, offeringIndex) => {
    const newCompanyDetails = [...formData.companyDetails];
    if (newCompanyDetails[companyIndex].offerings.length > 1) {
      newCompanyDetails[companyIndex].offerings = newCompanyDetails[companyIndex].offerings.filter((_, i) => i !== offeringIndex);
      setFormData({ ...formData, companyDetails: newCompanyDetails });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError('');

    try {
      await companyAPI.create({
        email: formData.email,
        companyName: formData.companyName,
        phoneNumber: formData.phoneNumber,

        services: formData.companyDetails.map(detail => ({
          type: detail.type,
          description: detail.description,
          offerings: detail.offerings.filter(o => o.trim() !== "")
        })),

        socialLinks: {
          website: formData.website,
          linkedin: formData.linkedin,
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
        },

        city: formData.city
      });
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
            <div className="mb-3 p-2 px-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-800">{error}</p>
            </div>
          )}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">
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
              <CompanyDetails
                formData={formData}
                setFormData={(newData) => {
                  setFormData(newData);
                  setIsCompanyDetailsSaved(false);
                }}
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
                onAllSaved={() => {
                  setError('');
                  setRequireSequentialFill(false);
                  setIsCompanyDetailsSaved(true);
                  toast.success('Company details saved');
                }}
              />
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
                  disabled={!isCompanyDetailsSaved}
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Social Networking →
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <SocialNetworking formData={formData} setFormData={setFormData} />
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
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registering ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Creating Account...
                    </div>
                  ) : (
                    'Complete Registration →'
                  )}
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