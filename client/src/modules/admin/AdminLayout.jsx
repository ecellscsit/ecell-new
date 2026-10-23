import { NavLink, Outlet, Link } from 'react-router-dom';

const items = [
  ['Dashboard', '/admin'], ['Home Page', '/admin/home'], ['About Page', '/admin/about'], ['Notifications', '/admin/notifications'], ['Initiatives', '/admin/initiatives'],
  ['Events', '/admin/events'], ['Blog', '/admin/blog'], ['Team', '/admin/team'], ['Gallery', '/admin/gallery'],
  ['Startups', '/admin/startups'], ['Members', '/admin/members'], ['Messages', '/admin/messages'], ['Settings', '/admin/settings'],
];

export default function AdminLayout() {
  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-brand"><img src="/images/ecell-logo-white.png" alt="" /><h3>E-Cell Admin</h3></div>
        {items.map(([l, to]) => <NavLink key={to} to={to} end={to === '/admin'}>{l}</NavLink>)}
        <Link to="/">← Back to site</Link>
      </aside>
      <section className="admin-main"><Outlet /></section>
    </div>
  );
}
