import { X, MapPin, Mail, Phone, Lock, Globe, Linkedin, Facebook, Instagram, Twitter, UserPlus } from 'lucide-react';

const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'Not provided';
    return '**********';
};

const CompanyDetailsModal = ({ company, onClose, onConnect, isAuthenticated, navigate }) => {
    const hasSocialLinks = company.socialLinks && Object.values(company.socialLinks).some(v => !!v);

    const socialIconMap = {
        website: <Globe className="h-5 w-5 text-teal-400" />,
        linkedin: <Linkedin className="h-5 w-5 text-teal-400" />,
        facebook: <Facebook className="h-5 w-5 text-teal-400" />,
        instagram: <Instagram className="h-5 w-5 text-teal-400" />,
        twitter: <Twitter className="h-5 w-5 text-teal-400" />,
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{company.companyName}</h2>
                        {company.city && (
                            <p className="text-xs font-bold text-gray-500 flex items-center gap-1 mt-1 tracking-wider">
                                <MapPin className="h-3 w-3 text-teal-200" /> {company.city}
                            </p>
                        )}
                        {company.email && (
                            <p className="text-xs font-medium text-teal-600 flex items-center gap-1 mt-1 lowercase">
                                <Mail className="h-3 w-3 text-teal-500" /> {company.email}
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="h-6 w-6 text-gray-400" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    <div className="space-y-6">
                        {company.services?.map((service, sIdx) => (
                            <div key={sIdx} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-teal-400 text-white px-3 py-1 text-[10px] font-bold rounded-bl-lg">
                                    {service.type.replace('_', ' ')}
                                </div>

                                <div className="space-y-4">
                                    {service.description && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 mb-1">Description</h4>
                                            <p className="text-gray-700 leading-relaxed text-sm italic">"{service.description}"</p>
                                        </div>
                                    )}

                                    {service.offerings && service.offerings.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 mb-2">Offerings & Expertise</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {service.offerings.map((o, oIdx) => (
                                                    <span key={oIdx} className="bg-white border border-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                                                        {o}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-200">
                                        <h4 className="text-xs font-bold text-gray-400 mb-2">Contact Details</h4>
                                        <div className="space-y-2">
                                            {isAuthenticated ? (
                                                <div className="space-y-3">
                                                    {service.phoneNumber && (
                                                        <div className="flex items-center gap-3 text-gray-700">
                                                            <Phone className="h-5 w-5 text-teal-400" />
                                                            <span className="text-sm font-bold text-gray-800 tracking-wide">
                                                                {!service.isPhoneHidden ? service.phoneNumber : maskPhoneNumber(service.phoneNumber)}
                                                            </span>
                                                            {service.isPhoneHidden && <Lock className="h-3 w-3 text-gray-300" />}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                                                    <Lock className="h-3 w-3 text-gray-300" />
                                                    <span>Login to view specific contacts</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!isAuthenticated && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Lock className="h-5 w-5 text-yellow-600" />
                                <p className="text-xs text-yellow-700">Detailed contact information is restricted to logged-in users only.</p>
                            </div>
                            <button
                                onClick={() => { onClose(); navigate('/login'); }}
                                className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-200 transition whitespace-nowrap"
                            >
                                Login Now
                            </button>
                        </div>
                    )}

                    {/* Social Links Section */}
                    {company.socialLinks && Object.values(company.socialLinks).some(v => v) && (
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 tracking-widest mb-4">Connect with Us</h3>
                            <div className="flex flex-wrap gap-4">
                                {Object.entries(company.socialLinks).map(([key, value]) => {
                                    if (!value) return null;

                                    // Ensure URL has protocol
                                    const url = value.startsWith('http') ? value : `https://${value}`;

                                    return (
                                        <div key={key} className="flex items-center gap-4 group bg-gray-50/50 p-3 rounded-xl border border-transparent hover:border-teal-100 hover:bg-teal-50/30 transition-all">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                {socialIconMap[key]}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[10px] font-black text-gray-400 tracking-wider mb-0.5">
                                                    {key === 'website' ? 'Official Website' : key}
                                                </span>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-bold text-teal-600 hover:text-teal-700 break-all leading-tight"
                                                >
                                                    {value.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 flex gap-4 border-t border-gray-100">
                    <button
                        onClick={() => onConnect(company)}
                        className="flex-1 bg-teal-500 text-white py-3 rounded-xl hover:bg-teal-700 transition font-bold shadow-lg shadow-teal-100 flex items-center justify-center gap-2"
                    >
                        <UserPlus className="h-5 w-5" /> Send Connection
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailsModal;
