import re

files_to_update = ['src/pages/UploadData.jsx', 'src/pages/DataQuality.jsx']

sidebar_replacement = """          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === '/dashboard' ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
            <span className="material-symbols-outlined" style={currentPath === '/dashboard' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
            <span className="font-title-md text-title-md font-medium">Dashboard</span>
          </Link>
          <Link to="/analytics" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === '/analytics' ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
            <span className="material-symbols-outlined" style={currentPath === '/analytics' ? { fontVariationSettings: "'FILL' 1" } : {}}>bar_chart</span>
            <span className="font-title-md text-title-md font-medium">Analytics</span>
          </Link>
          <Link to="/upload" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === '/upload' ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
            <span className="material-symbols-outlined" style={currentPath === '/upload' ? { fontVariationSettings: "'FILL' 1" } : {}}>database</span>
            <span className="font-title-md text-title-md font-medium">Data Sources</span>
          </Link>
          <Link to="/reports" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === '/reports' ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
            <span className="material-symbols-outlined" style={currentPath === '/reports' ? { fontVariationSettings: "'FILL' 1" } : {}}>description</span>
            <span className="font-title-md text-title-md font-medium">Reports</span>
          </Link>
          <Link to="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === '/settings' ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
            <span className="material-symbols-outlined" style={currentPath === '/settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
            <span className="font-title-md text-title-md font-medium">Settings</span>
          </Link>"""

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'useLocation' not in content:
        if 'import { useState, useEffect }' in content:
             content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { useLocation } from 'react-router-dom';")
        elif "import { useState } from 'react';" in content:
             content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useLocation } from 'react-router-dom';")
        else:
             content = content.replace("import { Link", "import { Link, useLocation")

    if 'const location = useLocation();' not in content:
        func_name = filepath.split('/')[-1].replace('.jsx', '')
        content = content.replace(f"function {func_name}() {{", f"function {func_name}() {{\n  const location = useLocation();\n  const currentPath = location.pathname;")

    # We need to replace the inner children of <div className="flex flex-col gap-2 px-3">
    content = re.sub(
        r'<div className="flex flex-col gap-2 px-3">.*?</div>',
        f'<div className="flex flex-col gap-2 px-3">\n{sidebar_replacement}\n          </div>',
        content,
        flags=re.DOTALL
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")
