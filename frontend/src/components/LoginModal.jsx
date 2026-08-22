import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('System requires valid credentials.');
      return;
    }

    setIsAuthenticating(true);
    setError('');

    // Simulate network delay for aesthetic purposes
    setTimeout(async () => {
      const success = await login(email, password);
      if (success) {
        onClose();
        navigate('/dashboard');
      } else {
        setError('Authentication sequence failed.');
        setIsAuthenticating(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 md:p-10 bg-[#0A0B10] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Background Cyberpunk Elements internal to card */}
        <div className="absolute -top-[50%] -left-[50%] w-full h-full bg-[#00F0FF]/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-[50%] -right-[50%] w-full h-full bg-[#B900FF]/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col items-center mb-10 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F0FF]/20 to-[#B900FF]/20 border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <span className="material-symbols-outlined text-[#00F0FF] text-3xl drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">admin_panel_settings</span>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight">Access Terminal</h1>
          <p className="text-white/40 text-sm mt-2 font-mono">VIZGEN.AI // IDENTIFICATION REQUIRED</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] text-[#00F0FF] uppercase tracking-widest font-bold">Email Designation</label>
            <input 
              type="text" 
              name="vizgen-email"
              autoComplete="new-password"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all font-mono text-sm placeholder:text-white/20 shadow-inner"
              placeholder="operator@vizgen.ai"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-end">
                <label className="text-[10px] text-[#00F0FF] uppercase tracking-widest font-bold">Access Key</label>
            </div>
            <input 
              type="password" 
              name="vizgen-password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all font-mono text-sm placeholder:text-white/20 shadow-inner tracking-widest"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-[#FF007C]/10 border border-[#FF007C]/30 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FF007C] text-sm">warning</span>
              <p className="text-[#FF007C] text-xs font-mono">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isAuthenticating}
            className={`w-full mt-8 px-6 py-4 rounded-xl font-bold tracking-widest text-sm transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-3 ${isAuthenticating ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/10' : 'bg-gradient-to-r from-[#00F0FF] to-[#B900FF] text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]'}`}
          >
            {isAuthenticating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></span>
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <span>INITIALIZE SESSION</span>
            )}
          </button>
        </form>
        
        <div className="mt-8 flex justify-center relative z-10">
             <div className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md flex items-center gap-2 cursor-help group hover:bg-white/[0.08] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse"></span>
                <span className="text-[9px] text-white/40 font-mono tracking-widest group-hover:text-white/80 transition-colors">SYSTEM ONLINE</span>
            </div>
        </div>
      </div>
    </div>
  );
}
