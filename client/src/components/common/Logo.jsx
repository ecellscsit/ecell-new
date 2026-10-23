// variant: 'dark' = black E-Cell logo (light backgrounds), 'light' = white logo (dark backgrounds)
// Pass `size` (px) for a fixed size, or `className` to size it with CSS.
export default function Logo({ variant = 'dark', size, className = '' }) {
  const src = variant === 'light' ? '/images/ecell-logo-white.png' : '/images/ecell-logo.png';
  const style = size ? { height: size, width: size, objectFit: 'contain' } : undefined;
  return <img src={src} alt="E-Cell SCSIT logo" className={className} style={style} />;
}
