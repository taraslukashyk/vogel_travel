import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Package, FileText, Briefcase, Search, LogOut, Menu, X, HelpCircle, Globe, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.svg';

const navItems = [
  { to: '/admin/offers', label: 'Пропозиції', icon: Package },
  { to: '/admin/blog', label: 'Блог', icon: FileText },
  { to: '/admin/services', label: 'Сервіси', icon: Briefcase },
  { to: '/admin/partners', label: 'Партнери', icon: Globe },
  { to: '/admin/seo', label: 'SEO', icon: Search },
  { to: '/admin/help', label: 'Довідка', icon: HelpCircle },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed');
    return saved === 'true';
  });

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('adminSidebarCollapsed', String(newState));
  };

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

      {/* Sidebar - Truly fixed */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 h-full bg-white border-r border-gray-200 flex flex-col transform transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo Section */}
        <div className={`p-4 border-b border-gray-200 flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed || sidebarOpen ? (
            <>
              <Link to="/" className="flex-1 flex items-center justify-center py-4 px-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-xl shadow-slate-900/10 rounded-2xl hover:bg-slate-900 hover:shadow-2xl transition-all duration-300 group" title="На головну сайту">
                <img src={logo} alt="Vogel Logo" className="w-28 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-500" />
              </Link>
              <button 
                className="lg:hidden text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg ml-3 transition-colors" 
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <Link to="/" className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-lg shrink-0" title="На головну">
               <img src={logo} alt="V" className="w-6 h-6 object-contain" />
            </Link>
          )}
        </div>

        {/* Desktop Collapse Toggle (Top) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-full py-3 text-gray-400 hover:text-teal-600 border-b border-gray-100 transition-colors bg-gray-50/50 hover:bg-teal-50/10 group relative"
          title={isCollapsed ? 'Розгорнути' : 'Згорнути'}
        >
          {isCollapsed ? (
            <ChevronRight size={18} className="text-gray-400 group-hover:text-teal-600 transition-colors" />
          ) : (
            <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 group-hover:text-teal-600 transition-colors">
              <ChevronLeft size={14} />
              <span>Згорнути меню</span>
            </div>
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 mt-2 overflow-hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center rounded-lg text-sm font-medium transition-all duration-300 group relative ${
                  isCollapsed && !sidebarOpen ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
              title={isCollapsed ? label : ''}
            >
              <Icon size={20} className="shrink-0" />
              {(!isCollapsed || sidebarOpen) && <span className="truncate">{label}</span>}
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && !sidebarOpen && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] font-bold uppercase tracking-[0.2em] shadow-2xl border border-white/10">
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <NavLink
            to="/admin/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center rounded-lg text-sm font-medium transition-all duration-300 group relative mb-2 ${
                isCollapsed && !sidebarOpen ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
            title={isCollapsed ? 'Налаштування' : ''}
          >
            <Settings size={20} className="shrink-0" />
            {(!isCollapsed || sidebarOpen) && <span className="truncate">Налаштування</span>}
            {isCollapsed && !sidebarOpen && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] font-bold uppercase tracking-[0.2em] shadow-2xl border border-white/10">
                Налаштування
              </div>
            )}
          </NavLink>
          
          <button
            onClick={handleSignOut}
            className={`flex items-center rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-all duration-300 group relative ${
              isCollapsed && !sidebarOpen ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'
            }`}
          >
            <LogOut size={20} className="shrink-0" />
            {(!isCollapsed || sidebarOpen) && <span className="truncate">Вийти</span>}
            {isCollapsed && !sidebarOpen && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-red-600 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] font-bold uppercase tracking-[0.2em] shadow-2xl border border-white/10">
                Вийти
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main content - Compensate for fixed sidebar width */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}`}>
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden shadow-sm z-30 sticky top-0">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 p-2 -ml-2 rounded-lg hover:bg-gray-100">
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center justify-center px-5 py-2.5 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-lg shadow-slate-900/10 rounded-xl hover:scale-105 transition-transform" title="На головну сайту">
            <img src={logo} alt="Vogel Logo" className="w-16 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
          </Link>
          <div className="w-10"></div>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
