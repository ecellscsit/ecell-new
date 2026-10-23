import { useEffect, useState } from 'react';
import http from '../../api/http.js';

export default function MessagesPage() {
  const [msgs, setMsgs] = useState([]);
  const load = () => http.get('/contact').then((r) => setMsgs(r.data));
  useEffect(() => { load(); }, []);
  return (
    <div>
      <h1>Messages</h1>
      {msgs.map((m) => (
        <div key={m._id} className={`card msg ${m.done ? 'done' : ''}`}>
          <div className="card-body">
            <b>{m.name}</b> &lt;{m.email}&gt; — {m.subject}
            <p>{m.message}</p>
            <button onClick={async () => { await http.patch(`/contact/${m._id}/done`, { done: !m.done }); load(); }}>{m.done ? 'Reopen' : 'Mark done'}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
