import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Plot from 'react-plotly.js';

function Reports() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/predict');
        if (!response.ok) {
           const errData = await response.json();
           throw new Error(errData.detail || "Failed to generate prediction");
        }
        const result = await response.json();
        setPredictionData(result.forecast);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, []);

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
            <h2 className="font-title-md text-title-md text-white/90 font-semibold tracking-wide">Predictive Reports</h2>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B900FF]/5 border border-[#B900FF]/20 ml-4 shadow-[0_0_15px_rgba(185,0,255,0.05)] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#B900FF] animate-pulse shadow-[0_0_8px_#B900FF]"></span>
              <span className="font-label-caps text-label-caps text-[#B900FF] tracking-widest font-bold">MODEL RUNNING</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF]/10 to-[#B900FF]/10 border border-[#B900FF]/50 text-[#00F0FF] hover:bg-[#B900FF]/20 transition-colors duration-300 text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span> Export PDF
             </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-margin-mobile md:p-margin-desktop pb-24 flex-1">
          <div className="mb-8">
            <h3 className="font-headline-xl text-[2.5rem] font-bold text-white mb-2 drop-shadow-lg tracking-tight">AI Forecasting Engine</h3>
            <p className="font-body-md text-body-md text-[#B900FF] tracking-[0.2em] uppercase font-bold text-[11px] drop-shadow-[0_0_8px_rgba(185,0,255,0.5)]">Regression analysis & variance projection</p>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center h-[50vh]">
                <span className="material-symbols-outlined text-6xl text-[#00F0FF] animate-spin mb-4" style={{textShadow: "0 0 20px rgba(0,240,255,0.6)"}}>sync</span>
                <p className="text-[#00F0FF] font-code tracking-widest uppercase text-sm">Synthesizing predictions...</p>
             </div>
          ) : error ? (
             <div className="flex flex-col items-center justify-center h-[50vh] bg-white/[0.02] border border-white/5 rounded-3xl p-10">
                <span className="material-symbols-outlined text-6xl text-[#FF007C] mb-4" style={{textShadow: "0 0 20px rgba(255,0,124,0.6)"}}>warning</span>
                <p className="text-white text-xl font-bold mb-2">Forecasting Failed</p>
                <p className="text-white/50">{error}</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Main Chart Area */}
              <div className="xl:col-span-2 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[24px] relative group shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-white/10 transition-all duration-500 overflow-hidden min-h-[500px] flex flex-col p-6">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h4 className="font-title-md text-lg font-semibold text-white tracking-wide">Target Metric Projection (30 Days)</h4>
                  <div className="px-3 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]"></span>
                    Live Forecast
                  </div>
                </div>
                
                <div className="flex-1 w-full relative z-10">
                  <Plot
                    data={predictionData.data}
                    layout={{
                      ...predictionData.layout,
                      autosize: true,
                      paper_bgcolor: 'rgba(0,0,0,0)',
                      plot_bgcolor: 'rgba(0,0,0,0)',
                      margin: { l: 40, r: 20, t: 20, b: 40 },
                      xaxis: {
                        ...(predictionData.layout?.xaxis || {}),
                        showgrid: false,
                        zeroline: false,
                        showline: false,
                        tickfont: { color: "rgba(255,255,255,0.4)" }
                      },
                      yaxis: {
                        ...(predictionData.layout?.yaxis || {}),
                        showgrid: true,
                        gridcolor: "rgba(255,255,255,0.03)",
                        zeroline: false,
                        showline: false,
                        tickfont: { color: "rgba(255,255,255,0.4)" }
                      }
                    }}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ displayModeBar: false, responsive: true }}
                  />
                </div>
              </div>

              {/* Sidebar AI Insights */}
              <div className="grid grid-cols-1 gap-6">
                
                {/* Anomaly Risk Card */}
                <div className="bg-white/[0.02] backdrop-blur-3xl border border-[#FF007C]/20 rounded-[24px] p-6 shadow-[inset_0_0_20px_rgba(255,0,124,0.02)] relative overflow-hidden group hover:border-[#FF007C]/40 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF007C] blur-[100px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-500"></div>
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#FF007C] to-transparent opacity-50"></div>
                  
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 bg-[#FF007C]/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#FF007C] text-[18px]">radar</span>
                    </div>
                    <h4 className="font-title-md font-bold text-white tracking-wide">Anomaly Risk</h4>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-[3.5rem] font-bold text-white leading-none mb-2 tracking-tight">12<span className="text-2xl text-[#FF007C]">%</span></p>
                    <p className="text-white/40 text-[13px] font-medium leading-relaxed">Probability of variance exceeding upper bounds in next 7 days.</p>
                  </div>
                </div>

                {/* AI Synthesis Card */}
                <div className="bg-white/[0.02] backdrop-blur-3xl border border-[#00F0FF]/20 rounded-[24px] p-6 shadow-[inset_0_0_20px_rgba(0,240,255,0.02)] relative overflow-hidden flex-1 group hover:border-[#00F0FF]/40 transition-all duration-500">
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#00F0FF] blur-[100px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-500"></div>
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#00F0FF] to-transparent opacity-50"></div>
                  
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 bg-[#00F0FF]/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#00F0FF] text-[18px]">auto_awesome</span>
                    </div>
                    <h4 className="font-title-md font-bold text-white tracking-wide">AI Synthesis</h4>
                  </div>
                  
                  <div className="space-y-3 relative z-10">
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      <p className="text-white/80 text-[13px] leading-relaxed font-medium">The model projects steady upward momentum, with a subtle underlying seasonality pattern.</p>
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      <p className="text-white/80 text-[13px] leading-relaxed font-medium">Confidence intervals are widening slightly towards day 30, indicating increased unpredictability.</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

      {/* Mobile Nav Shell */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe lg:hidden bg-[#000000]/80 rounded-t-[32px] border-t border-white/10 backdrop-blur-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
         <Link to="/dashboard" className={`flex flex-col items-center justify-center transition-all duration-300 w-full h-full font-label-caps text-[10px] tracking-widest font-bold text-white/30`}>
           <span className="material-symbols-outlined mb-1.5 text-2xl">home</span>HOME
         </Link>
         <Link to="/reports" className={`flex flex-col items-center justify-center transition-all duration-300 w-full h-full font-label-caps text-[10px] tracking-widest font-bold text-[#00F0FF] relative`}>
           <div className="absolute top-0 w-16 h-1.5 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent shadow-[0_2px_15px_#00F0FF]"></div>
           <span className="material-symbols-outlined mb-1.5 text-2xl" style={{ fontVariationSettings: "'FILL' 1", textShadow: "0 0 15px rgba(0,240,255,0.8)" }}>description</span>
           REPORTS
         </Link>
      </nav>
    </>
  );
}

export default Reports;
