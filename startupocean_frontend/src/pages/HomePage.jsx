import { Link } from 'react-router-dom';
import { Briefcase, Users, Calendar, TrendingUp, Mail, Search, ArrowRight, CheckCircle2, Star, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { enquiryAPI, trackActivity } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Lottie from "lottie-react";
import buildingWebsiteAnimation from "../assets/building-website.json";
import networkingAnimation from "../assets/networking.json";
import socialMediaAnimation from "../assets/social-media-network.json";
import mentorshipAnimation from "../assets/mentorship.json";
import { motion } from 'framer-motion';
import CorePathSection from './components/CorePathSection';
import WhyUs from './components/WhyUs';

const HomePage = () => {
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();


  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await enquiryAPI.submit(enquiryForm);
      toast.success('Enquiry submitted successfully!');
      setEnquiryForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error('Failed to submit enquiry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    trackActivity({
      activityType: "PAGE_VISIT",
      pageUrl: window.location.pathname,
    });
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="overflow-x-hidden pt-16 bg-white selection:bg-primary-100 selection:text-primary-900">

     {/* HERO SECTION */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-center min-h-[450px] w-full relative">
            
            {/* Left Images (Desktop only) */}
            <div className="hidden lg:flex flex-col w-[400px] absolute left-0 top-1/2 -translate-y-1/2 gap-20 z-0">
               <motion.div 
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8 }}
                 className="relative w-64 h-64 self-end mr-8"
               >
                   <div className="absolute inset-0 bg-indigo-100 rounded-[2.5rem] transform -rotate-6"></div>
                   <div className="absolute inset-0 w-full h-full bg-white rounded-[2.5rem] shadow-lg flex items-center justify-center overflow-hidden">
                     <Lottie animationData={buildingWebsiteAnimation} loop={true} className="w-full h-full" />
                   </div>
                   <div className="absolute -bottom-4 -left-6 bg-white px-3 py-1.5 rounded-lg shadow-md border border-slate-100 text-xs font-bold text-indigo-600 flex items-center gap-1.5 tracking-wide">
                      <Sparkles className="w-3 h-3"/> STARTUPS
                   </div>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative w-72 h-48 self-start ml-4"
               >
                   <div className="absolute inset-0 bg-pink-100 rounded-[2rem] transform rotate-3"></div>
                   <div className="absolute inset-0 w-full h-full bg-white rounded-[2rem] shadow-lg flex items-center justify-center p-2 overflow-hidden">
                     <Lottie animationData={socialMediaAnimation} loop={true} className="w-full h-full" />
                   </div>
                   <div className="absolute -bottom-3 right-4 bg-white px-3 py-1.5 rounded-lg shadow-md border border-slate-100 text-xs font-bold text-pink-500 tracking-wide">
                      NETWORKING
                   </div>
               </motion.div>
            </div>

            {/* Center Content */}
            <motion.div 
              className="relative z-10 w-full max-w-2xl text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-teal-600 leading-[1.1] mb-6 tracking-tight">
                Accelerate Your <br /> <span className="text-teal-900">Startup Journey.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                Connect with verified founders, expert service providers, and strategic investors in one unified platform built for growth.
              </p>

              <div className="flex flex-col items-center justify-center space-y-6">
                 {/* Join Button */}
                 <button onClick={() => navigate('/register')} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-lg font-bold text-[15px] transition-colors duration-200 mt-4">
                    Join StartupOcean
                 </button>
              </div>
            </motion.div>

            {/* Right Images (Desktop only) */}
            <div className="hidden lg:flex flex-col w-[400px] absolute right-0 top-1/2 -translate-y-1/2 gap-20 z-0">
               <motion.div 
                 initial={{ opacity: 0, x: 30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8 }}
                 className="relative w-72 h-48 self-start ml-4"
               >
                   <div className="absolute inset-0 bg-emerald-100 rounded-[2rem] transform -rotate-3"></div>
                   <div className="absolute inset-0 w-full h-full bg-white rounded-[2rem] shadow-lg flex items-center justify-center p-2 overflow-hidden">
                     <Lottie animationData={mentorshipAnimation} loop={true} className="w-full h-full" />
                   </div>
                   <div className="absolute -bottom-3 right-8 bg-white px-3 py-1.5 rounded-lg shadow-md border border-slate-100 text-xs font-bold text-emerald-600 tracking-wide">
                      MENTORSHIP
                   </div>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, x: 30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative w-64 h-64 self-center mr-8"
               >
                   <div className="absolute inset-0 bg-amber-100 rounded-[2.5rem] transform rotate-6"></div>
                   <div className="absolute inset-0 w-full h-full bg-white rounded-[2.5rem] shadow-lg flex items-center justify-center p-2 overflow-hidden">
                     <Lottie animationData={networkingAnimation} loop={true} className="w-full h-full" />
                   </div>
                   <div className="absolute bottom-2 -right-4 bg-white px-3 py-1.5 rounded-lg shadow-md border border-slate-100 text-xs font-bold text-amber-500 flex items-center gap-1.5 tracking-wide">
                      INVESTORS <Briefcase className="w-3 h-3"/>
                   </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      <CorePathSection />
      <WhyUs/>

      {/* ENQUIRY SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto glass rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border-slate-100">
            <div className="flex-1 bg-slate-900 p-12 lg:p-16 text-white relative">
              <div className="absolute top-0 right-0 p-8">
                <Mail className="h-32 w-32 text-white/5" />
              </div>
              <h2 className="text-4xl font-bold mb-6">Have Questions? <br /> Let's Talk.</h2>
              <p className="text-slate-400 text-lg mb-10">Our ecosystem experts are here to help you navigate through the platform and find what you need.</p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary-400" />
                  </div>
                  <span className="font-medium text-slate-200">24/7 Priority Support</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary-400" />
                  </div>
                  <span className="font-medium text-slate-200">Specialized Onboarding</span>
                </div>
              </div>
            </div>

            <div className="flex-[1.2] p-12 lg:p-16 bg-white">
              <form onSubmit={handleSubmitEnquiry} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="Ram Kumar"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="ram@example.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">How can we help?</label>
                  <textarea
                    placeholder="Tell us about your startup or service..."
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-5 text-lg shadow-xl"
                >
                  {loading ? 'Sending Message...' : 'Submit Enquiry'}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-[3rem] bg-gradient-to-br from-teal-600 to-indigo-400 p-12 lg:p-20 text-center text-white shadow-2xl shadow-primary-200 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-bold mb-8">Ready to make a splash?</h2>
              <p className="text-xl text-primary-50 mb-12 max-w-2xl mx-auto">Join the premium network of game-changers today and take your startup to the next level.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-white text-teal-600 rounded-2xl font-bold text-lg hover:bg-slate-50 transition shadow-xl shadow-black/10">
                  Register For Free
                </Link>
                <Link to="/search" className="w-full sm:w-auto px-10 py-5 bg-teal-600 text-white rounded-2xl font-bold text-lg hover:bg-teal-700 transition border border-white/10">
                  Browse Companies
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;