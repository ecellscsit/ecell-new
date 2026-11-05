import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Logo from '../common/Logo.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';

const PAGES = ['about', 'events', 'team', 'startups', 'gallery', 'blog', 'contact'];

const SOCIALS = [
  ['instagram', 'Instagram', InstagramIcon],
  ['linkedin', 'LinkedIn', LinkedInIcon],
  ['x', 'X', XIcon],
  ['youtube', 'YouTube', YouTubeIcon],
];

const USEFUL = [
  ['DAVV', 'https://dauniv.ac.in', 'dauniv.ac.in'],
  ['SCSIT website', 'https://scs.dauniv.ac.in', 'scs.dauniv.ac.in'],
  ['Hackathon website', 'https://hackathon.ecellscsit.app', 'hackathon.ecellscsit.app'],
];

const favicon = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

export default function Footer() {
  const { settings: s } = useSettings();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-about">
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
          <div className="social-icons">
            {SOCIALS.map(([k, label, Icon]) =>
              s.social?.[k] && (
                <a
                  key={k}
                  href={s.social[k]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="social-btn"
                >
                  <Icon fontSize="small" />
                </a>
              ),
            )}
          </div>

          <h4 style={{ marginTop: 14 }}>Useful links</h4>
          {USEFUL.map(([label, url, domain]) => (
            <a key={url} href={url} target="_blank" rel="noreferrer" className="useful-link">
              <img
                src={favicon(domain)}
                alt=""
                width="18"
                height="18"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
      <p className="copy">© {new Date().getFullYear()} E-Cell SCSIT, DAVV Indore. All rights reserved.</p>
    </footer>
  );
}
