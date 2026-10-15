# EventHub: Event Management System

A responsive React application for exploring events, viewing event details, registering for events and managing your registrations. Event data comes live from the **Ticketmaster Discovery API**.

Built for **Web Programming, Assignment 2**.

## Features

**Authentication (frontend simulation)**
- User registration (name, email, password, confirm password) with form validation
- Login and logout
- Login state persists across page refreshes using Local Storage
- Protected routes: `/my-events` requires login, and login/register redirect logged-in users away

**Event exploration**
- Browse upcoming events from the Ticketmaster Discovery API
- Keyword search (debounced to avoid unnecessary API calls)
- Filters: category, city, country, date range, and sort order
- "Next 30 days" quick filter
- Event categories loaded from the API's classifications endpoint
- Pagination
- Loading, empty and error states, with a retry button

**Event details**
- Name, date and time, venue, full location, category, genre, event image
- Price range, description, notes, featured attractions, seat map and a link to Ticketmaster

**Registration**
- Register for an event while logged in (logged-out users are sent to login and returned afterwards)
- Duplicate registration is prevented
- Toast notifications for feedback
- Cancel a registration with a confirmation prompt
- Registrations are stored per user

**My Events**
- Separate **Upcoming** and **Completed** tabs
- Cancel upcoming registrations (completed events are kept as history)

## Tech stack

| Purpose | Tool |
|---|---|
| UI | React |
| Build tool | Vite |
| State management | Redux Toolkit, React-Redux |
| Routing | React Router |
| Data | Ticketmaster Discovery API v2 |

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version)
- A free Ticketmaster API key (see below)

### Get a Ticketmaster API key
1. Register at https://developer.ticketmaster.com/
2. Open **My Apps** and copy the **Consumer Key**. This is your API key.

### Installation

```bash
git clone https://github.com/Anosha-Aamer/event-management-system.git
cd event-management-system
npm install
```

### Configure environment variables

Create a `.env` file in the project root (next to `package.json`). You can copy the example file:

```bash
# Windows (PowerShell / Command Prompt)
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Then open `.env` and paste your key:

```
VITE_TM_API_KEY=your_ticketmaster_consumer_key
```

> `.env` is listed in `.gitignore` and must never be committed.

### Run the app

```bash
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).
If you change `.env` while the server is running, stop and restart it.

### Other scripts

```bash
npm run build     # production build
npm run preview   # preview the production build
```

## Routes

| Path | Page | Access |
|---|---|---|
| `/` | Redirects to `/events` | Public |
| `/events` | Event listing with search and filters | Public |
| `/events/:id` | Event details | Public |
| `/login` | Login | Guests only |
| `/register` | Register | Guests only |
| `/my-events` | My registered events | Logged-in users only |
| `*` | 404 page | Public |

## Redux structure

The store is created with `configureStore` in `src/app/store.js` and combines four slices built with `createSlice`:

| Slice | State | Notes |
|---|---|---|
| `auth` | `users`, `currentUser`, `error` | Register, login, logout. Persisted to Local Storage |
| `events` | `list`, `page`, `selected`, `segments`, status and error fields | `createAsyncThunk` for the API calls. Outdated responses are ignored, so fast typing never shows stale results |
| `registrations` | `items` (userId, event snapshot, registeredAt) | Register and cancel, with duplicate prevention. Persisted to Local Storage |
| `ui` | `toast` | Success and info notifications |

Components read state with `useSelector` and update it with `useDispatch`.

## Project structure

```
src/
  app/            store.js
  features/
    auth/         authSlice.js
    events/       eventsSlice.js
    registrations/registrationsSlice.js
    ui/           uiSlice.js
  services/       ticketmaster.js     (all API calls and data cleanup)
  utils/          format.js, storage.js
  components/     Navbar, EventCard, RegisterButton, Toast, Feedback, FormField
  routes/         RouteGuards.jsx     (ProtectedRoute, GuestRoute)
  pages/          Login, Register, Events, EventDetails, MyEvents
```

## API usage

- `GET /discovery/v2/events.json` for searching and filtering events (keyword, city, country code, classification name, start and end date, sort, page, size)
- `GET /discovery/v2/events/{id}.json` for event details
- `GET /discovery/v2/classifications.json` for event categories

The default Ticketmaster quota is 5,000 requests per day with a limit of 2 requests per second. Search input is debounced to stay within this limit.

## Notes and limitations

- **Authentication is simulated on the frontend.** Users and passwords are kept in Local Storage and there is no real backend, so passwords are stored unencrypted. This is for learning purposes only and must not be used in production.
- Registrations are local to the browser. They do not register you with Ticketmaster.
- Ticketmaster's API only lets you page through the first 1,000 results of a query, so use filters to narrow results.
- Ticketmaster's coverage is mostly North America and Europe, so some regions have few events.
- The API key is bundled into the frontend build, which is acceptable for this assignment but not for production apps.

## Development workflow

Features were developed on separate branches and merged through Pull Requests, with commits for each feature: authentication, Redux setup, API integration, event listing and search, registration, My Events, protected routes and responsive UI.

## Author

Anosha Aamer · 23L-2633 · Web Programming, Assignment 2
