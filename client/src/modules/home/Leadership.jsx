import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import WebsiteIcon from '../../components/common/WebsiteIcon.jsx';
import Img from '../../components/common/Img.jsx';
import Reveal from '../../components/common/Reveal.jsx';
import SectionHeader from '../../components/common/SectionHeader.jsx';

const href = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);

const Person = ({ p }) => p && (
  <div className="leader card">
    <Img src={p.photo} alt={p.name} />
    <div className="card-body">
      <small>{p.role}</small>
      <h3>{p.name}</h3>
      {(p.linkedin || p.instagram || p.portfolio) && (
        <div className="team-socials leader-socials">
          {p.linkedin && (
            <a href={p.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon fontSize="small" />
            </a>
          )}
          {p.instagram && (
            <a href={p.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon fontSize="small" />
            </a>
          )}
          {p.portfolio && (
            <a href={href(p.portfolio)} target="_blank" rel="noreferrer" aria-label="Portfolio website" title="Portfolio">
              <WebsiteIcon />
            </a>
          )}
        </div>
      )}
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
