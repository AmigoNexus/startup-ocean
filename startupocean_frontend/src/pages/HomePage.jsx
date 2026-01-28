import { Link } from 'react-router-dom';
import { Briefcase, Users, Calendar, TrendingUp, Mail, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { enquiryAPI, trackActivity } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
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

  const testimonials = [
    {
      quote: "This platform helped us find the right legal and marketing partners quickly. It's a game-changer for startups!",
      author: "Priya Sharma",
      role: "Startup Founder",
      company: "TechVenture India",
      avatar: "PS"
    },
    {
      quote: "StartupOcean connected us with amazing service providers. We scaled our business faster than we imagined!",
      author: "Rajesh Kumar",
      role: "CEO",
      company: "InnovateLabs",
      avatar: "RK"
    },
    {
      quote: "The networking opportunities here are incredible. We found investors and mentors who truly understand our vision.",
      author: "Ananya Desai",
      role: "Co-founder",
      company: "GreenTech Solutions",
      avatar: "AD"
    },
    {
      quote: "As a service provider, this platform helped me reach startups that genuinely needed my expertise. Highly recommended!",
      author: "Vikram Patel",
      role: "Business Consultant",
      company: "Growth Partners",
      avatar: "VP"
    }
  ];

  return (
    <div>
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-teal-400 to-teal-500 text-white py-4">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center">
              Welcome, <span className="font-bold">{user?.name || user?.email}</span>!
            </h2>
          </div>
        </div>
      )}
      <section className={`bg-gradient-to-r from-primary-400 to-primary-500 text-white py-10 ${!isAuthenticated ? 'mt-' : ''}`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Startup Collaboration & Services Portal
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connecting Startups & Service Providers Under One Umbrella<br />
            Platform Created for Startup. Service Providers. Founders. Investors.
          </p>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="container mx-auto px-2">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What Are You Looking For?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              to="/search?type=STARTUP"
              className="bg-gradient-to-br from-blue-100 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-4 group-hover:scale-110 transition">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Looking Startup for Collaboration
              </h3>
              <p className="text-gray-600">
                Connect and collaborate with other startups.
              </p>
            </Link>

            <Link
              to="/search?type=SERVICE_PROVIDER"
              className="bg-gradient-to-br from-green-100 to-green-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-4 group-hover:scale-110 transition">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Service Providers
              </h3>
              <p className="text-gray-600">
                Find consultants to scale your startup.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
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
                desc: 'Host and attend startup-focused events',
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: 'Service Providers',
                desc: 'Access to consultants and service providers',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center text-primary-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Our Community Says
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Don't just take our word for it. Here's what startups and service providers have to say about StartupOcean.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative"
              >
                <div className="absolute top-6 right-6 text-teal-200">
                  <Quote className="h-12 w-12" />
                </div>
                <div className="relative z-10">
                  <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">
                        {testimonial.author}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-700 text-lg mb-4">
              Join thousands of startups and service providers already growing their business
            </p>
            <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition shadow-lg">
              Get Started Today
            </button>
          </div>
        </div>
      </section>
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Benefits of Registering
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
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
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <Mail className="h-12 w-12 text-primary-500" />
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
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