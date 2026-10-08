import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, fetchSegments } from '../features/events/eventsSlice';
import EventCard from '../components/EventCard';
import { Spinner, ErrorBox } from '../components/Feedback';
import { isoNoMs, toApiDate } from '../utils/format';

const SIZE = 12;
const EMPTY = { keyword: '', segment: '', city: '', country: '', dateFrom: '', dateTo: '', sort: 'date,asc' };
const COUNTRIES = [['US', 'United States'], ['CA', 'Canada'], ['GB', 'United Kingdom'], ['AU', 'Australia'], ['DE', 'Germany'], ['ES', 'Spain']];

export default function Events() {
  const dispatch = useDispatch();
  const { list, page, listStatus, listError, segments } = useSelector((s) => s.events);

  const [filters, setFilters] = useState(EMPTY);
  const [debounced, setDebounced] = useState(EMPTY);
  const [pageNum, setPageNum] = useState(0);

  // Load categories from the API (slightly delayed to respect the 2 req/sec limit)
  useEffect(() => {
    const t = setTimeout(() => dispatch(fetchSegments()), 700);
    return () => clearTimeout(t);
  }, [dispatch]);

  // Debounce so we don't call the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(filters);
      setPageNum(0);
    }, 500);
    return () => clearTimeout(t);
  }, [filters]);

  // Fetch whenever the (debounced) filters or page change
  useEffect(() => {
    const f = debounced;
    dispatch(
      fetchEvents({
        keyword: f.keyword.trim(),
        classificationName: f.segment,
        city: f.city.trim(),
        countryCode: f.country,
        sort: f.sort,
        size: SIZE,
        page: pageNum,
        // Always show upcoming events unless the user picks an earlier start date
        startDateTime: f.dateFrom ? toApiDate(f.dateFrom) : isoNoMs(new Date()),
        endDateTime: f.dateTo ? toApiDate(f.dateTo, true) : '',
      })
    );
  }, [debounced, pageNum, dispatch]);

  const update = (name, value) => setFilters((f) => ({ ...f, [name]: value }));

  const next30Days = () => {
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 30);
    setFilters((f) => ({ ...f, dateFrom: from.toISOString().slice(0, 10), dateTo: to.toISOString().slice(0, 10) }));
  };

  const totalPages = Math.min(page.totalPages, Math.floor(1000 / SIZE)); // API deep-paging limit
  const retry = () => setDebounced({ ...filters });

  return (
    <section>
      <h1>Explore events</h1>

      <div className="chips">
        <button className={`chip ${filters.segment === '' ? 'active' : ''}`} onClick={() => update('segment', '')}>All</button>
        {segments.map((s) => (
          <button key={s} className={`chip ${filters.segment === s ? 'active' : ''}`} onClick={() => update('segment', s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="filters">
        <input placeholder="Search events, artists, teams..." value={filters.keyword} onChange={(e) => update('keyword', e.target.value)} />
        <input placeholder="City" value={filters.city} onChange={(e) => update('city', e.target.value)} />
        <select value={filters.country} onChange={(e) => update('country', e.target.value)}>
          <option value="">All countries</option>
          {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
        <label className="inline-label">From <input type="date" value={filters.dateFrom} onChange={(e) => update('dateFrom', e.target.value)} /></label>
        <label className="inline-label">To <input type="date" value={filters.dateTo} onChange={(e) => update('dateTo', e.target.value)} /></label>
        <select value={filters.sort} onChange={(e) => update('sort', e.target.value)}>
          <option value="date,asc">Soonest first</option>
          <option value="date,desc">Latest first</option>
          <option value="name,asc">Name A–Z</option>
          <option value="relevance,desc">Most relevant</option>
        </select>
        <button className="btn" onClick={next30Days}>Next 30 days</button>
        <button className="btn" onClick={() => setFilters(EMPTY)}>Clear</button>
      </div>

      {listStatus === 'loading' && <Spinner text="Finding events..." />}
      {listStatus === 'failed' && <ErrorBox message={listError} onRetry={retry} />}

      {listStatus === 'succeeded' && (
        <>
          <p className="muted">{page.totalElements} events found</p>
          {list.length === 0 ? (
            <p className="center muted">No events match your filters. Try a different search.</p>
          ) : (
            <div className="grid">
              {list.map((ev) => <EventCard key={ev.id} event={ev} />)}
            </div>
          )}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn" disabled={pageNum === 0} onClick={() => setPageNum((p) => p - 1)}>← Prev</button>
              <span>Page {pageNum + 1} of {totalPages}</span>
              <button className="btn" disabled={pageNum + 1 >= totalPages} onClick={() => setPageNum((p) => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}