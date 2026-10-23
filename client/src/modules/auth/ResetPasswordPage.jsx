import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import http, { errMsg } from '../../api/http.js';
import AuthCard from './AuthCard.jsx';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    try { setMsg((await http.post(`/auth/reset-password/${token}`, { password })).data.message); setDone(true); }
    catch (er) { setMsg(errMsg(er)); }
  };
  return (
    <AuthCard title="Set a new password">
      <form onSubmit={submit} className="form">
        <input type="password" minLength={6} placeholder="New password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary">Change password</button>
        {msg && <p className={done ? '' : 'error'}>{msg}</p>}
      </form>
      {done && <Link to="/login" className="btn btn-outline">Login</Link>}
    </AuthCard>
  );
}
