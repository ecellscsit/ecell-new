import { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../common/Logo.jsx';
import NotificationBell from '../../modules/notifications/NotificationBell.jsx';

const links = [['About', '/about'], ['Initiatives', '/initiatives'], ['Events', '/events'], ['Team', '/team'], ['Startups', '/startups'], ['Gallery', '/gallery'], ['Blog', '/blog']];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {   // navbar gets a little smaller + shadow after scrolling
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <Logo className="nav-logo" />
          <span>E-Cell <small>SCSIT, DAVV INDORE</small></span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}
        </nav>

        <div className="nav-right">
          <Link to="/contact" className="btn btn-primary nav-cta">Contact Us</Link>
          <NotificationBell />
          {user ? (
            <div className="user-menu">
              <span>{user.name.split(' ')[0]} ▾</span>
              <div className="dropdown">
                <Link to="/profile">Profile</Link>
                {user.role === 'admin' && <Link to="/admin">Admin panel</Link>}
                <button onClick={() => { logout(); nav('/'); }}>Logout</button>
              </div>
            </div>
          ) : <Link to="/login" className="login-link">Login</Link>}
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">{open ? '✕' : '☰'}</button>
        </div>
      </div>
    </header>
  );
}
