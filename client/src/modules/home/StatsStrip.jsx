import CountUp from '../../components/common/CountUp.jsx';
import Reveal from '../../components/common/Reveal.jsx';

// Uses the numbers typed in Admin > Home Page; falls back to live counts from the database.
export default function StatsStrip({ stats = {}, custom = [] }) {
  const items = custom.length ? custom : [
    { value: stats.members, suffix: '+', label: 'Members' }, { value: stats.events, suffix: '+', label: 'Events' },
    { value: stats.startups, suffix: '', label: 'Startups' }, { value: stats.posts, suffix: '+', label: 'Blog posts' },
  ];
  return (
    <section className="stats-strip">
      <div className="container stats-grid">
        {items.map((s, i) => (
          <Reveal key={s.label} delay={i * 100} from="zoom">
            <div className="stat-item"><h3><CountUp to={s.value || 0} suffix={s.suffix || ''} /></h3><p>{s.label}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
