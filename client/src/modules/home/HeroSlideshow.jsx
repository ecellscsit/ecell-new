import { useEffect, useState } from 'react';

// Auto-rotating images (tick "Show in hero slideshow" on photos in Admin > Gallery).
export default function HeroSlideshow({ images = [] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images.length]);

  // no photos yet -> show both logos
  if (!images.length) {
    return (
      <div className="hero-img placeholder hero-logos">
        <img src="/images/ecell-logo.png" alt="E-Cell SCSIT" />
        <img src="/images/scsit-logo.png" alt="SCSIT DAVV" />
      </div>
    );
  }
  return (
    <div className="slideshow">
      <img className="hero-img" src={images[i].url} alt={images[i].caption || 'E-Cell activity'} />
      <div className="dots">{images.map((_, n) => <span key={n} className={n === i ? 'on' : ''} onClick={() => setI(n)} />)}</div>
    </div>
  );
}
