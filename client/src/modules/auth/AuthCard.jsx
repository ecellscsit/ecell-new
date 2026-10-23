import Logo from '../../components/common/Logo.jsx';

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo"><Logo size={84} /></div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
