import { useEffect, useState } from 'react';

// Cycles a highlighted word: "E-Cell is for [Ideas]"
export default function RotatingWords({ words = ['Ideas', 'Builders', 'Founders', 'Startups'], every = 2200 }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((p) => (p + 1) % words.length), every); return () => clearInterval(t); }, [words.length, every]);
  return (
    <div className="rotator">
      <span>E-Cell is for</span>
      <b key={i} className="rotator-word">{words[i]}</b>
    </div>
  );
}
