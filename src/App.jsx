import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import NewDiagnosis from './pages/NewDiagnosis';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import DemoDashboard from './pages/DemoDashboard';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Clinical Workstation UI caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto my-12 p-8 text-center bg-surface-container-lowest border-3 border-on-background neo-shadow-xl rounded-DEFAULT">
          <div className="w-14 h-14 rounded-DEFAULT bg-red-100 border-2 border-on-background inline-flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-red-600 text-[28px]">warning</span>
          </div>
          <h2 className="font-headline-md text-[20px] font-bold m-0 mb-2 uppercase text-on-surface">
            Clinical Interface Notice
          </h2>
          <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed mb-6">
            An unexpected error occurred while rendering the clinical view. You can safely return to the diagnostic workstation or reset to the main dashboard.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="px-5 py-2.5 bg-primary text-white font-label-md text-[13px] font-bold uppercase border-2 border-on-background neo-shadow hover:-translate-x-[1px] hover:-translate-y-[1px] cursor-pointer"
          >
            Reset to Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const getInitialPage = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/demo' || hash === '#/demo' || hash === '#demo') return 'demo';
      if (path === '/dashboard' || hash === '#/dashboard') return 'dashboard';
      if (path === '/new-diagnosis' || hash === '#/new-diagnosis') return 'new-diagnosis';
      if (path === '/history' || hash === '#/history') return 'history';
      if (path === '/results' || hash === '#/results') return 'results';
    }
    return 'landing';
  };

  const [activePage, setActivePage] = useState(getInitialPage);
  const [selectedCancerModule, setSelectedCancerModule] = useState('lung');
  const [selectedScanUrl, setSelectedScanUrl] = useState(null);
  const [selectedScanName, setSelectedScanName] = useState(null);
  const [currentDiagnosisResult, setCurrentDiagnosisResult] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setActivePage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    try {
      const targetUrl = pageId === 'demo' ? '/demo' : (pageId === 'landing' ? '/' : `/${pageId}`);
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ page: pageId }, '', targetUrl);
      }
    } catch {
      // Ignore in non-standard history environments
    }
  };

  const handleSelectModule = (moduleId, scanUrl = null, scanName = null) => {
    setSelectedCancerModule(moduleId);
    setSelectedScanUrl(scanUrl);
    setSelectedScanName(scanName);
    handleNavigate('new-diagnosis');
  };

  const handleDiagnosisComplete = (resultData) => {
    setCurrentDiagnosisResult(resultData);
    handleNavigate('results');
  };

  const handleViewDiagnosisFromHistory = (resultData) => {
    setCurrentDiagnosisResult(resultData);
    handleNavigate('results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#181b25] selection:bg-[#50d9fe] selection:text-[#001f27]">
      {/* Top Application Bar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={handleNavigate}
        onSearch={(query) => {
          handleNavigate('history');
        }}
      />

      {/* Main Content Area */}
      <main className="grow flex flex-col">
        <ErrorBoundary onReset={() => handleNavigate('dashboard')}>
          {activePage === 'landing' && (
            <LandingPage 
              onSelectModule={handleSelectModule} 
              onOpenDemo={() => handleNavigate('demo')} 
            />
          )}

          {activePage === 'demo' && (
            <DemoDashboard
              onSelectModule={handleSelectModule}
              onViewDiagnosis={handleViewDiagnosisFromHistory}
            />
          )}

          {activePage === 'dashboard' && (
            <Dashboard 
              onSelectModule={handleSelectModule} 
              onViewDiagnosis={handleViewDiagnosisFromHistory}
            />
          )}

          {activePage === 'new-diagnosis' && (
            <NewDiagnosis 
              initialCancerType={selectedCancerModule} 
              initialScanUrl={selectedScanUrl}
              initialScanName={selectedScanName}
              onDiagnosisComplete={handleDiagnosisComplete} 
            />
          )}

          {activePage === 'results' && (
            <ResultsPage 
              diagnosis={currentDiagnosisResult} 
              onNewAnalysis={() => handleNavigate('new-diagnosis')}
              onBackToHistory={() => handleNavigate('history')}
            />
          )}

          {activePage === 'history' && (
            <HistoryPage onViewDiagnosis={handleViewDiagnosisFromHistory} />
          )}
        </ErrorBoundary>
      </main>

      {/* Shared Institutional Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
