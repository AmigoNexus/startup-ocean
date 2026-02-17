import { Plus, X, Building2, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompanyDetails = ({
  formData,
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

  return (
    <div className="space-y-6">
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-2 px-3 mb-3">
        <p className="text-xs text-teal-700">
          ℹ️ Select your company type and fill in the details. You can add multiple types.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-700 select-none">Register As *</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleToggleCompanyType('STARTUP')}
            className={`flex items-center gap-3 p-4 border-2 rounded-lg transition select-none ${formData.companyDetails.some(c => c.type === 'STARTUP') ? 'border-teal-600 bg-teal-50' : 'border-gray-300 hover:border-teal-600 hover:bg-teal-50'
              }`}
          >
            <Building2 className="h-6 w-6 text-teal-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-800">Startup Company</p>
              <p className="text-xs text-gray-500">
                {formData.companyDetails.some(c => c.type === 'STARTUP') ? 'Selected - Click to remove' : 'Click to select'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleToggleCompanyType('SERVICE_PROVIDER')}
            className={`flex items-center gap-3 p-4 border-2 rounded-lg transition select-none ${formData.companyDetails.some(c => c.type === 'SERVICE_PROVIDER') ? 'border-teal-600 bg-teal-50' : 'border-gray-300 hover:border-teal-600 hover:bg-teal-50'
              }`}
          >
            <Share2 className="h-6 w-6 text-teal-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-800">Service Provider</p>
              <p className="text-xs text-gray-500">
                {formData.companyDetails.some(c => c.type === 'SERVICE_PROVIDER') ? 'Selected - Click to remove' : 'Click to select'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {formData.companyDetails.length > 0 && (
        <div className="space-y-6">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">
                {formData.companyDetails[editingIndex]?.type === 'STARTUP' ? 'Startup Company Details' : 'Service Provider Details'}
              </h3>
              {formData.companyDetails.length > 1 && (
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  {formData.companyDetails.map((_, i) => (
                    <span key={i} className={`w-2 h-2 rounded-full ${i === editingIndex ? 'bg-teal-600' : 'bg-gray-300'}`}></span>
                  ))}
                  <span className="ml-1">Step {(editingIndex || 0) + 1} of {formData.companyDetails.length}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Description (Max 150 chars) <span className="text-red-500">*</span>
                </label>
                <textarea
                  maxLength={150}
                  value={formData.companyDetails[editingIndex].description}
                  onChange={(e) => updateCompanyDetail(editingIndex, 'description', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Short description (2-3 lines) - Required"
                />
                <p className="text-xs sm:text-xs text-gray-500 mt-1 text-right">{formData.companyDetails[editingIndex].description.length}/150</p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Offerings / Specialization</label>
                <div className="space-y-3">
                  {formData.companyDetails[editingIndex].offerings.map((offering, offeringIndex) => (
                    <div key={offeringIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={offering}
                        onChange={(e) => updateOffering(editingIndex, offeringIndex, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g. IT Consulting"
                      />
                      {formData.companyDetails[editingIndex].offerings.length > 1 && (
                        <button type="button" onClick={() => removeOffering(editingIndex, offeringIndex)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"><X className="h-4 w-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addOffering(editingIndex)} className="mt-3 flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-100 transition"><Plus className="h-4 w-4" />Add More</button>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <div>
                  {editingIndex > 0 && (
                    <button type="button" onClick={() => setEditingIndex(editingIndex - 1)} className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition">← Back</button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.companyDetails[editingIndex].description || formData.companyDetails[editingIndex].description.trim() === '') {
                        toast.error('Description is mandatory');
                        return;
                      }

                      if (isSingleSelect || isLastItem) {
                        if (onAllSaved) onAllSaved();
                      } else {
                        setEditingIndex(editingIndex + 1);
                      }
                    }}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
                  >
                    {isSingleSelect || isLastItem ? 'Save' : 'Save & Next →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default CompanyDetails;