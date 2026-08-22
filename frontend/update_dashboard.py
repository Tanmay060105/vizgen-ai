import re

with open('src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update side navbar using useLocation
content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useLocation } from 'react-router-dom';")

# Inside Dashboard, add useLocation hook
content = content.replace("function Dashboard() {", "function Dashboard() {\n  const location = useLocation();\n  const currentPath = location.pathname;")

# Manual replacement for sidebar
sidebar_replacement = """          {/* Active Tab: Dashboard */}
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === '/dashboard' ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
            <span className="material-symbols-outlined" style={currentPath === '/dashboard' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
            <span className="font-body-md text-body-md font-medium">Dashboard</span>
          </Link>
          <Link to="/analytics" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === '/analytics' ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
            <span className="material-symbols-outlined" style={currentPath === '/analytics' ? { fontVariationSettings: "'FILL' 1" } : {}}>bar_chart</span>
            <span className="font-body-md text-body-md font-medium">Analytics</span>
          </Link>
          <Link to="/upload" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === '/upload' ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
            <span className="material-symbols-outlined" style={currentPath === '/upload' ? { fontVariationSettings: "'FILL' 1" } : {}}>database</span>
            <span className="font-body-md text-body-md font-medium">Data Sources</span>
          </Link>
          <Link to="/reports" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === '/reports' ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
            <span className="material-symbols-outlined" style={currentPath === '/reports' ? { fontVariationSettings: "'FILL' 1" } : {}}>description</span>
            <span className="font-body-md text-body-md font-medium">Reports</span>
          </Link>
          <Link to="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === '/settings' ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
            <span className="material-symbols-outlined" style={currentPath === '/settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
            <span className="font-body-md text-body-md font-medium">Settings</span>
          </Link>"""

content = re.sub(
    r'<nav className="flex-1 px-4 space-y-1">.*?</nav>',
    f'<nav className="flex-1 px-4 space-y-1">\n{sidebar_replacement}\n        </nav>',
    content,
    flags=re.DOTALL
)

content = content.replace("const [showInfo, setShowInfo] = useState(false);\n", "")

content = content.replace("""                <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100" title="View Details">
                  <span className="material-symbols-outlined">info</span>
                </button>
              </div>""", """                <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100" title="View Details">
                  <span className="material-symbols-outlined">info</span>
                </button>
                {/* Info Popover (Hover) */}
                <div className="absolute top-12 right-4 w-64 bg-[#1F2124] border border-white/10 rounded-lg p-3 z-10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#4ad66d] text-sm">verified</span>
                    <span className="font-label-caps text-label-caps text-[#4ad66d]">High Confidence (98%)</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">ARR is growing steadily over the past quarter.</p>
                  <button className="text-primary font-body-sm text-body-sm hover:underline">View Source Data</button>
                </div>
              </div>""")

content = content.replace("""                <button className="text-on-surface-variant hover:text-primary transition-colors" onClick={() => setShowInfo(!showInfo)}>
                  <span className="material-symbols-outlined">info</span>
                </button>
                {/* Info Popover (Layer 2) */}
                {showInfo && (
                  <div className="absolute top-12 right-4 w-64 bg-[#1F2124] border border-white/10 rounded-lg p-3 z-10 shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[#4ad66d] text-sm">verified</span>
                      <span className="font-label-caps text-label-caps text-[#4ad66d]">High Confidence (94%)</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">NA region shows unexpected growth driven by enterprise segment.</p>
                    <button className="text-primary font-body-sm text-body-sm hover:underline">View Source Data</button>
                  </div>
                )}
              </div>""", """                <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">info</span>
                </button>
                {/* Info Popover (Layer 2) */}
                <div className="absolute top-12 right-4 w-64 bg-[#1F2124] border border-white/10 rounded-lg p-3 z-10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#4ad66d] text-sm">verified</span>
                    <span className="font-label-caps text-label-caps text-[#4ad66d]">High Confidence (94%)</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">NA region shows unexpected growth driven by enterprise segment.</p>
                  <button className="text-primary font-body-sm text-body-sm hover:underline">View Source Data</button>
                </div>
              </div>""")

content = content.replace("""                <h4 className="font-title-md text-title-md font-medium text-on-surface">Customer LTV vs CAC</h4>
                <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">info</span>
                </button>
              </div>""", """                <h4 className="font-title-md text-title-md font-medium text-on-surface">Customer LTV vs CAC</h4>
                <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">info</span>
                </button>
                {/* Info Popover */}
                <div className="absolute top-12 right-4 w-64 bg-[#1F2124] border border-white/10 rounded-lg p-3 z-10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#4ad66d] text-sm">verified</span>
                    <span className="font-label-caps text-label-caps text-[#4ad66d]">High Confidence (89%)</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">Clear positive correlation between acquisition cost and lifetime value.</p>
                  <button className="text-primary font-body-sm text-body-sm hover:underline">View Source Data</button>
                </div>
              </div>""")

content = content.replace("""                <h4 className="font-title-md text-title-md font-medium text-on-surface">Activity Matrix</h4>
                <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">info</span>
                </button>
              </div>""", """                <h4 className="font-title-md text-title-md font-medium text-on-surface">Activity Matrix</h4>
                <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">info</span>
                </button>
                {/* Info Popover */}
                <div className="absolute top-12 right-4 w-64 bg-[#1F2124] border border-white/10 rounded-lg p-3 z-10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-sm">lightbulb</span>
                    <span className="font-label-caps text-label-caps text-primary">Insight</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">Peak activity occurs mid-week during afternoon hours.</p>
                  <button className="text-primary font-body-sm text-body-sm hover:underline">View Source Data</button>
                </div>
              </div>""")

content = content.replace("""                <h4 className="font-title-md text-title-md font-medium text-on-surface">Top Anomalies</h4>
                <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">info</span>
                </button>
              </div>""", """                <h4 className="font-title-md text-title-md font-medium text-on-surface">Top Anomalies</h4>
                <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">info</span>
                </button>
                {/* Info Popover */}
                <div className="absolute top-12 right-4 w-64 bg-[#1F2124] border border-white/10 rounded-lg p-3 z-10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-error text-sm">warning</span>
                    <span className="font-label-caps text-label-caps text-error">Alert</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">Anomalies detected using Isolation Forest algorithm.</p>
                  <button className="text-primary font-body-sm text-body-sm hover:underline">View Source Data</button>
                </div>
              </div>""")

content = content.replace("""                <h4 className="font-title-md text-title-md font-medium text-on-surface">User Session Duration</h4>
                <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">info</span>
                </button>
              </div>""", """                <h4 className="font-title-md text-title-md font-medium text-on-surface">User Session Duration</h4>
                <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">info</span>
                </button>
                {/* Info Popover */}
                <div className="absolute top-12 right-4 w-64 bg-[#1F2124] border border-white/10 rounded-lg p-3 z-10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#4ad66d] text-sm">verified</span>
                    <span className="font-label-caps text-label-caps text-[#4ad66d]">Normal Distribution</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">Session durations are right-skewed with a median of 4.2 minutes.</p>
                  <button className="text-primary font-body-sm text-body-sm hover:underline">View Source Data</button>
                </div>
              </div>""")

with open('src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Dashboard.jsx")
