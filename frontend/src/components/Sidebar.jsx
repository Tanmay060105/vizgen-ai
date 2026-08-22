import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="hidden md:flex flex-col pt-16 bg-[#000000]/40 backdrop-blur-3xl h-full w-60 fixed left-0 top-0 border-r border-white/5 z-40 shadow-2xl">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B900FF] tracking-tight drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">VizGen</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out ${currentPath === '/dashboard' ? 'bg-gradient-to-r from-[#00F0FF]/20 to-transparent text-[#00F0FF] border-l-2 border-[#00F0FF] shadow-[inset_4px_0_20px_rgba(0,240,255,0.15)]' : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}>
          <span className="material-symbols-outlined" style={currentPath === '/dashboard' ? { fontVariationSettings: "'FILL' 1", textShadow: "0 0 15px rgba(0,240,255,0.8)" } : {}}>dashboard</span>
          <span className="font-medium tracking-wide">Dashboard</span>
        </Link>
        <Link to="/analytics" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out ${currentPath === '/analytics' ? 'bg-gradient-to-r from-[#00F0FF]/20 to-transparent text-[#00F0FF] border-l-2 border-[#00F0FF]' : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}>
          <span className="material-symbols-outlined" style={currentPath === '/analytics' ? { fontVariationSettings: "'FILL' 1" } : {}}>bar_chart</span>
          <span className="font-medium tracking-wide">Analytics</span>
        </Link>
        <Link to="/upload" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out ${currentPath === '/upload' ? 'bg-gradient-to-r from-[#00F0FF]/20 to-transparent text-[#00F0FF] border-l-2 border-[#00F0FF]' : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}>
          <span className="material-symbols-outlined" style={currentPath === '/upload' ? { fontVariationSettings: "'FILL' 1" } : {}}>database</span>
          <span className="font-medium tracking-wide">Data Sources</span>
        </Link>
        <Link to="/reports" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out ${currentPath === '/reports' ? 'bg-gradient-to-r from-[#00F0FF]/20 to-transparent text-[#00F0FF] border-l-2 border-[#00F0FF]' : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}>
          <span className="material-symbols-outlined" style={currentPath === '/reports' ? { fontVariationSettings: "'FILL' 1" } : {}}>description</span>
          <span className="font-medium tracking-wide">Reports</span>
        </Link>
        <Link to="/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out ${currentPath === '/settings' ? 'bg-gradient-to-r from-[#00F0FF]/20 to-transparent text-[#00F0FF] border-l-2 border-[#00F0FF]' : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}>
          <span className="material-symbols-outlined" style={currentPath === '/settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
          <span className="font-medium tracking-wide">Settings</span>
        </Link>
      </nav>

      {/* User Profile Section with Logout Context Menu */}
      <div className="relative border-t border-white/5 mt-auto bg-black/40 backdrop-blur-xl p-4">
        {showMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#13141B] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#FF007C] hover:bg-[#FF007C]/10 transition-colors text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </button>
          </div>
        )}
        
        {user && (
          <div 
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00F0FF]/20 to-[#B900FF]/20 border border-[#00F0FF]/40 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-300">
              <span className="material-symbols-outlined text-[#00F0FF] text-sm">person</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{user.name}</span>
              <span className="text-[10px] text-[#00F0FF] uppercase tracking-[0.15em] font-semibold">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
