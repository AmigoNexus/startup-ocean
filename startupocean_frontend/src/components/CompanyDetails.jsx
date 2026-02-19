import { Plus, X, Building2, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompanyDetails = ({
  formData,
  setFormData,
  removeCompanyDetail,
  updateCompanyDetail,
  addOffering,
  updateOffering,
  removeOffering,
  confirmAddCompanyDetail,
  requireSequentialFill,
  editingIndex,
  setEditingIndex,
  onAllSaved,
  phoneError,
  setPhoneError,
  viewMode = 'BOTH'
}) => {
  useEffect(() => {
    if (requireSequentialFill && editingIndex !== undefined) {
    }
  }, [requireSequentialFill, editingIndex]);

  const isSingleSelect = formData.companyDetails.length === 1;
  const isLastItem = editingIndex === formData.companyDetails.length - 1;

  const handleToggleCompanyType = (type) => {
    const exists = formData.companyDetails.some(c => c.type === type);
    if (exists) {
      const idx = formData.companyDetails.findIndex(c => c.type === type);
      removeCompanyDetail(idx);
      if (editingIndex >= formData.companyDetails.length - 1) {
        setEditingIndex(Math.max(0, formData.companyDetails.length - 2));
      }
    } else {
      confirmAddCompanyDetail(type);
    }
  };

  const validatePhone = (phone) => {
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
  };

  return (
    <div className="space-y-6">
      {(viewMode === 'SELECTION' || viewMode === 'BOTH') && (
        <>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-2 px-3 mb-3">
            <p className="text-xs text-teal-700">
              ℹ️ Select your company type. You can select one or both.
            </p>
          </div>

          <div className="space-y-4">
            {window.location.pathname.includes('/register') && (
              <p className="text-sm font-semibold text-gray-700 select-none">Register As *</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleToggleCompanyType('STARTUP')}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition select-none ${formData.companyDetails.some(c => c.type === 'STARTUP') ? 'border-teal-600 bg-teal-50 shadow-md' : 'border-gray-200 hover:border-teal-400 hover:bg-gray-50'
                  }`}
              >
                <div className={`p-2 rounded-lg ${formData.companyDetails.some(c => c.type === 'STARTUP') ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">Startup Company</p>
                  <p className="text-[10px] text-gray-500">I have an innovative startup</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleToggleCompanyType('SERVICE_PROVIDER')}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition select-none ${formData.companyDetails.some(c => c.type === 'SERVICE_PROVIDER') ? 'border-teal-600 bg-teal-50 shadow-md' : 'border-gray-200 hover:border-teal-400 hover:bg-gray-50'
                  }`}
              >
                <div className={`p-2 rounded-lg ${formData.companyDetails.some(c => c.type === 'SERVICE_PROVIDER') ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
                  <Share2 className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800">Service Provider</p>
                  <p className="text-[10px] text-gray-500">I provide expert services</p>
                </div>
              </button>
            </div>
            {viewMode === 'SELECTION' && formData.companyDetails.length > 0 && (
              <p className="text-xs text-green-600 font-medium">✓ {formData.companyDetails.length} type(s) selected. Click next to fill details.</p>
            )}
          </div>
        </>
      )}

      {(viewMode === 'FORM' || viewMode === 'BOTH') && formData.companyDetails.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-600 text-white rounded-lg">
                  {formData.companyDetails[editingIndex]?.type === 'STARTUP' ? <Building2 className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {formData.companyDetails[editingIndex]?.type === 'STARTUP' ? 'Startup Details' : 'Service Provider Details'}
                </h3>
              </div>
              {formData.companyDetails.length > 1 && (
                <div className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                  STEP {editingIndex + 1} OF {formData.companyDetails.length}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  What do you do? (Max 250 chars) *
                </label>
                <textarea
                  maxLength={250}
                  value={formData.companyDetails[editingIndex].description}
                  onChange={(e) => updateCompanyDetail(editingIndex, 'description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
                  rows={4}
                  placeholder={`Describe your ${formData.companyDetails[editingIndex]?.type === 'STARTUP' ? 'startup mission and product' : 'services and expertise'}...`}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-[10px] text-gray-400">Be clear and concise for better reach.</p>
                  <p className="text-[10px] font-bold text-gray-500">{formData.companyDetails[editingIndex].description.length}/250</p>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Offerings & Specializations</label>
                <div className="space-y-2">
                  {formData.companyDetails[editingIndex].offerings.map((offering, offeringIndex) => (
                    <div key={offeringIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={offering}
                        onChange={(e) => updateOffering(editingIndex, offeringIndex, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                        placeholder="e.g. AI/ML, Cloud Services, etc."
                      />
                      {formData.companyDetails[editingIndex].offerings.length > 1 && (
                        <button type="button" onClick={() => removeOffering(editingIndex, offeringIndex)} className="p-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50"><X className="h-4 w-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addOffering(editingIndex)} className="mt-2 flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline"><Plus className="h-3 w-3" /> Add Offering</button>
              </div>

              {/* Phone Number Section - Shown for every service item */}
              <div className="pt-6 mt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Contact Number</h4>
                    <p className="text-[10px] text-gray-500">Phone for this specific {formData.companyDetails[editingIndex]?.type === 'STARTUP' ? 'startup' : 'service'}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.companyDetails[editingIndex].isPhoneHidden ?? false}
                      onChange={(e) => updateCompanyDetail(editingIndex, 'isPhoneHidden', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                    <span className="ml-2 text-xs font-bold text-gray-600">
                      {formData.companyDetails[editingIndex].isPhoneHidden ? 'Hide' : 'Public'}
                    </span>
                  </label>
                </div>
                <input
                  type="tel"
                  value={formData.companyDetails[editingIndex].phoneNumber || ''}
                  onChange={(e) => {
                    updateCompanyDetail(editingIndex, 'phoneNumber', e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  onBlur={(e) => validatePhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter 10-digit number"
                />
                {phoneError && <p className="text-[10px] text-red-500 mt-1 font-bold">{phoneError}</p>}
              </div>

              <div className="flex justify-between pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    if (editingIndex > 0) setEditingIndex(editingIndex - 1);
                  }}
                  className={`px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold transition ${editingIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-50'}`}
                >
                  ← Previous
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!formData.companyDetails[editingIndex].description?.trim()) {
                      toast.error('Please provide a description');
                      return;
                    }

                    const currentPhone = formData.companyDetails[editingIndex].phoneNumber?.trim();
                    if (currentPhone) {
                      const digits = currentPhone.replace(/\D/g, '');
                      if (!/^\d{10}$/.test(digits) && !/^\d{6,12}$/.test(digits)) {
                        toast.error('Invalid phone number');
                        return;
                      }
                    }

                    if (isLastItem) {
                      if (onAllSaved) onAllSaved();
                    } else {
                      setEditingIndex(editingIndex + 1);
                    }
                  }}
                  className="px-8 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-teal-700 transition"
                >
                  {isLastItem ? 'Confirm Details ✓' : 'Next Detail →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;