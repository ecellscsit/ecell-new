import { Link } from 'react-router-dom';
import Reveal from '../../components/common/Reveal.jsx';

export default function CtaBanner() {
  return (
    <section className="container section">
      <Reveal from="zoom">
        <div className="cta-banner">
          <img src="/images/ecell-logo-white.png" alt="" className="cta-logo" />
          <div>
            <h2>Have an idea? Let&apos;s build it together.</h2>
            <p>Join E-Cell SCSIT to get event updates, mentorship and a community of builders.</p>
          </div>
          <Link to="/register" className="btn btn-light">Join E-Cell</Link>
        </div>
      </Reveal>
    </section>
  );
}
