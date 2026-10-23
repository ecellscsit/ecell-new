import { Link } from 'react-router-dom';
import Img from './Img.jsx';

export default function EventCard({ event }) {
  return (
    <div className="card event-card">
      <Img src={event.poster} alt={event.title} />
      <div className="card-body">
        <span className={`badge badge-${event.status}`}>{event.status}</span>
        <h3>{event.title}</h3>
        <p className="muted">{new Date(event.startDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {event.venue}</p>
        <Link to={`/events/${event.slug}`} className="btn btn-outline">
          {event.canRegister ? 'Register' : 'View details'}
        </Link>
      </div>
    </div>
  );
}
