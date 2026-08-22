import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Plot from 'react-plotly.js';

const Analytics = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [isLoading, setIsLoading] = useState(true);
  const [timelineData, setTimelineData] = useState([]);
  const [activeYearIndex, setActiveYearIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/timeline');
        if (!response.ok) {
          throw new Error('Failed to fetch timeline analysis.');
        }
        const result = await response.json();
        if (result.status === 'success') {
          setTimelineData(result.timeline);
        } else {
          throw new Error(result.detail || 'Unknown error');
        }
      } catch (err) {
        console.error(err);
        setError('Could not generate timeline. Make sure you have uploaded data with a Year or Date column.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const activeData = timelineData[activeYearIndex];

  return (
    <>
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#13112a] via-[#0b0f19] to-[#05070a]"></div>
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-purple-900/10 blur-[120px]"></div>
        <div className="absolute bottom-[0%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[100px]"></div>
      </div>

      <header className="px-8 lg:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 backdrop-blur-md bg-[#0b0f19]/40 sticky top-0 z-50">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-[32px] text-cyan-400">timeline</span>
            Annual AI Review
          </h1>
          <p className="text-gray-400 mt-2 text-sm max-w-xl">
            Deep temporal machine learning insights and advanced yearly segment analysis.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-medium flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Engine Online
          </div>
        </div>
      </header>

      <div className="p-8 lg:px-12 py-8 w-full max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-purple-400 animate-spin">refresh</span>
              <p className="text-purple-400 font-medium">Generating Temporal AI Models...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl border border-red-500/30 bg-red-500/10 text-red-200 backdrop-blur-md flex items-center gap-4">
            <span className="material-symbols-outlined text-red-400 text-3xl">error</span>
            <p>{error}</p>
          </div>
        ) : timelineData.length === 0 ? (
          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] text-gray-400 text-center">
            No timeline data could be generated.
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Timeline Navigation */}
            <div className="w-full lg:w-48 shrink-0 relative">
              <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-white/10 z-0 hidden lg:block"></div>
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 relative z-10 scrollbar-hide">
                {timelineData.map((item, idx) => {
                  const isActive = idx === activeYearIndex;
                  return (
                    <button
                      key={item.year}
                      onClick={() => setActiveYearIndex(idx)}
                      className={`flex items-center gap-4 py-2 px-3 lg:px-0 transition-all ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      <div className={`hidden lg:flex w-6 h-6 rounded-full items-center justify-center border-2 transition-all shrink-0 ${isActive ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-white/20 bg-[#0b0f19]'}`}>
                        {isActive && <div className="w-2 h-2 rounded-full bg-purple-400"></div>}
                      </div>
                      <span className={`text-xl lg:text-2xl font-bold tracking-tight ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : ''}`}>
                        {item.year}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Canvas */}
            <div className="flex-1 space-y-6">
              
              {/* AI Summary Card */}
              <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-100 pointer-events-none"></div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 relative z-10">
                  <span className="material-symbols-outlined text-[32px] text-purple-400">smart_toy</span>
                  Executive Summary: {activeData.year}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed relative z-10 font-light">
                  <span dangerouslySetInnerHTML={{__html: activeData.summary.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')}} />
                </p>

                {/* Micro Metrics Row */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Events</div>
                    <div className="text-2xl font-bold text-white">{activeData.metrics.rows.toLocaleString()}</div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Aggregated Volume</div>
                    <div className="text-2xl font-bold text-cyan-400">{activeData.metrics.total_volume.toLocaleString()}</div>
                  </div>
                  {activeData.metrics.top_segment && (
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Top Segment</div>
                      <div className="text-lg font-bold text-pink-400 truncate">{activeData.metrics.top_segment}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Visual Card */}
              <div className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent relative overflow-hidden group">
                <div className="bg-[#080b13] rounded-[23px] overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400">bubble_chart</span>
                      Advanced Segment Hierarchy
                    </h3>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">Interactive Model</span>
                  </div>
                  
                  <div className="w-full h-[500px] relative">
                    {activeData.chart ? (
                      <Plot
                        data={activeData.chart.data}
                        layout={{...activeData.chart.layout, autosize: true}}
                        useResizeHandler={true}
                        style={{ width: '100%', height: '100%' }}
                        config={{ displayModeBar: false, responsive: true }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Insufficient variance to render complex hierarchy.
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </>
  );
};

export default Analytics;
