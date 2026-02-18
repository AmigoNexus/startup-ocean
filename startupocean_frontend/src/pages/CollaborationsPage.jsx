import { useState, useEffect } from 'react';
import { collaborationAPI, companyAPI } from '../services/api';
import { Send, Inbox, CheckCircle, XCircle, Briefcase, MessageSquare, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import EnhancedMessagingModal from '../components/EnhancedMessagingModal';

const CollaborationsPage = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [requestForm, setRequestForm] = useState({
    targetCompanyId: '',
    message: '',
  });

  useEffect(() => {
    fetchCollaborations();
  }, [activeTab]);

  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      const response = activeTab === 'sent'
        ? await collaborationAPI.getSent()
        : await collaborationAPI.getReceived();

      setCollaborations(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching collaborations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getAll();
      setCompanies(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleAccept = async (collaborationId) => {
    setConfirmAction({
      type: 'accept',
      collaborationId,
      title: 'Accept Collaboration Request',
      message: 'Are you sure you want to accept this collaboration request? You will be able to start messaging with this company.',
      confirmText: 'Accept',
      confirmClass: 'bg-green-600 hover:bg-green-700',
      icon: <CheckCircle className="h-12 w-12 text-green-600" />
    });
    setShowConfirmModal(true);
  };

  const handleReject = async (collaborationId) => {
    setConfirmAction({
      type: 'reject',
      collaborationId,
      title: 'Reject Collaboration Request',
      message: 'Are you sure you want to reject this collaboration request? This action cannot be undone.',
      confirmText: 'Reject',
      confirmClass: 'bg-red-600 hover:bg-red-700',
      icon: <XCircle className="h-12 w-12 text-red-600" />
    });
    setShowConfirmModal(true);
  };

  const executeAction = async () => {
    try {
      if (confirmAction.type === 'accept') {
        await collaborationAPI.accept(confirmAction.collaborationId);
        toast.success('Collaboration request accepted!');
      } else if (confirmAction.type === 'reject') {
        await collaborationAPI.reject(confirmAction.collaborationId);
        toast.success('Collaboration request rejected');
      }
      fetchCollaborations();
      setShowDetailsModal(false);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error processing collaboration:', error);
      toast.error('Failed to process request');
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();

    if (!requestForm.targetCompanyId) {
      toast('Please select a company');
      return;
    }

    try {
      await collaborationAPI.send(requestForm);
      toast.success('Collaboration request sent successfully!');
      setShowRequestModal(false);
      setRequestForm({ targetCompanyId: '', message: '' });
      if (activeTab === 'sent') {
        fetchCollaborations();
      }
    } catch (error) {
      console.error('Error sending collaboration:', error);
      toast('Failed to send request');
    }
  };

  const openRequestModal = () => {
    fetchCompanies();
    setShowRequestModal(true);
  };

  const viewDetails = (collaboration) => {
    setSelectedCollaboration(collaboration);
    setShowDetailsModal(true);
  };

  const openMessaging = (collaboration) => {
    setSelectedCollaboration(collaboration);
    setShowMessagingModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Collaborations</h1>
        <button
          onClick={openRequestModal}
          className="w-full sm:w-auto bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2 shadow-md"
        >
          <Send className="h-5 w-5" />
          Send Request
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition text-sm sm:text-base ${activeTab === 'received'
            ? 'bg-teal-600 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
        >
          <Inbox className="h-5 w-5" />
          Received ({collaborations.filter(c => activeTab === 'received').length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition text-sm sm:text-base ${activeTab === 'sent'
            ? 'bg-teal-600 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
        >
          <Send className="h-5 w-5" />
          Sent ({collaborations.filter(c => activeTab === 'sent').length})
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {collaborations.map((collab) => (
            <CollaborationCard
              key={collab.collaborationId}
              collaboration={collab}
              type={activeTab}
              onAccept={handleAccept}
              onReject={handleReject}
              onViewDetails={viewDetails}
              onOpenMessaging={openMessaging}
            />
          ))}
        </div>
      )}

      {!loading && collaborations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No {activeTab} collaborations found</p>
          <p className="text-gray-400 text-sm mt-2">
            {activeTab === 'received'
              ? 'You have not received any collaboration requests yet'
              : 'You have not sent any collaboration requests yet'}
          </p>
        </div>
      )}

      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send Collaboration Request
            </h2>
            <form onSubmit={handleSendRequest} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Company *
                </label>
                <select
                  required
                  value={requestForm.targetCompanyId}
                  onChange={(e) => setRequestForm({ ...requestForm, targetCompanyId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Choose a company...</option>
                  {companies.map((company) => (
                    <option key={company.companyId} value={company.companyId}>
                      {company.companyName} - {company.companyType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="Tell them why you'd like to collaborate..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition"
                >
                  Send Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailsModal && selectedCollaboration && (
        <CollaborationDetailsModal
          collaboration={selectedCollaboration}
          type={activeTab}
          onClose={() => setShowDetailsModal(false)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}

      {showMessagingModal && selectedCollaboration && (
        <EnhancedMessagingModal
          collaboration={selectedCollaboration}
          type={activeTab}
          onClose={() => setShowMessagingModal(false)}
        />
      )}

      {showConfirmModal && confirmAction && (
        <ConfirmationModal
          title={confirmAction.title}
          message={confirmAction.message}
          confirmText={confirmAction.confirmText}
          confirmClass={confirmAction.confirmClass}
          icon={confirmAction.icon}
          onConfirm={executeAction}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

const ConfirmationModal = ({ title, message, confirmText, confirmClass, icon, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all animate-slideUp">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 animate-bounce">
            {icon}
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {title}
          </h3>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 text-white rounded-lg transition font-semibold ${confirmClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollaborationCard = ({ collaboration, type, onAccept, onReject, onViewDetails, onOpenMessaging }) => {
  const company = type === 'sent' ? collaboration.targetCompany : collaboration.requesterCompany;

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    ACCEPTED: 'bg-green-100 text-green-800 border-green-300',
    REJECTED: 'bg-red-100 text-red-800 border-red-300',
    CANCELLED: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-teal-100 rounded-lg flex items-center justify-center">
            <Briefcase className="h-6 w-6 sm:h-7 sm:sm:w-7 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">{company?.companyName || 'Unknown Company'}</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">{company?.companyType || 'N/A'}</p>
          </div>
        </div>
        <span className={`self-start px-3 py-1 rounded-full text-xs font-bold border ${statusColors[collaboration.status]}`}>
          {collaboration.status}
        </span>
      </div>

      {company?.description && (
        <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">{company.description}</p>
      )}

      {collaboration.message && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-teal-500">
          <p className="text-sm font-semibold text-gray-700 mb-1">Message:</p>
          <p className="text-gray-700">{collaboration.message}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="text-[10px] sm:text-xs text-gray-500">
          <span className="font-semibold uppercase tracking-wider opacity-60">Sent</span>
          <br className="sm:hidden" />
          <span className="sm:ml-1 font-medium">{format(new Date(collaboration.createdAt), 'PPp')}</span>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {collaboration.status === 'ACCEPTED' && (
            <button
              onClick={() => onOpenMessaging(collaboration)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs font-bold shadow-sm"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Messages
            </button>
          )}

          <button
            onClick={() => onViewDetails(collaboration)}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs font-bold"
          >
            View Details
          </button>

          {type === 'received' && collaboration.status === 'PENDING' && (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => onAccept(collaboration.collaborationId)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-xs font-bold shadow-sm"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Accept
              </button>
              <button
                onClick={() => onReject(collaboration.collaborationId)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-xs font-bold shadow-sm"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CollaborationDetailsModal = ({ collaboration, type, onClose, onAccept, onReject }) => {
  const company = type === 'sent' ? collaboration.targetCompany : collaboration.requesterCompany;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Collaboration Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-teal-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              {company?.companyName?.charAt(0) || '?'}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{company?.companyName || 'Unknown'}</h3>
              <p className="text-gray-600">{company?.companyType || 'N/A'}</p>
            </div>
          </div>

          {company?.description && (
            <div className="mt-4">
              <p className="text-gray-700 leading-relaxed">{company.description}</p>
            </div>
          )}
        </div>

        {collaboration.message && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Message</h4>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-teal-500">
              <p className="text-gray-700 whitespace-pre-wrap">{collaboration.message}</p>
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-gray-800">{collaboration.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date Sent</p>
              <p className="text-lg font-semibold text-gray-800">
                {format(new Date(collaboration.createdAt), 'PPP')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {type === 'received' && collaboration.status === 'PENDING' && (
            <>
              <button
                onClick={() => onAccept(collaboration.collaborationId)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                <CheckCircle className="h-5 w-5" />
                Accept Request
              </button>
              <button
                onClick={() => onReject(collaboration.collaborationId)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                <XCircle className="h-5 w-5" />
                Reject Request
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationsPage;