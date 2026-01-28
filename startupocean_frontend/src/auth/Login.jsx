import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const { requestLoginOtp, verifyLoginOtp } = useAuth();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await requestLoginOtp(email);

    if (success) {
      setStep(2);
      startCountdown();
    }

    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    const success = await verifyLoginOtp(email, otp);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const startCountdown = () => {
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
  };

  const handleResendOtp = async () => {
    if (!canResend || loading) return;

    setLoading(true);
    const success = await requestLoginOtp(email);
    setLoading(false);

    if (success) {
      startCountdown();
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp('');
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <LogIn className="h-12 w-12 text-teal-400 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Login</h2>
          <p className="text-gray-600 mt-2">
            {step === 1 ? 'Enter your email to continue' : 'Enter OTP sent to your email'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="your.email@example.com"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-400 text-white py-3 rounded-lg font-semibold hover:bg-teal-500 transition disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP →'}
            </button>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-teal-400 font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
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
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center text-3xl tracking-widest font-semibold"
                placeholder="000000"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                OTP sent to <span className="font-semibold text-teal-400">{email}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-teal-400 text-white py-3 rounded-lg font-semibold hover:bg-teal-500 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleBackToEmail}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Change Email
              </button>

              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-sm text-teal-400 hover:text-teal-600 font-semibold disabled:opacity-50"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend in <span className="font-semibold text-teal-400">{countdown}s</span>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;