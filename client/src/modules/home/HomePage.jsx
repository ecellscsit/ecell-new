import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../../api/http.js';
import SectionHeader from '../../components/common/SectionHeader.jsx';
import EventCard from '../../components/common/EventCard.jsx';
import Reveal from '../../components/common/Reveal.jsx';
import HeroSlideshow from './HeroSlideshow.jsx';
import RotatingWords from './RotatingWords.jsx';
import StatsStrip from './StatsStrip.jsx';
import Marquee from './Marquee.jsx';
import AboutSnippet from './AboutSnippet.jsx';
import InitiativesSection from './InitiativesSection.jsx';
import Announcements from './Announcements.jsx';
import Leadership from './Leadership.jsx';
import Testimonials from './Testimonials.jsx';
import Partners from './Partners.jsx';
import CtaBanner from './CtaBanner.jsx';
import StartupCard from '../startups/StartupCard.jsx';

export default function HomePage() {
  const [d, setD] = useState(null);
  useEffect(() => { http.get('/home').then((r) => setD(r.data)); }, []);
  if (!d) return <div className="page-loading"><img src="/images/ecell-logo.png" alt="Loading" /></div>;
  const s = d.settings;

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
        <div className="container hero-grid">
          <div className="hero-text">
            <RotatingWords words={['Innovators', 'Founders', 'Builders', 'Leaders']} />
            <h1>{s.hero.headline}</h1>
            <p>{s.hero.description}</p>
            <div className="btn-row">
              <Link to="/events" className="btn btn-primary btn-lg">Explore Events</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Join E-Cell</Link>
            </div>
            {s.hero.highlight && <small className="highlight pulse-dot">{s.hero.highlight}</small>}
          </div>
          <div className="hero-visual"><HeroSlideshow images={d.heroImages} /></div>
        </div>
      </section>

      <Marquee />
      <StatsStrip stats={d.stats} custom={s.stats || []} />
      <AboutSnippet about={s.about} hod={s.hod} />
      <InitiativesSection items={d.initiatives} />
      <Announcements items={d.announcements} />

      <section className="container section">
        <SectionHeader title="Events" to="/events" linkText="View all events" />
        <div className="grid-3">{d.events.map((e, i) => <Reveal key={e._id} delay={i * 120}><EventCard event={e} /></Reveal>)}</div>
      </section>

      <Leadership president={d.president} vicePresident={d.vicePresident} tagline={s.tagline} />

      <section className="container section">
        <SectionHeader title="Startups" to="/startups" linkText="View all startups" />
        <div className="grid-4">{d.startups.map((st, i) => <Reveal key={st._id} delay={i * 100}><StartupCard startup={st} /></Reveal>)}</div>
      </section>

      <Testimonials items={s.testimonials} />

      <section className="container section">
        <SectionHeader title="Gallery" to="/gallery" linkText="View full gallery" />
        <div className="mini-gallery">
          {d.gallery.map((p, i) => <Reveal key={p._id} delay={i * 70} from="zoom"><img src={p.url} alt={p.caption || ''} /></Reveal>)}
        </div>
      </section>

      <Partners names={s.sponsors} />
      <CtaBanner />
    </>
  );
}
