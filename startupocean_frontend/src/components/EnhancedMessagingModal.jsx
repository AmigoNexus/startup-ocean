import { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Check, CheckCheck, X, Smile } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8025';

const messageAPI = {
    send: (data) => axios.post(`${API_BASE_URL}/messages`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }),
    getByCollaboration: (collaborationId) => axios.get(`${API_BASE_URL}/messages/collaboration/${collaborationId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }),
    markAsRead: (messageId) => axios.put(`${API_BASE_URL}/messages/${messageId}/read`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }),
};

const EnhancedMessagingModal = ({ collaboration, type, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const messageContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const company = type === 'sent' ? collaboration.targetCompany : collaboration.requesterCompany;
    const myCompanyId = type === 'sent'
        ? collaboration.requesterCompany.companyId
        : collaboration.targetCompany.companyId;
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);

        if (isToday(date)) {
            return format(date, 'HH:mm');
        } else if (isYesterday(date)) {
            return `Yesterday ${format(date, 'HH:mm')}`;
        } else {
            return format(date, 'dd/MM/yyyy HH:mm');
        }
    };

    const groupMessagesByDate = (messages) => {
        const groups = {};

        messages.forEach(msg => {
            const date = new Date(msg.createdAt);
            let dateKey;

            if (isToday(date)) {
                dateKey = 'Today';
            } else if (isYesterday(date)) {
                dateKey = 'Yesterday';
            } else {
                dateKey = format(date, 'dd MMMM yyyy');
            }

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(msg);
        });

        return groups;
    };

    const fetchMessages = async () => {
        try {
            const response = await messageAPI.getByCollaboration(collaboration.collaborationId);
            const fetchedMessages = response.data.data || [];
            setMessages(fetchedMessages);

            fetchedMessages
                .filter(msg => !msg.isRead && msg.senderCompanyId !== myCompanyId)
                .forEach(msg => {
                    messageAPI.markAsRead(msg.messageId).catch(err =>
                        console.error('Failed to mark as read:', err)
                    );
                });

            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();

        const interval = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => clearInterval(interval);
    }, [collaboration.collaborationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleTyping = () => {
        setIsTyping(true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 1000);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || sending) return;

        const messageContent = newMessage.trim();
        setNewMessage('');
        setSending(true);

        const tempMessage = {
            messageId: Date.now(),
            content: messageContent,
            senderCompanyId: myCompanyId,
            senderCompanyName: type === 'sent'
                ? collaboration.requesterCompany.companyName
                : collaboration.targetCompany.companyName,
            createdAt: new Date().toISOString(),
            isRead: false,
            sending: true
        };

        setMessages(prev => [...prev, tempMessage]);
        scrollToBottom();

        try {
            await messageAPI.send({
                collaborationId: collaboration.collaborationId,
                content: messageContent,
            });

            await fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');

            setMessages(prev => prev.filter(m => m.messageId !== tempMessage.messageId));
        } finally {
            setSending(false);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const groupedMessages = groupMessagesByDate(messages);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-0 md:p-4 z-50">
            <div className="bg-white w-full h-full md:max-w-4xl md:h-[90vh] md:rounded-lg flex flex-col shadow-2xl">
                <div className="bg-gradient-to-r from-teal-400 to-teal-500 text-white p-4 md:rounded-t-lg flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-600 font-bold text-lg">
                            {company?.companyName?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-semibold truncate">{company?.companyName}</h2>
                            <p className="text-xs text-teal-100 truncate">{company?.companyType}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-teal-500 rounded-full transition ml-2"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div
                    ref={messageContainerRef}
                    className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                >
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading messages...</p>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                                <Send className="h-12 w-12 text-teal-400" />
                            </div>
                            <p className="text-lg font-semibold">No messages yet</p>
                            <p className="text-sm mt-2">Start the conversation by sending a message!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                                <div key={date}>
                                    <div className="flex items-center justify-center my-4">
                                        <div className="bg-white px-3 rounded-full shadow-sm border border-gray-200">
                                            <span className="text-xs font-medium text-gray-600">{date}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {dateMessages.map((msg, index) => {
                                            const isMe = msg.senderCompanyId === myCompanyId;
                                            const showAvatar = index === 0 ||
                                                dateMessages[index - 1].senderCompanyId !== msg.senderCompanyId;

                                            return (
                                                <div
                                                    key={msg.messageId}
                                                    className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                                >
                                                    {!isMe && (
                                                        <div className={`w-8 h-8 flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                                            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                                {msg.senderCompanyName?.charAt(0) || '?'}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className={`max-w-[75%] md:max-w-[60%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                                        {!isMe && showAvatar && (
                                                            <span className="text-xs font-semibold text-gray-600 mb-1 px-2">
                                                                {msg.senderCompanyName}
                                                            </span>
                                                        )}

                                                        <div
                                                            className={`rounded-2xl px-4 py-2 shadow-sm ${isMe
                                                                    ? 'bg-teal-500 text-white rounded-br-sm'
                                                                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                                                                } ${msg.sending ? 'opacity-70' : ''}`}
                                                        >
                                                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                                                {msg.content}
                                                            </p>

                                                            <div className={`flex items-center gap-1 mt-1 justify-end ${isMe ? 'text-teal-100' : 'text-gray-500'}`}>
                                                                <span className="text-xs">
                                                                    {formatMessageTime(msg.createdAt)}
                                                                </span>
                                                                {isMe && (
                                                                    <span className="ml-1">
                                                                        {msg.sending ? (
                                                                            <div className="w-3 h-3 border-2 border-teal-100 border-t-transparent rounded-full animate-spin"></div>
                                                                        ) : msg.isRead ? (
                                                                            <CheckCheck className="h-4 w-4 text-blue-200" />
                                                                        ) : (
                                                                            <Check className="h-4 w-4" />
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
                {isTyping && (
                    <div className="px-4 py-2 bg-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                            <span className="text-xs text-gray-500">typing...</span>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4 md:rounded-b-lg">
                    <div className="flex items-end gap-2">
                        <div className="flex-1 relative">
                            <textarea
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    handleTyping();
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none max-h-32"
                                rows={1}
                                disabled={sending}
                                style={{
                                    minHeight: '44px',
                                    maxHeight: '120px'
                                }}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            className={`p-3 rounded-full transition flex-shrink-0 ${newMessage.trim() && !sending
                                    ? 'bg-teal-300 text-white hover:bg-teal-400 shadow-lg'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {sending ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Send className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnhancedMessagingModal;