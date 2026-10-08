import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { showToast } from '../features/ui/uiSlice';

export default function Navbar() {
  const user = useSelector((s) => s.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast({ message: 'You have been logged out.', type: 'info' }));
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <NavLink to="/events" className="brand">EventHub</NavLink>
        <nav className="nav-links">
          <NavLink to="/events">Events</NavLink>
          {user && <NavLink to="/my-events">My Events</NavLink>}
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-small" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="btn btn-small">Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}