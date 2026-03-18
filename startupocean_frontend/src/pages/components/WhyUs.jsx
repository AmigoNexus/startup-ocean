import React from 'react';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: Briefcase,
    title: 'Platform for Startups',
    desc: 'Comprehensive platform for all startup companies to build and grow.',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-400',
    hoverGradient: 'from-teal-400 to-emerald-500',
    active: true,
  },
  {
    icon: Users,
    title: 'Connect & Collaborate',
    desc: 'Help startups connect seamlessly with other startups and founders.',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-400',
    hoverGradient: 'from-blue-500 to-indigo-600',
    active: true,
  },
  {
    icon: TrendingUp,
    title: 'Service Providers',
    desc: 'Direct access to verified consultants and top-tier service providers.',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-400',
    hoverGradient: 'from-purple-500 to-pink-500',
    active: true,
  },
  {
    icon: Calendar,
    title: 'Organize Events',
    desc: 'Host and manage startup events effortlessly. We are launching this soon.',
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-100',
    hoverGradient: 'from-slate-400 to-slate-500',
    active: false,
  },
];

const WhyUs = () => {
  return (
    <section className="py-24 relative bg-slate-50/50 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold mb-6 border border-teal-100"
          >
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            What We Do
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
          >
            Empowering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">Startup Ecosystem</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            We provide the essential tools, connections, and resources you need to turn your vision into reality.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx, type: 'spring', stiffness: 200, damping: 20 }}
                whileHover={feature.active ? { y: -12, scale: 1.03 } : {}}
                className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 z-10 overflow-hidden ${
                  feature.active 
                    ? 'bg-white/60 backdrop-blur-2xl border-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(13,148,136,0.15)] hover:border-teal-100/50' 
                    : 'bg-white/40 backdrop-blur-md border-white/60 opacity-80 grayscale-[50%]'
                }`}
              >
                {/* Background Gradient overlay on Hover */}
                {feature.active && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                )}

                {/* Decorative Colored Blob (Visible on normal state to add color to the section) */}
                {feature.active && (
                  <div className={`absolute -top-10 -right-10 w-40 h-40 ${feature.iconBg} rounded-full blur-3xl opacity-60 group-hover:opacity-0 transition-opacity duration-500 -z-20`}></div>
                )}
                
                {/* Icon Container */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 transition-all duration-500 shadow-sm ${feature.iconBg} ${
                  feature.active ? 'group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-6 backdrop-blur-md group-hover:shadow-lg' : ''
                }`}>
                  <IconComponent className={`w-8 h-8 transition-colors duration-500 ${
                    feature.active ? `${feature.iconColor} group-hover:text-white` : feature.iconColor
                  }`} />
                </div>
                
                {/* Text Elements */}
                <h3 className={`text-xl font-bold mb-4 transition-colors duration-500 ${
                  feature.active ? 'text-slate-900 group-hover:text-white' : 'text-slate-700'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed text-sm lg:text-base transition-colors duration-500 ${
                  feature.active ? 'text-slate-600 group-hover:text-white/90' : 'text-slate-500'
                }`}>
                  {feature.desc}
                </p>

                {/* Status Badge for inactive/coming soon items */}
                {!feature.active && (
                  <div className="mt-8 relative z-20">
                    <span className="inline-block px-4 py-1.5 bg-slate-200 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                      Coming Soon
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;