import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo.jsx';

export default function NotFoundPage() {
  return (
    <div className="container section" style={{ textAlign: 'center' }}>
      <Logo size={110} />
      <h1>Page not found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Go home</Link>
    </div>
  );
}
