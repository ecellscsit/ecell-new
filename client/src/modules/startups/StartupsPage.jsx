import { useEffect, useState } from 'react';
import http from '../../api/http.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import StartupCard from './StartupCard.jsx';

export default function StartupsPage() {
  const [list, setList] = useState([]);
  useEffect(() => { http.get('/startups').then((r) => setList(r.data)); }, []);
  return (
    <>
      <PageHeader title="Startups" subtitle="Built by E-Cell SCSIT members" />
      <div className="container section grid-4">{list.map((s) => <StartupCard key={s._id} startup={s} />)}</div>
    </>
  );
}
