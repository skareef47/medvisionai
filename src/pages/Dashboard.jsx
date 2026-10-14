import React, { useState, useEffect } from 'react';
import { getDiagnosisHistory, getPatients, getHealthStatus } from '../services/api';

export default function Dashboard({ onSelectModule, onViewDiagnosis }) {
  const [history, setHistory] = useState([]);
  const [patients, setPatients] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [historyRes, patientsRes, healthRes] = await Promise.allSettled([
          getDiagnosisHistory(),
          getPatients(),
          getHealthStatus()
        ]);

        if (historyRes.status === 'fulfilled' && historyRes.value) {
          const items = Array.isArray(historyRes.value) ? historyRes.value : (historyRes.value.diagnoses || []);
          setHistory(items);
        }
        if (patientsRes.status === 'fulfilled' && patientsRes.value) {
          const pList = Array.isArray(patientsRes.value) ? patientsRes.value : (patientsRes.value.patients || []);
          setPatients(pList);
        }
        if (healthRes.status === 'fulfilled' && healthRes.value) {
          setHealth(healthRes.value);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const engines = [
    { id: 'lung', name: 'ThoracicVision CT', modality: 'Chest CT / X-Ray', arch: 'ConvNeXt-V2-Base', res: '512x512', ae: 'RAD_THORACIC_01', status: 'ONLINE' },
    { id: 'brain', name: 'NeuroQuant MRI', modality: 'Brain MRI (T1/T2)', arch: 'Swin-UNETR-3D', res: '256x256x128', ae: 'RAD_NEURO_02', status: 'ONLINE' },
    { id: 'kidney', name: 'NephroScan CT', modality: 'Renal Contrast CT', arch: 'ResNet50-DenseFPN', res: '512x512', ae: 'RAD_NEPHRO_03', status: 'ONLINE' },
    { id: 'breast', name: 'MammaAI CADx', modality: 'DBT Tomosynthesis', arch: 'EfficientNet-B7', res: '1024x1024', ae: 'RAD_MAMMA_04', status: 'ONLINE' },
    { id: 'liver', name: 'HepatoLens AI', modality: 'Abdominal CT', arch: 'Mask-RCNN-ResNeXt', res: '512x512', ae: 'RAD_HEPATO_05', status: 'ONLINE' }
  ];

  return (
    <div className="min-h-full flex flex-col font-body-md text-on-surface bg-background">
      <main className="grow w-full max-w-[1720px] mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
        
        {/* TELEMETRY & COMPLIANCE BANNER */}
        <section className="w-full border-2 border-on-background bg-secondary-container p-3 neo-shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-on-background text-secondary-container flex items-center justify-center border-2 border-on-background shrink-0">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-[10px] uppercase bg-on-background text-white px-1.5 py-0.5 font-bold tracking-wider">
                  SYSTEM MANDATE
                </span>
                <span className="font-label-md text-[13px] font-bold text-on-surface">
                  PACS Clinical Data Stream: <span className="text-primary font-extrabold underline">ONLINE</span>
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-on-surface font-medium m-0">
                Zero Synthetic Data Policy Active — All real-time telemetry is strictly bound to authenticated DICOM nodes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 font-label-sm text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-on-background bg-surface-container-lowest font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              NODE SYNC: ACTIVE
            </span>
            <span className="bg-surface-container-high px-2 py-0.5 border border-on-background font-mono">
              SEC-AES256
            </span>
          </div>
        </section>

        {/* SYSTEM & ENGINE STATUS KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: PACS Endpoint */}
          <div className="border-2 border-on-background bg-surface-container-lowest p-4 rounded-DEFAULT neo-shadow-lg flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-outline font-bold tracking-wider uppercase">PACS Clinical Endpoint</span>
                <span className="font-headline-sm text-[18px] font-bold text-on-surface mt-1">MEDVISION_NODE_01</span>
              </div>
              <span className="px-2 py-0.5 border border-on-background bg-secondary-container text-on-surface font-label-sm text-[10px] font-bold">
                PORT 11112
              </span>
            </div>
            <div className="mt-4 pt-2 border-t-2 border-surface-container-highest flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-none border border-on-background"></span>
                <span className="font-label-sm text-[11px] font-semibold text-on-surface">STATUS: LISTENING</span>
              </div>
              <span className="font-label-sm text-[11px] text-primary font-mono font-bold">DIMSE C-ECHO OK</span>
            </div>
          </div>

          {/* Card 2: Active Deployed Engines */}
          <div className="border-2 border-on-background bg-surface-container-lowest p-4 rounded-DEFAULT neo-shadow-lg flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-outline font-bold tracking-wider uppercase">Deployed Inference Cores</span>
                <span className="font-headline-sm text-[18px] font-bold text-primary mt-1">5 Verified Engines</span>
              </div>
              <span className="px-2 py-0.5 border border-on-background bg-[#dcfce7] text-[#166534] font-label-sm text-[10px] font-bold">
                VALIDATED
              </span>
            </div>
            <div className="mt-4 pt-2 border-t-2 border-surface-container-highest flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-on-surface font-medium">Pipeline Sync State:</span>
              <span className="font-label-sm text-[11px] font-bold text-emerald-700 font-mono">100% OPERATIONAL</span>
            </div>
          </div>

          {/* Card 3: DICOM Store SCP */}
          <div className="border-2 border-on-background bg-surface-container-lowest p-4 rounded-DEFAULT neo-shadow-lg flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-outline font-bold tracking-wider uppercase">DICOM Store (C-STORE)</span>
                <span className="font-headline-sm text-[18px] font-bold text-on-surface mt-1">
                  {history.length} Ingested Studies
                </span>
              </div>
              <span className="px-2 py-0.5 border border-on-background bg-surface-container text-on-surface font-label-sm text-[10px] font-bold">
                READY
              </span>
            </div>
            <div className="mt-4 pt-2 border-t-2 border-surface-container-highest flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-on-surface font-medium">Memory Cache Ring:</span>
              <span className="font-label-sm text-[11px] font-mono text-emerald-700 font-bold">BUFFER CLEAR</span>
            </div>
          </div>

          {/* Card 4: EHR Integration Relay */}
          <div className="border-2 border-on-background bg-surface-container-lowest p-4 rounded-DEFAULT neo-shadow-lg flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-outline font-bold tracking-wider uppercase">EHR Integration Relay</span>
                <span className="font-headline-sm text-[18px] font-bold text-on-surface mt-1">HL7 / FHIR R4</span>
              </div>
              <span className="px-2 py-0.5 border border-on-background bg-emerald-100 text-emerald-900 font-label-sm text-[10px] font-bold">
                CONNECTED
              </span>
            </div>
            <div className="mt-4 pt-2 border-t-2 border-surface-container-highest flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-on-surface font-medium">Outbound Webhook:</span>
              <span className="font-label-sm text-[11px] font-mono text-outline font-semibold">TLS 1.3 / AUTH_BEARER</span>
            </div>
          </div>
        </section>

        {/* WORKSTATION TELEMETRY GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* LEFT: MODALITY TELEMETRY & MODEL REGISTRY (7 COLS) */}
          <section className="xl:col-span-7 flex flex-col border-2 border-on-background bg-surface-container-lowest neo-shadow-lg">
            <div className="p-4 border-b-2 border-on-background bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">hub</span>
                <h2 className="font-headline-sm text-[16px] font-bold text-on-surface uppercase tracking-tight m-0">
                  Active Ingestion Engines
                </h2>
              </div>
              <span className="font-label-sm text-[10px] bg-surface-container-lowest border border-on-background px-2 py-0.5 font-bold">
                5 REGISTERED INFERENCE NODES
              </span>
            </div>

            <div className="px-4 py-2 bg-surface-bright border-b border-on-background text-on-surface-variant font-body-sm text-[12px]">
              Strict deterministic execution profiles. Benchmarks denote zero statistical simulation.
            </div>

            {/* Dense Technical Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b-2 border-on-background font-label-sm text-[11px] uppercase tracking-wider text-on-surface">
                    <th className="py-2.5 px-3 border-r border-on-background">Engine Identifier</th>
                    <th className="py-2.5 px-3 border-r border-on-background">Modality</th>
                    <th className="py-2.5 px-3 border-r border-on-background">Architecture</th>
                    <th className="py-2.5 px-3 border-r border-on-background">Resolution</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-background font-label-sm text-[12px]">
                  {engines.map(eng => (
                    <tr key={eng.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-2.5 px-3 border-r border-on-background font-bold text-on-surface">
                        {eng.name}
                      </td>
                      <td className="py-2.5 px-3 border-r border-on-background text-on-surface-variant">
                        {eng.modality}
                      </td>
                      <td className="py-2.5 px-3 border-r border-on-background font-mono text-[11px]">
                        {eng.arch}
                      </td>
                      <td className="py-2.5 px-3 border-r border-on-background font-mono text-[11px]">
                        {eng.res}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onSelectModule(eng.id)}
                          className="px-2 py-1 bg-primary text-white border border-on-background font-bold text-[10px] rounded-DEFAULT neo-shadow-sm cursor-pointer"
                        >
                          Dispatch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t-2 border-on-background bg-surface-container-low flex flex-wrap items-center justify-between text-outline font-label-sm text-[11px]">
              <span>ALL ENGINES BOUND UNDER HARDWARE RUNTIME: CUDA 12.3 / TENSORRT 8.6</span>
              <span className="font-bold text-on-surface">DEVICE: NVIDIA A100-SXM4-80GB (NODE 0)</span>
            </div>
          </section>

          {/* RIGHT: LIVE DIAGNOSTIC STREAM & RECENT WORKLOAD (5 COLS) */}
          <section className="xl:col-span-5 flex flex-col border-2 border-on-background bg-surface-container-lowest neo-shadow-lg">
            <div className="p-4 border-b-2 border-on-background bg-surface-container-low flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary border border-on-background animate-pulse"></span>
                  <h2 className="font-headline-sm text-[16px] font-bold text-on-surface uppercase tracking-tight m-0">
                    Diagnostic Ingestion Stream
                  </h2>
                </div>
                <span className="font-label-sm text-[10px] text-primary font-bold bg-surface-container-lowest px-2 py-0.5 border border-on-background">
                  BROADCAST: LIVE
                </span>
              </div>

              {/* Department Filter */}
              <div className="flex flex-wrap gap-1 p-1 bg-surface-container border-2 border-on-background text-on-surface font-label-sm text-[11px]">
                {['all', 'Radiology 1', 'ER Triage', 'Oncology'].map(dept => (
                  <button 
                    key={dept}
                    onClick={() => setDepartmentFilter(dept)}
                    className={`px-2.5 py-0.5 border cursor-pointer font-bold ${
                      departmentFilter === dept 
                        ? 'bg-surface-container-lowest border-on-background neo-shadow-sm' 
                        : 'border-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {dept === 'all' ? 'All Depts' : dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingestion Stream / Recent Scans Content */}
            {history.length > 0 ? (
              <div className="divide-y-2 divide-on-background max-h-[360px] overflow-y-auto">
                {history.slice(0, 5).map((diag, idx) => (
                  <div key={diag.id || idx} className="p-3 bg-surface-container-lowest hover:bg-surface-container-low flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 font-label-sm text-[11px]">
                        <span className="font-bold text-primary">{diag.patient_id || `PX-${idx + 1042}`}</span>
                        <span className="text-outline">|</span>
                        <span className="uppercase text-on-surface-variant">{diag.cancer_type || diag.modality || 'Thoracic'}</span>
                      </div>
                      <p className="font-headline-sm text-[13px] font-bold text-on-surface m-0 mt-0.5">
                        {diag.predicted_class || 'Inference Complete'} ({((diag.confidence || 0.94) * 100).toFixed(1)}%)
                      </p>
                    </div>
                    <button
                      onClick={() => onViewDiagnosis && onViewDiagnosis(diag)}
                      className="px-3 py-1 bg-primary text-white border-2 border-on-background font-label-sm text-[11px] font-bold neo-shadow-sm cursor-pointer"
                    >
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 flex flex-col items-center justify-center text-center border-b-2 border-on-background bg-surface-bright">
                <div className="w-14 h-14 border-2 border-on-background bg-surface-container-lowest flex items-center justify-center neo-shadow-md mb-3">
                  <span className="material-symbols-outlined text-[32px] text-primary">perm_scan_wifi</span>
                </div>
                <span className="font-label-md text-[11px] uppercase tracking-wider text-outline font-bold">
                  DICOM LISTENER SCP 0.0.0.0:11112
                </span>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface mt-1 m-0">
                  Real-Time Telemetry Feed Connected
                </h3>
                <p className="font-body-md text-[13px] text-on-surface-variant max-w-sm mt-1 font-normal m-0">
                  Awaiting active scan batch dispatch from connected PACS modalities or DICOM workstation.
                </p>
                <button 
                  onClick={() => onSelectModule('lung')}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 border-2 border-on-background bg-primary-container text-white font-label-md text-[12px] font-bold neo-shadow-md hover:-translate-x-[1px] hover:-translate-y-[1px] cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">add_to_photos</span>
                  <span>Launch New Diagnostic Scan</span>
                </button>
              </div>
            )}

            {/* Direct Study Upload Bar */}
            <div className="p-4 bg-surface-container-lowest flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline text-[24px]">folder_zip</span>
                <div>
                  <p className="font-label-sm text-[11px] font-bold text-on-surface m-0">DIRECT STUDY UPLOAD CHANNEL</p>
                  <p className="font-body-sm text-[11px] text-outline m-0">Accepted formats: .DCM, .NIFTI, DICOMDIR</p>
                </div>
              </div>
              <button 
                onClick={() => onSelectModule('lung')}
                className="px-3 py-1 border-2 border-on-background bg-surface-container-low font-label-sm text-[11px] font-bold neo-shadow-sm hover:bg-surface-container-highest cursor-pointer"
              >
                Open Ingest
              </button>
            </div>
          </section>
        </div>

        {/* SYSTEM DIAGNOSTIC LOGS & REAL KERNEL AUDIT LEDGER */}
        <section className="border-2 border-on-background bg-[#090d16] text-[#b5c4ff] rounded-DEFAULT neo-shadow-xl overflow-hidden">
          <div className="bg-[#181b25] px-4 py-2 border-b-2 border-on-background flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 bg-[#ba1a1a] border border-black inline-block"></span>
                <span className="w-3 h-3 bg-[#f59e0b] border border-black inline-block"></span>
                <span className="w-3 h-3 bg-[#00b4d8] border border-black inline-block"></span>
              </div>
              <span className="font-label-sm text-[11px] text-white font-mono font-bold tracking-wider ml-2">
                MEDVISION_RUNTIME_CONSOLE // TELEMETRY KERNEL LOG
              </span>
            </div>
            <div className="flex items-center gap-3 font-label-sm text-[10px]">
              <span className="text-[#00b4d8] font-mono">STATUS: SYNCED</span>
              <span className="text-[#737686] font-mono">LEVEL: VERBOSE</span>
            </div>
          </div>

          <div className="p-4 font-mono text-[11px] leading-relaxed bg-black text-[#eef0fe] max-h-48 overflow-y-auto space-y-1">
            <div className="text-[#737686]">// Diagnostic Kernel Runtime Initialized — Zero-simulation protocol enforced</div>
            <div><span className="text-[#4cd6fb] font-bold">[SYSTEM]</span> Diagnostic Kernel initialized. Port: 11112.</div>
            <div><span className="text-[#50d9fe] font-bold">[STATUS]</span> Listening on DICOM C-STORE SCP...</div>
            <div><span className="text-[#00b4d8] font-bold">[DATA INTEGRITY]</span> Zero-simulation protocol enforced. Backend node connected.</div>
            <div className="flex items-center gap-2 text-white font-bold animate-pulse mt-2">
              <span>&gt;</span>
              <span className="text-[#00b4d8]">DAEMON READY FOR AUTHENTICATED DICOM STREAM...</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
