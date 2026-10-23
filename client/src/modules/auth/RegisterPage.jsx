import { useState } from 'react';
import { Link } from 'react-router-dom';
import http, { errMsg } from '../../api/http.js';
import AuthCard from './AuthCard.jsx';

export default function RegisterPage() {
  const [f, setF] = useState({ name: '', enrollmentNo: '', course: '', year: '', email: '', phone: '', password: '', interests: '', subscribe: true });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const r = await http.post('/auth/register', { ...f, interests: f.interests.split(',').map((s) => s.trim()).filter(Boolean) });
      setMsg(r.data.message);
    } catch (e) { setErr(errMsg(e)); }
  };
  if (msg) return <AuthCard title="🎉 You're in!" subtitle={msg}><Link to="/login" className="btn btn-primary">Go to login</Link></AuthCard>;

  return (
    <AuthCard title="Join E-Cell SCSIT" subtitle="Create your member account.">
      <form onSubmit={submit} className="form">
        <input placeholder="Full name" value={f.name} onChange={set('name')} required />
        <input placeholder="Enrollment number" value={f.enrollmentNo} onChange={set('enrollmentNo')} />
        <input placeholder="Course (e.g. MCA)" value={f.course} onChange={set('course')} />
        <input placeholder="Year (e.g. 2nd)" value={f.year} onChange={set('year')} />
        <input type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
        <input placeholder="Phone" value={f.phone} onChange={set('phone')} />
        <input type="password" placeholder="Password (min 6)" minLength={6} value={f.password} onChange={set('password')} required />
        <input placeholder="Interests / skills (comma separated)" value={f.interests} onChange={set('interests')} />
        <label><input type="checkbox" checked={f.subscribe} onChange={set('subscribe')} /> Send me updates about events and blogs</label>
        <button className="btn btn-primary">Register</button>
        {err && <p className="error">{err}</p>}
      </form>
      <p>Already a member? <Link to="/login"><b>Login</b></Link></p>
    </AuthCard>
  );
}
