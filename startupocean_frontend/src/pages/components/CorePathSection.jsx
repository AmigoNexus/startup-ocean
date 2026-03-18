import React from 'react';
import { Briefcase, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import StartupTrendingNewsMini from '../../components/StartupTrendingNewsMini';

// Define the path cards structure so it's fully modular.
// You can easily add more objects here, change their colors, or provide an `image` instead of an `icon`.
const PATH_CARDS = [
    {
        id: 'startups',
        icon: Briefcase,
        // Optional: image: 'https://example.com/some-free-image.png',
        path: '/search?type=STARTUP',
        gradient: 'from-teal-400 to-teal-600',
        shadow: 'shadow-teal-200',
        textColor: 'text-teal-100',
        title: <>I'm looking for <br />Startups</>,
        description: 'Discover innovative companies and explore collaboration opportunities.',
        actionText: 'Find Startups'
    },
    {
        id: 'service-providers',
        icon: Users,
        // Optional: image: 'https://example.com/another-free-image.png',
        path: '/search?type=SERVICE_PROVIDER',
        gradient: 'from-indigo-500 to-purple-600',
        shadow: 'shadow-indigo-200',
        textColor: 'text-indigo-100',
        title: <>I'm looking for <br />Service Providers</>,
        description: 'Connecting you with verified consultants, agencies, and experts.',
        actionText: 'Browse Experts'
    }
];

const CorePathSection = () => {
    const navigate = useNavigate();
    return (
        <div className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">Unlock Your Ecosystem</h2>
                    <p className="text-lg text-slate-600">Choose your path and start connecting with the right people to scale your vision.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                    {/* Render standard cards dynamically from our config array */}
                    {PATH_CARDS.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <motion.div
                                key={card.id}
                                whileHover={{ y: -10 }}
                                onClick={() => navigate(card.path)}
                                className={`group flex-1 cursor-pointer bg-gradient-to-br ${card.gradient} p-10 rounded-[2.5rem] shadow-2xl ${card.shadow} text-white relative overflow-hidden`}
                            >
                                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    {card.image ? (
                                        <img src={card.image} alt="" className="w-64 h-64 object-contain opacity-50" />
                                    ) : (
                                        IconComponent && <IconComponent className="w-64 h-64" />
                                    )}
                                </div>

                                <div className="relative z-10">
                                    <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 overflow-hidden">
                                        {card.image ? (
                                            <img src={card.image} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            IconComponent && <IconComponent className="h-8 w-8 text-white" />
                                        )}
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">{card.title}</h3>
                                    <p className={`${card.textColor} text-lg mb-8 max-w-xs`}>{card.description}</p>
                                    <div className="inline-flex items-center gap-2 font-bold text-white group-hover:gap-3 transition-all">
                                        {card.actionText} <ArrowRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Trending Updates Static Widget */}
                    <div className="lg:w-[400px]">
                        <div className="premium-card p-8 h-full border-2 border-teal-600 shadow-md overflow-hidden relative">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-teal-600" />
                                    Trending Updates
                                </h3>
                                <Link to="/TrendingNews" className="text-xs font-bold text-teal-600 hover:underline">View All</Link>
                            </div>
                            <StartupTrendingNewsMini />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CorePathSection;