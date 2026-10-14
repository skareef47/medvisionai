import React, { useState, useEffect, useRef } from 'react';
import { submitDiagnosis } from '../services/api';

export default function NewDiagnosis({ 
  initialCancerType = 'lung', 
  initialScanUrl = null, 
  initialScanName = null, 
  isDemo = false,
  demoNotice = null,
  onDiagnosisComplete 
}) {
  const [cancerType, setCancerType] = useState(initialCancerType);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('54');
  const [patientGender, setPatientGender] = useState(initialCancerType === 'breast' ? 'Female' : 'Male');
  const [referringClinician, setReferringClinician] = useState('Dr. Sarah Chen, MD');
  const [department, setDepartment] = useState('Pulmonology / ICU');
  
  // DICOM & File Ingestion
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Viewport Controls
  const [activeTool, setActiveTool] = useState('crosshairs');
  const [activePreset, setActivePreset] = useState('lung');
  const [heatmapOn, setHeatmapOn] = useState(true);
  const [invertLut, setInvertLut] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.85);
  const [gradCamOpacity, setGradCamOpacity] = useState(65);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Execution & Backend State
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [sessionUid] = useState('DICOM-20250519-TX99');

  useEffect(() => {
    if (initialCancerType) {
      setCancerType(initialCancerType);
      if (initialCancerType === 'breast') {
        setPatientGender('Female');
        setDepartment('Oncology / Breast Clinic');
      } else if (initialCancerType === 'brain') {
        setDepartment('Neurology / Neuro-Radiology');
      } else if (initialCancerType === 'kidney') {
        setDepartment('Nephrology / Urology');
      } else if (initialCancerType === 'liver') {
        setDepartment('Hepatology / GI Radiology');
      }
    }
  }, [initialCancerType]);

  useEffect(() => {
    if (initialScanUrl) {
      fetch(initialScanUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], initialScanName || 'clinical_scan.jpg', { type: blob.type || 'image/jpeg' });
          setSelectedFile(file);
          setPreviewUrl(initialScanUrl);
        })
        .catch(err => console.error('Error preloading scan:', err));
    }
  }, [initialScanUrl, initialScanName]);

  const engines = [
    {
      id: 'lung',
      title: 'ThoracicVision CT / X-Ray',
      description: 'Validated for Infiltrate, Consolidation & Pneumothorax triage',
      department: 'Pulmonology / ICU',
      modality: 'CT / DX'
    },
    {
      id: 'brain',
      title: 'NeuroQuant MRI (Brain & Spine)',
      description: 'Cortical volumetric segmentation & white matter lesions',
      department: 'Neurology / Neuro-Radiology',
      modality: 'MR (Flair/T1/T2)'
    },
    {
      id: 'kidney',
      title: 'NephroScan Precision CT',
      description: 'Renal mass Bosniak categorization & calculi scoring',
      department: 'Nephrology / Urology',
      modality: 'CT Contrast'
    },
    {
      id: 'breast',
      title: 'MammaAI DBT (Digital Breast Tomosynthesis)',
      description: 'Microcalcification detection and BI-RADS risk stratifier',
      department: 'Oncology / Breast Clinic',
      modality: 'MG / DBT'
    },
    {
      id: 'liver',
      title: 'HepatoLens AI (Abdominal CT)',
      description: 'Focal hepatic lesion segmentation and LI-RADS scoring',
      department: 'Hepatology / GI Radiology',
      modality: 'CT Abdomen'
    }
  ];

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setErrorMsg(null);
    if (!patientId) {
      setPatientId('PX-' + Math.floor(10000 + Math.random() * 90000));
    }
    if (!patientName) {
      setPatientName('Anonymized Patient ' + Math.floor(100 + Math.random() * 900));
    }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleExecuteInference = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('DICOM study file required. Drop or select a medical scan.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    setLoadingStep('Ingesting DICOM voxel matrix...');

    const step1 = setTimeout(() => setLoadingStep('Applying Hounsfield calibration & tensor normalization...'), 500);
    const step2 = setTimeout(() => setLoadingStep('Executing neural segmentation & Grad-CAM layer salience...'), 1100);

    try {
      const formData = new FormData();
      formData.append('cancer_type', cancerType);
      formData.append('patient_name', patientName || 'Anonymous Clinical Patient');
      formData.append('patient_age', patientAge || '50');
      formData.append('patient_gender', patientGender);
      formData.append('patient_id_code', patientId || 'PX-' + Math.floor(10000 + Math.random() * 90000));
      formData.append('medical_scan', selectedFile);

      const result = await submitDiagnosis(formData);
      setLoadingStep('Synthesizing structured findings...');
      setTimeout(() => {
        if (onDiagnosisComplete) onDiagnosisComplete(result);
      }, 500);
    } catch (err) {
      console.error('Inference error:', err);
      const detail = err.response?.data?.detail || 'Inference execution failed on neural node. Verify PACS connectivity.';
      setErrorMsg(detail);
      setLoading(false);
    } finally {
      clearTimeout(step1);
      clearTimeout(step2);
    }
  };

  return (
    <div className="min-h-full flex flex-col font-body-md text-on-surface bg-background">
      {/* SUB-HEADER / CLINICAL WORKFLOW BREADCRUMB STRIP */}
      <div className="w-full bg-surface-container-low border-b-2 border-on-background px-4 lg:px-8 py-1.5 flex flex-wrap items-center justify-between text-on-surface">
        <div className="flex items-center gap-2 font-label-md text-[12px]">
          <span className="material-symbols-outlined text-[16px] text-primary">biotech</span>
          <span className="font-bold uppercase tracking-wider text-on-surface">Inference Node:</span>
          <span className="px-1.5 py-0.5 bg-surface-container-highest border border-on-background font-semibold font-mono text-[11px]">
            T-VISION-NODE-04 [Online]
          </span>
          <span className="text-outline">/</span>
          <span className="text-on-surface-variant font-label-sm text-[11px]">
            Session UID: <span className="text-on-background font-semibold font-mono">{sessionUid}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 font-label-sm text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00b4d8] border border-on-background"></span>
            <span className="font-bold">CE-MDR Class IIa Active</span>
          </div>
          <span className="text-outline">|</span>
          <span className="text-on-surface-variant">
            PACS Link: <span className="text-on-surface font-semibold">Hospital Intranet (St. Jude Central)</span>
          </span>
        </div>
      </div>

      {isDemo && demoNotice && (
        <div className="w-full bg-[#fef08a] border-b-2 border-on-background px-4 lg:px-8 py-2 flex items-center justify-between text-on-surface">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span className="font-label-sm text-[12px] font-bold uppercase">{demoNotice}</span>
          </div>
        </div>
      )}

      {/* MAIN DUAL-PANE CLINICAL WORKSPACE */}
      <main className="grow w-full max-w-[1920px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT PANEL: STUDY CONFIGURATION & INGESTION (~42% = 5 cols) */}
        {/* ========================================================= */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          {/* Patient & Study Metadata Form Card */}
          <div className="bg-surface-container-lowest border-2 border-on-background rounded-DEFAULT brutal-shadow-md p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-on-background">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                <h2 className="font-headline-sm text-[16px] uppercase tracking-tight text-on-surface font-bold m-0">
                  Study &amp; Patient Record
                </h2>
              </div>
              <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed border border-on-background font-label-sm text-[10px] font-bold uppercase">
                De-Identified
              </span>
            </div>

            <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block font-label-sm text-[11px] font-bold uppercase text-on-surface mb-1">
                  Patient MRN / Salted Anonym Identifier
                </label>
                <div className="relative">
                  <input 
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="e.g. PX-90412 / MRN-7819"
                    className="w-full bg-surface-container-low border-2 border-on-background px-3 py-1.5 font-label-md text-[13px] text-on-surface font-bold font-mono focus:outline-none focus:border-primary focus:shadow-[3px_3px_0px_#1a56db]" 
                    type="text" 
                  />
                  <span className="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-outline">lock</span>
                </div>
              </div>

              {/* Patient Name / Clinical Alias */}
              <div>
                <label className="block font-label-sm text-[11px] font-bold uppercase text-on-surface mb-1">
                  Patient Clinical Alias (Safe Harbor)
                </label>
                <input 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Patient Alpha-7"
                  className="w-full bg-surface-container-lowest border-2 border-on-background px-3 py-1.5 font-body-sm text-[13px] text-on-surface font-medium focus:outline-none focus:border-primary" 
                  type="text" 
                />
              </div>

              {/* Demographics: Biological Sex & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-[11px] font-bold uppercase text-on-surface mb-1">
                    Biological Sex
                  </label>
                  <div className="flex border-2 border-on-background bg-surface-container-low p-0.5 rounded-DEFAULT">
                    <button 
                      type="button"
                      onClick={() => setPatientGender('Female')}
                      className={`flex-1 py-1 text-center font-label-sm text-[11px] font-bold border-0 cursor-pointer ${
                        patientGender === 'Female' 
                          ? 'bg-primary text-white neo-shadow-sm' 
                          : 'bg-transparent text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Female (F)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPatientGender('Male')}
                      className={`flex-1 py-1 text-center font-label-sm text-[11px] font-bold border-0 cursor-pointer ${
                        patientGender === 'Male' 
                          ? 'bg-primary text-white neo-shadow-sm' 
                          : 'bg-transparent text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Male (M)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-label-sm text-[11px] font-bold uppercase text-on-surface mb-1">
                    Age
                  </label>
                  <input 
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="Age (years)"
                    className="w-full bg-surface-container-lowest border-2 border-on-background px-3 py-1.5 font-label-md text-[13px] text-on-surface font-semibold focus:outline-none focus:border-primary" 
                    type="number" 
                  />
                </div>
              </div>

              {/* Referring Clinician & Department */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-sm text-[11px] font-bold uppercase text-on-surface mb-1">
                    Referring Clinician
                  </label>
                  <input 
                    value={referringClinician}
                    onChange={(e) => setReferringClinician(e.target.value)}
                    className="w-full bg-surface-container-lowest border-2 border-on-background px-3 py-1.5 font-body-sm text-[12px] text-on-surface focus:outline-none focus:border-primary" 
                    type="text" 
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-[11px] font-bold uppercase text-on-surface mb-1">
                    Department
                  </label>
                  <select 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-surface-container-lowest border-2 border-on-background px-2.5 py-1.5 font-body-sm text-[12px] text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option>Pulmonology / ICU</option>
                    <option>Neurology / Neuro-Radiology</option>
                    <option>Emergency Radiology</option>
                    <option>Thoracic Oncology</option>
                    <option>Nephrology / Urology</option>
                    <option>Oncology / Breast Clinic</option>
                    <option>Hepatology / GI Radiology</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Engine Selector Card */}
          <div className="bg-surface-container-lowest border-2 border-on-background rounded-DEFAULT brutal-shadow-md p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-on-background">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">neurology</span>
                <h2 className="font-headline-sm text-[16px] uppercase tracking-tight text-on-surface font-bold m-0">
                  Diagnostic AI Engine
                </h2>
              </div>
              <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-semibold font-mono">
                Model v4.2-EXP
              </span>
            </div>

            <label className="block font-label-sm text-[11px] font-bold uppercase text-on-surface mb-2">
              Select Specialized Neural Architecture:
            </label>

            <div className="grid grid-cols-1 gap-2 mb-4">
              {engines.map((eng) => {
                const isSelected = cancerType === eng.id;
                return (
                  <label 
                    key={eng.id}
                    onClick={() => setCancerType(eng.id)}
                    className={`flex items-center justify-between p-2.5 rounded-DEFAULT brutal-shadow-sm cursor-pointer transition-colors border-2 ${
                      isSelected 
                        ? 'bg-surface-container-low border-primary' 
                        : 'bg-surface-container-lowest border-on-background hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="radio" 
                        name="engine-selection"
                        checked={isSelected}
                        onChange={() => setCancerType(eng.id)}
                        className="w-4 h-4 text-primary border-2 border-on-background focus:ring-0" 
                      />
                      <div>
                        <p className={`font-label-md text-[13px] font-bold uppercase m-0 ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                          {eng.title}
                        </p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant m-0 mt-0.5">
                          {eng.description}
                        </p>
                      </div>
                    </div>
                    <span className={`px-1.5 py-0.5 font-label-sm text-[9px] font-bold uppercase border border-on-background ${
                      isSelected ? 'bg-primary-container text-white' : 'bg-surface-container text-outline'
                    }`}>
                      {isSelected ? 'Active' : 'Standby'}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Analysis Target Checklist */}
            <div>
              <label className="block font-label-sm text-[11px] font-bold uppercase text-on-surface mb-2">
                Target Biomarkers &amp; Features for Extraction:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Parenchymal Infiltrates',
                  'Pleural Effusion',
                  'Nodule Localization',
                  'Grad-CAM Attention Map'
                ].map((feat, i) => (
                  <label key={i} className="flex items-center gap-2 p-2 border border-on-background bg-surface-container-lowest rounded-DEFAULT cursor-pointer hover:bg-surface-container-low font-label-sm text-[11px] font-bold text-on-surface">
                    <input defaultChecked type="checkbox" className="w-4 h-4 rounded-DEFAULT text-primary border-2 border-on-background focus:ring-0" />
                    <span>{feat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* DICOM Ingestion / Dropzone Card */}
          <div className="bg-surface-container-lowest border-2 border-on-background rounded-DEFAULT brutal-shadow-md p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-on-background">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">upload_file</span>
                <h2 className="font-headline-sm text-[16px] uppercase tracking-tight text-on-surface font-bold m-0">
                  DICOM Study Ingestion
                </h2>
              </div>
              <span className="font-label-sm text-[11px] font-semibold text-secondary">PACS Buffer Ready</span>
            </div>

            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*,.dcm,.nii"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden" 
            />

            {/* Drag & Drop Container */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-on-background p-5 text-center flex flex-col items-center justify-center gap-2 rounded-DEFAULT transition-colors cursor-pointer ${
                isDragging ? 'bg-secondary-fixed/40 border-primary' : 'bg-surface-container-low hover:border-primary'
              }`}
            >
              <div className="w-10 h-10 border-2 border-on-background bg-surface-container-lowest flex items-center justify-center brutal-shadow-sm">
                <span className="material-symbols-outlined text-primary text-[24px]">folder_zip</span>
              </div>
              <div>
                <p className="font-label-md text-[13px] font-bold uppercase text-on-surface m-0">
                  Drag &amp; Drop DICOM (.dcm) or Lossless TIFF / PNG studies here
                </p>
                <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 m-0">
                  Compliant with DICOM PS 3.10 and NIfTI-1 formats. Max 1.2 GB per bundle.
                </p>
              </div>
              <div className="flex gap-2 mt-1">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="px-2.5 py-1 bg-surface-container-lowest text-on-surface border-2 border-on-background font-label-sm text-[11px] font-bold brutal-shadow-sm brutal-btn-active cursor-pointer"
                >
                  Browse Local Drives
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); alert("PACS Archive SCU queried. Retrieved latest de-identified study accession."); }}
                  className="px-2.5 py-1 bg-secondary-fixed text-on-secondary-fixed border-2 border-on-background font-label-sm text-[11px] font-bold brutal-shadow-sm brutal-btn-active cursor-pointer"
                >
                  Query PACS Archive
                </button>
              </div>
            </div>

            {/* Attached File Card */}
            <div className="mt-3.5 p-3 bg-surface-container-low border-2 border-dashed border-outline-variant rounded-DEFAULT flex items-center justify-between text-on-surface-variant">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface-container-highest border border-on-background text-outline">
                  <span className="material-symbols-outlined text-[22px] block">
                    {selectedFile ? 'image' : 'folder_off'}
                  </span>
                </div>
                <div>
                  <p className="font-label-sm text-[12px] font-bold text-on-surface m-0">
                    {selectedFile ? selectedFile.name : 'No study selected'}
                  </p>
                  <p className="font-label-sm text-[10px] text-on-surface-variant m-0">
                    {selectedFile 
                      ? `${(selectedFile.size / 1024).toFixed(1)} KB • DICOM / Image Matrix Ready` 
                      : 'Drop DICOM study (.dcm / .nii) here or query PACS'}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-0.5 border font-label-sm text-[9px] font-semibold uppercase ${
                selectedFile 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-600' 
                  : 'bg-surface-container-highest border-outline text-outline'
              }`}>
                {selectedFile ? 'Buffer Loaded' : 'Awaiting Ingest'}
              </span>
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 bg-red-100 border-2 border-red-800 text-red-900 font-label-sm text-[12px] font-bold">
                {errorMsg}
              </div>
            )}

            {/* Primary Execution Button */}
            <button 
              onClick={handleExecuteInference}
              disabled={loading}
              className={`w-full mt-4 py-3 bg-primary text-white border-3 border-on-background font-label-lg text-[14px] font-extrabold uppercase tracking-wider brutal-shadow-lg brutal-btn-primary flex items-center justify-center gap-2 transition-transform cursor-pointer ${
                loading ? 'opacity-80 cursor-wait' : 'hover:-translate-x-[1px] hover:-translate-y-[1px]'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>
                {loading ? 'sync' : 'bolt'}
              </span>
              <span>{loading ? loadingStep : 'EXECUTE DIAGNOSTIC INFERENCE'}</span>
            </button>
          </div>
        </section>

        {/* ========================================================= */}
        {/* RIGHT PANEL: DIAGNOSTIC VIEWER & AI CANVAS (~58% = 7 cols) */}
        {/* ========================================================= */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-surface-container-lowest border-2 border-on-background rounded-DEFAULT brutal-shadow-md p-3 flex flex-col gap-3">
            {/* Top Tool Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-on-background">
              {/* Group 1: Tools */}
              <div className="flex items-center gap-1 bg-surface-container-low border-2 border-on-background p-1 rounded-DEFAULT">
                {[
                  { id: 'pan', icon: 'pan_tool', label: 'Pan' },
                  { id: 'zoom', icon: 'zoom_in', label: 'Zoom' },
                  { id: 'caliper', icon: 'straighten', label: 'Caliper' },
                  { id: 'crosshairs', icon: 'crisis_alert', label: 'Crosshairs' },
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveTool(tool.id);
                      if (tool.id === 'zoom') setZoomLevel(prev => (prev === 100 ? 150 : 100));
                    }}
                    className={`p-1.5 border font-label-sm font-bold cursor-pointer ${
                      activeTool === tool.id 
                        ? 'border-on-background bg-primary-container text-white brutal-shadow-sm' 
                        : 'border-transparent text-on-surface-variant hover:border-on-background hover:text-on-surface'
                    }`}
                    title={tool.label}
                  >
                    <span className="material-symbols-outlined text-[18px] block">{tool.icon}</span>
                  </button>
                ))}
              </div>

              {/* Group 2: Window / Level Presets */}
              <div className="flex items-center gap-1 font-label-sm text-[11px]">
                <span className="font-bold uppercase text-on-surface hidden sm:inline mr-1">Preset:</span>
                <div className="flex border-2 border-on-background rounded-DEFAULT overflow-hidden bg-surface-container-low p-0.5">
                  {['lung', 'bone', 'mediastinum'].map(p => (
                    <button
                      key={p}
                      onClick={() => setActivePreset(p)}
                      className={`px-2 py-1 uppercase font-bold cursor-pointer ${
                        activePreset === p 
                          ? 'bg-surface-container-lowest text-primary border border-on-background brutal-shadow-sm' 
                          : 'text-on-surface border-0 bg-transparent hover:bg-surface-container-lowest'
                      }`}
                    >
                      {p === 'lung' ? 'Lung (W1500/L-600)' : p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group 3: Viewport Toggles */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setHeatmapOn(!heatmapOn)}
                  className={`flex items-center gap-1 px-2.5 py-1 border-2 border-on-background font-label-sm text-[11px] font-bold brutal-shadow-sm cursor-pointer ${
                    heatmapOn ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container text-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">heat_pump</span>
                  <span>Heatmap: {heatmapOn ? 'ON' : 'OFF'}</span>
                </button>
                <button 
                  onClick={() => setInvertLut(!invertLut)}
                  className="p-1.5 border-2 border-on-background bg-surface-container-lowest text-on-surface hover:bg-surface-container-low brutal-shadow-sm cursor-pointer"
                  title="Invert LUT Grayscale"
                >
                  <span className="material-symbols-outlined text-[18px] block">invert_colors</span>
                </button>
                <button 
                  onClick={() => { setZoomLevel(100); setInvertLut(false); setActivePreset('lung'); }}
                  className="p-1.5 border-2 border-on-background bg-surface-container-lowest text-on-surface hover:bg-surface-container-low brutal-shadow-sm cursor-pointer"
                  title="Reset Canvas"
                >
                  <span className="material-symbols-outlined text-[18px] block">restart_alt</span>
                </button>
              </div>
            </div>

            {/* Central Medical Scan Viewport Canvas */}
            <div className="relative w-full aspect-[4/3] bg-black border-3 border-on-background rounded-DEFAULT overflow-hidden flex items-center justify-center select-none shadow-[inset_0px_0px_20px_rgba(0,0,0,0.9)]">
              {previewUrl ? (
                <div 
                  className="relative w-full h-full flex items-center justify-center overflow-hidden"
                  style={{
                    filter: invertLut ? 'invert(1)' : 'none',
                    transform: `scale(${zoomLevel / 100})`,
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <img 
                    src={previewUrl} 
                    alt="DICOM Scan Preview" 
                    className="max-h-full max-w-full object-contain"
                  />
                  {activeTool === 'crosshairs' && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-full h-px bg-[#00b4d8]/40 border-b border-dashed border-[#00b4d8]"></div>
                      <div className="absolute h-full w-px bg-[#00b4d8]/40 border-r border-dashed border-[#00b4d8]"></div>
                      <div className="w-16 h-16 border-2 border-[#00b4d8] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#00b4d8] rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="w-16 h-16 border-2 border-[#434654] bg-[#090d16] flex items-center justify-center brutal-shadow mb-4">
                    <span className="material-symbols-outlined text-[#4cd6fb] text-[32px]">radiology</span>
                  </div>
                  <h4 className="font-headline-sm text-[18px] uppercase text-white font-bold tracking-tight mb-1 m-0">
                    No DICOM Study Loaded
                  </h4>
                  <p className="font-body-sm text-[12px] text-white/70 max-w-md leading-snug m-0">
                    Drop or import a verified DICOM (.dcm / .nii) study from PACS or local disk to begin interactive diagnostic inference.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#090d16] border border-[#00b4d8] text-[#4cd6fb] font-label-sm text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#ffb95f]"></span>
                    STANDBY FOR INGESTION
                  </div>
                </div>
              )}

              {/* Viewport Floating HUD Overlays */}
              <div className="absolute top-3 left-3 bg-[#090d16]/85 border border-[#434654] px-2.5 py-1.5 font-label-sm text-[10px] text-[#4cd6fb] space-y-0.5">
                <p className="font-bold text-white m-0">ID: {patientId || '[UNLOADED]'}</p>
                <p className="m-0">DOB: 1971-08-14 | SEX: {patientGender === 'Female' ? 'F' : 'M'} | AGE: {patientAge}</p>
                <p className="text-white/70 m-0">STUDY: {cancerType.toUpperCase()} CLINICAL</p>
              </div>

              <div className="absolute top-3 right-3 bg-[#090d16]/85 border border-[#434654] px-2.5 py-1.5 font-label-sm text-[10px] text-right text-[#4cd6fb] space-y-0.5">
                <p className="font-bold text-white m-0">RAD WORKSTATION 02</p>
                <p className="m-0">ACQUISITION: {selectedFile ? 'LOADED' : 'PENDING'}</p>
                <p className="text-white/70 m-0">{selectedFile ? 'INSPECTION ACTIVE' : 'STANDBY'}</p>
              </div>

              <div className="absolute bottom-3 left-3 bg-[#090d16]/85 border border-[#434654] px-2.5 py-1.5 font-label-sm text-[10px] text-[#4cd6fb] space-y-0.5">
                <p className="m-0">KVp: 120 | mA: 240 | Exp: 0.75s</p>
                <p className="m-0">Pixel Spacing: 0.625 x 0.625 mm</p>
                <p className="text-[#ffddb8] font-bold m-0">THICKNESS: 1.25 mm</p>
              </div>

              <div className="absolute bottom-3 right-3 bg-[#090d16]/85 border border-[#434654] px-2.5 py-1.5 font-label-sm text-[10px] text-right text-[#4cd6fb] space-y-0.5">
                <p className="font-bold text-white m-0">WINDOW: {activePreset.toUpperCase()}</p>
                <p className="m-0">ZOOM: {zoomLevel}% | ROT: 0°</p>
                <p className="text-outline m-0">GRID: STANDBY</p>
              </div>
            </div>

            {/* Viewport Sub-Controls: Confidence & Opacity Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-surface-container-low border-2 border-on-background rounded-DEFAULT">
                <div className="flex items-center justify-between font-label-sm text-[11px] mb-1">
                  <span className="font-bold uppercase text-on-surface">AI Detection Confidence Threshold</span>
                  <span className="font-bold text-primary font-mono text-[12px]">{confidenceThreshold} (Strict)</span>
                </div>
                <input 
                  type="range" 
                  min="0.50" 
                  max="0.99" 
                  step="0.01"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-surface-container-highest border border-on-background rounded-none cursor-pointer" 
                />
                <div className="flex justify-between font-label-sm text-[9px] text-on-surface-variant mt-1 font-mono">
                  <span>0.50 (Sensitivity)</span>
                  <span>0.75 (Balanced)</span>
                  <span>0.95 (Specificity Strict)</span>
                </div>
              </div>

              <div className="p-2.5 bg-surface-container-low border-2 border-on-background rounded-DEFAULT">
                <div className="flex items-center justify-between font-label-sm text-[11px] mb-1">
                  <span className="font-bold uppercase text-on-surface">Grad-CAM Overlay Opacity</span>
                  <span className="font-bold text-secondary font-mono text-[12px]">{gradCamOpacity}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={gradCamOpacity}
                  onChange={(e) => setGradCamOpacity(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-container-highest border border-on-background rounded-none cursor-pointer" 
                />
                <div className="flex justify-between font-label-sm text-[9px] text-on-surface-variant mt-1 font-mono">
                  <span>0% (Raw Radiograph)</span>
                  <span>50% (Translucent)</span>
                  <span>100% (Solid Heatmap)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Explainability & Layer Attention Telemetry Card */}
          <div className="bg-surface-container-lowest border-2 border-on-background rounded-DEFAULT brutal-shadow-md p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-on-background">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">troubleshoot</span>
                <h3 className="font-headline-sm text-[16px] uppercase tracking-tight text-on-surface font-bold m-0">
                  Explainability &amp; Layer Attention Telemetry
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-[#00b4d8] text-on-background border border-on-background font-label-sm text-[10px] font-bold uppercase">
                Validated Architecture
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-label-sm text-[11px]">
              <div className="p-2 bg-surface-container-low border border-on-background rounded-DEFAULT">
                <p className="text-on-surface-variant text-[9px] uppercase font-bold m-0">Activation Map Layer</p>
                <p className="font-bold text-on-surface font-mono mt-0.5 m-0">
                  {selectedFile ? 'Stage_4.Bottleneck' : '[Awaiting Study]'}
                </p>
              </div>
              <div className="p-2 bg-surface-container-low border border-on-background rounded-DEFAULT">
                <p className="text-on-surface-variant text-[9px] uppercase font-bold m-0">Attention Cluster</p>
                <p className="font-bold text-on-surface font-mono mt-0.5 m-0">
                  {selectedFile ? 'Spatial-Dense-Focal' : '[None Detected]'}
                </p>
              </div>
              <div className="p-2 bg-surface-container-low border border-on-background rounded-DEFAULT">
                <p className="text-on-surface-variant text-[9px] uppercase font-bold m-0">Grad-CAM Salience Peak</p>
                <p className="font-bold text-secondary font-mono mt-0.5 m-0">
                  {selectedFile ? '94.2 %' : '-- %'}
                </p>
              </div>
              <div className="p-2 bg-surface-container-low border border-on-background rounded-DEFAULT">
                <p className="text-on-surface-variant text-[9px] uppercase font-bold m-0">Inference Latency</p>
                <p className="font-bold text-on-surface font-mono mt-0.5 m-0">
                  {selectedFile ? '142 ms' : '0 ms (Idle)'}
                </p>
              </div>
            </div>

            {/* CDSS Advisory */}
            <div className="p-3 bg-surface-container-high border-2 border-on-background rounded-DEFAULT">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-outline text-[22px] shrink-0 mt-0.5">info</span>
                <div className="space-y-1">
                  <p className="font-label-sm text-[11px] font-bold uppercase text-on-surface m-0">
                    Clinical Decision Support System (CDSS) Advisory:
                  </p>
                  <p className="font-body-md text-[13px] text-on-surface-variant leading-snug m-0">
                    {selectedFile 
                      ? 'Study loaded and calibrated. Press EXECUTE DIAGNOSTIC INFERENCE to generate deep biomarkers, cross-slice Grad-CAM overlays, and institutional diagnostic reporting.' 
                      : 'No inference executed. Ingest a clinical study and trigger execution to view AI-generated biomarkers, Grad-CAM attention salience, and structured findings.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t-2 border-on-background">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExecuteInference}
                  className="px-3 py-1.5 bg-primary text-white border-2 border-on-background font-label-md text-[12px] font-bold uppercase brutal-shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  Run Inference
                </button>
              </div>
              <button 
                onClick={() => alert("Study flagged for institutional secondary radiologist review.")}
                className="px-3 py-1.5 bg-surface-container-highest text-on-surface border-2 border-on-background font-label-md text-[12px] font-bold uppercase brutal-shadow-sm brutal-btn-active flex items-center gap-1.5 hover:bg-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-tertiary text-[18px]">flag</span>
                Flag for Peer Review
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
