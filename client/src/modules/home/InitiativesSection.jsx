import Reveal from '../../components/common/Reveal.jsx';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import InitiativeCard from '../initiatives/InitiativeCard.jsx';

export default function InitiativesSection({ items = [] }) {
  if (!items.length) return null;
  return (
    <section className="container section">
      <SectionHeader title="Our Initiatives" to="/initiatives" linkText="All initiatives" />
      <p className="muted section-sub">Programs crafted to empower innovative thinkers and aspiring entrepreneurs.</p>
      <div className="grid-3">{items.map((it, i) => <Reveal key={it._id} delay={i * 100}><InitiativeCard item={it} /></Reveal>)}</div>
    </section>
  );
}
