# Event Module Design Documentation

This document outlines the full-stack architecture, data flow, and feature set for the Event Module in the Startup Ocean platform.

## 1. Overview
The Event Module is designed to facilitate networking and knowledge sharing within the startup ecosystem. It allows organizations (and admins) to host events, and users to discover and register for them.

---

## 2. Frontend Architecture (React)

### 2.1 Components Structure
- **`EventsPage.jsx`**: The main container managing the state of events, filters (Upcoming/Past), and modal visibility.
- **`EventCard` (Base, User, Admin)**:
    - `BaseEventCard`: Renders core UI (Image, Title, Date, Time, Location, Capacity).
    - `UserEventCard`: Wraps base card with "Register" or "Cancel Registration" buttons.
    - `AdminEventCard`: Wraps base card with "Edit", "Delete", and "View Participants" controls.
- **`EventModal`**: A unified form for creating and updating events.
- **`ParticipantsModal`**: A management view for organizers to see who has registered.

### 2.2 State Management
- `events`: Array of event objects fetched from the API.
- `filter`: String (`'upcoming'` or `'past'`) determining which API endpoint to call.
- `showCreateModal` / `showParticipantsModal`: Boolean flags for UI overlays.
- `editingEvent`: The event object currently being modified.

### 2.3 Styling Strategy
- **Framework**: Tailwind CSS.
- **Aesthetic**: Premium light theme with a `teal-600` primary color.
- **Animations**: `framer-motion` for smooth layout transitions and modal entrance/exit.

---

## 3. Backend Architecture (API Design)

### 3.1 Data Model (Conceptual)

| Field | Type | Description |
| :--- | :--- | :--- |
| `eventId` | String (UUID) | Unique identifier for the event. |
| `eventName` | String | Title of the event. |
| `eventDescription` | Text | Detailed information/agenda. |
| `eventDate` | DateTime | When the event starts. |
| `location` | String | Physical address or virtual link. |
| `eventType` | String | Category (Networking, Workshop, etc.). |
| `maxParticipants` | Integer | Seat limit (optional). |
| `status` | Enum | `DRAFT`, `PUBLISHED`, `CANCELLED`. |
| `hostId` | String | Reference to the organizing User/Company. |

### 3.2 API Endpoints (`eventAPI`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/events/upcoming` | Retrieves all future events. |
| `GET` | `/events/past` | Retrieves historical data. |
| `GET` | `/events/:id` | Detailed view of a single event. |
| `POST` | `/events` | Creates a new event (Admin/Host only). |
| `PUT` | `/events/:id` | Updates event details. |
| `DELETE` | `/events/:id` | Permanently removes an event. |
| `POST` | `/events/:id/register` | Registers the current user for an event. |
| `DELETE` | `/events/:id/register` | Cancels current user's registration. |

---

## 4. User Journey & Data Flow

### 4.1 Discovery Flow
1. User navigates to `/events`.
2. Frontend triggers `eventAPI.getUpcoming()`.
3. Backend returns a list of events filtered by date > `NOW()`.
4. User toggles the "Past" button, triggering `eventAPI.getPast()`.

### 4.2 Registration Flow
1. User clicks **"Register for Event"**.
2. Frontend calls `eventAPI.register(eventId)`.
3. Backend validates:
    - User is authenticated.
    - Event is not full (`registered < max`).
    - User is not already registered.
4. Backend creates a record in the `Registrations` bridge table.
5. Frontend displays a Success Toast and updates the local registration count.

### 4.3 Hosting Flow (Admin/Authenticated)
1. Admin clicks **"Host an Event"**.
2. `EventModal` opens, taking inputs (Name, Date, Location, etc.).
3. On submit, `eventAPI.create(payload)` is called.
4. Local event list is refreshed to show the new card.

---

## 5. Permissions Matrix

| Feature | Guest | Authenticated User | Admin / Organizer |
| :--- | :---: | :---: | :---: |
| View Upcoming Events | ✅ | ✅ | ✅ |
| View Past Events | ✅ | ✅ | ✅ |
| Register for Event | ❌* | ✅ | ✅ |
| Host/Create Event | ❌ | ❌ (or limited) | ✅ |
| Edit/Delete Events | ❌ | ❌ | ✅ (Own events) |
| View Participant List | ❌ | ❌ | ✅ |

*\*Guests are prompted to login before registration.*

---

## 6. Future Enhancements
- **Email Notifications**: Automated reminders 24 hours before an event starts.
- **Calendar Integration**: "Add to Google Calendar" / iCal links.
- **Waitlist Logic**: Auto-registration if a spot opens up in a full event.
- **Attendance Tracking**: QR code scanning for physical events.
