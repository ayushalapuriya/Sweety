import { BarChart3, CalendarDays, CircleUserRound, LogOut, Plus, Settings, ShieldCheck } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function AppShell() {
  const { user, signOut } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const nav = [{ to: '/dashboard', label: 'Dashboard', icon: BarChart3 }, { to: '/reports', label: 'Reports', icon: CalendarDays }];
  return <div className="app-shell"><aside className="sidebar"><Logo /><nav>{nav.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={18} />{label}</NavLink>)}</nav><div className="sidebar-bottom"><div className="privacy"><ShieldCheck size={18} /><span><b>Your data is private</b><small>Securely stored and encrypted</small></span></div><div className="profile"><CircleUserRound size={32} /><span><b>{user.name}</b><small>{user.email}</small></span><button className="icon-btn" aria-label="Sign out" onClick={() => { signOut(); navigate('/login'); }}><LogOut size={17} /></button></div></div></aside><main className="main-content"><header className="topbar"><div><p className="eyebrow">Good day, {user.name.split(' ')[0]}</p><h1>{location.pathname === '/reports' ? 'Reports' : 'Your glucose overview'}</h1></div><button className="button primary top-action" onClick={() => navigate('/dashboard?add=1')}><Plus size={18} />Add reading</button></header><Outlet /></main></div>;
}
