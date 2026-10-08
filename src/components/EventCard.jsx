import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '../utils/format';

export default function EventCard({ event, children }) {
  return (
    <article className="card">
      <Link to={`/events/${event.id}`} className="card-link">
        {event.image ? (
          <img src={event.image} alt={event.name} loading="lazy" />
        ) : (
          <div className="img-placeholder">No image</div>
        )}
        <div className="card-body">
          <span className="badge">{event.category}</span>
          <h3>{event.name}</h3>
          <p className="muted">{formatDate(event)} · {formatTime(event)}</p>
          <p className="muted">{event.venue}{event.city ? `, ${event.city}` : ''}</p>
        </div>
      </Link>
      {children && <div className="card-actions">{children}</div>}
    </article>
  );
}