import { useEffect, useState } from 'react';
import http from '../../api/http.js';
import Img from '../../components/common/Img.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

const LEVELS = { 0: 'Faculty Mentors', 1: 'President', 2: 'Vice President', 3: 'Heads', 4: 'Team Leads', 5: 'Co-ordinators & Members' };

const Card = ({ m, big }) => (
  <div className={`card person ${big ? 'big' : ''}`}>
    <Img src={m.photo} alt={m.name} />
    <div className="card-body">
      <h4>{m.name}</h4><p>{m.role}</p>
      {m.department && <small>{m.department}</small>}
      <div className="socials">
        {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer">in</a>}
        {m.instagram && <a href={m.instagram} target="_blank" rel="noreferrer">ig</a>}
      </div>
    </div>
  </div>
);

export default function TeamPage() {
  const [years, setYears] = useState([]);
  const [year, setYear] = useState('');
  const [team, setTeam] = useState([]);
  const [founders, setFounders] = useState([]);

  useEffect(() => { http.get('/team', { params: { year: 'Founders' } }).then((r) => setFounders(r.data)); }, []);
  useEffect(() => { http.get('/team/years').then((r) => { setYears(r.data); setYear(r.data[0] || ''); }); }, []);
  useEffect(() => { if (year) http.get('/team', { params: { year } }).then((r) => setTeam(r.data)); }, [year]);

  return (
    <>
      <PageHeader title="Our Team" />
      <div className="container section">
        {founders.length > 0 && (<section><h2>Founders</h2><div className="grid-2">{founders.map((m) => <Card key={m._id} m={m} big />)}</div></section>)}
        <h2>Team of the year</h2>
        <select value={year} onChange={(e) => setYear(e.target.value)}>{years.map((y) => <option key={y}>{y}</option>)}</select>

        {Object.entries(LEVELS).map(([lvl, title]) => {
          const people = team.filter((m) => m.level === Number(lvl));
          if (!people.length) return null;
          // Heads / Leads / Members are grouped by department
          const grouped = Number(lvl) >= 3
            ? [...new Set(people.map((p) => p.department || 'General'))].map((d) => [d, people.filter((p) => (p.department || 'General') === d)])
            : [['', people]];
          return (
            <section key={lvl}>
              <h2>{title}</h2>
              {grouped.map(([dept, list]) => (
                <div key={dept}>
                  {dept && <h4 className="dept">{dept}</h4>}
                  <div className={Number(lvl) <= 2 ? 'grid-2' : 'grid-4'}>{list.map((m) => <Card key={m._id} m={m} big={Number(lvl) <= 2} />)}</div>
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </>
  );
}
