import React from 'react';
import { SmartificiaIcon, ContactsIcon, LogOutIcon } from './icons';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/smartificia.png'; // ✅ import your local logo

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <a
    href="#"
    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      active
        ? 'bg-white/10 text-white'
        : 'text-purple-200 hover:bg-white/5 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </a>
);

const Sidebar = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 bg-brand-purple text-white flex flex-col flex-shrink-0">
      <div className="flex items-center justify-center h-28 border-b border-white/10">
        <div className="flex flex-col items-center gap-1">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" /> {/* ✅ logo image */}
          <span className="text-xl font-bold text-white">SmartiCard</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem icon={<ContactsIcon className="w-6 h-6" />} label="Contacts" active={true} />
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-sm text-purple-200 truncate">Signed in as</p>
          <p className="text-base font-semibold text-white truncate">{user?.email}</p>
          <button
            onClick={logout}
            className="w-full mt-4 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-white/5 text-purple-200 hover:bg-white/10 hover:text-white"
          >
            <LogOutIcon className="w-5 h-5" />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
