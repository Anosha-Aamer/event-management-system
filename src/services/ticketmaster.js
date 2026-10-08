const BASE = 'https://app.ticketmaster.com/discovery/v2';
const KEY = import.meta.env.VITE_TM_API_KEY;

const request = async (path, params = {}) => {
  if (!KEY) {
    throw new Error('Missing API key. Add VITE_TM_API_KEY to .env and restart the dev server.');
  }
  const qs = new URLSearchParams({ apikey: KEY });
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.append(k, v);
  });

  const res = await fetch(`${BASE}${path}?${qs}`);
  if (res.status === 429) throw new Error('Too many requests. Please wait a moment and try again.');
  if (res.status === 401) throw new Error('Invalid API key.');
  if (!res.ok) throw new Error(`Ticketmaster API error (${res.status}).`);
  return res.json();
};

const pickImage = (images = []) => {
  const wide = images.filter((i) => i.ratio === '16_9').sort((a, b) => a.width - b.width);
  return (wide.find((i) => i.width >= 640) || wide[wide.length - 1] || images[0])?.url || null;
};

export const normalizeEvent = (e) => {
  const venue = e._embedded?.venues?.[0];
  const cls = e.classifications?.[0];
  const price = e.priceRanges?.[0];
  return {
    id: e.id,
    name: e.name,
    url: e.url,
    image: pickImage(e.images),
    localDate: e.dates?.start?.localDate || null,
    localTime: e.dates?.start?.localTime || null,
    dateTime: e.dates?.start?.dateTime || null,
    status: e.dates?.status?.code || '',
    venue: venue?.name || 'Venue TBA',
    address: venue?.address?.line1 || '',
    city: venue?.city?.name || '',
    state: venue?.state?.name || '',
    country: venue?.country?.name || '',
    category: cls?.segment?.name || 'Other',
    genre: cls?.genre?.name || '',
    subGenre: cls?.subGenre?.name || '',
    info: e.info || '',
    note: e.pleaseNote || '',
    priceMin: price?.min ?? null,
    priceMax: price?.max ?? null,
    currency: price?.currency || '',
    seatmap: e.seatmap?.staticUrl || null,
    attractions: (e._embedded?.attractions || []).map((a) => a.name),
  };
};

export const searchEvents = async (params) => {
  const data = await request('/events.json', params);
  return {
    events: (data._embedded?.events || []).map(normalizeEvent),
    page: data.page || { size: 0, totalElements: 0, totalPages: 0, number: 0 },
  };
};

export const getEvent = async (id) => normalizeEvent(await request(`/events/${id}.json`));

// Categories (segments) come from the classifications endpoint
export const getSegments = async () => {
  const data = await request('/classifications.json', { size: 100 });
  const names = new Set();
  (data._embedded?.classifications || []).forEach((c) => {
    if (c.segment?.name && c.segment.name !== 'Undefined') names.add(c.segment.name);
  });
  return [...names];
};