import { useState } from 'react';
import { Link } from 'react-router-dom';
import http, { errMsg } from '../../api/http.js';
import AuthCard from './AuthCard.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { setMsg((await http.post('/auth/forgot-password', { email })).data.message); } catch (er) { setMsg(errMsg(er)); }
  };
  return (
    <AuthCard title="Forgot password" subtitle="Enter your email and we will send a reset link.">
      <form onSubmit={submit} className="form">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="btn btn-primary">Send reset link</button>
        {msg && <p>{msg}</p>}
      </form>
      <Link to="/login">← Back to login</Link>
    </AuthCard>
  );
}
