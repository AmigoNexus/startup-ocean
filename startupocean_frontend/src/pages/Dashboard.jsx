import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { companyAPI, eventAPI, collaborationAPI } from '../services/api';
import { Briefcase, Calendar, Users, MessageSquare } from 'lucide-react';
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
  });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [companyRes, eventsRes, collabRes, messagesRes] = await Promise.all([
        companyAPI.getMyCompany().catch(() => ({ data: { success: false } })),
        eventAPI.getUpcoming().catch(() => ({ data: { data: [] } })),
        collaborationAPI.getReceived().catch(() => ({ data: { data: [] } })),
        messageAPI.getUnreadCount().catch(() => ({ data: { data: 0 } })),
      ]);

      setStats({
        hasCompany: companyRes.data.success,
        upcomingEvents: eventsRes.data.data?.length || 0,
        collaborations: collabRes.data.data?.filter(c => c.status === 'PENDING').length || 0,
        unreadMessages: messagesRes.data.data || 0,
      });
    } catch {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-1  ">
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 mb-8 rounded-lg shadow-md">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold text-center">
              Welcome, <span className="font-bold">{user?.name || user?.email}</span>!
            </h2>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Briefcase className="h-8 w-8" />}
          title="Company Profile"
          value={stats.hasCompany ? 'Active' : 'Not Created'}
          color="blue"
          link="/company"
        />
        <StatCard
          icon={<Calendar className="h-8 w-8" />}
          title="Upcoming Events"
          value={stats.upcomingEvents}
          color="green"
          link="/events"
        />
        <StatCard
          icon={<Users className="h-8 w-8" />}
          title="Pending Requests"
          value={stats.collaborations}
          color="purple"
          link="/collaborations"
        />
        <StatCard
          icon={<MessageSquare className="h-8 w-8" />}
          title="Unread Messages"
          value={stats.unreadMessages}
          color="teal"
          link="/messages"
          badge={stats.unreadMessages > 0}
        />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!stats.hasCompany && (
            <ActionButton
              title="Create Company Profile"
              description="Set up your company profile to get started"
              link="/company"
              color="primary"
            />
          )}
          <ActionButton
            title="Search Companies"
            description="Find startups or service providers"
            link="/search"
            color="blue"
          />
          <ActionButton
            title="View Events"
            description="Explore upcoming networking events"
            link="/events"
            color="green"
          />
          <ActionButton
            title="Collaborations"
            description="Manage your collaboration requests"
            link="/collaborations"
            color="purple"
          />
          <ActionButton
            title="Messages"
            description="Chat with your connections"
            link="/messages"
            color="teal"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, link, badge }) => {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-500',
    green: 'from-green-400 to-green-500',
    purple: 'from-purple-400 to-purple-500',
    teal: 'from-teal-400 to-teal-500',
  };

  return (
    <Link
      to={link}
      className={`bg-gradient-to-br ${colorClasses[color]} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition relative`}
    >
      {badge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-pulse">
          {value > 9 ? '9+' : value}
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </Link>
  );
};

const ActionButton = ({ title, description, link }) => {
  return (
    <Link
      to={link}
      className="block bg-gray-50 hover:bg-gray-100 p-6 rounded-lg border-2 border-gray-200 hover:border-primary-500 transition"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-xs">{description}</p>
    </Link>
  );
};

export default DashboardPage;