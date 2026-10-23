import { useEffect, useState, useRef } from 'react';
import SmartLink from '../../components/common/SmartLink.jsx';
import http from '../../api/http.js';
import { useAuth } from '../../context/AuthContext.jsx';

const LS_KEY = 'readNotifications';
const readLocal = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');

export default function NotificationBell() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const box = useRef();

  const load = () => http.get('/notifications').then((r) => {
    const local = readLocal();
    // logged-in: server remembers; visitor: browser remembers
    setItems(r.data.map((n) => ({ ...n, read: user ? n.read : local.includes(n._id) })));
  }).catch(() => {});

  useEffect(() => { load(); }, [user]);
  useEffect(() => {  // close when clicking outside
    const h = (e) => box.current && !box.current.contains(e.target) && setOpen(false);
    document.addEventListener('click', h); return () => document.removeEventListener('click', h);
  }, []);

  const unread = items.filter((n) => !n.read).length;
  const markAll = async () => {
    if (user) await http.post('/notifications/read-all');
    else localStorage.setItem(LS_KEY, JSON.stringify(items.map((n) => n._id)));
    setItems(items.map((n) => ({ ...n, read: true })));
  };
  const ago = (d) => {
    const m = Math.floor((Date.now() - new Date(d)) / 60000);
    return m < 60 ? `${m || 1} min ago` : m < 1440 ? `${Math.floor(m / 60)} hours ago` : `${Math.floor(m / 1440)} days ago`;
  };

  return (
    <div className="bell" ref={box}>
      <button onClick={() => setOpen(!open)} aria-label="Notifications">🔔{unread > 0 && <span className="bell-badge">{unread}</span>}</button>
      {open && (
        <div className="bell-panel">
          <div className="bell-head"><b>Notifications</b><button onClick={markAll}>Mark all as read</button></div>
          {items.length === 0 && <p className="muted">Nothing new.</p>}
          {items.map((n) => (
            <SmartLink key={n._id} to={n.link || '/'} className={`bell-item ${n.read ? '' : 'unread'}`} onClick={() => setOpen(false)}>
              <span className="tag">{n.pinned ? '📌 ' : ''}{n.type}</span>
              <strong>{n.title}</strong>
              {n.body && <small>{n.body}</small>}
              <em>{ago(n.createdAt)}</em>
            </SmartLink>
          ))}
        </div>
      )}
    </div>
  );
}
