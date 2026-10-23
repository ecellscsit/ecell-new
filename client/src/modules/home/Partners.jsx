import SectionHeader from '../../components/common/SectionHeader.jsx';

// Sponsors / partners (names only; add logos later if you have them)
export default function Partners({ names = [] }) {
  if (!names.length) return null;
  const row = [...names, ...names, ...names, ...names];
  return (
    <section className="container section">
      <SectionHeader title="Our Partners & Sponsors" />
      <div className="partners"><div className="partners-track">{row.map((n, i) => <span key={i} className="partner-chip">{n}</span>)}</div></div>
    </section>
  );
}
