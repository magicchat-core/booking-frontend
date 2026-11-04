import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

const nav = [
  { to: '/owner',       label: 'Running Tables' },   // ← owner's home
  { to: '/',             label: 'Dashboard' },
  { to: '/menu',         label: 'Menu' },
  { to: '/inventory',    label: 'Inventory' },
  { to: '/purchase-orders', label: 'Purchase Orders' },
  { to: '/orders',       label: 'Orders' },
  { to: '/customers',    label: 'Customers' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">🍛 Ref&nbsp;CRM</div>
        <nav>
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <span className="who">{user?.email} <em>({user?.role})</em></span>
          <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
