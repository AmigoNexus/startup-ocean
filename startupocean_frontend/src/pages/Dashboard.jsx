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
  ArrowRight,
  TrendingUp,
  X
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
  const [showWelcome, setShowWelcome] = useState(true);
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
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-teal-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-sky-50 rounded-full blur-3xl opacity-60"></div>

      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Welcome Banner */}
        {isAuthenticated && showWelcome && (
          <div className="relative mb-12 group/welcome">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
              <button
                onClick={() => setShowWelcome(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all z-20 group/close"
                title="Dismiss welcome"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Decorative Banner Background */}
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"></div>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Briefcase className="h-40 w-40 rotate-12" />
              </div>

              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-teal-400 uppercase bg-teal-400/10 rounded-full border border-teal-400/20">
                  <TrendingUp className="h-3 w-3" />
                  Growth Dashboard
                </span>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                  Welcome Back, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </h2>
                <p className="text-slate-400 text-lg font-medium max-w-lg">
                  Scale your company and manage high-value collaborations all from one unified dashboard.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-black text-teal-600 uppercase tracking-[0.3em] flex items-center gap-3">
              <div className="w-10 h-0.5 bg-teal-500 rounded-full"></div>
              Business Intelligence
            </h2>
            <h3 className="text-2xl font-bold text-slate-800">Operational Overview</h3>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <Calendar className="h-4 w-4 text-teal-500" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard
            icon={<Briefcase className="h-6 w-6" />}
            title="Profile Status"
            value={stats.hasCompany ? 'ACTIVE' : 'INCOMPLETE'}
            link="/company"
            isStatus={true}
            description={stats.hasCompany ? "Your brand is visible" : "Step-up your profile"}
            active={stats.hasCompany}
          />
          <StatCard
            icon={<Calendar className="h-6 w-6" />}
            title="Events"
            value={stats.upcomingEvents}
            link="/events"
            isComingSoon={true}
            description="Upcoming networking"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Requests"
            value={stats.collaborations}
            link="/collaborations"
            badge={stats.collaborations > 0}
            description="Pending partnerships"
          />
          <StatCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="Messages"
            value={stats.unreadMessages}
            link="/messages"
            badge={stats.unreadMessages > 0}
            description="Unread communications"
          />
        </div>

        {/* Essential Navigation Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white/60"></div>
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-sm font-black text-teal-600 uppercase tracking-[0.3em] flex items-center gap-3 mb-3">
                  <div className="w-10 h-0.5 bg-teal-500 rounded-full"></div>
                  Core Platform
                </h2>
                <h3 className="text-3xl font-black text-slate-800">Essential Navigation</h3>
                <p className="text-slate-500 font-medium mt-2">Everything you need to grow your startup presence</p>
              </div>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-teal-600 transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-teal-100"
              >
                Explore Ecosystem
                <ArrowRight className="h-4 w-4" />
              </Link>
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
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, link, badge, isComingSoon, isStatus, description, active }) => {
  return (
    <Link
      to={isComingSoon ? '#' : link}
      className={`group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-52 
        ${isComingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-teal-100/50 hover:-translate-y-2 hover:border-teal-100'}`}
      onClick={(e) => isComingSoon && e.preventDefault()}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 opacity-40" />

      <div className="relative z-10 flex justify-between items-start">
        <div className={`p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all duration-500 group-hover:rotate-6`}>
          {icon}
        </div>
        {badge && !isComingSoon && (
          <div className="bg-rose-500 text-white rounded-full min-w-[24px] h-6 px-2 flex items-center justify-center text-[10px] font-black shadow-lg shadow-rose-200 animate-bounce">
            {value > 9 ? '9+' : value}
          </div>
        )}
        {isComingSoon && (
          <div className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
            Soon
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 group-hover:text-teal-600 transition-colors">
          {title}
        </h3>
        <div className="flex items-baseline gap-2">
          <p className={`text-3xl font-black tracking-tighter mb-1 ${isStatus ? (active ? 'text-teal-600' : 'text-slate-300') : 'text-slate-800'}`}>
            {isComingSoon ? '-' : value}
          </p>
          {isStatus && (
            <div className={`w-2 h-2 rounded-full mb-2 ${active ? 'bg-teal-500 animate-pulse' : 'bg-slate-300'}`}></div>
          )}
        </div>
        <p className="text-[10px] text-slate-400 font-bold italic">{description}</p>
      </div>
    </Link>
  );
};

const ActionButton = ({ title, description, link, icon, isComingSoon, theme }) => {
  const themeMap = {
    teal: 'bg-teal-500 shadow-teal-100',
    blue: 'bg-blue-500 shadow-blue-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    purple: 'bg-purple-500 shadow-purple-100',
    orange: 'bg-orange-500 shadow-orange-100',
    rose: 'bg-rose-500 shadow-rose-100',
  };

  return (
    <Link
      to={isComingSoon ? '#' : link}
      className={`group relative p-8 rounded-[2.5rem] border border-slate-100 bg-white transition-all duration-500 
        ${isComingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_20px_50px_rgba(45,212,191,0.15)] hover:border-teal-200 hover:-translate-y-2'}`}
      onClick={(e) => isComingSoon && e.preventDefault()}
    >
      <div className="flex flex-col gap-6">
        <div className={`w-14 h-14 ${themeMap[theme]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 group-hover:text-teal-600 transition-colors">
            {title}
            {!isComingSoon && <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />}
          </h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mt-2 group-hover:text-slate-500 transition-colors">
            {description}
          </p>
        </div>
      </div>

      {isComingSoon && (
        <div className="absolute top-6 right-6 bg-slate-100 text-slate-400 text-[9px] font-black uppercase px-2 py-1 rounded-md">
          Soon
        </div>
      )}
    </Link>
  );
};

export default DashboardPage;