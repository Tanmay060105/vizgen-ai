import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Layout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-white">
        <span className="animate-pulse tracking-widest text-[#00F0FF] uppercase text-sm font-bold">Initializing Session...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/?login=true" replace />;
  }

  return (
    <div className="antialiased h-screen flex flex-col md:flex-row overflow-hidden bg-transparent text-white selection:bg-[#00F0FF]/30 selection:text-white font-body-md relative">
      <Sidebar />
      <main className="flex-1 md:ml-60 flex flex-col h-screen relative z-10 bg-transparent overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
