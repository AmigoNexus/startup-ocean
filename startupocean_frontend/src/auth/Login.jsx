import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const navigate = useNavigate();
  const { requestLoginOtp, verifyLoginOtp } = useAuth();

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    setSendingOtp(true);

    const result = await requestLoginOtp(email);

    setSendingOtp(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    setStep(2);
    startCountdown();
  };


  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) return;

    setVerifyingOtp(true);

    const success = await verifyLoginOtp(email, otp);

    setVerifyingOtp(false);

    if (success) {
      toast.success("Login successful!");
      navigate("/dashboard");
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

    if (success && success.success !== false) {
      toast.success(success.message || "OTP resent successfully!");
      startCountdown();
    } else if (success && success.success === false) {
      toast.error(success.message || "Failed to resend OTP");
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp('');
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-400/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-400/30 blur-[120px] rounded-full" />
      
      <div className="max-w-lg w-full relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-400/20 to-teal-500/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-teal-500/20 shadow-inner">
              <LogIn className="h-8 w-8 text-teal-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-3 text-center text-sm font-medium">
              {step === 1 
                ? 'Sign in to access your ocean of opportunities' 
                : `We've sent a 6-digit code to your email`}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none text-slate-800 placeholder-slate-400 font-medium"
                    placeholder="your@email.com"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sendingOtp}
                className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-teal-200 hover:bg-teal-700 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 group"
              >
                {sendingOtp ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Continue</span>
                    <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center px-2">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 px-4 text-slate-400 font-bold tracking-widest">or</span>
                </div>
              </div>

              <p className="text-center text-slate-600 text-sm font-medium">
                New to StartupOcean?{' '}
                <Link to="/register" className="text-teal-600 font-bold hover:text-teal-700 transition-colors">
                  Create Account
                </Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center text-3xl tracking-[0.75em] font-black text-teal-700 outline-none transition-all shadow-inner"
                  placeholder="000000"
                  autoFocus
                />
                <div className="bg-teal-50/50 border border-teal-100/50 p-3 rounded-xl">
                  <p className="text-[11px] text-teal-700 text-center font-semibold">
                    Code sent to <span className="underline opacity-80">{email}</span>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={verifyingOtp || otp.length !== 6}
                className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-teal-200 hover:bg-teal-700 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center"
              >
                {verifyingOtp ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Verify & Account Access'
                )}
              </button>

              <div className="flex flex-col gap-4 pt-4">
                <div className="flex justify-between items-center text-sm">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold transition-colors py-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>

                  <div className="flex items-center">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-teal-600 hover:text-teal-700 font-bold disabled:opacity-50 transition-colors py-2 underline underline-offset-4"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded-full border border-slate-200/50 font-mono text-xs font-bold text-slate-500">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        <span>00:{countdown.toString().padStart(2, '0')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;