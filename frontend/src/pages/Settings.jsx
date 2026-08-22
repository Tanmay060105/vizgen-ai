import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function Settings() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
        {/* TopAppBar */}
        <header className="flex justify-between items-center h-20 px-gutter w-full sticky top-0 z-50 bg-[#000000]/20 backdrop-blur-2xl border-b border-white/5 shadow-lg">
          {/* Mobile Brand */}
          <div className="md:hidden flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00F0FF]" style={{textShadow: "0 0 10px rgba(0,240,255,0.5)"}}>insights</span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B900FF] tracking-tight">VizGen</h1>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1">
            <h2 className="font-title-md text-title-md text-white/90 font-semibold tracking-wide">Settings & Configurations</h2>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF]/20 to-[#B900FF]/20 border border-[#00F0FF]/50 text-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">save</span> Save Changes
             </button>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="relative z-10 p-margin-mobile md:p-margin-desktop pb-24 flex-1">
          
          <div className="max-w-4xl mx-auto space-y-10 mt-8">
            
            {/* Header Section */}
            <div className="flex flex-col gap-2 mb-10 text-center">
              <h2 className="text-3xl font-bold text-white tracking-tight">Workspace Settings</h2>
              <p className="text-white/50 text-base">Manage your basic environment preferences.</p>
            </div>
          
            {/* Workspace Preferences */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
                <div className="px-8 py-5 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#B900FF]">tune</span>
                        System Preferences
                    </h3>
                </div>
                
                <div className="flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-8 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <div className="md:w-2/3 mb-4 md:mb-0 pr-4">
                            <h4 className="text-white font-medium mb-1 flex items-center gap-2 text-lg">
                                Cyberpunk Aesthetics
                            </h4>
                            <p className="text-white/40 text-sm leading-relaxed">Enable maximum neon glow effects, deep space backgrounds, and glassmorphism across all dashboards.</p>
                        </div>
                        <div className="md:w-1/3 flex md:justify-end">
                            <div className="w-14 h-7 rounded-full bg-[#B900FF]/20 border border-[#B900FF]/50 relative cursor-pointer shadow-[0_0_15px_rgba(185,0,255,0.2)] hover:shadow-[0_0_25px_rgba(185,0,255,0.4)] transition-all">
                                <div className="absolute right-1 top-1 w-5 h-5 rounded-full bg-[#B900FF] shadow-[0_0_10px_#B900FF]"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-8 hover:bg-white/[0.02] transition-colors">
                        <div className="md:w-2/3 mb-4 md:mb-0 pr-4">
                            <h4 className="text-white font-medium mb-1 text-lg">Local Data Caching</h4>
                            <p className="text-white/40 text-sm leading-relaxed">Persist uploaded datasets to disk to survive server restarts. Highly recommended for large CSV files.</p>
                        </div>
                        <div className="md:w-1/3 flex md:justify-end">
                            <div className="w-14 h-7 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/50 relative cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all">
                                <div className="absolute right-1 top-1 w-5 h-5 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#FF007C]/[0.02] border border-[#FF007C]/30 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl relative mt-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF007C]/10 blur-[80px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="px-8 py-5 flex items-center justify-between border-b border-[#FF007C]/10 bg-[#FF007C]/[0.02]">
                    <h3 className="text-lg font-semibold text-[#FF007C] flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">warning</span>
                        Danger Zone
                    </h3>
                </div>
                
                <div className="flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-8 hover:bg-[#FF007C]/[0.02] transition-colors">
                        <div className="md:w-2/3 mb-4 md:mb-0 pr-4">
                            <h4 className="text-white font-medium mb-1 text-lg">Clear Workspace Cache</h4>
                            <p className="text-white/40 text-sm leading-relaxed">This will delete all locally saved datasets, cached dataframes, and dashboard configurations from this machine.</p>
                        </div>
                        <div className="md:w-1/3 flex md:justify-end">
                            <button className="px-8 py-3 bg-[#FF007C]/10 border border-[#FF007C]/50 hover:bg-[#FF007C] text-[#FF007C] hover:text-white rounded-lg transition-all font-semibold text-sm whitespace-nowrap shadow-[0_0_15px_rgba(255,0,124,0.1)] hover:shadow-[0_0_20px_rgba(255,0,124,0.4)]">
                                Clear Cache
                            </button>
                        </div>
                    </div>
                </div>
            </div>

          </div>

        </div>

      {/* Mobile Nav Shell */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe lg:hidden bg-[#000000]/80 rounded-t-[32px] border-t border-white/10 backdrop-blur-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
         <Link to="/dashboard" className={`flex flex-col items-center justify-center transition-all duration-300 w-full h-full font-label-caps text-[10px] tracking-widest font-bold text-white/30`}>
           <span className="material-symbols-outlined mb-1.5 text-2xl">home</span>HOME
         </Link>
         <Link to="/settings" className={`flex flex-col items-center justify-center transition-all duration-300 w-full h-full font-label-caps text-[10px] tracking-widest font-bold text-[#00F0FF] relative`}>
           <div className="absolute top-0 w-16 h-1.5 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_2px_15px_#00F0FF]"></div>
           <span className="material-symbols-outlined mb-1.5 text-2xl" style={{ fontVariationSettings: "'FILL' 1", textShadow: "0 0 15px rgba(0,240,255,0.8)" }}>settings</span>
           SETTINGS
         </Link>
      </nav>
    </>
  );
}

export default Settings;
