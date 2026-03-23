import { useState } from 'react';
import { X, Building2, Send, MessageSquare } from 'lucide-react';

const API_HOST = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8025';

const ConnectModal = ({ company, onClose, onConnect, connectMessage, setConnectMessage, sendingRequest }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 md:p-10 shadow-2xl shadow-teal-900/20 border border-slate-100 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-teal-50 p-2.5 rounded-2xl">
                            <Send className="h-5 w-5 text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Connect
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 mb-10 flex items-center gap-5 group transition-all">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        {company?.companyId && !imgError ? (
                            <img
                                src={`${API_HOST}/upload/logo/${company.companyId}`}
                                alt="Logo"
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 text-lg group-hover:text-teal-600 transition-colors uppercase tracking-tight">{company.companyName}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {company.services?.map((s, idx) => (
                                <span key={idx} className="text-[10px] font-black text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100 uppercase tracking-widest leading-none">
                                    {s.type.replace('_', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">
                        <MessageSquare className="h-3 w-3" />
                        Your Message (Optional)
                    </label>
                    <textarea
                        value={connectMessage}
                        onChange={(e) => setConnectMessage(e.target.value)}
                        rows={5}
                        className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-300 resize-none shadow-sm"
                        placeholder="Explain why you'd like to partner or connect..."
                    />
                </div>

                <div className="flex gap-4">
                     <button
                        onClick={onClose}
                        className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-slate-200 hover:bg-slate-50 transition-all duration-300 font-bold text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConnect}
                        disabled={sendingRequest}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-teal-500/20 active:scale-[0.98]
            ${sendingRequest ? 'bg-teal-300 cursor-not-allowed text-white' : 'bg-slate-900 hover:bg-teal-600 text-white'} `}
                    >
                        {sendingRequest ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Send Request
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectModal;
