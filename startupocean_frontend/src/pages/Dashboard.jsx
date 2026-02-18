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
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
        <div className="bg-gradient-to-br from-teal-400 to-teal-500 text-white p-8 mb-10 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Briefcase className="h-40 w-40 rotate-12" />
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
          icon={<Briefcase className="h-4 w-4" />}
          title="Profile Status"
          value={stats.hasCompany ? 'Active' : 'Not Setup'}
          color="blue"
          link="/company"
        />
        <StatCard
          icon={<Calendar className="h-4 w-4" />}
          title="Upcoming Events"
          value={stats.upcomingEvents}
          color="green"
          link="/events"
          isComingSoon={true}
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          title="Pending Requests"
          value={stats.collaborations}
          color="purple"
          link="/collaborations"
          badge={stats.collaborations > 0}
        />
        <StatCard
          icon={<MessageSquare className="h-4 w-4" />}
          title="Unread Messages"
          value={stats.unreadMessages}
          color="teal"
          link="/messages"
          badge={stats.unreadMessages > 0}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-teal-600" /> Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!stats.hasCompany && (
            <ActionButton
              icon={<PlusCircle className="h-4 w-4 text-teal-600" />}
              title="Create Company Profile"
              description="Get started by setting up your brand"
              link="/company"
            />
          )}
          <ActionButton
            icon={<Search className="h-4 w-4 text-blue-600" />}
            title="Search Companies"
            description="Explore potential partners"
            link="/search"
          />
          <ActionButton
            icon={<Calendar className="h-4 w-4 text-green-600" />}
            title="View Events"
            description="Discover networking opportunities"
            link="/events"
            isComingSoon={true}
          />
          <ActionButton
            icon={<Users className="h-4 w-4 text-purple-600" />}
            title="Collaborations"
            description="Manage your requests"
            link="/collaborations"
          />
          <ActionButton
            icon={<MessageSquare className="h-4 w-4 text-teal-600" />}
            title="Messages"
            description="Chat with connections"
            link="/messages"
          />
          {isAdmin && (
            <ActionButton
              icon={<Bell className="h-4 w-4 text-orange-600" />}
              title="View Enquiries"
              description="Manage system enquiries"
              link="/admin/enquiries"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, link, badge, isComingSoon }) => {
  const colorMap = {
    blue: 'border-blue-500 text-blue-600 bg-blue-50/30',
    green: 'border-green-500 text-green-600 bg-green-50/30',
    purple: 'border-purple-500 text-purple-600 bg-purple-50/30',
    teal: 'border-teal-500 text-teal-600 bg-teal-50/30',
  };

  return (
    <Link
      to={isComingSoon ? '#' : link}
      className={`group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-40 ${isComingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:border-teal-200 hover:-translate-y-1'}`}
      onClick={(e) => isComingSoon && e.preventDefault()}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
          {icon}
        </div>
        {badge && !isComingSoon && (
          <div className="bg-red-500 text-white rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold animate-pulse">
            {value > 9 ? '9+' : value}
          </div>
        )}
        {isComingSoon && (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Soon</span>
        )}
      </div>
      <div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 group-hover:text-gray-700 transition">
          {title}
        </h3>
        <p className="text-2xl font-black text-gray-800 tracking-tight">{isComingSoon ? '-' : value}</p>
      </div>
    </Link>
  );
};

const ActionButton = ({ title, description, link, icon, isComingSoon }) => {
  return (
    <Link
      to={isComingSoon ? '#' : link}
      className={`group block p-6 rounded-2xl border border-gray-100 bg-gray-50/50 transition-all duration-300 ${isComingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:shadow-lg hover:shadow-teal-100/50 hover:border-teal-200'}`}
      onClick={(e) => isComingSoon && e.preventDefault()}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1 group-hover:text-teal-600 transition">
            {title} {!isComingSoon && <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />}
          </h3>
          <p className="text-gray-500 text-[10px] font-medium mt-0.5">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default DashboardPage;