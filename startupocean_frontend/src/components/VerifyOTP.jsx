import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { verifyRegistrationOtp } = useAuth();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    const success = await verifyRegistrationOtp(email, otp);
    setLoading(false);

    if (success) {
      const pendingData = localStorage.getItem('pendingCompanyData');

      if (pendingData) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/auth/resend-otp?email=${email}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'OTP resent successfully');
        setCountdown(60);
        setCanResend(false);

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        alert(data.message || 'Failed to resend OTP');
      }
    } catch {
      alert('Error resending OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <Mail className="h-16 w-16 text-blue-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
          <p className="text-gray-600 mt-2 text-center">
            We've sent a 6-digit OTP to
          </p>
          <p className="text-blue-600 font-semibold">{email}</p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Enter OTP
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-3xl tracking-widest font-semibold"
              placeholder="000000"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Please check your email for the OTP
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm disabled:opacity-50"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Resend OTP in <span className="font-semibold text-blue-600">{countdown}s</span>
              </p>
            )}
          </div>

          <button
            onClick={() => navigate('/register')}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Registration
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Check your spam folder if you don't see the email in your inbox.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;