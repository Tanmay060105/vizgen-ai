import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

function DataQuality() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [scoreOffset, setScoreOffset] = useState(283);
  const [stats, setStats] = useState({ rows: 0, cols: 0, missing: 0, dupes: 0 });
  const [issues, setIssues] = useState([]);
  const [fingerprint, setFingerprint] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Read from state passed by UploadData
    const data = location.state?.data;
    const qualityReport = data?.quality_report;
    const score = qualityReport?.score || 85;
    const fingerprint = data?.fingerprint || null;

    // Set actionable issues
    if (qualityReport?.issues) {
      setIssues(qualityReport.issues);
    }
    
    if (fingerprint) {
      setFingerprint(fingerprint);
    }

    // Animate Gauge to score
    const targetOffset = 283 - (283 * (score / 100));
    const timer = setTimeout(() => {
      setScoreOffset(targetOffset);
    }, 300);

    // Animate Numbers
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const targetStats = { 
      rows: qualityReport?.metrics?.rows || 0, 
      cols: qualityReport?.metrics?.cols || 0, 
      missing: qualityReport?.metrics?.missing_overall || 0, 
      dupes: qualityReport?.metrics?.duplicate_rows || 0 
    };

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setStats({
        rows: targetStats.rows * easeProgress,
        cols: targetStats.cols * easeProgress,
        missing: targetStats.missing * easeProgress,
        dupes: targetStats.dupes * easeProgress,
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(targetStats);
      }
    }, stepTime);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [location.state]);

  const handleGenerateDashboard = () => {
    // Pass the same data forward to the dashboard
    navigate('/dashboard', { state: { data: location.state?.data } });
  };

  return (
    <>
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13112a] via-[#0b0f19] to-[#05070a]"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px]"></div>
      </div>

      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative z-10 p-6 lg:p-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 mb-6 shrink-0">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-[28px] text-cyan-400">fact_check</span>
              Data Quality Overview
            </h1>
            <p className="text-gray-400 mt-1 text-sm flex items-center gap-2">
              Reviewing dataset: 
              <span className="font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                {fingerprint?.filename || 'dataset.csv'}
              </span>
            </p>
          </div>
          
          <button 
            onClick={handleGenerateDashboard} 
            className="mt-4 md:mt-0 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] flex items-center gap-2 group"
          >
            <span className="material-symbols-outlined text-white text-lg group-hover:rotate-12 transition-transform">magic_button</span>
            Generate Clean Dashboard
          </button>
        </header>

        {/* Dashboard Grid (Single Screen Layout) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 pb-6">
          
          {/* Left Column: Fingerprint & Meta (3 cols) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
            
            <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <span className="material-symbols-outlined text-cyan-400">fingerprint</span>
                Dataset Fingerprint
              </h2>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-2">SHA-256 Checksum</span>
                  <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg px-3 py-2">
                    <span className="material-symbols-outlined text-gray-400 text-sm">lock</span>
                    <code className="text-xs text-gray-300 truncate w-full font-mono">{fingerprint?.sha256_hash || '...'}</code>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">File Size</span>
                    <div className="text-sm font-semibold text-white">
                      {fingerprint ? (fingerprint.file_size_bytes / 1024).toFixed(2) : 0} KB
                    </div>
                  </div>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">In-Memory</span>
                    <div className="text-sm font-semibold text-white">
                      {fingerprint ? (fingerprint.memory_usage_bytes / 1024).toFixed(2) : 0} KB
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-3">Column Types</span>
                  <div className="space-y-2">
                    {fingerprint?.type_counts && Object.entries(fingerprint.type_counts).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${type === 'numeric' ? 'bg-purple-500' : type === 'categorical' ? 'bg-cyan-400' : 'bg-pink-400'}`}></span>
                          <span className="text-xs font-medium text-gray-300 capitalize">{type}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-gray-400">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Middle Column: Central Score & Primary Stats (5 cols) */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 h-full min-h-0">
            {/* Massive Gauge */}
            <div className="flex-1 p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
              
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 relative z-10">Overall Quality Score</h3>
              
              <div className="relative w-64 h-64 flex items-center justify-center z-10">
                <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]" viewBox="0 0 100 100">
                  <circle className="stroke-white/5 fill-transparent stroke-[6]" cx="50" cy="50" r="44"></circle>
                  <circle 
                    className="stroke-purple-500 fill-transparent stroke-[6] transition-all duration-[1.5s] ease-out" 
                    cx="50" cy="50" r="44"
                    style={{ 
                      strokeDasharray: 276, 
                      strokeDashoffset: scoreOffset,
                      strokeLinecap: 'round'
                    }}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-7xl font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {location.state?.data?.quality_report?.score || 85}
                  </span>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] mt-3 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                    Good Quality
                  </span>
                </div>
              </div>
            </div>

            {/* 2x2 Stat Grid */}
            <div className="shrink-0 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md flex flex-col relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <span className="material-symbols-outlined text-gray-400 text-xl">table_rows</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] bg-white/5 px-2 py-1 rounded">Rows</span>
                </div>
                <div className="text-3xl font-bold text-white tracking-tight">{Math.floor(stats.rows).toLocaleString()}</div>
              </div>
              <div className="p-5 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-md flex flex-col relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <span className="material-symbols-outlined text-gray-400 text-xl">view_column</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] bg-white/5 px-2 py-1 rounded">Cols</span>
                </div>
                <div className="text-3xl font-bold text-white tracking-tight">{Math.floor(stats.cols).toLocaleString()}</div>
              </div>
              <div className="p-5 rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-md flex flex-col relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-center mb-3 relative z-10">
                  <span className="material-symbols-outlined text-red-400 text-xl">warning</span>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">Missing</span>
                </div>
                <div className="text-3xl font-bold text-red-400 relative z-10 tracking-tight">{stats.missing.toFixed(1)}%</div>
              </div>
              <div className="p-5 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md flex flex-col relative overflow-hidden group">
                <div className="flex justify-between items-center mb-3 relative z-10">
                  <span className="material-symbols-outlined text-yellow-400 text-xl">content_copy</span>
                  <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-[0.2em] bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded">Dupes</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400 relative z-10 tracking-tight">{Math.floor(stats.dupes).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Actionable Issues (4 cols) */}
          <div className="col-span-1 lg:col-span-4 h-full flex flex-col min-h-0 bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-black/20 shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-400">assignment_late</span>
                Actionable Issues
                <span className="ml-auto text-xs font-bold bg-white/10 text-white px-3 py-1 rounded-full">{issues.length}</span>
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 relative">
              {issues.length > 0 ? (
                issues.map((issue, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-black/40 border border-white/5 hover:bg-white/5 transition-colors duration-150 group">
                    <span className="material-symbols-outlined text-yellow-400 text-[22px] mt-0.5 shrink-0 group-hover:scale-110 transition-transform">warning</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{issue.message}</h3>
                      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">Recommendation</p>
                      <p className="text-xs text-gray-300 leading-relaxed">{issue.suggestion}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <span className="material-symbols-outlined text-green-400 text-4xl">verified</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Issues Found</h3>
                  <p className="text-sm text-gray-400 max-w-[200px]">Your dataset is exceptionally clean and ready for analysis.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}} />
    </>
  )
}

export default DataQuality
