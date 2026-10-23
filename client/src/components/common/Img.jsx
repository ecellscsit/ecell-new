import { useState } from 'react';

// Shows the image; if it is missing or broken, shows the E-Cell logo instead.
export default function Img({ src, alt = '', className = '', ...rest }) {
  const [bad, setBad] = useState(!src);
  return (
    <img
      {...rest}
      src={bad ? '/images/ecell-logo.png' : src}
      alt={alt}
      className={`${className} ${bad ? 'img-fallback' : ''}`}
      onError={() => setBad(true)}
    />
  );
}
