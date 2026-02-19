import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { companyAPI, eventAPI, collaborationAPI, enquiryAPI } from '../services/api';
import {
  Briefcase,
  Calendar,
  Users,
  MessageSquare,
  Search,
  PlusCircle,
  Settings,
  Bell,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8025';

const messageAPI = {
  getUnreadCount: () => axios.get(`${API_BASE_URL}/messages/unread/count`, {
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
  }),
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    hasCompany: false,
    upcomingEvents: 0,
    collaborations: 0,
    unreadMessages: 0,
    enquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const promises = [
        companyAPI.getMyCompany().catch(() => ({ data: { success: false } })),
        eventAPI.getUpcoming().catch(() => ({ data: { data: [] } })),
        collaborationAPI.getReceived().catch(() => ({ data: { data: [] } })),
        messageAPI.getUnreadCount().catch(() => ({ data: { data: 0 } })),
      ];
      if (isAdmin) {
        promises.push(enquiryAPI.getAll().catch(() => ({ data: { data: [] } })));
      }

      const responses = await Promise.all(promises);
      const [companyRes, eventsRes, collabRes, messagesRes, enquiriesRes] = responses;

      setStats({
        hasCompany: companyRes.data.success,
        upcomingEvents: eventsRes.data.data?.length || 0,
        collaborations: collabRes.data.data?.filter(c => c.status === 'PENDING').length || 0,
        unreadMessages: messagesRes.data.data || 0,
        enquiries: isAdmin ? (enquiriesRes?.data?.data?.length || 0) : 0,
      });
    } catch {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-100 border-t-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Banner */}
      {isAuthenticated && (
        <div className="bg-gradient-to-br from-teal-400 to-teal-500 text-white p-6 mb-10 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Briefcase className="h-20 w-20 rotate-12" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 tracking-tight">
              Welcome Back, <span className="text-teal-700">{user?.name || user?.email?.split('@')[0]}!</span>
            </h2>
            <p className="text-teal-50/80 font-medium tracking-tight">Manage your company presence and collaborations seamlessly.</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="mt-4 mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5 text-teal-600" />
        <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          title="Profile Status"
          value={stats.hasCompany ? 'Active' : 'Not Setup'}
          color="blue"
          link="/company"
          description={stats.hasCompany ? "Your profile is live" : "Complete your profile"}
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          title="Events"
          value={stats.upcomingEvents}
          color="green"
          link="/events"
          isComingSoon={true}
          description="Explore upcoming mixers"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          title="Requests"
          value={stats.collaborations}
          color="purple"
          link="/collaborations"
          badge={stats.collaborations > 0}
          description="Pending collaborations"
        />
        <StatCard
          icon={<MessageSquare className="h-5 w-5" />}
          title="Messages"
          value={stats.unreadMessages}
          color="orange"
          link="/messages"
          badge={stats.unreadMessages > 0}
          description="Recent communications"
        />
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-10">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl font-black text-gray-800 mb-2 flex items-center justify-center md:justify-start gap-3">
            <PlusCircle className="h-7 w-7 text-teal-600" /> Essential Navigation
          </h2>
          <p className="text-gray-500 font-medium">Everything you need to grow your startup presence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!stats.hasCompany && (
            <ActionButton
              icon={<PlusCircle className="h-6 w-6 text-white" />}
              title="Create Profile"
              description="Showcase your brand to the world"
              link="/company"
              theme="teal"
            />
          )}
          <ActionButton
            icon={<Search className="h-6 w-6 text-white" />}
            title="Find Partners"
            description="Discover synergies in the ocean"
            link="/search"
            theme="blue"
          />
          <ActionButton
            icon={<MessageSquare className="h-6 w-6 text-white" />}
            title="Messages"
            description="Keep the conversation flowing"
            link="/messages"
            theme="emerald"
          />
          <ActionButton
            icon={<Users className="h-6 w-6 text-white" />}
            title="Collaborate"
            description="Review and manage requests"
            link="/collaborations"
            theme="purple"
          />
          <ActionButton
            icon={<Calendar className="h-6 w-6 text-white" />}
            title="Events Hub"
            description="Network at industry events"
            link="/events"
            theme="orange"
            isComingSoon={true}
          />
          {isAdmin && (
            <ActionButton
              icon={<Bell className="h-6 w-6 text-white" />}
              title="Admin Panel"
              description="Manage queries and platform"
              link="/admin/enquiries"
              theme="rose"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, link, badge, isComingSoon, description }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 border-blue-100',
      icon: 'bg-blue-600 text-white shadow-lg shadow-blue-200',
      text: 'text-blue-700',
      border: 'group-hover:border-blue-300',
      glow: 'group-hover:shadow-blue-200/50'
    },
    green: {
      bg: 'bg-emerald-50 border-emerald-100',
      icon: 'bg-emerald-600 text-white shadow-lg shadow-emerald-200',
      text: 'text-emerald-700',
      border: 'group-hover:border-emerald-300',
      glow: 'group-hover:shadow-emerald-200/50'
    },
    purple: {
      bg: 'bg-purple-50 border-purple-100',
      icon: 'bg-purple-600 text-white shadow-lg shadow-purple-200',
      text: 'text-purple-700',
      border: 'group-hover:border-purple-300',
      glow: 'group-hover:shadow-purple-200/50'
    },
    orange: {
      bg: 'bg-orange-50 border-orange-100',
      icon: 'bg-orange-600 text-white shadow-lg shadow-orange-200',
      text: 'text-orange-700',
      border: 'group-hover:border-orange-300',
      glow: 'group-hover:shadow-orange-200/50'
    },
  };

  const style = colorMap[color];

  return (
    <Link
      to={isComingSoon ? '#' : link}
      className={`group ${style.bg} p-6 rounded-[2rem] border shadow-sm transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-50 ${isComingSoon ? 'opacity-60 cursor-not-allowed' : `hover:shadow-xl ${style.glow} hover:-translate-y-2 ${style.border}`}`}
      onClick={(e) => isComingSoon && e.preventDefault()}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${style.icon} transition-transform group-hover:scale-110 duration-500`}>
          {icon}
        </div>
        {badge && !isComingSoon && (
          <div className="bg-rose-500 text-white rounded-full min-w-[24px] h-6 px-2 flex items-center justify-center text-xs font-black shadow-lg shadow-rose-200 animate-bounce">
            {value > 9 ? '9+' : value}
          </div>
        )}
        {isComingSoon && (
          <div className="bg-gray-200/50 backdrop-blur-sm text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
            Coming Soon
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-gray-600 transition-colors">
          {title}
        </h3>
        <p className={`text-3xl font-black ${style.text} tracking-tighter mb-1`}>
          {isComingSoon ? '-' : value}
        </p>
        <p className="text-xs text-gray-400 font-medium italic">{description}</p>
      </div>
    </Link>
  );
};

const ActionButton = ({ title, description, link, icon, isComingSoon, theme }) => {
  const themeMap = {
    teal: 'from-teal-400 to-teal-600 shadow-teal-100',
    blue: 'from-blue-400 to-blue-600 shadow-blue-100',
    emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-100',
    purple: 'from-purple-400 to-purple-600 shadow-purple-100',
    orange: 'from-orange-400 to-orange-600 shadow-orange-100',
    rose: 'from-rose-400 to-rose-600 shadow-rose-100',
  };

  return (
    <Link
      to={isComingSoon ? '#' : link}
      className={`group relative p-8 rounded-[2rem] border border-gray-100 bg-white transition-all duration-500 ${isComingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-gray-200 hover:border-teal-200 hover:-translate-y-1'}`}
      onClick={(e) => isComingSoon && e.preventDefault()}
    >
      <div className="flex flex-col gap-6">
        <div className={`w-14 h-14 bg-gradient-to-br ${themeMap[theme]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 group-hover:text-teal-600 transition">
            {title} {!isComingSoon && <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
          </h3>
          <p className="text-gray-400 text-sm font-medium leading-relaxed mt-1 group-hover:text-gray-500 transition-colors">{description}</p>
        </div>
      </div>

      {isComingSoon && (
        <div className="absolute top-4 right-4 bg-gray-100 text-gray-400 text-[9px] font-black uppercase px-2 py-1 rounded-md">
          Soon
        </div>
      )}
    </Link>
  );
};

export default DashboardPage;