
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

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => {
            setFormData({ ...formData, phoneNumber: e.target.value });
            if (phoneError) setPhoneError('');
          }}
          onBlur={() => {
            const phone = formData.phoneNumber?.trim();
            if (phone) {
              const digits = phone.replace(/\D/g, '');
              const isMobile = /^\d{10}$/.test(digits);
              const isLandline = /^\d{6,12}$/.test(digits);
              if (!isMobile && !isLandline) {
                setPhoneError('Enter a valid phone number: 10-digit mobile or 6–12 digit landline');
              } else {
                setPhoneError('');
              }
            } else {
              setPhoneError('');
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="1234567890"
        />
        {phoneError && <p className="text-xs text-red-600 mt-1">{phoneError}</p>}
      </div>

      {/* City */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">City</label>
        {citiesLoading ? (
          <div className="text-xs text-gray-500">Loading cities...</div>
        ) : citiesError ? (
          <div className="text-xs text-red-600">{citiesError}</div>
        ) : (
          <select
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.cityId} value={c.cityName}>
                {c.cityName}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};
export default BasicInformation;
