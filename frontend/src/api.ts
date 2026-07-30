const API = '/api';

async function request(path: string, options?: RequestInit) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (res.status === 401) localStorage.removeItem('token');
  if (res.status >= 500) throw new Error('Server error');
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string, name: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
  me: () => request('/auth/me'),

  // Audio guides
  getAudioGuides: (official?: boolean, language?: string) => {
    let q = '';
    if (official) q += '?official=true';
    if (language) q += (q ? '&' : '?') + `language=${language}`;
    return request(`/audio-guides${q}`);
  },
  getAudioGuide: (id: string) => request(`/audio-guides/${id}`),

  // Prayers
  getPrayers: (day?: string) => request(`/prayers${day ? `?day=${day}` : ''}`),
  getPrayer: (id: string) => request(`/prayers/${id}`),

  // Tickets
  getTicketTypes: () => request('/tickets/types'),
  bookTicket: (data: any) => request('/tickets/book', { method: 'POST', body: JSON.stringify(data) }),
  getMyTickets: () => request('/tickets/my'),
  getTicket: (id: string) => request(`/tickets/${id}`),

  // Events
  getEvents: (category?: string) => request(`/events${category ? `?category=${category}` : ''}`),
  getEvent: (id: string) => request(`/events/${id}`),
  registerForEvent: (id: string, name: string, email: string) =>
    request(`/events/${id}/register`, { method: 'POST', body: JSON.stringify({ name, email }) }),

  // Comments
  getComments: (targetId?: string) => request(`/comments${targetId ? `?targetId=${targetId}` : ''}`),
  addComment: (content: string, rating: number, targetId?: string) =>
    request('/comments', { method: 'POST', body: JSON.stringify({ content, rating, targetId }) }),

  // Info
  getAbout: () => request('/about'),
  getRules: () => request('/rules'),
  health: () => request('/health'),
};
