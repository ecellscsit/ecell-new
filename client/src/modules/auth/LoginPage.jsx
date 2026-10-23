import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { errMsg } from '../../api/http.js';
import AuthCard from './AuthCard.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { state } = useLocation();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const user = await login(f.email, f.password);
      nav(user.role === 'admin' ? '/admin' : state?.from || '/');   // admins go to the panel
    } catch (e) { setErr(errMsg(e)); }
  };
  return (
    <AuthCard title="Welcome back" subtitle="Login to register for events and get updates.">
      <form onSubmit={submit} className="form">
        <input type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
        <button className="btn btn-primary">Login</button>
        {err && <p className="error">{err}</p>}
      </form>
      <p><Link to="/forgot">Forgot password?</Link></p>
      <p>New here? <Link to="/register"><b>Join E-Cell SCSIT</b></Link></p>
    </AuthCard>
  );
}
