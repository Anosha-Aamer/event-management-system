import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import { ProtectedRoute, GuestRoute } from './routes/RouteGuards';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';

function NotFound() {
  return (
    <div className="center-box">
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <Link to="/events" className="btn">Go to events</Link>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Toast />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}