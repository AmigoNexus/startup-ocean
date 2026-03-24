import { Plus, X, Building2, Share2, Info, Check, ArrowRight, ArrowLeft } from 'lucide-react';
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
      if (formData.companyDetails.length <= 1) {
        toast.error("At least one company type must be selected.");
        return;
      }
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
          <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Info className="h-5 w-5 text-teal-600 mt-0.5" />
            <p className="text-sm text-teal-800 leading-relaxed">
              Select your company type. This helps us categorize your business and show it to the right audience. You can select both if applicable.
            </p>
          </div>

          <div className="space-y-4">
            {window.location.pathname.includes('/register') && (
              <p className="text-sm font-bold text-gray-700 select-none uppercase tracking-wider">Register As *</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => handleToggleCompanyType('STARTUP')}
                className={`group relative flex flex-col items-start gap-4 p-6 border-2 rounded-2xl transition-all duration-300 select-none text-left ${
                  formData.companyDetails.some(c => c.type === 'STARTUP') 
                  ? 'border-teal-600 bg-teal-50/30 shadow-xl shadow-teal-900/5' 
                  : 'border-gray-100 hover:border-teal-200 hover:bg-teal-50/10'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${
                  formData.companyDetails.some(c => c.type === 'STARTUP') ? 'bg-teal-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-teal-100 group-hover:text-teal-600'
                }`}>
                  <Building2 className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-extrabold text-gray-800 text-lg">Startup Company</p>
                  <p className="text-sm text-gray-500 mt-1 leading-snug">I have an innovative startup with a focus on growth and scale.</p>
                </div>
                {formData.companyDetails.some(c => c.type === 'STARTUP') && (
                  <div className="absolute top-4 right-4 bg-teal-600 text-white rounded-full p-1 shadow-lg">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleToggleCompanyType('SERVICE_PROVIDER')}
                className={`group relative flex flex-col items-start gap-4 p-6 border-2 rounded-2xl transition-all duration-300 select-none text-left ${
                  formData.companyDetails.some(c => c.type === 'SERVICE_PROVIDER') 
                  ? 'border-teal-600 bg-teal-50/30 shadow-xl shadow-teal-900/5' 
                  : 'border-gray-100 hover:border-teal-200 hover:bg-teal-50/10'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${
                  formData.companyDetails.some(c => c.type === 'SERVICE_PROVIDER') ? 'bg-teal-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-teal-100 group-hover:text-teal-600'
                }`}>
                  <Share2 className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-extrabold text-gray-800 text-lg">Service Provider</p>
                  <p className="text-sm text-gray-500 mt-1 leading-snug">I provide expert services and professional support to businesses.</p>
                </div>
                {formData.companyDetails.some(c => c.type === 'SERVICE_PROVIDER') && (
                  <div className="absolute top-4 right-4 bg-teal-600 text-white rounded-full p-1 shadow-lg">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </button>
            </div>
            {viewMode === 'SELECTION' && formData.companyDetails.length > 0 && (
              <div className="flex items-center gap-2 mt-4 text-sm font-bold text-teal-600 bg-teal-50 w-fit px-4 py-2 rounded-full border border-teal-100">
                <Check className="h-4 w-4" />
                <span>{formData.companyDetails.length} type(s) selected. Continue to details.</span>
              </div>
            )}
          </div>
        </>
      )}

      {(viewMode === 'FORM' || viewMode === 'BOTH') && formData.companyDetails.length > 0 && (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-600/20">
                  {formData.companyDetails[editingIndex]?.type === 'STARTUP' ? <Building2 className="h-6 w-6" /> : <Share2 className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 leading-none">
                    {formData.companyDetails[editingIndex]?.type === 'STARTUP' ? 'Startup Details' : 'Service Provider Details'}
                  </h3>
                  {formData.companyDetails.length > 1 && (
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-1.5">
                      STEP {editingIndex + 1} OF {formData.companyDetails.length}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons Moved to Top Right */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (editingIndex > 0) setEditingIndex(editingIndex - 1);
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    editingIndex === 0 
                    ? 'opacity-0 pointer-events-none' 
                    : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50 border border-gray-100 hover:border-teal-200'
                  }`}
                  title="Previous Step"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                {!isLastItem && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.companyDetails[editingIndex].description?.trim()) {
                        toast.error(`Description for ${formData.companyDetails[editingIndex].type.replace('_', ' ')} is compulsory`);
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

                      setEditingIndex(editingIndex + 1);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg hover:bg-teal-700 transition-all active:scale-95"
                  >
                    {/* <span>NEXT STEP</span> */}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="group/field">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider group-focus-within/field:text-teal-600 transition-colors">
                  Business Description *
                </label>
                <textarea
                  maxLength={250}
                  value={formData.companyDetails[editingIndex].description}
                  onChange={(e) => updateCompanyDetail(editingIndex, 'description', e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition-all text-sm min-h-[140px] outline-none"
                  rows={4}
                  placeholder={`Describe your ${formData.companyDetails[editingIndex]?.type === 'STARTUP' ? 'startup mission and product' : 'services and expertise'}...`}
                />
                <div className="flex justify-between mt-2 px-1">
                  <p className="text-[10px] text-gray-400 font-medium italic">Summarize your impact in a few sentences.</p>
                  <p className={`text-[10px] font-bold ${formData.companyDetails[editingIndex].description.length > 200 ? 'text-teal-600' : 'text-gray-400'}`}>
                    {formData.companyDetails[editingIndex].description.length} / 250
                  </p>
                </div>
              </div>

              <div className="group/field">
                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider group-focus-within/field:text-teal-600 transition-colors">
                  Key Offerings & Specializations
                </label>
                <div className="space-y-3">
                  {formData.companyDetails[editingIndex].offerings.map((offering, offeringIndex) => (
                    <div key={offeringIndex} className="flex gap-2 group/offering">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={offering}
                          onChange={(e) => updateOffering(editingIndex, offeringIndex, e.target.value)}
                          className="w-full pl-5 pr-10 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition-all text-sm outline-none"
                          placeholder="e.g. AI/ML, Cloud Services, Enterprise Consulting"
                        />
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-xl opacity-0 group-focus-within/offering:opacity-100 transition-opacity"></div>
                      </div>
                      {formData.companyDetails[editingIndex].offerings.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeOffering(editingIndex, offeringIndex)} 
                          className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={() => addOffering(editingIndex)} 
                  className="mt-4 flex items-center gap-2 text-xs font-extrabold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-lg transition-all border border-teal-200/50"
                >
                  <Plus className="h-4 w-4" /> 
                  ADD NEW OFFERING
                </button>
              </div>

              <div className="pt-8 mt-4 border-t border-gray-50 group/field">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider group-focus-within/field:text-teal-600 transition-colors">Point of Contact</h4>
                    <p className="text-[10px] text-gray-400 font-medium italic">A dedicated number for your {formData.companyDetails[editingIndex]?.type === 'STARTUP' ? 'startup' : 'service'}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer group/toggle">
                    <input
                      type="checkbox"
                      checked={formData.companyDetails[editingIndex].isPhoneHidden ?? false}
                      onChange={(e) => updateCompanyDetail(editingIndex, 'isPhoneHidden', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500/80 shadow-inner"></div>
                    <span className={`ml-3 text-xs font-extrabold uppercase tracking-tighter transition-colors ${formData.companyDetails[editingIndex].isPhoneHidden ? 'text-red-500' : 'text-gray-400'}`}>
                      {formData.companyDetails[editingIndex].isPhoneHidden ? 'Hidden' : 'Public'}
                    </span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.companyDetails[editingIndex].phoneNumber || ''}
                    onChange={(e) => {
                      updateCompanyDetail(editingIndex, 'phoneNumber', e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    onBlur={(e) => validatePhone(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition-all outline-none"
                    placeholder="Enter 10-digit number"
                  />
                  {phoneError && <p className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-bold tracking-tight">{phoneError}</p>}
                </div>
              </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;