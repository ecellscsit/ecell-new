import http from '../../api/http.js';

export const getEvents = (params) => http.get('/events', { params }).then((r) => r.data);
export const getEvent = (slug) => http.get(`/events/${slug}`).then((r) => r.data);
export const registerForEvent = (id) => http.post(`/registrations/${id}`).then((r) => r.data);
export const myRegistrations = () => http.get('/registrations/mine').then((r) => r.data);
