import { useState, useEffect } from 'react';
import { collaborationAPI } from '../services/api';
import { MessageSquare, Inbox, Search, Users, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import EnhancedMessagingModal from '../components/EnhancedMessagingModal';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8025';

const messageAPI = {
    getUnreadCount: () => axios.get(`${API_BASE_URL}/messages/unread/count`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }),
    getByCollaboration: (collaborationId) => axios.get(`${API_BASE_URL}/messages/collaboration/${collaborationId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }),
};

const MessagesPage = () => {
    const [collaborations, setCollaborations] = useState([]);
    const [filteredCollaborations, setFilteredCollaborations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMessagingModal, setShowMessagingModal] = useState(false);
    const [selectedCollaboration, setSelectedCollaboration] = useState(null);
    const [lastMessages, setLastMessages] = useState({});
    const [unreadCounts, setUnreadCounts] = useState({});

    useEffect(() => {
        fetchAcceptedCollaborations();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCollaborations(collaborations);
        } else {
            const filtered = collaborations.filter(collab => {
                const company = collab.requesterCompany?.companyName?.toLowerCase() || '';
                const targetCompany = collab.targetCompany?.companyName?.toLowerCase() || '';
                const query = searchQuery.toLowerCase();
                return company.includes(query) || targetCompany.includes(query);
            });
            setFilteredCollaborations(filtered);
        }
    }, [searchQuery, collaborations]);

    const fetchAcceptedCollaborations = async () => {
        setLoading(true);
        try {
            const [sentRes, receivedRes] = await Promise.all([
                collaborationAPI.getSent(),
                collaborationAPI.getReceived(),
            ]);

            const sentCollabs = (sentRes.data.data || sentRes.data || [])
                .filter(c => c.status === 'ACCEPTED')
                .map(c => ({ ...c, type: 'sent' }));

            const receivedCollabs = (receivedRes.data.data || receivedRes.data || [])
                .filter(c => c.status === 'ACCEPTED')
                .map(c => ({ ...c, type: 'received' }));

            const allAcceptedCollaborations = [...receivedCollabs, ...sentCollabs];

            setCollaborations(allAcceptedCollaborations);
            setFilteredCollaborations(allAcceptedCollaborations);
            await fetchLastMessagesAndCounts(allAcceptedCollaborations);
        } catch (error) {
            console.error('Error fetching collaborations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLastMessagesAndCounts = async (collaborations) => {
        const lastMessagesMap = {};
        const unreadCountsMap = {};

        for (const collab of collaborations) {
            try {
                const response = await messageAPI.getByCollaboration(collab.collaborationId);
                const messages = response.data.data || [];

                if (messages.length > 0) {
                    const lastMsg = messages[messages.length - 1];
                    lastMessagesMap[collab.collaborationId] = lastMsg;
                    const myCompanyId = collab.type === 'sent'
                        ? collab.requesterCompany.companyId
                        : collab.targetCompany.companyId;

                    const unreadCount = messages.filter(
                        msg => msg.senderCompanyId !== myCompanyId && !msg.isRead
                    ).length;

                    unreadCountsMap[collab.collaborationId] = unreadCount;
                }
            } catch (error) {
                console.error(`Error fetching messages for collaboration ${collab.collaborationId}:`, error);
            }
        }

        setLastMessages(lastMessagesMap);
        setUnreadCounts(unreadCountsMap);
    };

    const openMessaging = (collaboration) => {
        setSelectedCollaboration(collaboration);
        setShowMessagingModal(true);
    };

    const handleCloseMessaging = () => {
        setShowMessagingModal(false);
        setSelectedCollaboration(null);
        fetchAcceptedCollaborations();
    };

    const formatLastMessageTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Messages</h1>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            ) : filteredCollaborations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                        {searchQuery ? 'No conversations found' : 'No messages yet'}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        {searchQuery
                            ? 'Try a different search term'
                            : 'Accept collaboration requests to start messaging'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 divide-y divide-gray-200">
                    {filteredCollaborations.map((collab) => (
                        <ConversationItem
                            key={collab.collaborationId}
                            collaboration={collab}
                            onClick={() => openMessaging(collab)}
                            lastMessage={lastMessages[collab.collaborationId]}
                            unreadCount={unreadCounts[collab.collaborationId] || 0}
                            formatTime={formatLastMessageTime}
                        />
                    ))}
                </div>
            )}

            {showMessagingModal && selectedCollaboration && (
                <EnhancedMessagingModal
                    collaboration={selectedCollaboration}
                    type={selectedCollaboration.type}
                    onClose={handleCloseMessaging}
                />
            )}
        </div>
    );
};

const ConversationItem = ({ collaboration, onClick, lastMessage, unreadCount, formatTime }) => {
    const company = collaboration.type === 'sent'
        ? collaboration.targetCompany
        : collaboration.requesterCompany;

    return (
        <div
            onClick={onClick}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {company?.companyName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {company?.companyName || 'Unknown Company'}
                        </h3>
                        {lastMessage && (
                            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                {formatTime(lastMessage.createdAt)}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-500 mb-1">{company?.companyType || 'N/A'}</p>
                            {lastMessage ? (
                                <p className={`text-sm truncate ${unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                    {lastMessage.senderCompanyId === (collaboration.type === 'sent' ? collaboration.requesterCompany.companyId : collaboration.targetCompany.companyId)
                                        ? 'You: '
                                        : ''}
                                    {lastMessage.content}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No messages yet</p>
                            )}
                        </div>

                        <MessageSquare className={`h-5 w-5 ml-3 flex-shrink-0 ${unreadCount > 0 ? 'text-teal-600' : 'text-gray-400'}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;