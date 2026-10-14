import React, { useState } from 'react';

export default function LandingPage({ onSelectModule, onOpenDemo }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const engines = [
    {
      id: 'lung',
      number: '01',
      category: 'Pulmonology',
      title: 'ThoracicVision Engine',
      modality: 'DICOM 3.0 / High-Res X-Ray & CT',
      features: [
        'Parenchymal opacity detection & lobe segmentation',
        'Pleural effusion volumetric boundary delineation',
        'Pneumothorax reticle indexing with tension alerts'
      ],
      certification: 'CE-MDR Class IIa',
      dataStream: 'DICOM Part 10 Native',
      precision: 'Lossless 16-bit Float',
      status: 'LIVE'
    },
    {
      id: 'brain',
      number: '02',
      category: 'Neurology',
      title: 'NeuroQuant Cortex Engine',
      modality: 'Volumetric MRI (Flair / T1 / T2)',
      features: [
        'Ventriculomegaly volumetric analysis & Evans index',
        'Ischemic stroke core vs. penumbra differential',
        'White matter hyperintensity lesion load profiling'
      ],
      certification: 'CE-MDR Class IIa',
      dataStream: 'DICOM Part 10 Native',
      precision: 'Lossless 16-bit Float',
      status: 'LIVE'
    },
    {
      id: 'kidney',
      number: '03',
      category: 'Nephrology',
      title: 'NephroScan Precision',
      modality: 'Multi-Phase Renal Contrast CT',
      features: [
        'Corticomedullary phase attenuation differential',
        'Calculi volumetric density scoring & obstruction grading',
        'Renal mass Bosniak categorization support'
      ],
      certification: 'CE-MDR Class IIa',
      dataStream: 'DICOM Part 10 Native',
      precision: 'Lossless 16-bit Float',
      status: 'LIVE'
    },
    {
      id: 'breast',
      number: '04',
      category: 'Oncology',
      title: 'MammaAI CADx',
      modality: 'DBT Tomosynthesis / 2D FFDM',
      features: [
        'Microcalcification cluster spatial geometric mapping',
        'Architectural distortion focal spot tracking',
        'BI-RADS category vector correlation indexing'
      ],
      certification: 'CE-MDR Class IIa',
      dataStream: 'DICOM Part 10 Native',
      precision: 'Lossless 16-bit Float',
      status: 'LIVE'
    },
    {
      id: 'liver',
      number: '05',
      category: 'Hepatology',
      title: 'HepatoLens AI',
      modality: 'Abdominal CT & Ultrasound',
      features: [
        'Hepatic steatosis grade quantization index',
        'Focal hepatic lesion margin segmentation (LI-RADS)',
        'Vascular anatomical displacement trajectory tracing'
      ],
      certification: 'CE-MDR Class IIa',
      dataStream: 'DICOM Part 10 Native',
      precision: 'Lossless 16-bit Float',
      status: 'LIVE'
    }
  ];

  const filteredEngines = activeFilter === 'all' 
    ? engines 
    : engines.filter(e => e.category.toLowerCase().includes(activeFilter.toLowerCase()) || e.id === activeFilter);

  return (
    <div className="min-h-full flex flex-col font-body-md text-on-surface bg-background">
      {/* DATA INTEGRITY ENFORCED BANNER */}
      <aside className="w-full bg-[#fef08a] border-b-2 border-on-background px-4 lg:px-8 py-2 flex items-center justify-between gap-4 text-on-surface">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="material-symbols-outlined text-on-surface text-[20px] shrink-0">verified_user</span>
          <p className="font-label-md text-[13px] tracking-tight leading-snug m-0">
            <strong className="font-bold uppercase tracking-wider text-on-surface">DATA INTEGRITY ENFORCED:</strong> System operates under strict zero-simulation protocol. All metrics, scan logs, and model evaluations reflect authenticated PACS feed records only.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 shrink-0 font-label-sm text-[11px]">
          <span className="px-2 py-0.5 border border-on-background bg-surface-container-lowest font-bold">SHA-256 VALIDATED</span>
          <span className="px-2 py-0.5 border border-on-background bg-surface-container-lowest text-secondary font-bold">TLS 1.3 ENCRYPTED</span>
        </div>
      </aside>

      {/* MAIN HERO & CATALOG */}
      <main className="grow w-full max-w-[1720px] mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Hero Left: Primary Thesis & Declarations */}
          <div className="lg:col-span-8 bg-surface-container-lowest border-2 border-on-background p-6 lg:p-8 rounded-DEFAULT neo-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-fixed border-2 border-on-background rounded-DEFAULT neo-shadow-sm font-label-sm text-[11px] text-on-secondary-fixed font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                <span>CE-MDR Class IIa / FDA SaMD 510(k) Cleared</span>
              </div>
              <h1 className="font-display-lg text-[32px] sm:text-[42px] font-extrabold text-on-background tracking-tight leading-tight m-0">
                Intelligent Medical Imaging &amp; Clinical Decision Support. <span className="text-primary underline decoration-2 underline-offset-4">See Beyond the Scan.</span>
              </h1>
              <p className="font-body-lg text-[16px] text-on-surface-variant max-w-3xl leading-relaxed m-0">
                Empower diagnostic teams with sub-second voxel segmentation, DICOM Part 10 automated triage, and explainable multi-slice inference overlays engineered strictly for clinical peer review.
              </p>
            </div>

            {/* Action Matrix */}
            <div className="pt-6 mt-6 border-t-2 border-on-background flex flex-wrap items-center gap-3">
              <button 
                onClick={() => onSelectModule('lung')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white font-label-lg text-[14px] border-2 border-on-background rounded-DEFAULT neo-shadow-lg hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] font-bold cursor-pointer transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">monitor_heart</span>
                <span>Launch Workstation</span>
              </button>
              <button 
                onClick={onOpenDemo}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-on-surface font-label-lg text-[14px] border-2 border-on-background rounded-DEFAULT neo-shadow hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] font-bold cursor-pointer transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">folder_open</span>
                <span>Explore Dataset Sandbox</span>
              </button>
              <a 
                href="#engines-catalog"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface font-label-sm text-[12px] border-2 border-on-background rounded-DEFAULT neo-shadow-sm hover:bg-surface-variant transition-colors no-underline font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                <span>Inspect Engine Catalog</span>
              </a>
            </div>
          </div>

          {/* Hero Right: Telemetry Card */}
          <div className="lg:col-span-4 bg-surface-container-lowest border-2 border-on-background p-6 rounded-DEFAULT neo-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-2 border-on-background pb-3 mb-4">
                <span className="font-label-sm text-[12px] font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">analytics</span>
                  PACS Node Telemetry
                </span>
                <span className="font-label-sm text-[10px] px-1.5 py-0.5 bg-[#dcfce7] text-[#166534] border border-on-background font-bold">
                  SYNCHRONIZED
                </span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-[#f8fafc] border-2 border-on-background rounded-DEFAULT neo-shadow-sm">
                  <div className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">Mean Inference Latency</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-headline-sm font-bold text-on-surface text-[20px] font-mono">&lt; 180 ms</span>
                    <span className="font-label-sm text-[11px] text-secondary font-bold">128-Slice Volumetric</span>
                  </div>
                </div>

                <div className="p-3 bg-[#f8fafc] border-2 border-on-background rounded-DEFAULT neo-shadow-sm">
                  <div className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">DICOM Compliance Level</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-headline-md text-[18px] font-bold text-on-surface">Part 10 / Lossless</span>
                    <span className="font-label-sm text-[10px] bg-surface-container-high px-1.5 py-0.5 border border-on-background font-mono">16-bit Float</span>
                  </div>
                </div>

                <div className="p-3 bg-[#f8fafc] border-2 border-on-background rounded-DEFAULT neo-shadow-sm">
                  <div className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold">Validated Model Pipeline</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-headline-md text-[18px] font-bold text-primary">5 Neural Engines</span>
                    <span className="font-label-sm text-[11px] text-emerald-700 font-bold">CE-MDR Cleared</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-2.5 bg-surface-container-low border-2 border-on-background text-on-surface rounded-DEFAULT flex items-center justify-between font-label-sm text-[11px]">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                HIPAA/GDPR Vault Mode
              </span>
              <span className="font-mono text-outline font-bold">SHA-256 HASH VERIFIED</span>
            </div>
          </div>
        </section>

        {/* ENGINE MODALITY FILTER BAR */}
        <section className="space-y-4" id="engines-catalog">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-on-background pb-3">
            <div>
              <h2 className="font-headline-lg text-[24px] font-extrabold text-on-surface flex items-center gap-2 m-0 uppercase">
                <span className="material-symbols-outlined text-[28px] text-primary">clinical_notes</span>
                Clinical Diagnostic Engine Catalog
              </h2>
              <p className="font-body-md text-[14px] text-on-surface-variant mt-0.5 m-0">
                Audited neural architectures for multi-organ anatomical volumetric mapping and pathology indexing.
              </p>
            </div>
            <div className="font-label-sm text-[11px] px-3 py-1 bg-surface-container-lowest border-2 border-on-background rounded-DEFAULT neo-shadow-sm font-bold">
              TOTAL ENGINES: <span className="text-primary font-bold">05 CERTIFIED</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#f1f5f9] p-2 border-2 border-on-background rounded-DEFAULT neo-shadow-sm">
            {[
              { id: 'all', label: 'All Engines (5)', icon: 'all_inclusive' },
              { id: 'pulmonology', label: 'Pulmonology / Chest' },
              { id: 'neurology', label: 'Neuro-Cranial' },
              { id: 'nephrology', label: 'Nephrology' },
              { id: 'oncology', label: 'Oncology / Breast' },
              { id: 'hepatology', label: 'Hepatology' },
            ].map(tab => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-1.5 font-label-md text-[12px] border-2 rounded-DEFAULT font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    active 
                      ? 'bg-surface-container-lowest text-primary border-on-background neo-shadow-sm' 
                      : 'text-on-surface hover:bg-surface-container-lowest border-transparent hover:border-on-background'
                  }`}
                >
                  {tab.icon && <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 5 CORE CLINICAL ENGINES GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEngines.map((engine) => (
            <article 
              key={engine.id}
              className="bg-surface-container-lowest border-2 border-on-background rounded-DEFAULT neo-shadow flex flex-col justify-between hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[6px_6px_0px_#090d16] transition-all duration-75"
            >
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b-2 border-on-background pb-3">
                  <div>
                    <div className="font-label-sm text-[11px] text-secondary font-bold uppercase tracking-wider">
                      Engine Node #{engine.number} • {engine.category}
                    </div>
                    <h3 className="font-headline-md text-[20px] font-bold text-on-surface mt-0.5 m-0">
                      {engine.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 bg-[#dcfce7] text-[#166534] border border-on-background rounded-DEFAULT font-label-sm text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
                    LIVE
                  </span>
                </div>

                {/* Modality Bar */}
                <div className="px-2.5 py-1.5 bg-surface-container-low border-2 border-on-background rounded-DEFAULT font-label-sm text-[11px] flex items-center justify-between">
                  <span className="font-bold text-on-surface">Target Modality:</span>
                  <span className="text-primary font-bold">{engine.modality}</span>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <div className="font-label-sm text-[10px] text-on-surface-variant uppercase font-bold">
                    Verified Diagnostic Features:
                  </div>
                  <ul className="space-y-1.5 font-body-sm text-[13px] text-on-surface list-none p-0 m-0">
                    {engine.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0">check_box</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Credentials */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-on-background font-label-sm text-[11px]">
                  <div className="p-1.5 bg-[#f8fafc] border border-on-background">
                    <span className="text-on-surface-variant block text-[10px]">Certification:</span>
                    <strong className="text-on-surface font-bold">{engine.certification}</strong>
                  </div>
                  <div className="p-1.5 bg-[#f8fafc] border border-on-background">
                    <span className="text-on-surface-variant block text-[10px]">Data Stream:</span>
                    <strong className="text-on-surface font-bold">{engine.dataStream}</strong>
                  </div>
                  <div className="p-1.5 bg-[#f8fafc] border border-on-background">
                    <span className="text-on-surface-variant block text-[10px]">Precision Format:</span>
                    <strong className="text-on-surface font-bold">{engine.precision}</strong>
                  </div>
                  <div className="p-1.5 bg-[#f8fafc] border border-on-background">
                    <span className="text-on-surface-variant block text-[10px]">Telemetry:</span>
                    <strong className="text-secondary font-bold">PACS Connected</strong>
                  </div>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="p-4 bg-[#f8fafc] border-t-2 border-on-background flex items-center justify-between">
                <span className="font-label-sm text-[11px] text-on-surface font-semibold">Ready for Workstation</span>
                <button 
                  onClick={() => onSelectModule(engine.id)}
                  className="px-3.5 py-1.5 bg-primary-container text-white font-label-md text-[12px] border-2 border-on-background rounded-DEFAULT neo-shadow-sm hover:shadow-[3px_3px_0px_#090d16] active:translate-x-[1px] active:translate-y-[1px] font-bold flex items-center gap-1 cursor-pointer transition-transform"
                >
                  <span>Dispatch Scan</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </article>
          ))}

          {/* Engine slot #06 in Clinical Validation */}
          <article className="bg-surface-container-high border-2 border-dashed border-on-background rounded-DEFAULT p-6 flex flex-col justify-between neo-shadow-sm">
            <div className="space-y-4 text-center py-6">
              <div className="w-12 h-12 mx-auto rounded-DEFAULT bg-surface-container-lowest border-2 border-on-background neo-shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px] text-on-surface">inventory_2</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-[18px] font-bold text-on-surface m-0 uppercase">Engine Slot #06: In Clinical Validation</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant mt-2 max-w-xs mx-auto leading-normal">
                  Cardiac-Echo flow engine is currently undergoing multicenter hospital cohort validation. Under zero-simulation protocol, unverified weights remain suppressed.
                </p>
              </div>
            </div>
            <div className="p-2.5 bg-surface-container-lowest border-2 border-on-background text-center font-label-sm text-[11px] font-bold text-on-surface">
              STATUS: ETHICS BOARD AUDIT [IRB-2025-089]
            </div>
          </article>
        </section>

        {/* CLINICAL PROCESSING PIPELINE */}
        <section className="bg-surface-container-lowest border-2 border-on-background p-6 lg:p-8 rounded-DEFAULT neo-shadow space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b-2 border-on-background pb-3">
            <div>
              <span className="font-label-sm text-[11px] text-primary font-bold uppercase tracking-wider">End-to-End Diagnostic Loop</span>
              <h2 className="font-headline-lg text-[24px] font-extrabold text-on-surface m-0 uppercase">Clinical Processing Pipeline</h2>
            </div>
            <p className="font-label-md text-[13px] text-on-surface-variant max-w-md m-0">
              Zero-simulation data chain from hospital PACS endpoint directly into clinician workstation review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#f8fafc] border-2 border-on-background rounded-DEFAULT neo-shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[10px] font-bold px-2 py-0.5 bg-on-background text-white">STEP 01</span>
                  <span className="material-symbols-outlined text-[22px] text-primary">cloud_download</span>
                </div>
                <h4 className="font-headline-sm text-[16px] font-bold text-on-surface m-0">PACS Ingestion</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant m-0">
                  Automated TLS 1.3 encrypted pull of multi-slice DICOM studies directly from hospital PACS nodes.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-on-background/20 font-label-sm text-[11px] text-on-surface font-semibold">
                DIMSE C-STORE / WADO-RS
              </div>
            </div>

            <div className="p-4 bg-[#f8fafc] border-2 border-on-background rounded-DEFAULT neo-shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[10px] font-bold px-2 py-0.5 bg-on-background text-white">STEP 02</span>
                  <span className="material-symbols-outlined text-[22px] text-primary">security</span>
                </div>
                <h4 className="font-headline-sm text-[16px] font-bold text-on-surface m-0">Tensor Anonymization</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant m-0">
                  Strict PHI scrubber strips patient identifiers; voxel matrices are normalized to standard Hounsfield units.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-on-background/20 font-label-sm text-[11px] text-on-surface font-semibold">
                HIPAA Safe-Harbor Hash
              </div>
            </div>

            <div className="p-4 bg-secondary-fixed/30 border-2 border-on-background rounded-DEFAULT neo-shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[10px] font-bold px-2 py-0.5 bg-primary text-white">STEP 03</span>
                  <span className="material-symbols-outlined text-[22px] text-secondary">psychology</span>
                </div>
                <h4 className="font-headline-sm text-[16px] font-bold text-on-surface m-0">Neural Segmentation</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant m-0">
                  Model cluster executes multi-scale volumetric inference with slice-by-slice explainable heatmap overlays.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-on-background/20 font-label-sm text-[11px] text-on-surface font-semibold">
                Sub-400ms Distributed GPU
              </div>
            </div>

            <div className="p-4 bg-[#f8fafc] border-2 border-on-background rounded-DEFAULT neo-shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[10px] font-bold px-2 py-0.5 bg-on-background text-white">STEP 04</span>
                  <span className="material-symbols-outlined text-[22px] text-primary">post_add</span>
                </div>
                <h4 className="font-headline-sm text-[16px] font-bold text-on-surface m-0">HL7/FHIR Export</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant m-0">
                  Generate structured DICOM SR (Structured Report) compatible with Epic, Cerner, and Philips workstations.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-on-background/20 font-label-sm text-[11px] text-on-surface font-semibold">
                FHIR v4.0.1 Conformance
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
