
import { useEffect, useState } from 'react';
import { locationAPI } from '../services/api';

const BasicInformation = ({
  formData,
  setFormData,
  isEmailVerified,
  isOtpSent,
  isSendingOtp,
  isVerifyingOtp,
  otp,
  setOtp,
  resendTimer,
  phoneError,
  setPhoneError,
  handleSendOtp,
  handleVerifyOtp,
}) => {
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
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
    fetch();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Company Name *
        </label>
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
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Email Address (OTP Based) *
        </label>
        <div className="relative">
          <input
            type="email"
            required
            disabled={isEmailVerified || isOtpSent}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${isEmailVerified ? 'bg-green-50 border-green-200' : ''
              }`}
            placeholder="your.email@example.com"
          />
          <div className="absolute right-2 top-2">
            {isEmailVerified ? (
              <span className="px-3 py-1 rounded-md bg-green-100 text-green-700 text-xs font-semibold">
                Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp || isOtpSent || !formData.email}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${isOtpSent
                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
              >
                {isSendingOtp ? 'Sending...' : isOtpSent ? 'Sent' : 'Verify'}
              </button>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-xs text-gray-500 mt-1">OTP will be sent to this email for verification</p>

        {isOtpSent && !isEmailVerified && (
          <div className="mt-3 p-4 bg-teal-50 rounded-lg border border-teal-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-teal-700">Enter verification code</p>
              <button
                type="button"
                onClick={() => {
                  setOtp('');
                }}
                className="text-xs text-gray-500 hover:underline"
              >
                Change Email
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-center tracking-wider"
                placeholder="Enter OTP"
                maxLength={6}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp || otp.length < 4}
                className="px-4 py-2 bg-teal-600 text-white rounded-md"
              >
                {isVerifyingOtp ? 'Verifying...' : 'Confirm'}
              </button>
            </div>
            <div className="flex items-center justify-end mt-2 text-xs text-gray-600">
              {resendTimer > 0 ? (
                <span>Resend in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="underline text-teal-600"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}
      </div>



      {/* City */}
      <div className="relative overflow-visible">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">City</label>
        {citiesLoading ? (
          <div className="text-xs text-gray-500 animate-pulse bg-gray-100 p-3 rounded-lg">Loading cities...</div>
        ) : citiesError ? (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{citiesError}</div>
        ) : (
          <div className="relative overflow-visible">
            <input
              type="text"
              placeholder="Search or select city..."
              value={formData.city || ''}
              autoComplete="off"
              onFocus={() => {
                const dropdown = document.getElementById('city-dropdown');
                const overlay = document.getElementById('city-dropdown-overlay');
                if (dropdown) dropdown.classList.remove('hidden');
                if (overlay) overlay.classList.remove('hidden');
              }}
              onChange={(e) => {
                setFormData({ ...formData, city: e.target.value });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
            <div
              id="city-dropdown"
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
                      document.getElementById('city-dropdown').classList.add('hidden');
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
            {/* Overlay to close dropdown when clicking outside */}
            <div
              id="city-dropdown-overlay"
              className="fixed inset-0 z-[90] hidden"
              onClick={() => {
                document.getElementById('city-dropdown').classList.add('hidden');
                document.getElementById('city-dropdown-overlay').classList.add('hidden');
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BasicInformation;
