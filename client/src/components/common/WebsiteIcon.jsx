// Ek hi jagah se website icon. Rang parent ke text color se aata hai
// (jaise team ke gol button pe hover karne par safed ho jaata hai).
// Agar icon ko uske apne rangon mein chahiye to <WebsiteIcon original />
export default function WebsiteIcon({ size = 20, original = false, className = '' }) {
  return (
    <span
      className={`web-icon ${original ? 'original' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
