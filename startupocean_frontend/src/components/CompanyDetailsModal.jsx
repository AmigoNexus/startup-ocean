import { X, MapPin, Mail, Phone, Lock, Globe, Linkedin, Facebook, Instagram, Twitter, UserPlus, Info, Briefcase, ExternalLink } from 'lucide-react';

const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'Not provided';
    return '**********';
};

const CompanyDetailsModal = ({ company, onClose, onConnect, isAuthenticated, navigate }) => {
    const hasSocialLinks = company.socialLinks && Object.values(company.socialLinks).some(v => !!v);

    const socialIconMap = {
        website: <Globe className="h-5 w-5 text-teal-500" />,
        linkedin: <Linkedin className="h-5 w-5 text-teal-600" />,
        facebook: <Facebook className="h-5 w-5 text-sky-600" />,
        instagram: <Instagram className="h-5 w-5 text-pink-600" />,
        twitter: <Twitter className="h-5 w-5 text-slate-900" />,
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-teal-900/20 border border-slate-100 flex flex-col animate-in zoom-in-95 duration-300">
                {/* Fixed Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-8 flex justify-between items-center z-10">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-teal-100">
                                Profile Overview
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight truncate pr-4">
                            {company.companyName}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                            {company.city && (
                                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                                    <MapPin className="h-3.5 w-3.5 text-teal-500" /> {company.city}
                                </div>
                            )}
                            {company.email && (
                                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 lowercase">
                                    <Mail className="h-3.5 w-3.5 text-teal-500" /> {company.email}
                                </div>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-all duration-200"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="space-y-10">
                        {/* Services Section */}
                        <div className="space-y-6">
                             <div className="flex items-center gap-2 mb-2">
                                <Briefcase className="h-4 w-4 text-teal-500" />
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Businesses & Expertise</h3>
                            </div>
                            
                            {company.services?.map((service, sIdx) => (
                                <div key={sIdx} className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8 relative overflow-hidden group hover:border-teal-100 hover:bg-white transition-all duration-300">
                                    <div className="absolute top-0 right-0 bg-teal-600 text-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-bl-[1.5rem] shadow-sm">
                                        {service.type.replace('_', ' ')}
                                    </div>

                                    <div className="space-y-6">
                                        {service.description && (
                                            <div>
                                                <p className="text-slate-600 leading-relaxed font-medium italic text-lg">
                                                    "{service.description}"
                                                </p>
                                            </div>
                                        )}

                                        {service.offerings && service.offerings.length > 0 && (
                                            <div className="pt-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {service.offerings.map((o, oIdx) => (
                                                        <span key={oIdx} className="bg-white border border-slate-200 group-hover:border-teal-100 text-slate-600 group-hover:text-teal-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors">
                                                            {o}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Direct Communication</h4>
                                                {isAuthenticated ? (
                                                    <div className="flex items-center gap-4">
                                                        {service.phoneNumber && (
                                                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                                                <Phone className="h-4 w-4 text-teal-500" />
                                                                <span className="text-sm font-black text-slate-800 tracking-wider">
                                                                    {!service.isPhoneHidden ? service.phoneNumber : maskPhoneNumber(service.phoneNumber)}
                                                                </span>
                                                                {service.isPhoneHidden && (
                                                                    <div className="group/lock relative">
                                                                        <Lock className="h-3.5 w-3.5 text-slate-300" />
                                                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/lock:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Protected</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2.5 text-sm text-slate-400 font-medium italic">
                                                        <Lock className="h-4 w-4 text-slate-200" />
                                                        <span>Access restricted. Please login.</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Presence Section */}
                        {company.socialLinks && Object.values(company.socialLinks).some(v => v) && (
                            <div className="pt-2">
                                <div className="flex items-center gap-2 mb-6">
                                    <Globe className="h-4 w-4 text-teal-500" />
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Social Presence</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {Object.entries(company.socialLinks).map(([key, value]) => {
                                        if (!value) return null;
                                        const url = value.startsWith('http') ? value : `https://${value}`;

                                        return (
                                            <a
                                                key={key}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/20 transition-all group"
                                            >
                                                <div className="w-12 h-12 bg-slate-50 group-hover:bg-white rounded-xl flex items-center justify-center transition-colors shadow-sm">
                                                    {socialIconMap[key]}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                                                        {key === 'website' ? 'Official Site' : key}
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-700 group-hover:text-teal-600 truncate flex items-center gap-1.5">
                                                        {value.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </span>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 bg-slate-50 flex flex-col sm:flex-row gap-4 border-t border-slate-100">
                    <button
                        onClick={() => onConnect(company)}
                        className="flex-1 bg-slate-900 text-white py-4 rounded-2xl hover:bg-teal-600 transition-all duration-300 font-bold shadow-xl flex items-center justify-center gap-2 text-sm shadow-teal-500/10 active:scale-[0.98]"
                    >
                        <UserPlus className="h-5 w-5" /> Send Connection Request
                    </button>
                    <button
                        onClick={onClose}
                        className="px-10 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all duration-300 font-bold text-sm"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailsModal;
