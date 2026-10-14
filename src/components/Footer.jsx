import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full border-t-2 border-on-background bg-surface-container-low px-4 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto">
      <div className="flex flex-col text-left">
        <div className="font-headline-sm text-[16px] font-bold text-on-surface uppercase mb-0.5 tracking-tight">
          MedVision AI Systems
        </div>
        <p className="font-body-sm text-[12px] text-on-surface-variant max-w-2xl m-0">
          © 2025 MedVision AI Systems Inc. Validated CE-MDR Class IIa / FDA SaMD 510(k) Cleared. Engine Node v4.2.0-STABLE.
        </p>
      </div>
      <nav aria-label="Legal & Conformance" className="flex flex-wrap items-center gap-3 font-label-sm text-[11px]">
        <button onClick={() => alert("CE-MDR Class IIa Dossier: Certificate No. MDR-78291. ISO 13485:2016 Certified.")} className="text-on-surface-variant hover:text-primary underline cursor-pointer bg-transparent border-0 p-0">
          Regulatory Dossier
        </button>
        <span className="text-outline-variant hidden sm:inline">•</span>
        <button onClick={() => alert("PACS Telemetry: Real-time DICOM store and query retrieve validated.")} className="text-on-surface-variant hover:text-primary underline cursor-pointer bg-transparent border-0 p-0">
          PACS Telemetry Log
        </button>
        <span className="text-outline-variant hidden sm:inline">•</span>
        <button onClick={() => alert("DICOM Conformance Manifest: Conforms to DICOM PS 3.10 and NIfTI-1 standards.")} className="text-on-surface-variant hover:text-primary underline cursor-pointer bg-transparent border-0 p-0">
          DICOM Conformance Manifest
        </button>
        <span className="text-outline-variant hidden sm:inline">•</span>
        <button onClick={() => alert("HIPAA/GDPR Attestation: De-identification adheres to Safe Harbor standards.")} className="text-on-surface-variant hover:text-primary underline cursor-pointer bg-transparent border-0 p-0">
          HIPAA/GDPR Attestation
        </button>
        <span className="text-outline-variant hidden sm:inline">•</span>
        <button onClick={() => onNavigate && onNavigate('history')} className="text-primary font-bold underline cursor-pointer bg-transparent border-0 p-0">
          Audit Ledger
        </button>
      </nav>
    </footer>
  );
}
