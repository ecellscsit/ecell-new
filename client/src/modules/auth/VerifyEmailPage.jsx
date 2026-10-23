import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import http, { errMsg } from '../../api/http.js';
import AuthCard from './AuthCard.jsx';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [msg, setMsg] = useState('Verifying…');
  useEffect(() => { http.get(`/auth/verify/${token}`).then((r) => setMsg(r.data.message)).catch((e) => setMsg(errMsg(e))); }, [token]);
  return <AuthCard title="Email verification" subtitle={msg}><Link to="/login" className="btn btn-primary">Login</Link></AuthCard>;
}
