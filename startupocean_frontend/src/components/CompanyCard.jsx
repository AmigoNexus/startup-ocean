import { Mail, MapPin, Eye, UserPlus, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const CompanyCard = ({ company, onViewDetails, onConnect, isAuthenticated, navigate, activeFilter }) => {
    const handleViewProfile = () => {
        if (!isAuthenticated) {
            toast('Please login to view company profile');
            navigate('/login');
            return;
        }
        onViewDetails(company);
    };

    const isStartup = company.services?.some(s => s.type === 'STARTUP');

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-500 flex flex-col overflow-hidden group relative h-full">
            {/* Location Tag */}
            {company.city && (
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md border border-gray-100 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10 shadow-sm transition-transform group-hover:scale-105">
                    <MapPin className="h-3 w-3 text-teal-500" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{company.city}</span>
                </div>
            )}

            <div className="p-8 flex flex-col flex-1">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {company.services?.map((s, idx) => (
                            <span
                                key={idx}
                                className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest
                    ${s.type === 'STARTUP'
                                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                                        : 'bg-teal-50 text-teal-600 border-teal-100'
                                    }`}
                            >
                                {s.type === 'STARTUP' ? 'Startup' : 'Service Provider'}
                            </span>
                        ))}
                    </div>

                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-teal-600 transition-colors">
                        {company.companyName}
                    </h3>

                    {company.email && (
                        <a
                            href={`mailto:${company.email}`}
                            className="text-sm text-gray-500 flex items-center gap-1.5 hover:text-teal-600 transition-colors w-fit"
                        >
                            <Mail className="h-3.5 w-3.5 opacity-60" />
                            <span className="truncate max-w-[180px] font-medium">{company.email}</span>
                        </a>
                    )}
                </div>

                {/* Divider with Accent */}
                <div className="relative h-px w-full bg-slate-100 mb-6">
                    <div className="absolute top-0 left-0 h-px w-0 bg-teal-500 group-hover:w-1/2 transition-all duration-700"></div>
                </div>

                {/* Offerings Section */}
                <div className="flex-1 mb-8">
                    {company.offerings && company.offerings.length > 0 ? (
                        <>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Core Expertise</p>
                            <div className="flex flex-wrap gap-2">
                                {company.offerings.slice(0, 3).map((offering, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold group-hover:bg-white group-hover:border-teal-100 group-hover:text-teal-700 transition-all duration-300"
                                    >
                                        {offering}
                                    </span>
                                ))}
                                {company.offerings.length > 3 && (
                                    <span className="flex items-center justify-center bg-slate-100 text-slate-500 h-8 w-8 rounded-full text-[10px] font-black">
                                        +{company.offerings.length - 3}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center">
                            <p className="text-xs text-slate-300 italic font-medium">No specialized offerings listed</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto pt-4">
                    <button
                        onClick={handleViewProfile}
                        className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-100 text-slate-600 px-4 py-3 rounded-2xl hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/20 transition-all duration-300 font-bold text-xs"
                    >
                        <Eye className="h-4 w-4" />
                        Details
                    </button>
                    <button
                        onClick={() => onConnect(company)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-200 active:scale-[0.98] transition-all duration-300 font-bold text-xs"
                    >
                        <UserPlus className="h-4 w-4" />
                        Connect
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCard;
