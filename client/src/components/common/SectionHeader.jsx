import { Link } from 'react-router-dom';

export default function SectionHeader({ title, linkText, to }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {to && <Link to={to}>{linkText} →</Link>}
    </div>
  );
}
