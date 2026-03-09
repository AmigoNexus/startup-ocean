import { Mail, MapPin, Eye, UserPlus } from 'lucide-react';
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

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group relative">
            {company.city && (
                <div className="absolute top-0 right-0 bg-sky-100 text-gray-900 px-3 py-1 rounded-bl-xl flex items-center gap-1 z-10">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[10px] font-bold tracking-wide">{company.city}</span>
                </div>
            )}

            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start gap-4 mb-4 pr-20">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{company.companyName}</h3>
                        {company.email && (
                            <a
                                href={`mailto:${company.email}`}
                                className="text-sm text-gray-800 flex items-center gap-1 mt-1 hover:text-teal-600 transition"
                            >
                                <Mail className="h-3.5 w-3.5 text-teal-400 flex-shrink-0" />
                                <span className="truncate">{company.email}</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                    {company.services?.map((s, idx) => (
                        <span
                            key={idx}
                            className={`text-xs font-bold px-2.5 py-1 rounded-full border tracking-wide
                ${s.type === 'STARTUP'
                                    ? 'bg-violet-50 text-violet-600 border-violet-200'
                                    : 'bg-sky-50 text-sky-600 border-sky-200'
                                }`}
                        >
                            {s.type === 'STARTUP' ? ' Startup' : ' Service Provider'}
                        </span>
                    ))}
                </div>

                <div className="border-t border-gray-100 mb-4" />

                {company.offerings && company.offerings.length > 0 ? (
                    <div className="mb-5 flex-1">
                        <p className="text-xs font-black text-gray-700 mb-2">Offerings / Specialization:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {company.offerings.slice(0, 4).map((offering, idx) => (
                                <span
                                    key={idx}
                                    className="bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-md text-xs font-medium"
                                >
                                    {offering}
                                </span>
                            ))}
                            {company.offerings.length > 4 && (
                                <span className="text-xs text-gray-400 self-center font-medium">+{company.offerings.length - 4} more</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1" />
                )}

                <div className="flex gap-2 mt-auto">
                    <button
                        onClick={handleViewProfile}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2.5 rounded-xl hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/50 transition-all duration-200 font-semibold text-sm"
                    >
                        <Eye className="h-4 w-4" />
                        View Profile
                    </button>
                    <button
                        onClick={() => onConnect(company)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-teal-600 text-white px-3 py-2.5 rounded-xl hover:bg-teal-700 active:scale-95 transition-all duration-200 font-semibold text-sm shadow-sm shadow-teal-200"
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
