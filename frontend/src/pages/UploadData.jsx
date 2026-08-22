import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

function UploadData() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const uploadFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
      const data = await response.json();
      navigate('/data-quality', { state: { data: data } });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container antialiased">
      {/* TopAppBar */}
      <header className="flex justify-between items-center h-16 px-gutter w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform">insights</span>
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">VizGen</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-white/5 transition-colors duration-150 active:scale-95">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 w-full max-w-[1440px] mx-auto relative">
        {/* NavigationDrawer (Desktop) */}
        <nav className="hidden lg:flex flex-col gap-unit pt-16 bg-surface-container-low h-full w-60 fixed left-0 top-0 border-r border-white/10 z-40">
          <div className="px-6 mb-8 pt-4">
            <span className="font-headline-lg text-headline-lg font-bold text-primary">VizGen AI</span>
          </div>
          <div className="flex flex-col gap-2 px-3">
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 ease-in-out ${currentPath === '/dashboard' ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
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
          </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-60 p-margin-mobile md:p-margin-desktop min-h-screen relative overflow-hidden flex flex-col">
          {/* Atmospheric Gradient Background */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-inverse-primary/20 blur-[100px]"></div>
          </div>
          
          {/* Content Canvas */}
          <div className="relative z-10 max-w-container-max mx-auto w-full flex-1 flex flex-col h-full pt-8 md:pt-16">
            <div className="text-center mb-12">
              <h1 className="font-headline-xl text-headline-xl mb-4 text-on-surface tracking-tight">Connect your data</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                Upload your datasets to automatically generate intelligent visualizations and insights. Secure, fast, and processed entirely within your workspace.
              </p>
            </div>
            
            {/* Upload Zone */}
            <div 
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-8 bg-[#16171A] rounded-[24px] border border-white/10 shadow-2xl relative group transition-all duration-300"
              style={{
                backgroundColor: isDragging ? 'rgba(139, 92, 246, 0.05)' : '',
              }}
            >
              <div 
                className="upload-zone absolute inset-4 border-2 border-dashed border-outline-variant rounded-[16px] transition-all duration-300 pointer-events-none"
                style={{
                  borderColor: isDragging ? 'rgba(139, 92, 246, 1)' : '',
                  boxShadow: isDragging ? '0 0 30px rgba(139, 92, 246, 0.3)' : ''
                }}
              ></div>
              <div className="relative z-20 flex flex-col items-center text-center p-12">
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin mb-4"></div>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2 tracking-tight">Analyzing Data...</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">Extracting schema and generating intelligent insights.</p>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon w-24 h-24 mb-8 rounded-full bg-surface-container flex items-center justify-center border border-white/5 relative hover:animate-pulse">
                      <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl"></div>
                      <span className="material-symbols-outlined text-5xl text-primary relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2 tracking-tight">Drag and drop files</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-8">CSV, XLSX, JSON, TSV supported</p>
                    {error && (
                      <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-lg text-error font-body-sm max-w-md break-words">
                        {error}
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <label className="cursor-pointer px-8 py-3 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white rounded-lg font-title-md text-title-md shadow-[inset_0_4px_4px_rgba(255,255,255,0.1)] transition-all duration-150 active:scale-95 flex items-center gap-2 relative overflow-hidden group">
                        <span className="material-symbols-outlined text-xl">upload_file</span>
                        Browse Files
                        <input type="file" className="hidden" accept=".csv,.xlsx,.json,.tsv" onChange={handleFileSelect} />
                      </label>
                      <span className="text-on-surface-variant font-body-sm text-body-sm px-2">or</span>
                      <button className="px-6 py-3 bg-transparent border border-white/10 hover:bg-white/5 text-on-surface rounded-lg font-title-md text-title-md transition-all duration-150 active:scale-95 flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl">dataset</span>
                        Try with sample dataset
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Footer Info */}
            <div className="mt-auto pt-16 pb-8 text-center flex justify-center items-center gap-2 text-on-surface-variant/60">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="font-label-caps text-label-caps tracking-widest">End-to-end encrypted storage</span>
            </div>
          </div>
        </main>
      </div>

      {/* BottomNavBar (Mobile) */}
            <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 pb-safe lg:hidden bg-surface-container-highest rounded-t-xl border-t border-white/10 backdrop-blur-lg shadow-2xl shadow-primary/20">
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
      </nav>
    </div>
  );
}

export default UploadData;
