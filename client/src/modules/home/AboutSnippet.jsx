import { Link } from 'react-router-dom';
import Reveal from '../../components/common/Reveal.jsx';

export default function AboutSnippet({ about = {}, hod = {} }) {
  if (!about.intro && !hod.message) return null;
  return (
    <section className="container section about-snippet">
      <Reveal from="left">
        <div>
          <span className="eyebrow">About us</span>
          <h2>Fostering Innovation &amp; Entrepreneurship</h2>
          <p>{about.intro}</p>
          <Link to="/about" className="btn btn-outline">Learn more →</Link>
        </div>
      </Reveal>
      {hod.message && (
        <Reveal from="right" delay={150}>
          <div className="hod-card">
            <div className="quote-mark">“</div>
            <p>{hod.message}</p>
            <div className="hod-by">
              <img src={hod.photo || '/images/scsit-logo.png'} alt="" />
              <div><b>{hod.name}</b><small>{hod.title}</small></div>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
