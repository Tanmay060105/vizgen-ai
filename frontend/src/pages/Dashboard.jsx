import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Plot from 'react-plotly.js';

function Dashboard() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [data, setData] = useState(location.state?.data || null);
  const [loading, setLoading] = useState(!location.state?.data);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!data) {
      const fetchDashboard = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/dashboard');
          if (!response.ok) throw new Error("No active dataset");
          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboard();
    }
  }, [data]);

  const recommendations = data?.recommendations || [];
  const issues = data?.quality_report?.issues || [];

  if (loading) return <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-white font-body-md">Loading dashboard telemetry...</div>;
  if (error) return <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center text-white font-body-md"><span className="material-symbols-outlined text-4xl text-[#FF007C] mb-4">error</span><p>No telemetry data found. Please initialize a data source.</p><Link to="/upload" className="mt-6 px-6 py-2.5 bg-[#B900FF] hover:bg-[#8B5CF6] transition-colors rounded-xl font-bold">Go to Upload</Link></div>;
  
  return (
    <>
        {/* TopAppBar */}
        <header className="flex justify-between items-center h-20 px-gutter w-full sticky top-0 z-50 bg-[#000000]/20 backdrop-blur-2xl border-b border-white/5 shadow-lg">
          {/* Mobile Brand */}
          <div className="md:hidden flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00F0FF]" style={{textShadow: "0 0 10px rgba(0,240,255,0.5)"}}>insights</span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#B900FF] tracking-tight">VizGen</h1>
          </div>

          {/* Desktop Header Content / Tools */}
          <div className="hidden md:flex items-center gap-4 flex-1">
            <h2 className="font-title-md text-title-md text-white/90 font-semibold tracking-wide">Overview</h2>
            {/* Health Score Badge */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00FF66]/5 border border-[#00FF66]/20 ml-4 shadow-[0_0_15px_rgba(0,255,102,0.05)] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse shadow-[0_0_8px_#00FF66]"></span>
              <span className="font-label-caps text-label-caps text-[#00FF66] tracking-widest font-bold">SYSTEM ACTIVE</span>
            </div>
          </div>

          {/* Global Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#00F0FF]/60 text-sm">search</span>
              <input className="w-72 bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2 font-body-sm text-body-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00F0FF] focus:border-[#00F0FF] transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] placeholder:text-white/30 backdrop-blur-xl" placeholder="Search insights..." type="text" />
            </div>
            <button className="p-2.5 rounded-xl text-white/60 hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button className="p-2.5 rounded-xl text-white/60 hover:text-[#B900FF] hover:bg-[#B900FF]/10 hover:shadow-[0_0_15px_rgba(185,0,255,0.2)] transition-all duration-300">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-margin-mobile md:p-margin-desktop pb-24 md:pb-margin-desktop flex-1">
          {/* Context Header */}
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative">
            <div className="relative z-10">
              <h3 className="font-headline-xl text-[2.5rem] font-bold text-white mb-2 drop-shadow-lg tracking-tight">Revenue Intelligence</h3>
              <p className="font-body-md text-body-md text-[#00F0FF] tracking-[0.2em] uppercase font-bold text-[11px] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">Real-time telemetry & geospatial analysis</p>
            </div>
            <div className="flex gap-4 relative z-10">
              <button className="px-6 py-3 rounded-xl border border-white/10 bg-black/20 text-white/90 font-body-sm text-body-sm font-semibold hover:bg-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-300">Last 30 Days</button>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0055FF] text-white font-body-sm text-body-sm font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-105 transition-all duration-300">Generate Report</button>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div key={index} className="flex flex-col bg-white/[0.015] backdrop-blur-2xl border border-white/10 rounded-[24px] relative group shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-[#00F0FF]/40 hover:shadow-[0_0_40px_rgba(0,240,255,0.15)] transition-all duration-500 overflow-hidden h-[400px]">
                  {/* Subtle Top Gradient Line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex justify-between items-start p-6 pb-2 relative z-10">
                    <h4 className="font-title-md text-lg font-semibold text-white tracking-wide">{rec.title}</h4>
                    <button className="text-white/30 hover:text-[#B900FF] transition-colors duration-300">
                      <span className="material-symbols-outlined">info</span>
                    </button>
                    {/* Info Popover */}
                    <div className="absolute top-14 right-6 w-72 bg-[#000000]/90 backdrop-blur-3xl border border-[#B900FF]/40 rounded-2xl p-5 z-20 shadow-[0_10px_50px_rgba(185,0,255,0.2)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-[#B900FF] text-sm" style={{textShadow: "0 0 10px rgba(185,0,255,0.6)"}}>lightbulb</span>
                        <span className="font-label-caps text-label-caps text-[#B900FF] tracking-widest font-bold">AI INSIGHT</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-white/70 leading-relaxed">{rec.explanation || rec.description}</p>
                    </div>
                  </div>
                  <div className="flex-1 w-full relative z-10">
                    {rec.fig_json ? (() => {
                      try {
                        const parsed = JSON.parse(rec.fig_json);
                        return (
                          <Plot
                            data={parsed.data}
                            layout={{
                              ...parsed.layout,
                              autosize: true,
                              paper_bgcolor: 'rgba(0,0,0,0)',
                              plot_bgcolor: 'rgba(0,0,0,0)',
                              margin: { l: 20, r: 20, t: 20, b: 30 },
                              xaxis: {
                                ...(parsed.layout?.xaxis || {}),
                                showgrid: false,
                                zeroline: false,
                                showline: false,
                                tickfont: { color: "rgba(255,255,255,0.3)" }
                              },
                              yaxis: {
                                ...(parsed.layout?.yaxis || {}),
                                showgrid: true,
                                gridcolor: "rgba(255,255,255,0.03)",
                                zeroline: false,
                                showline: false,
                                tickfont: { color: "rgba(255,255,255,0.3)" }
                              }
                            }}
                            useResizeHandler={true}
                            style={{ width: '100%', height: '100%' }}
                            config={{ displayModeBar: false, responsive: true }}
                          />
                        );
                      } catch(e) {
                        return <div className="flex items-center justify-center h-full text-[#FF007C] font-body-sm font-semibold tracking-wider">ERROR PARSING CHART DATA</div>;
                      }
                    })() : (
                      <div className="flex items-center justify-center h-full text-white/30 font-body-sm text-center px-8 uppercase tracking-widest font-semibold">
                        Awaiting Telemetry Data
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-20 flex flex-col items-center justify-center text-white/30 bg-white/[0.01] backdrop-blur-3xl border border-white/5 rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
                <span className="material-symbols-outlined text-6xl mb-6 text-white/10" style={{textShadow: "0 0 30px rgba(255,255,255,0.1)"}}>radar</span>
                <p className="text-xl font-bold tracking-widest uppercase">No Telemetry Detected</p>
                <p className="text-sm mt-3 font-medium tracking-wide">Initialize data source to commence visualization.</p>
              </div>
            )}
            
            {/* Top Anomalies / Issues Card */}
            {issues.length > 0 && (
              <div className="flex flex-col bg-gradient-to-br from-[#1A0510]/80 to-[#0A000A]/80 backdrop-blur-2xl border border-[#FF007C]/30 rounded-[24px] relative group shadow-[0_8px_40px_rgba(255,0,124,0.1)] hover:border-[#FF007C]/60 hover:shadow-[0_0_50px_rgba(255,0,124,0.2)] transition-all duration-500 overflow-hidden h-[400px]">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF007C] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex justify-between items-start p-6 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#FF007C] animate-pulse" style={{textShadow: "0 0 15px rgba(255,0,124,0.8)"}}>warning</span>
                    <h4 className="font-title-md text-lg font-bold text-white tracking-wide">Critical Alerts</h4>
                  </div>
                  <button className="text-[#FF007C]/60 hover:text-[#FF007C] transition-colors duration-300">
                    <span className="material-symbols-outlined">api</span>
                  </button>
                </div>
                <div className="space-y-4 px-6 overflow-y-auto pb-6 custom-scrollbar">
                  {issues.slice(0, 6).map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-[#FF007C]/10 hover:border-[#FF007C]/40 hover:bg-[#FF007C]/5 transition-all duration-300 group/item">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-[#FF007C] shadow-[0_0_10px_rgba(255,0,124,0.9)] flex-shrink-0 group-hover/item:scale-150 transition-transform duration-300"></div>
                      <span className="font-code text-[13px] text-white/80 leading-relaxed font-medium">{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
    </>
  );
}

export default Dashboard;
