import { useEffect, useRef, useState } from 'react';

// Fades + slides its children in when they scroll into view.
// <Reveal delay={150} from="up|left|right|zoom">...</Reveal>
export default function Reveal({ children, delay = 0, from = 'up', as: Tag = 'div', className = '' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return setShown(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal from-${from} ${shown ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
