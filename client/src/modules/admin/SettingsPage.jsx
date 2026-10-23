import { useEffect, useState } from 'react';
import http, { errMsg, uploadImage } from '../../api/http.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { toLines, fromLines } from '../../utils/lines.js';

export default function SettingsPage() {
  const { setSettings } = useSettings();
  const [s, setS] = useState(null);
  const [help, setHelp] = useState('');
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  useEffect(() => { http.get('/settings').then((r) => { setS(r.data); setHelp(toLines(r.data.helpDesk, ['role', 'name', 'phone'])); }); }, []);
  if (!s) return null;

  const set = (k) => (e) => setS({ ...s, [k]: e.target.value });
  const social = (k) => (e) => setS({ ...s, social: { ...s.social, [k]: e.target.value } });
  const save = async (e) => { e.preventDefault(); try { const r = await http.put('/settings', { ...s, helpDesk: fromLines(help, ['role', 'name', 'phone']) }); setSettings(r.data); setMsg('Saved ✅'); } catch (er) { setMsg(errMsg(er)); } };
  const changePw = async (e) => { e.preventDefault(); try { await http.post('/auth/change-password', pw); setMsg('Password changed ✅'); } catch (er) { setMsg(errMsg(er)); } };

  return (
    <div>
      <form className="form" onSubmit={save}>
        <h1>Settings</h1>
        <label><span>Logo</span>{s.logo && <img src={s.logo} className="thumb" alt="" />}<input type="file" onChange={async (e) => setS({ ...s, logo: await uploadImage(e.target.files[0]) })} /></label>
        <label><span>Email</span><input value={s.email || ''} onChange={set('email')} /></label>
        <label><span>Phone</span><input value={s.phone || ''} onChange={set('phone')} /></label>
        <label><span>Address</span><input value={s.address || ''} onChange={set('address')} /></label>
        <label><span>Google Maps link</span><input value={s.mapLink || ''} onChange={set('mapLink')} /></label>
        {['instagram', 'linkedin', 'x', 'youtube', 'scsit'].map((k) => <label key={k}><span>{k}</span><input value={s.social?.[k] || ''} onChange={social(k)} /></label>)}
        <label><span>Help desk (one per line: Role | Name | Phone)</span><textarea rows="6" value={help} onChange={(e) => setHelp(e.target.value)} /></label>
        <button className="btn btn-primary">Save settings</button>
      </form>
      <form className="form" onSubmit={changePw}>
        <h2>Change admin password</h2>
        <input type="password" placeholder="Current password" onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
        <input type="password" placeholder="New password" onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
        <button className="btn btn-outline">Change password</button>{msg && <p>{msg}</p>}
      </form>
    </div>
  );
}
