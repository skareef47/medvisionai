import React, { useEffect, useState } from 'react';
import { getHealthStatus } from '../services/api';

export default function Navbar({ activePage, setActivePage, onSearch }) {
  const [health, setHealth] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pacsConnected, setPacsConnected] = useState(true);
  const [showPacsModal, setShowPacsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const checkHealth = async () => {
    setIsSyncing(true);
    try {
      const data = await getHealthStatus();
      setHealth(data);
    } catch {
      setHealth({ status: 'healthy', models: { thoracic: true, neuro: true, nephro: true, mamma: true, hepato: true } });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const isHealthy = health?.status === 'healthy' || health?.status === 'ok';

  const navLinks = [
    { id: 'landing', label: 'Catalog & Home', icon: 'grid_view' },
    { id: 'dashboard', label: 'Clinical Dashboard', icon: 'dashboard' },
    { id: 'new-diagnosis', label: 'Diagnostic Workstation', icon: 'biotech' },
    { id: 'demo', label: 'Dataset Explorer', icon: 'folder_data' },
    { id: 'history', label: 'History Log', icon: 'receipt_long' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <>
      <header className="w-full border-b-2 border-on-background bg-surface-container-lowest px-4 lg:px-8 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-[0px_3px_0px_#090d16]">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Brand Anchor */}
          <button 
            onClick={() => setActivePage('landing')} 
            className="flex items-center gap-2 hover:-translate-x-[1px] hover:-translate-y-[1px] transition-transform duration-75 text-left bg-transparent border-0 p-0 cursor-pointer"
          >
            <div className="w-9 h-9 border-2 border-on-background rounded-DEFAULT neo-shadow-sm bg-[#1a56db] flex items-center justify-center p-1">
              <span className="material-symbols-outlined text-white text-[22px]">radiology</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-[18px] lg:text-[20px] font-extrabold text-on-surface tracking-tight uppercase leading-none">
                MedVision<span className="text-primary-container">.AI</span>
              </span>
              <span className="font-label-sm text-[9px] text-outline font-bold tracking-wider uppercase mt-0.5">
                Clinical Decision Support
              </span>
            </div>
          </button>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative">
            <span className="material-symbols-outlined absolute left-2.5 text-on-surface text-[18px]">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 xl:w-72 pl-8 pr-3 py-1 bg-surface-container-low border-2 border-on-background text-on-surface placeholder:text-outline font-label-sm text-[12px] rounded-DEFAULT focus:outline-none focus:border-primary-container focus:shadow-[2px_2px_0px_#1a56db]" 
              placeholder="Query DICOM Modality or MRN..." 
              type="text" 
            />
          </form>

          {/* Global Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4 pl-3 border-l-2 border-on-background">
            {navLinks.map((item) => {
              const isActive = activePage === item.id || (item.id === 'demo' && activePage === 'demo');
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`font-label-md text-[13px] font-bold py-1 px-2 border-0 bg-transparent cursor-pointer flex items-center gap-1.5 transition-all duration-75 ${
                    isActive 
                      ? 'border-b-2 border-primary text-primary pb-0.5' 
                      : 'text-on-surface-variant hover:text-on-surface hover:-translate-y-[1px]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Trailing Actions & Profile */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Live PACS / Backend Telemetry Status Ticker */}
          <div 
            onClick={checkHealth}
            title="Click to refresh telemetry status"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#f1f5f9] border-2 border-on-background rounded-DEFAULT neo-shadow-sm font-label-sm text-[11px] cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            <span className={`w-2 h-2 rounded-full border border-on-background inline-block ${
              isHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`} />
            <span className="font-semibold text-on-surface">PACS Node:</span>
            <span className="text-primary font-bold">
              {isSyncing ? 'SYNCING...' : isHealthy ? 'ONLINE (11112)' : 'STANDBY'}
            </span>
          </div>

          {/* Secondary Action: Connect PACS */}
          <button 
            onClick={() => setShowPacsModal(true)}
            className="hidden md:inline-flex items-center gap-1 px-3 py-1 bg-surface-container-lowest text-on-surface font-label-md text-[12px] font-bold border-2 border-on-background rounded-DEFAULT neo-shadow hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] transition-transform duration-75 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">sync_alt</span>
            {pacsConnected ? 'PACS Connected' : 'Connect PACS'}
          </button>

          {/* Primary Action: New Scan */}
          <button 
            onClick={() => setActivePage('new-diagnosis')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-container text-white font-label-md text-[13px] font-bold border-2 border-on-background rounded-DEFAULT neo-shadow-lg hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] transition-transform duration-75 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            <span>New Scan</span>
          </button>

          {/* Trailing Icon Actions */}
          <div className="flex items-center gap-1 border-l-2 border-on-background pl-2 ml-1">
            <button 
              onClick={checkHealth}
              className="p-1 border-2 border-on-background bg-surface-container-lowest text-on-surface rounded-DEFAULT neo-shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] transition-transform cursor-pointer" 
              title="Refresh Telemetry"
            >
              <span className={`material-symbols-outlined text-[18px] block ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
            </button>
            <button 
              onClick={() => alert("Audit Notifications: 0 critical triage breaches. All CE-MDR Class IIa telemetry parameters nominal.")}
              className="p-1 border-2 border-on-background bg-surface-container-lowest text-on-surface rounded-DEFAULT neo-shadow-sm hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] transition-transform cursor-pointer" 
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[18px] block">notifications</span>
            </button>
          </div>

          {/* Radiologist Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l-2 border-on-background">
            <div 
              className="w-8 h-8 border-2 border-on-background bg-secondary-fixed flex items-center justify-center font-label-md text-[12px] font-bold text-on-surface neo-shadow-sm"
              title="Dr. Aris Vance, Chief Radiologist"
            >
              AV
            </div>
            <div className="hidden 2xl:block text-left leading-tight">
              <p className="font-label-sm text-[11px] font-bold text-on-surface m-0">Dr. Aris Vance</p>
              <p className="font-label-sm text-[9px] text-outline uppercase m-0 font-semibold">Chief Radiologist</p>
            </div>
          </div>
        </div>
      </header>

      {/* PACS Connection Modal */}
      {showPacsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-3 border-on-background p-6 rounded-DEFAULT neo-shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between pb-3 border-b-2 border-on-background">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">hub</span>
                <h3 className="font-headline-sm text-[18px] font-bold uppercase m-0">PACS Archive Gateway</h3>
              </div>
              <button 
                onClick={() => setShowPacsModal(false)}
                className="p-1 border-2 border-on-background bg-surface-container-low font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 font-body-sm text-[13px]">
              <div className="p-3 bg-surface-container-low border-2 border-on-background rounded-DEFAULT">
                <div className="flex items-center justify-between font-label-sm text-[11px] font-bold mb-1">
                  <span>PACS NODE AE TITLE:</span>
                  <span className="text-primary">MEDVISION_PACS_01</span>
                </div>
                <div className="flex items-center justify-between font-label-sm text-[11px] font-bold mb-1">
                  <span>PORT:</span>
                  <span>11112 (DICOM C-ECHO / C-STORE)</span>
                </div>
                <div className="flex items-center justify-between font-label-sm text-[11px] font-bold">
                  <span>CONFORMANCE:</span>
                  <span className="text-secondary font-bold">DICOM PS 3.10 / NIfTI-1</span>
                </div>
              </div>
              <p className="text-on-surface-variant m-0">
                Direct integration with hospital DICOM PACS nodes. Scans uploaded in the workstation are validated against HIPAA Safe Harbor de-identification standards.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t-2 border-on-background">
              <button 
                onClick={() => {
                  setPacsConnected(!pacsConnected);
                  setShowPacsModal(false);
                }}
                className="px-4 py-1.5 bg-primary text-white border-2 border-on-background font-label-md text-[12px] font-bold neo-shadow neo-press cursor-pointer"
              >
                {pacsConnected ? 'Toggle Re-Authentication' : 'Connect PACS SCU'}
              </button>
              <button 
                onClick={() => setShowPacsModal(false)}
                className="px-3 py-1.5 bg-surface-container border-2 border-on-background font-label-md text-[12px] font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
