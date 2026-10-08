import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EventCard from '../components/EventCard';
import RegisterButton from '../components/RegisterButton';
import { eventTime, isPast } from '../utils/format';

export default function MyEvents() {
  const user = useSelector((s) => s.auth.currentUser);
  const items = useSelector((s) => s.registrations.items);
  const [tab, setTab] = useState('upcoming');

  const { upcoming, completed } = useMemo(() => {
    const mine = items.filter((r) => r.userId === user.id).map((r) => r.event);
    return {
      upcoming: mine.filter((e) => !isPast(e)).sort((a, b) => eventTime(a) - eventTime(b)),
      completed: mine.filter((e) => isPast(e)).sort((a, b) => eventTime(b) - eventTime(a)),
    };
  }, [items, user.id]);

  const shown = tab === 'upcoming' ? upcoming : completed;

  return (
    <section>
      <h1>My events</h1>
      <div className="tabs">
        <button className={`chip ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>
          Upcoming ({upcoming.length})
        </button>
        <button className={`chip ${tab === 'completed' ? 'active' : ''}`} onClick={() => setTab('completed')}>
          Completed ({completed.length})
        </button>
      </div>

      {shown.length === 0 ? (
        <p className="center muted">
          {tab === 'upcoming' ? 'No upcoming registrations yet. ' : 'No completed events yet. '}
          <Link to="/events">Browse events</Link>
        </p>
      ) : (
        <div className="grid">
          {shown.map((ev) => (
            <EventCard key={ev.id} event={ev}>
              <RegisterButton event={ev} />
            </EventCard>
          ))}
        </div>
      )}
    </section>
  );
}