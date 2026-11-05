import { useEffect, useState } from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import http from '../../api/http.js';
import Img from '../../components/common/Img.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

const LEVELS = { 0: 'Faculty Mentors', 1: 'President', 'Vice President', 2: 'Heads', 3: 'Team Leads', 4: 'Co-ordinators & Members' };

const Card = ({ m, big }) => (
  <div className={`team-card ${big ? 'big' : ''}`}>
    <Img className="team-photo" src={m.photo} alt={m.name} />
    <h4>{m.name}</h4>
    <p className="team-role">{m.role}</p>
    {m.department && <small className="team-dept">{m.department}</small>}
    {(m.linkedin || m.instagram) && (
      <div className="team-socials">
        {m.linkedin && (
          <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedInIcon fontSize="small" />
          </a>
        )}
        {m.instagram && (
          <a href={m.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon fontSize="small" />
          </a>
        )}
      </div>
    )}
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
        {founders.length > 0 && (
          <section>
            <h2>Founders</h2>
            <div className="team-grid big">{founders.map((m) => <Card key={m._id} m={m} big />)}</div>
          </section>
        )}
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
                  <div className={`team-grid ${Number(lvl) <= 2 ? 'big' : ''}`}>
                    {list.map((m) => <Card key={m._id} m={m} big={Number(lvl) <= 2} />)}
                  </div>
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </>
  );
}
