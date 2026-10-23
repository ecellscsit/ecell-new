import { useEffect, useRef, useState } from 'react';

// Counts from 0 to `to` when it scrolls into view.
export default function CountUp({ to = 0, duration = 1600, suffix = '' }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const run = () => {
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / duration, 1);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));   // ease-out
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) return setVal(to);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}
