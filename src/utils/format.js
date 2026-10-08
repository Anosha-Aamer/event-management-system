// Event time as a Date object (used for sorting and past/upcoming checks)
export const eventTime = (ev) =>
  new Date(ev.dateTime || (ev.localDate ? `${ev.localDate}T00:00:00` : 8.64e15));

export const isPast = (ev) => {
  if (ev.dateTime) return new Date(ev.dateTime) < new Date();
  if (ev.localDate) return new Date(`${ev.localDate}T23:59:59`) < new Date();
  return false; // date TBA, so treat as upcoming
};

export const formatDate = (ev) => {
  if (!ev.localDate) return 'Date TBA';
  return new Date(`${ev.localDate}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatTime = (ev) => {
  if (!ev.localTime) return 'Time TBA';
  const [h, m] = ev.localTime.split(':');
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

// Ticketmaster wants dates like 2026-10-08T00:00:00Z (no milliseconds)
export const isoNoMs = (date) => date.toISOString().split('.')[0] + 'Z';
export const toApiDate = (yyyyMmDd, endOfDay = false) =>
  `${yyyyMmDd}T${endOfDay ? '23:59:59' : '00:00:00'}Z`;