import Reveal from '../../components/common/Reveal.jsx';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import SmartLink from '../../components/common/SmartLink.jsx';

export default function Announcements({ items = [] }) {
  if (!items.length) return null;
  return (
    <section className="container section">
      <SectionHeader title="Announcements" />
      <div className="announce-list">
        {items.map((a, i) => (
          <Reveal key={a._id} delay={i * 90}>
            <SmartLink to={a.link} className="announce">
              <span className="announce-date">{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <div><b>{a.title}</b>{a.body && <p>{a.body}</p>}</div>
              <span className="announce-arrow">→</span>
            </SmartLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
