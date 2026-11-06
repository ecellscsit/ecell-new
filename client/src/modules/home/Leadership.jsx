import Img from '../../components/common/Img.jsx';
import Reveal from '../../components/common/Reveal.jsx';
import SectionHeader from '../../components/common/SectionHeader.jsx';

const Person = ({ p }) => p && (
  <div className="leader card">
    <Img src={p.photo} alt={p.name} />
    <div className="card-body">
      <small>{p.role}</small><h3>{p.name}</h3>
      <div className="socials">
        {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
        {p.instagram && <a href={p.instagram} target="_blank" rel="noreferrer">Instagram</a>}
      </div>
    </div>
  </div>
);

// president / vicePresident = the two people chosen in Admin > Home Page (here: Founder and Co-Founder)
export default function Leadership({ president, vicePresident, tagline }) {
  if (!president && !vicePresident) return null;
  return (
    <section className="container section">
      <SectionHeader title="Leadership" to="/team" linkText="Meet the full team" />
      {tagline && <p className="tagline">{tagline}</p>}
      <div className="leader-grid">
        <Reveal from="left"><Person p={president} /></Reveal>
        <Reveal from="right" delay={150}><Person p={vicePresident} /></Reveal>
      </div>
    </section>
  );
}
