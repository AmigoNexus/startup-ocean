import { useState, useEffect } from 'react';
import { enquiryAPI } from '../services/api';
import { FileText, Mail, Phone, User, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await enquiryAPI.getAll();
      setEnquiries(response.data.data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (enquiryId, newStatus) => {
    try {
      await enquiryAPI.updateStatus(enquiryId, newStatus);
      toast.success(`Enquiry marked as ${newStatus}`);
      fetchEnquiries();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) {
      return;
    }

    try {
      await enquiryAPI.delete(enquiryId);
      toast.success('Enquiry deleted successfully');
      fetchEnquiries();
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      toast.error('Failed to delete enquiry');
    }
  };

  const filteredEnquiries = enquiries.filter(e => 
    filter === 'ALL' ? true : e.status === filter
  );

  const statusCounts = {
    ALL: enquiries.length,
    NEW: enquiries.filter(e => e.status === 'NEW').length,
    IN_PROGRESS: enquiries.filter(e => e.status === 'IN_PROGRESS').length,
    RESOLVED: enquiries.filter(e => e.status === 'RESOLVED').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Enquiries Management</h1>
        <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-lg font-semibold">
          Total: {enquiries.length}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-3 rounded-lg transition whitespace-nowrap ${
              filter === status
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {status.replace('_', ' ')} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      {filteredEnquiries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No enquiries found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEnquiries.map((enquiry) => (
            <EnquiryCard
              key={enquiry.enquiryId}
              enquiry={enquiry}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EnquiryCard = ({ enquiry, onStatusUpdate, onDelete }) => {
  const statusColors = {
    NEW: 'bg-blue-100 text-blue-800 border-blue-300',
    IN_PROGRESS: 'bg-teal-100 text-teal-800 border-teal-300',
    RESOLVED: 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{enquiry.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {enquiry.email}
                </span>
                {enquiry.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {enquiry.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-teal-500">
            <p className="text-sm font-semibold text-gray-700 mb-1">Message:</p>
            <p className="text-gray-700">{enquiry.message}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Submitted on {format(new Date(enquiry.createdAt), 'PPp')}</span>
          </div>
        </div>

        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${statusColors[enquiry.status]}`}>
          {enquiry.status.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
        {enquiry.status === 'NEW' && (
          <button
            onClick={() => onStatusUpdate(enquiry.enquiryId, 'IN_PROGRESS')}
            className="flex items-center gap-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm font-medium"
          >
            <Clock className="h-4 w-4" />
            Mark In Progress
          </button>
        )}

        {enquiry.status === 'IN_PROGRESS' && (
          <button
            onClick={() => onStatusUpdate(enquiry.enquiryId, 'RESOLVED')}
            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            <CheckCircle className="h-4 w-4" />
            Mark Resolved
          </button>
        )}

        {enquiry.status === 'RESOLVED' && (
          <button
            onClick={() => onStatusUpdate(enquiry.enquiryId, 'NEW')}
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Reopen
          </button>
        )}

        <button
          onClick={() => onDelete(enquiry.enquiryId)}
          className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminEnquiriesPage;