import { useEffect, useState } from 'react';
import http from '../../api/http.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import Reveal from '../../components/common/Reveal.jsx';
import InitiativeCard from './InitiativeCard.jsx';

export default function InitiativesPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { http.get('/initiatives').then((r) => setItems(r.data)); }, []);
  return (
    <>
      <PageHeader title="Our Initiatives" subtitle="Programs & activities crafted to empower innovative thinkers and aspiring entrepreneurs" />
      <div className="container section grid-3">
        {items.map((it, i) => <Reveal key={it._id} delay={(i % 3) * 100}><InitiativeCard item={it} /></Reveal>)}
      </div>
    </>
  );
}
