import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setIsLoginModalOpen(true);
    }
  }, [searchParams]);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      {/* TopAppBar */}
      <header className="flex justify-between items-center h-16 px-gutter w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10 text-primary font-title-md text-title-md">
        <div className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform hover:bg-white/5 transition-colors duration-150 p-2 rounded-lg">
          <span className="material-symbols-outlined font-[FILL] text-[24px]">insights</span>
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">VizGen</span>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Features</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Docs</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Pricing</a>
          </nav>
          <div 
            onClick={() => user ? navigate('/dashboard') : setIsLoginModalOpen(true)}
            className="cursor-pointer active:scale-95 transition-transform hover:bg-white/5 transition-colors duration-150 p-2 rounded-full border border-white/10 bg-surface-container-low flex items-center justify-center h-8 w-8 overflow-hidden"
            title={user ? 'Go to Dashboard' : 'Sign In'}
          >
            {user ? (
               <div className="w-full h-full bg-gradient-to-br from-primary to-[#B900FF] flex items-center justify-center text-white font-bold text-xs uppercase">
                 {user.email ? user.email.charAt(0) : 'U'}
               </div>
            ) : (
               <span className="material-symbols-outlined text-[18px]">account_circle</span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="relative w-full min-h-[707px] flex flex-col items-center justify-center px-gutter py-20 overflow-hidden">
          {/* Background Glows */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#4f319c]/20 rounded-full blur-[100px] mix-blend-screen"></div>
            {/* Abstract Dashboard Preview */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 scale-150 blur-sm mask-image:linear-gradient(to_bottom,transparent,black,transparent)">
              <div className="w-full max-w-5xl h-96 border border-white/10 rounded-xl bg-surface-container-low p-4 grid grid-cols-3 gap-4">
                <div className="col-span-2 border border-white/5 rounded-lg h-full"></div>
                <div className="border border-white/5 rounded-lg h-full"></div>
                <div className="border border-white/5 rounded-lg h-32"></div>
                <div className="col-span-2 border border-white/5 rounded-lg h-32"></div>
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 text-center max-w-4xl flex flex-col items-center gap-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-label-caps uppercase tracking-wider backdrop-blur-md">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              <span>AI-Powered Insights</span>
            </div>
            
            <h1 className="font-headline-xl text-headline-xl text-on-surface max-w-3xl leading-tight">
              Understand your data <br />
              <span className="text-primary glow-effect inline-block px-2 rounded">before</span> you visualize it.
            </h1>
            
            <p className="font-body-md text-[18px] text-on-surface-variant max-w-2xl">
              Upload your raw data. VizGen automatically analyzes quality, detects patterns, and recommends the perfect charts with explanatory context. Professional dashboards, zero guesswork.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link to="/upload" className="bg-[#8B5CF6] text-white px-6 py-3 rounded-lg font-title-md text-title-md flex items-center justify-center gap-2 hover:bg-[#7e4ee8] transition-colors shadow-[inset_0_4px_4px_rgba(255,255,255,0.1)] active:scale-95 duration-150 glow-effect">
                <span className="material-symbols-outlined">cloud_upload</span>
                Upload your data
              </Link>
              <button className="bg-transparent border border-white/10 text-on-surface px-6 py-3 rounded-lg font-title-md text-title-md flex items-center justify-center gap-2 hover:bg-white/5 transition-colors active:scale-95 duration-150">
                <span className="material-symbols-outlined">play_circle</span>
                See a live demo
              </button>
            </div>
          </motion.div>
        </section>

        {/* Stats Counter */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          className="w-full max-w-container-max px-gutter py-12 border-y border-white/5 bg-surface/50 backdrop-blur-sm z-10 relative"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col gap-1">
              <span className="font-headline-lg text-headline-lg text-primary">10M+</span>
              <span className="text-label-caps text-on-surface-variant uppercase">Rows Analyzed</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-headline-lg text-headline-lg text-primary">99%</span>
              <span className="text-label-caps text-on-surface-variant uppercase">Accuracy</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-headline-lg text-headline-lg text-primary">50+</span>
              <span className="text-label-caps text-on-surface-variant uppercase">Chart Types</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-headline-lg text-headline-lg text-primary">&lt;1s</span>
              <span className="text-label-caps text-on-surface-variant uppercase">Render Time</span>
            </div>
          </div>
        </motion.section>

        {/* Features Showcase */}
        <section className="w-full max-w-container-max px-gutter py-24 flex flex-col gap-32 z-10 relative">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col lg:flex-row gap-16 items-center"
          >
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Every chart comes with a reason</h2>
              <p className="text-on-surface-variant font-body-md text-[16px]">Stop wondering which visualization to use. VizGen's engine selects the optimal chart type based on data distribution and intent, providing clear, natural-language explanations for its choice.</p>
            </div>
            <div className="flex-1 w-full bg-[#16171A] border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
                <span className="text-primary font-title-md text-[14px]">Insight Generated</span>
              </div>
              <div className="bg-surface-container-low border border-white/5 rounded-lg h-48 w-full flex items-end justify-around p-4">
                <div className="w-8 bg-primary/40 rounded-t-sm h-[40%]"></div>
                <div className="w-8 bg-primary/60 rounded-t-sm h-[70%]"></div>
                <div className="w-8 bg-primary/80 rounded-t-sm h-[90%] glow-effect"></div>
                <div className="w-8 bg-primary/50 rounded-t-sm h-[60%]"></div>
                <div className="w-8 bg-primary/30 rounded-t-sm h-[30%]"></div>
              </div>
              <p className="text-body-sm text-on-surface-variant bg-surface-container p-3 rounded border border-white/5">
                <strong className="text-on-surface">Why a Bar Chart?</strong> The dataset contains categorical variables with significant variance. A bar chart clearly illustrates the primary peak in 'Category C', making the comparative differences immediately obvious.
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col lg:flex-row-reverse gap-16 items-center"
          >
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Know your data quality instantly</h2>
              <p className="text-on-surface-variant font-body-md text-[16px]">Don't build insights on bad foundations. Our pre-flight check assesses null values, outliers, and formatting inconsistencies before a single pixel is drawn.</p>
            </div>
            <div className="flex-1 w-full bg-[#16171A] border border-white/10 rounded-xl p-6 relative flex items-center justify-center min-h-[300px]">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                  <circle className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" cx="50" cy="50" fill="none" r="40" stroke="#8B5CF6" strokeDasharray="251.2" strokeDashoffset="30" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-headline-xl text-headline-xl text-on-surface">88</span>
                  <span className="text-label-caps text-on-surface-variant">Quality Score</span>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-surface-container px-2 py-1 rounded border border-white/5">
                  <span className="material-symbols-outlined text-[16px] text-[#4ade80]">check_circle</span>
                  <span className="text-body-sm text-on-surface-variant">No Nulls</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container px-2 py-1 rounded border border-white/5">
                  <span className="material-symbols-outlined text-[16px] text-[#fbbf24]">warning</span>
                  <span className="text-body-sm text-on-surface-variant">3 Outliers</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Gallery / Bento Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          className="w-full max-w-container-max px-gutter py-16 flex flex-col gap-8 z-10 relative"
        >
          <div className="text-center mb-8">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Visualizations for every scenario</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
            {/* Large Card */}
            <div className="md:col-span-2 md:row-span-2 bg-[#16171A] border border-white/10 rounded-xl p-6 flex flex-col gap-4 group hover:border-primary/50 transition-colors duration-300">
              <h3 className="font-title-md text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">show_chart</span> Time-Series Forecasting</h3>
              <div className="flex-grow bg-surface-container-low rounded border border-white/5 relative overflow-hidden flex items-end p-4 gap-1">
                {/* Abstract Line Chart Simulation */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,80 Q20,60 40,70 T80,40 T100,20 L100,100 L0,100 Z" fill="rgba(139, 92, 246, 0.1)"></path>
                  <path className="drop-shadow-[0_0_4px_rgba(139,92,246,0.8)]" d="M0,80 Q20,60 40,70 T80,40 T100,20" fill="none" stroke="#8B5CF6" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
            {/* Small Card 1 */}
            <div className="bg-[#16171A] border border-white/10 rounded-xl p-4 flex flex-col gap-2 hover:border-primary/30 transition-colors">
              <h3 className="font-title-md text-[14px] text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">bubble_chart</span> Scatter Plot</h3>
              <div className="flex-grow bg-surface-container-low rounded border border-white/5 relative p-2">
                <div className="absolute w-2 h-2 rounded-full bg-primary/60 top-[20%] left-[30%]"></div>
                <div className="absolute w-3 h-3 rounded-full bg-primary/80 top-[40%] left-[60%] glow-effect"></div>
                <div className="absolute w-1.5 h-1.5 rounded-full bg-primary/40 top-[70%] left-[20%]"></div>
                <div className="absolute w-2 h-2 rounded-full bg-primary/50 top-[50%] left-[80%]"></div>
              </div>
            </div>
            {/* Small Card 2 */}
            <div className="bg-[#16171A] border border-white/10 rounded-xl p-4 flex flex-col gap-2 hover:border-primary/30 transition-colors">
              <h3 className="font-title-md text-[14px] text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">grid_view</span> Heatmap</h3>
              <div className="flex-grow bg-surface-container-low rounded border border-white/5 grid grid-cols-4 gap-1 p-1">
                <div className="bg-primary/20 rounded-sm"></div>
                <div className="bg-primary/60 rounded-sm"></div>
                <div className="bg-primary/10 rounded-sm"></div>
                <div className="bg-primary/80 rounded-sm glow-effect"></div>
                <div className="bg-primary/40 rounded-sm"></div>
                <div className="bg-primary/30 rounded-sm"></div>
                <div className="bg-primary/90 rounded-sm"></div>
                <div className="bg-primary/20 rounded-sm"></div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="mt-auto border-t border-white/5 bg-surface-container-lowest py-8 px-gutter flex flex-col items-center justify-center gap-4 z-10 relative">
        <div className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
          <span className="material-symbols-outlined text-[20px]">code</span>
          <span className="font-body-sm">View on GitHub</span>
        </div>
        <p className="text-body-sm text-on-surface-variant/60">
          © 2024 VizGen Inc. Designed for data professionals.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
