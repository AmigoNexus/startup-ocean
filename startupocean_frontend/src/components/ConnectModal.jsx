import { useState } from 'react';
import { X, Building2 } from 'lucide-react';

const API_HOST = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8025';

const ConnectModal = ({ company, onClose, onConnect, connectMessage, setConnectMessage, sendingRequest }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-8">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        Send Connection Request
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="bg-teal-50 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-teal-100 flex-shrink-0">
                        {company?.companyId && !imgError ? (
                            <img
                                src={`${API_HOST}/upload/logo/${company.companyId}`}
                                alt="Logo"
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-full h-full bg-teal-400 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">{company.companyName}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {company.services?.map((s, idx) => (
                                <span key={idx} className="text-[10px] font-bold text-teal-600">
                                    {s.type.replace('_', ' ')}
                                    {idx < company.services.length - 1 ? ' • ' : ''}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message (Optional)
                    </label>
                    <textarea
                        value={connectMessage}
                        onChange={(e) => setConnectMessage(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="Tell them why you'd like to connect..."
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onConnect}
                        disabled={sendingRequest}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition
            ${sendingRequest ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500 text-white'} `}
                    >
                        {sendingRequest ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Sending...
                            </>
                        ) : (
                            'Send Request'
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectModal;
