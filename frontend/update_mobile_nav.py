import re

files_to_update = ['src/pages/Dashboard.jsx', 'src/pages/UploadData.jsx', 'src/pages/DataQuality.jsx']

mobile_navbar_replacement = """      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 pb-safe lg:hidden bg-surface-container-highest rounded-t-xl border-t border-white/10 backdrop-blur-lg shadow-2xl shadow-primary/20">
        <Link to="/dashboard" className={`flex flex-col items-center justify-center transition-all duration-150 w-full h-full font-label-caps text-label-caps ${currentPath === '/dashboard' ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}>
          <span className="material-symbols-outlined mb-1" style={currentPath === '/dashboard' ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
          Home
        </Link>
        <Link to="/analytics" className={`flex flex-col items-center justify-center transition-all duration-150 w-full h-full font-label-caps text-label-caps ${currentPath === '/analytics' ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}>
          <span className="material-symbols-outlined mb-1" style={currentPath === '/analytics' ? { fontVariationSettings: "'FILL' 1" } : {}}>query_stats</span>
          Charts
        </Link>
        <Link to="/upload" className={`flex flex-col items-center justify-center transition-all duration-150 w-full h-full font-label-caps text-label-caps ${currentPath === '/upload' ? 'text-primary relative' : 'text-on-surface-variant opacity-60'}`}>
          {currentPath === '/upload' && <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full"></div>}
          <span className="material-symbols-outlined mb-1" style={currentPath === '/upload' ? { fontVariationSettings: "'FILL' 1" } : {}}>cloud_upload</span>
          Upload
        </Link>
        <Link to="/profile" className={`flex flex-col items-center justify-center transition-all duration-150 w-full h-full font-label-caps text-label-caps ${currentPath === '/profile' ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}>
          <span className="material-symbols-outlined mb-1" style={currentPath === '/profile' ? { fontVariationSettings: "'FILL' 1" } : {}}>account_circle</span>
          Profile
        </Link>
      </nav>"""

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to replace the entire <nav className="fixed bottom-0 ..."> block
    content = re.sub(
        r'<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16.*?</nav>',
        mobile_navbar_replacement,
        content,
        flags=re.DOTALL
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")
