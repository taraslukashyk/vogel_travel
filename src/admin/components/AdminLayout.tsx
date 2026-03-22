import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Package, FileText, Briefcase, Search, LogOut, Menu, X, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.svg';

const navItems = [
  { to: '/admin/offers', label: 'Пропозиції', icon: Package },
  { to: '/admin/blog', label: 'Блог', icon: FileText },
  { to: '/admin/services', label: 'Сервіси', icon: Briefcase },
  { to: '/admin/seo', label: 'SEO', icon: Search },
  { to: '/admin/help', label: 'Довідка', icon: HelpCircle },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-200 flex items-start justify-between">
          <Link to="/" className="flex-1 flex items-center justify-center py-4 px-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-xl shadow-slate-900/10 rounded-2xl hover:bg-slate-900 hover:shadow-2xl transition-all duration-300 group" title="На головну сайту">
            <img src={logo} alt="Vogel Logo" className="w-28 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-500" />
          </Link>
          <button className="lg:hidden text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg ml-3 mt-1 transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <div className="text-xs text-gray-400 px-3 mb-2 truncate">{user?.email}</div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
          >
            <LogOut size={18} />
            Вийти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden shadow-sm z-30 relative">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 p-2 -ml-2 rounded-lg hover:bg-gray-100">
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center justify-center px-5 py-2.5 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-lg shadow-slate-900/10 rounded-xl hover:scale-105 transition-transform" title="На головну сайту">
            <img src={logo} alt="Vogel Logo" className="w-16 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
          </Link>
          <div className="w-10"></div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
