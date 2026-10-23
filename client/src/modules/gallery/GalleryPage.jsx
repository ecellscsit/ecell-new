import { useEffect, useState } from 'react';
import http from '../../api/http.js';
import PageHeader from '../../components/common/PageHeader.jsx';

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [year, setYear] = useState('');
  const [zoom, setZoom] = useState(null);   // lightbox

  useEffect(() => { http.get('/gallery', { params: { year } }).then((r) => setPhotos(r.data)); }, [year]);
  const years = [...new Set(photos.map((p) => p.year).filter(Boolean))];

  return (
    <>
      <PageHeader title="Gallery" />
      <div className="container section">
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All years</option>{years.map((y) => <option key={y}>{y}</option>)}
        </select>
        <div className="mini-gallery big">{photos.map((p) => <img key={p._id} src={p.url} alt={p.caption || ''} onClick={() => setZoom(p)} />)}</div>
      </div>
      {zoom && <div className="lightbox" onClick={() => setZoom(null)}><img src={zoom.url} alt="" /></div>}
    </>
  );
}
