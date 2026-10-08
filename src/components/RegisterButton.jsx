import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerForEvent, cancelRegistration } from '../features/registrations/registrationsSlice';
import { showToast } from '../features/ui/uiSlice';
import { isPast } from '../utils/format';

export default function RegisterButton({ event }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((s) => s.auth.currentUser);
  const registered = useSelector((s) =>
    user ? s.registrations.items.some((r) => r.userId === user.id && r.event.id === event.id) : false
  );
  const past = isPast(event);

  const handleRegister = () => {
    if (!user) {
      dispatch(showToast({ message: 'Please log in to register for events.', type: 'info' }));
      navigate('/login', { state: { from: location } });
      return;
    }
    if (registered) {
      dispatch(showToast({ message: 'You are already registered for this event.', type: 'info' }));
      return;
    }
    dispatch(registerForEvent({ userId: user.id, event }));
    dispatch(showToast({ message: `You are registered for "${event.name}"!` }));
  };

  const handleCancel = () => {
    if (!window.confirm('Cancel your registration for this event?')) return;
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }));
    dispatch(showToast({ message: 'Registration cancelled.', type: 'info' }));
  };

  if (registered && past) return <span className="badge badge-done">Completed</span>;
  if (past) return <button className="btn" disabled>Event has ended</button>;
  if (registered) {
    return (
      <div className="btn-row">
        <span className="badge badge-ok">✓ Registered</span>
        <button className="btn btn-danger" onClick={handleCancel}>Cancel registration</button>
      </div>
    );
  }
  return <button className="btn btn-primary" onClick={handleRegister}>Register</button>;
}