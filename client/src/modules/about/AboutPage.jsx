import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';

const WHAT = [
  ['🛠️', 'Workshops', 'Hands-on sessions on building, pitching and launching.'],
  ['🏆', 'Hackathons', 'Build real products with your team in a few hours.'],
  ['🎤', 'Expert talks', 'Founders and investors share what actually works.'],
  ['🤝', 'Mentorship', 'One-to-one guidance from alumni and industry mentors.'],
  ['🚀', 'Startup support', 'Ideas to MVPs, with network and resources.'],
];

export default function AboutPage() {
  const { settings: s } = useSettings();
  const a = s.about || {};
  return (
    <>
      <PageHeader title="About E-Cell SCSIT" subtitle="Where SCSIT students turn ideas into startups" />
      <div className="container section">
        <div className="about-intro">
          <img src="/images/scsit-logo.png" alt="SCSIT DAVV" />
          <p>
            {a.intro || 'The Entrepreneurship Cell of SCSIT, DAVV Indore, is a student-run community that helps students explore entrepreneurship, build startups and learn from the people who have done it.'}
          </p>
        </div>

        <div className="grid-2">
          <div className="card"><div className="card-body"><h2>Vision</h2><p>{a.vision}</p></div></div>
          <div className="card"><div className="card-body"><h2>Mission</h2><p>{a.mission}</p></div></div>
        </div>

        {(a.davv || a.scsit) && (
          <div className="grid-2" style={{ marginTop: 24 }}>
            {a.davv && <div className="card"><div className="card-body"><h3>About DAVV</h3><p>{a.davv}</p></div></div>}
            {a.scsit && <div className="card"><div className="card-body"><h3>About SCSIT</h3><p>{a.scsit}</p></div></div>}
          </div>
        )}

        {a.objectives?.length > 0 && (<><h2>Objectives</h2><ul>{a.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul></>)}

        <h2>What we do</h2>
        <div className="grid-3">
          {WHAT.map(([icon, t, d]) => <div key={t} className="card"><div className="card-body"><div className="big-icon">{icon}</div><h3>{t}</h3><p className="muted">{d}</p></div></div>)}
        </div>

        {a.timeline?.length > 0 && (
          <>
            <h2>Our journey</h2>
            <div className="timeline">
              {a.timeline.map((t, i) => <div key={i} className="tl-item"><b>{t.year}</b><p>{t.text}</p></div>)}
            </div>
          </>
        )}

        {s.hod?.message && <blockquote className="faculty"><h3>Message from the HOD</h3>{s.hod.message}<footer>— {s.hod.name}, {s.hod.title}</footer></blockquote>}
        <Link to="/register" className="btn btn-primary">Join E-Cell</Link>
      </div>
    </>
  );
}
