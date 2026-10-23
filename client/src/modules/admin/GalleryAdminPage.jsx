import { useState } from 'react';
import http, { errMsg } from '../../api/http.js';
import AdminCrud from './AdminCrud.jsx';
import { galleryConfig } from './adminConfigs.jsx';

// Upload many photos at once, then edit captions / home / hero flags in the table below.
export default function GalleryAdminPage() {
  const [files, setFiles] = useState([]);
  const [event, setEvent] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [msg, setMsg] = useState('');
  const [key, setKey] = useState(0);

  const upload = async (e) => {
    e.preventDefault();
    if (!files.length) return;
    try {
      const fd = new FormData();
      [...files].forEach((f) => fd.append('files', f));
      const { data } = await http.post('/upload/many', fd);
      await http.post('/gallery/bulk', data.urls.map((url) => ({ url, event, year })));
      setMsg(`✅ ${data.urls.length} photos uploaded`); setFiles([]); e.target.reset(); setKey((k) => k + 1);
    } catch (er) { setMsg(errMsg(er)); }
  };

  const header = (
    <form className="bulk-box" onSubmit={upload}>
      <b>Upload multiple photos</b>
      <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
      <input placeholder="Event name" value={event} onChange={(e) => setEvent(e.target.value)} />
      <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
      <button className="btn btn-primary">Upload</button>
      {msg && <span>{msg}</span>}
    </form>
  );
  return <AdminCrud config={galleryConfig} header={header} reloadKey={key} />;
}
