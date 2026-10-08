import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventDetails } from '../features/events/eventsSlice';
import RegisterButton from '../components/RegisterButton';
import { Spinner, ErrorBox } from '../components/Feedback';
import { formatDate, formatTime } from '../utils/format';

export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: ev, detailStatus, detailError } = useSelector((s) => s.events);

  useEffect(() => {
    dispatch(fetchEventDetails(id));
  }, [id, dispatch]);

  if (detailStatus === 'failed') {
    return <ErrorBox message={detailError} onRetry={() => dispatch(fetchEventDetails(id))} />;
  }
  if (!ev || ev.id !== id) return <Spinner text="Loading event..." />;

  const location = [ev.address, ev.city, ev.state, ev.country].filter(Boolean).join(', ');

  return (
    <article className="details">
      <Link to="/events" className="back">← Back to events</Link>
      {ev.image && <img className="details-img" src={ev.image} alt={ev.name} />}

      <div className="details-head">
        <div>
          <span className="badge">{ev.category}</span>
          {ev.genre && <span className="badge badge-alt">{ev.genre}</span>}
          {ev.subGenre && ev.subGenre !== 'Undefined' && <span className="badge badge-alt">{ev.subGenre}</span>}
          <h1>{ev.name}</h1>
        </div>
        <RegisterButton event={ev} />
      </div>

      <dl className="info-grid">
        <div><dt>Date</dt><dd>{formatDate(ev)}</dd></div>
        <div><dt>Time</dt><dd>{formatTime(ev)}</dd></div>
        <div><dt>Venue</dt><dd>{ev.venue}</dd></div>
        <div><dt>Location</dt><dd>{location || 'TBA'}</dd></div>
        {ev.status && <div><dt>Status</dt><dd className="cap">{ev.status}</dd></div>}
        {ev.priceMin !== null && (
          <div><dt>Price range</dt><dd>{ev.priceMin} – {ev.priceMax} {ev.currency}</dd></div>
        )}
      </dl>

      {ev.attractions.length > 0 && (
        <section><h2>Featuring</h2><p>{ev.attractions.join(', ')}</p></section>
      )}
      {ev.info && <section><h2>About</h2><p>{ev.info}</p></section>}
      {ev.note && <section><h2>Please note</h2><p>{ev.note}</p></section>}
      {ev.seatmap && <section><h2>Seat map</h2><img className="seatmap" src={ev.seatmap} alt="Seat map" /></section>}

      {ev.url && (
        <a className="btn" href={ev.url} target="_blank" rel="noreferrer">View on Ticketmaster ↗</a>
      )}
    </article>
  );
}