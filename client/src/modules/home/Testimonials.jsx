import Reveal from '../../components/common/Reveal.jsx';
import SectionHeader from '../../components/common/SectionHeader.jsx';

export default function Testimonials({ items = [] }) {
  if (!items.length) return null;
  return (
    <section className="container section">
      <SectionHeader title="What participants say" />
      <div className="grid-3">
        {items.map((t, i) => (
          <Reveal key={t.name} delay={i * 120}>
            <div className="card testimonial"><div className="card-body">
              <div className="quote-mark">“</div><p>{t.text}</p>
              <div className="t-by"><span className="avatar">{t.name[0]}</span><div><b>{t.name}</b><small>{t.team}</small></div></div>
            </div></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
