import { useEffect, useState } from 'react';
import http from '../../api/http.js';

export default function MembersPage() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const load = () => http.get('/users', { params: { q } }).then((r) => setUsers(r.data));
  useEffect(() => { load(); }, [q]);

  const exportCsv = async () => {
    const r = await http.get('/users/export/csv', { responseType: 'blob' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(r.data); a.download = 'members.csv'; a.click();
  };
  return (
    <div>
      <div className="admin-head"><h1>Members</h1><input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-outline" onClick={exportCsv}>Export CSV</button></div>
      <table className="table"><thead><tr><th>Name</th><th>Email</th><th>Course</th><th>Verified</th><th>Blocked</th><th /></tr></thead>
        <tbody>{users.map((u) => (
          <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.course} {u.year}</td><td>{u.emailVerified ? '✔' : '—'}</td><td>{u.blocked ? '🚫' : ''}</td>
            <td className="actions">
              <button onClick={async () => { await http.patch(`/users/${u._id}/block`); load(); }}>{u.blocked ? 'Unblock' : 'Block'}</button>
              <button onClick={async () => { if (confirm('Remove member?')) { await http.delete(`/users/${u._id}`); load(); } }}>Remove</button>
            </td></tr>))}</tbody></table>
    </div>
  );
}
