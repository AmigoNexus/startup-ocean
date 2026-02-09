import { useEffect, useState } from 'react';
import { eventAPI } from '../services/api';
import { Calendar, MapPin, Users, Clock, Plus, X, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('upcoming');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        fetchEvents();
    }, [filter]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response =
                filter === 'upcoming'
                    ? await eventAPI.getUpcoming()
                    : await eventAPI.getPast();
            setEvents(response.data.data || []);
        } catch (error) {
            console.error('Fetch events error:', error);
            toast('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        if (!isAuthenticated) {
            toast('Please login to register for events');
            return;
        }
        try {
            await eventAPI.register(eventId);
            toast.success('Successfully registered for event!');
            fetchEvents();
        } catch (error) {
            toast(error.response?.data?.message || 'Registration failed');
        }
    };

    const handleCancelRegistration = async (eventId) => {
        try {
            await eventAPI.cancelRegistration(eventId);
            toast.success('Registration cancelled successfully');
            fetchEvents();
        } catch (error) {
            toast(error.response?.data?.message || 'Failed to cancel registration');
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await eventAPI.delete(eventId);
            toast.success('Event deleted successfully');
            fetchEvents();
        } catch (error) {
            toast(error.response?.data?.message || 'Failed to delete event');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setShowCreateModal(true);
    };

    const handleViewParticipants = (event) => {
        setSelectedEvent(event);
        setShowParticipantsModal(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Events</h1>

                <div className="flex gap-2 items-center flex-wrap">
                    {isAdmin && (
                        <button
                            onClick={() => {
                                setEditingEvent(null);
                                setShowCreateModal(true);
                            }}
                            className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition flex items-center gap-2 shadow-md"
                        >
                            <Plus className="h-5 w-5" />
                            Create Event
                        </button>
                    )}

                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-6 py-2 rounded-lg transition ${
                            filter === 'upcoming'
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-6 py-2 rounded-lg transition ${
                            filter === 'past'
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Past
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-base">No {filter} events found</p>
                    {isAdmin && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition"
                        >
                            Create First Event
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) =>
                        isAdmin ? (
                            <AdminEventCard
                                key={event.eventId}
                                event={event}
                                onEdit={() => handleEdit(event)}
                                onDelete={() => handleDelete(event.eventId)}
                                onViewParticipants={() => handleViewParticipants(event)}
                            />
                        ) : (
                            <UserEventCard
                                key={event.eventId}
                                event={event}
                                isAuthenticated={isAuthenticated}
                                onRegister={handleRegister}
                                onCancel={handleCancelRegistration}
                            />
                        )
                    )}
                </div>
            )}

            {showCreateModal && (
                <EventModal
                    event={editingEvent}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingEvent(null);
                    }}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        setEditingEvent(null);
                        fetchEvents();
                    }}
                />
            )}

            {showParticipantsModal && selectedEvent && (
                <ParticipantsModal
                    event={selectedEvent}
                    onClose={() => {
                        setShowParticipantsModal(false);
                        setSelectedEvent(null);
                    }}
                />
            )}
        </div>
    );
};

const UserEventCard = ({ event, isAuthenticated, onRegister, onCancel }) => {
    const isPast = new Date(event.eventDate) < new Date();
    const isFull =
        event.maxParticipants &&
        event.registeredParticipants >= event.maxParticipants;

    return (
        <BaseEventCard event={event}>
            {!isPast && isAuthenticated ? (
                event.isRegistered ? (
                    <button
                        onClick={() => onCancel(event.eventId)}
                        className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition"
                    >
                        Cancel Registration
                    </button>
                ) : (
                    <button
                        onClick={() => onRegister(event.eventId)}
                        disabled={isFull}
                        className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isFull ? 'Event Full' : 'Register Now'}
                    </button>
                )
            ) : !isPast && !isAuthenticated ? (
                <p className="text-center text-gray-500 text-sm py-2">
                    Login to register for this event
                </p>
            ) : isPast ? (
                <div className="text-center text-sm text-white bg-gray-500 py-2 rounded-lg">
                    Event Completed
                </div>
            ) : null}
        </BaseEventCard>
    );
};

const AdminEventCard = ({ event, onEdit, onDelete, onViewParticipants }) => {
    const isPast = new Date(event.eventDate) < new Date();

    return (
        <BaseEventCard event={event} isAdmin={true}>
            <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                <button
                    onClick={onViewParticipants}
                    className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition flex items-center justify-center gap-2"
                >
                    <Eye className="h-4 w-4" />
                    View Participants ({event.registeredParticipants || 0})
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="flex-1 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition flex items-center justify-center gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </button>
                </div>
                {isPast && (
                    <div className="text-center text-sm text-white bg-gray-500 py-1 rounded-lg">
                        Completed
                    </div>
                )}
            </div>
        </BaseEventCard>
    );
};

const BaseEventCard = ({ event, children, isAdmin }) => (
    <div
        className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition ${
            isAdmin ? 'border-2 border-teal-200' : ''
        }`}
    >
        <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {event.eventName}
                </h3>
                {event.eventType && (
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                        {event.eventType}
                    </span>
                )}
            </div>
            <Calendar className="h-6 w-6 text-primary-500 flex-shrink-0" />
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">
            {event.eventDescription || 'No description provided'}
        </p>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{format(new Date(event.eventDate), 'PPp')}</span>
            </div>
            {event.location && (
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                </div>
            )}
            <div className="flex items-center gap-2">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="font-semibold">
                    {event.registeredParticipants || 0}
                    {event.maxParticipants && ` / ${event.maxParticipants}`} registered
                </span>
            </div>
        </div>

        {children}
    </div>
);

const ParticipantsModal = ({ event, onClose }) => (
    <Modal title={`Participants - ${event.eventName}`} onClose={onClose}>
        <div className="mb-6 p-4 bg-primary-50 rounded-lg">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-600">Total Registered</p>
                    <p className="text-3xl font-bold text-primary-600">
                        {event.registeredParticipants || 0}
                    </p>
                </div>
                {event.maxParticipants && (
                    <div>
                        <p className="text-sm text-gray-600">Max Capacity</p>
                        <p className="text-3xl font-bold text-gray-700">
                            {event.maxParticipants}
                        </p>
                    </div>
                )}
            </div>
        </div>

        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="font-medium">Participant Details</p>
            <p className="text-sm mt-2">
                Backend API required: GET /events/{event.eventId}/participants
            </p>
            <p className="text-xs text-gray-400 mt-2">
                Will display participant names, emails, and registration status
            </p>
        </div>

        <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
        >
            Close
        </button>
    </Modal>
);

const EventModal = ({ event, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        eventName: event?.eventName || '',
        eventDescription: event?.eventDescription || '',
        eventDate: event?.eventDate
            ? format(new Date(event.eventDate), "yyyy-MM-dd'T'HH:mm")
            : '',
        location: event?.location || '',
        maxParticipants: event?.maxParticipants || '',
        eventType: event?.eventType || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                eventDate: new Date(formData.eventDate).toISOString(),
                maxParticipants: formData.maxParticipants
                    ? parseInt(formData.maxParticipants)
                    : null,
            };

            if (event) {
                await eventAPI.update(event.eventId, payload);
                toast.success('Event updated successfully!');
            } else {
                await eventAPI.create(payload);
                toast.success('Event created successfully!');
            }
            onSuccess();
        } catch (error) {
            toast(
                error.response?.data?.message ||
                    `Failed to ${event ? 'update' : 'create'} event`
            );
            console.error('Event operation error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title={event ? 'Edit Event' : 'Create New Event'} onClose={onClose} large>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Name *
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Enter event name"
                        value={formData.eventName}
                        onChange={(e) =>
                            setFormData({ ...formData, eventName: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Description
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Describe your event..."
                        value={formData.eventDescription}
                        onChange={(e) =>
                            setFormData({ ...formData, eventDescription: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Date & Time *
                    </label>
                    <input
                        type="datetime-local"
                        required
                        value={formData.eventDate}
                        onChange={(e) =>
                            setFormData({ ...formData, eventDate: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        placeholder="Event location or online link"
                        value={formData.location}
                        onChange={(e) =>
                            setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Participants
                        </label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Leave empty for unlimited"
                            value={formData.maxParticipants}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    maxParticipants: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Type
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Networking, Workshop"
                            value={formData.eventType}
                            onChange={(e) =>
                                setFormData({ ...formData, eventType: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
                    >
                        {loading
                            ? event
                                ? 'Updating...'
                                : 'Creating...'
                            : event
                            ? 'Update Event'
                            : 'Create Event'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const Modal = ({ title, children, onClose, large }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
            className={`bg-white rounded-lg p-8 w-full max-h-[90vh] overflow-y-auto ${
                large ? 'max-w-2xl' : 'max-w-xl'
            }`}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>
            {children}
        </div>
    </div>
);

export default EventsPage;