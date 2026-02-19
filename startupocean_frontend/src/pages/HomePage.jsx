import { Link } from 'react-router-dom';
import { Briefcase, Users, Calendar, TrendingUp, Mail, Quote, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { enquiryAPI, trackActivity } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import StartupTrendingNewsMini from '../components/StartupTrendingNewsMini';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Lottie from "lottie-react";
import startupAnimation from "../assets/startupAnimation.json";

const HomePage = () => {
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");



  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchInput(query);
    }
  }, [searchParams]);

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await enquiryAPI.submit(enquiryForm);
      toast.success('Enquiry submitted successfully!');
      setEnquiryForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast('Failed to submit enquiry');
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

  return (
    <div className="overflow-x-hidden">
      <section className="bg-gradient-to-r from-primary-400 to-primary-500 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

            {/* LEFT SIDE - Heading */}
            <div className="flex-1 text-center lg:text-right">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                Startup Collaboration & Services Portal
              </h1>
            </div>

            {/* CENTER - ANIMATION */}
            <div className="flex-shrink-0">
              <div className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px]">
                <Lottie
                  animationData={startupAnimation}
                  loop
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* RIGHT SIDE - Description & Search */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-base mb-6 max-w-xl mx-auto lg:mx-0">
                A unified platform connecting startups, service providers, founders, and investors under one ecosystem
              </p>

              {/* SEARCH BOX */}
              <div className="flex gap-2 max-w-md mx-auto lg:mx-0">
                <input
                  type="text"
                  placeholder="Search by name, city, or specialization..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchInput.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-white focus:outline-none"
                />

                <button
                  onClick={() =>
                    navigate(
                      searchInput.trim()
                        ? `/search?q=${encodeURIComponent(searchInput)}`
                        : "/search"
                    )
                  }
                  className="bg-white text-primary-500 px-6 py-3 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 font-semibold"
                >
                  <Search className="h-5 w-5" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            What Are You Looking For?
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="grid sm:grid-cols-2 gap-8 flex-1">

              <div
                onClick={() => navigate('/search?type=STARTUP')}
                className="cursor-pointer h-full bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group border border-blue-200"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition shadow-lg shadow-blue-200">
                  <Briefcase className="h-8 w-8" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition">
                  Looking for Startups
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  Connect and collaborate with innovative startups in the ecosystem.
                </p>
              </div>

              <div
                onClick={() => navigate('/search?type=SERVICE_PROVIDER')}
                className="cursor-pointer h-full bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group border border-teal-200"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-teal-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition shadow-lg shadow-teal-200">
                  <Users className="h-8 w-8" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-700 transition">
                  Looking for Service Providers
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  Find expert consultants and agencies to scale your business.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-[380px] h-full">
              <StartupTrendingNewsMini />
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-gray-50">
        <div className="container mx-auto px-3 ">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            What We Do
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Briefcase className="h-8 w-8" />,
                title: 'Platform for Startups',
                desc: 'Comprehensive platform for all startup companies',
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: 'Connect & Collaborate',
                desc: 'Help startups connect with other startups',
              },
              {
                icon: <Calendar className="h-8 w-8" />,
                title: 'Organize Events',
                desc: 'Coming Soon',
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: 'Service Providers',
                desc: 'Access to consultants and service providers',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`bg-white p-6 rounded-lg shadow-md text-center transition-all ${feature.desc === 'Coming Soon' ? 'opacity-50 grayscale bg-gray-50' : ''
                  }`}
              >
                <div className={`flex justify-center mb-4 ${feature.desc === 'Coming Soon' ? 'text-gray-400' : 'text-primary-500'}`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="container mx-auto px-4 ">

          <div className="text-center mt-12">
            <p className="text-gray-700 text-base mb-4">
              Join startups and service providers already growing their business
            </p>
            <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition shadow-lg">
              <Link
                to="/search"
                className="text-white no-underline"
              >
                Get Started Today
              </Link>
            </button>
          </div>
        </div>
      </section>
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 ">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-12">
            Benefits of Registering
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              'Visibility among verified startups and consultants',
              'Business collaboration opportunities',
              'Access to events and startup ecosystem',
              'Growth through trusted service providers',
              'Networking with like-minded entrepreneurs',
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <p className="text-sm text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 ">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <Mail className="h-12 w-12 text-primary-500" />
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800 mb-8">
              Submit an Enquiry
            </h2>
            <form onSubmit={handleSubmitEnquiry} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={enquiryForm.name}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={enquiryForm.email}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                value={enquiryForm.phone}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <textarea
                placeholder="Your Message"
                value={enquiryForm.message}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;