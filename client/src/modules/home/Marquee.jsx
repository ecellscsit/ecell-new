const WORDS = ['Workshops', 'Hackathons', 'Pitch Nights', 'Mentorship', 'Networking', 'Startup Support', 'Expert Talks', 'E-Summit'];

// Endless scrolling strip (pure CSS)
export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">{row.map((w, i) => <span key={i}>{w} <i>✦</i></span>)}</div>
    </div>
  );
}
