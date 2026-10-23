import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';

const PAGES = ['about', 'initiatives', 'events', 'team', 'startups', 'gallery', 'blog', 'contact'];
const SOCIALS = [['instagram', 'Instagram'], ['linkedin', 'LinkedIn'], ['x', 'X'], ['youtube', 'YouTube'], ['scsit', 'SCSIT Instagram']];

export default function Footer() {
  const { settings: s } = useSettings();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logos">
            <Logo variant="light" size={56} />
            <img src="/images/scsit-logo.png" alt="SCSIT DAVV logo" height="56" width="56" />
          </div>
          <h3>E-Cell SCSIT</h3>
          <p>{s.footerText || 'Entrepreneurship Cell, SCSIT, DAVV Indore.'}</p>
        </div>
        <div>
          <h4>Quick links</h4>
          {PAGES.map((p) => <Link key={p} to={`/${p}`}>{p}</Link>)}
        </div>
        <div>
          <h4>Contact us</h4>
          {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
          {s.phone && <a href={`tel:${s.phone}`}>{s.phone}</a>}
          <p>{s.address || 'SCSIT, DAVV, Indore'}</p>
          {s.mapLink && <a href={s.mapLink} target="_blank" rel="noreferrer">View on Google Maps →</a>}
        </div>
        <div>
          <h4>Follow us</h4>
          {SOCIALS.map(([k, label]) => s.social?.[k] && <a key={k} href={s.social[k]} target="_blank" rel="noreferrer">{label}</a>)}
          <h4 style={{ marginTop: 14 }}>Useful links</h4>
          <a href="https://dauniv.ac.in" target="_blank" rel="noreferrer">DAVV</a>
          <a href="https://scs.dauniv.ac.in" target="_blank" rel="noreferrer">SCSIT website</a>
          <a href="https://hackathon.ecellscsit.app" target="_blank" rel="noreferrer">Hackathon website</a>
        </div>
      </div>
      <p className="copy">© {new Date().getFullYear()} E-Cell SCSIT, DAVV Indore. All rights reserved.</p>
    </footer>
  );
}
