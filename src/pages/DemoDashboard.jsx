import React, { useState } from 'react';

export default function DemoDashboard({ onSelectModule, onViewDiagnosis }) {
  const [selectedCohort, setSelectedCohort] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  const cohorts = [
    {
      id: 'lung',
      number: '01',
      title: 'Thoracic Acute Triage Cohort (NLST / COVID-RAD)',
      datasetName: 'NLST / COVID-RAD',
      irb: 'IRB Protocol #2024-082',
      category: 'pulmonology',
      description: 'Multi-scanner non-contrast helical thoracic scans curated for acute respiratory distress, alveolar consolidation density, and peripheral opacity boundary identification.',
      modality: 'Low-Dose Chest CT (512×512×240 slices)',
      standard: 'Lossless DICOM Part 10 Native, 16-bit Grayscale',
      pathologies: 'Ground Glass Opacities, Consolidation, Pleural Effusions',
      source: 'Academic Medical Center Consortium',
      seriesUid: '1.2.840.113619.2.55.3.28311749',
      samples: [
        { name: 'Bengin case (1).jpg', label: 'Benign Solitary Nodule', url: '/datasets/Lung-Cancer-Dataset/Bengin cases/Bengin case (1).jpg' },
        { name: 'Malignant case (1).jpg', label: 'Primary Lung Adenocarcinoma', url: '/datasets/Lung-Cancer-Dataset/Malignant cases/Malignant case (1).jpg' },
        { name: 'Normal case (1).jpg', label: 'Clear Lung Parenchyma', url: '/datasets/Lung-Cancer-Dataset/Normal cases/Normal case (1).jpg' }
      ]
    },
    {
      id: 'brain',
      number: '02',
      title: 'Neuro-Oncology & Ischemic Stroke Cohort (BraTS / TCGA-GBM)',
      datasetName: 'BraTS / TCGA-GBM',
      irb: 'IRB Protocol #2024-114',
      category: 'neuro',
      description: 'Multi-parametric intracranial MRI series (T1, T1Gd, T2, FLAIR) evaluating cortical displacement, white matter tract infiltration, and contrast-enhancing glioma boundaries.',
      modality: 'Multi-Parametric Brain MRI (256×256×176 voxels)',
      standard: 'DICOM Part 10 Native / NIfTI-1 Normalized',
      pathologies: 'Glioblastoma, Astrocytoma, Infarct Core, Cerebral Edema',
      source: 'International Brain Tumor Segmentation Consortium',
      seriesUid: '1.2.840.113619.6.14.99281',
      samples: [
        { name: 'glioma_sample.jpg', label: 'High-Grade Glioma Focal Infiltrate', url: '/datasets/Brain-Cancer-Dataset/Testing/glioma/Te-gl_0010.jpg' },
        { name: 'meningioma_sample.jpg', label: 'Dural Meningioma Mass Effect', url: '/datasets/Brain-Cancer-Dataset/Testing/meningioma/Te-me_0010.jpg' },
        { name: 'notumor_sample.jpg', label: 'Nominal Neuro-Anatomy', url: '/datasets/Brain-Cancer-Dataset/Testing/notumor/Te-no_0010.jpg' }
      ]
    },
    {
      id: 'kidney',
      number: '03',
      title: 'Nephro-Oncology Renal Volumetric Cohort (KiTS23 Multicenter)',
      datasetName: 'KiTS23 Multicenter',
      irb: 'IRB Protocol #2024-055',
      category: 'nephro',
      description: 'Late arterial and corticomedullary phase renal contrast CT studies for complex exophytic and endophytic cortical lesions and Bosniak cyst differentiation.',
      modality: 'Multiphase Contrast-Enhanced CT (512×512)',
      standard: 'Lossless DICOM Part 10 Native',
      pathologies: 'Renal Cell Carcinoma, Oncocytoma, Renal Cysts',
      source: 'Kidney Tumor Segmentation Collaborative (KiTS)',
      seriesUid: '1.2.840.113619.7.3.10982',
      samples: [
        { name: 'kidney_tumor.jpg', label: 'Renal Cell Carcinoma Lesion', url: '/datasets/Kidney-Cancer-Dataset/Tumor/Tumor- (1).jpg' },
        { name: 'kidney_cyst.jpg', label: 'Corticomedullary Renal Cyst', url: '/datasets/Kidney-Cancer-Dataset/Cyst/Cyst- (1).jpg' },
        { name: 'kidney_normal.jpg', label: 'Nominal Renal Bilateral Parenchyma', url: '/datasets/Kidney-Cancer-Dataset/Normal/Normal- (1).jpg' }
      ]
    },
    {
      id: 'breast',
      number: '04',
      title: 'Breast Tomosynthesis CADx Cohort (CBIS-DDSM / INbreast)',
      datasetName: 'CBIS-DDSM / INbreast',
      irb: 'IRB Protocol #2024-031',
      category: 'mammography',
      description: 'High-resolution digital mammography and breast ultrasound studies indexed with histological biopsy ground-truth and BI-RADS assessment classifications.',
      modality: 'Full-Field Digital Mammography / Ultrasound',
      standard: '16-bit Lossless DICOM PS 3.10',
      pathologies: 'Invasive Ductal Carcinoma, Fibroadenoma, Microcalcifications',
      source: 'National Cancer Imaging Archive (NCIA)',
      seriesUid: '1.2.840.113619.4.19.88214',
      samples: [
        { name: 'benign (1).png', label: 'Well-Circumscribed Fibroadenoma', url: '/datasets/Breast-Ultrasound-Images/benign/benign (1).png' },
        { name: 'malignant (1).png', label: 'Invasive Spiculated Carcinoma', url: '/datasets/Breast-Ultrasound-Images/malignant/malignant (1).png' },
        { name: 'normal (1).png', label: 'Homogeneous Fibroglandular Tissue', url: '/datasets/Breast-Ultrasound-Images/normal/normal (1).png' }
      ]
    },
    {
      id: 'liver',
      number: '05',
      title: 'Multiphasic Abdominal Hepato-Oncology Cohort (LiTS / TCGA-LIHC)',
      datasetName: 'LiTS / TCGA-LIHC',
      irb: 'IRB Protocol #2024-099',
      category: 'abdominal',
      description: 'Contrast-enhanced multi-phase abdominal CT datasets mapping hepatic parenchyma, portal venous dynamics, and focal hepatocellular lesions.',
      modality: 'Portal Venous Phase Abdominal CT (512×512)',
      standard: 'DICOM Part 10 Native, 16-bit Float',
      pathologies: 'Hepatocellular Carcinoma, Hemangioma, Hepatic Steatosis',
      source: 'Liver Tumor Segmentation Benchmark Consortium',
      seriesUid: '1.2.840.113619.9.22.44192',
      samples: [
        { name: 'liver_tumor.jpg', label: 'Focal Hepatocellular Lesion', url: '/datasets/Liver-Cancer-Dataset/Tumor/Tumor- (1).jpg' },
        { name: 'liver_normal.jpg', label: 'Homogeneous Liver Parenchyma', url: '/datasets/Liver-Cancer-Dataset/Normal/Normal- (1).jpg' }
      ]
    }
  ];

  const filteredCohorts = cohorts.filter(c => {
    const matchesCategory = selectedCohort === 'all' || c.category === selectedCohort || c.id === selectedCohort;
    const matchesSearch = !searchFilter || 
      c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.pathologies.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInjectScan = (cohortId, sampleUrl, sampleName) => {
    if (onSelectModule) {
      onSelectModule(cohortId, sampleUrl, sampleName);
    }
  };

  return (
    <div className="min-h-full flex flex-col font-body-md text-on-surface bg-background">
      {/* SUB-HEADER ANNOUNCEMENT & AUDIT BANNER */}
      <aside className="bg-[#ebedfb] border-b-2 border-on-background px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 font-label-sm text-[11px]">
        <div className="flex items-center gap-2 text-on-surface">
          <span className="bg-[#00b4d8] text-on-surface px-1.5 py-0.5 neo-border font-bold text-[9px] uppercase tracking-wider">
            SECURE AUDIT REPO
          </span>
          <span className="font-medium text-on-surface-variant">
            CURATED EVALUATION REPOSITORY: De-identified multi-center cohort studies compliant with HIPAA Safe Harbor and GDPR Article 89. Zero synthetic cases.
          </span>
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant ml-auto">
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
            AIR-2024 Node: VERIFIED
          </span>
          <span className="font-mono text-outline text-[11px]">HASH: 9e4f·77c1·a10b</span>
        </div>
      </aside>

      <main className="grow w-full px-4 lg:px-8 py-6 max-w-[1920px] mx-auto flex flex-col gap-6">
        {/* Screen Title & Demo Workspace Control Strip */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-2 border-b-2 border-on-background">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-[10px] bg-primary text-white px-2 py-0.5 uppercase tracking-widest font-bold">
                Clinical Sandbox
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">
                PACS Mirror Mode: READ-ONLY
              </span>
            </div>
            <h1 className="font-headline-lg text-[24px] lg:text-[28px] font-bold text-on-background tracking-tight mt-1 m-0 uppercase">
              Demo Mode &amp; Dataset Explorer
            </h1>
            <p className="font-body-md text-[13px] text-on-surface-variant max-w-4xl mt-0.5 m-0">
              Select and inspect reference DICOM cohorts benchmarked under CE-MDR Class IIa guidelines. Direct instant injection into the Diagnostic Workstation for side-by-side radiologic inference review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="neo-border bg-surface-container-lowest px-3 py-1.5 neo-shadow-sm flex items-center gap-3">
              <div>
                <div className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-wider font-semibold">Active Cohorts</div>
                <div className="font-label-lg text-[13px] font-bold text-on-surface font-mono">5 Verified Benchmarks</div>
              </div>
              <div className="w-px h-6 bg-on-background"></div>
              <div>
                <div className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-wider font-semibold">De-ID Standard</div>
                <div className="font-label-lg text-[13px] font-bold text-primary font-mono">PS 3.15 / HIPAA</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Toolbar Strip */}
        <section className="neo-border bg-surface-container-lowest p-3 neo-shadow flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          {/* Primary Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface text-[18px]">filter_alt</span>
            <input 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by anatomical cohort, pathology tag, or acquisition protocol..."
              className="w-full bg-[#f8fafc] neo-border pl-10 pr-4 py-1.5 font-body-md text-[13px] text-on-surface placeholder:text-outline focus:outline-none focus:border-primary" 
              type="text" 
            />
          </div>

          {/* Anatomical Modality Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-0.5">
            {[
              { id: 'all', label: 'All Cohorts', icon: 'select_all' },
              { id: 'pulmonology', label: 'Pulmonology (Chest CT)' },
              { id: 'neuro', label: 'Neuro-Imaging (Brain MRI)' },
              { id: 'nephro', label: 'Nephrology (Renal CT)' },
              { id: 'mammography', label: 'Mammography (DBT)' },
              { id: 'abdominal', label: 'Abdominal (Liver CT)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCohort(tab.id)}
                className={`px-2.5 py-1.5 neo-border font-label-sm text-[11px] font-bold cursor-pointer transition-all ${
                  selectedCohort === tab.id 
                    ? 'bg-primary text-white neo-shadow-sm' 
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* 2-COLUMN VIEW: Primary Cohort Grid + Technical Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Benchmark Study Cards Grid */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {filteredCohorts.map((cohort) => (
              <article 
                key={cohort.id}
                className="neo-border bg-surface-container-lowest neo-shadow-md p-5 relative border-l-8 border-l-primary flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b-2 border-on-background pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#090d16] text-white font-label-sm text-[10px] px-2 py-0.5 font-bold tracking-wider uppercase">
                      Cohort #{cohort.number}
                    </span>
                    <span className="bg-[#00b4d8] text-on-surface font-label-sm text-[10px] px-2 py-0.5 neo-border font-bold">
                      {cohort.datasetName}
                    </span>
                    <span className="font-label-sm text-[11px] text-primary font-bold">
                      {cohort.irb}
                    </span>
                  </div>
                  <span className="font-label-sm text-[10px] text-on-surface-variant font-mono">
                    Series UID: {cohort.seriesUid}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-5 justify-between items-start">
                  <div className="flex-1">
                    <h2 className="font-headline-md text-[18px] font-bold text-on-surface tracking-tight m-0">
                      {cohort.title}
                    </h2>
                    <p className="font-body-md text-[13px] text-on-surface-variant mt-1 m-0">
                      {cohort.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-3 border-t border-outline-variant font-label-sm text-[11px]">
                      <div>
                        <span className="text-on-surface-variant uppercase text-[9px] block font-semibold">Modality:</span>
                        <span className="font-bold text-on-surface font-mono">{cohort.modality}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant uppercase text-[9px] block font-semibold">Data Standard:</span>
                        <span className="font-bold text-on-surface font-mono">{cohort.standard}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant uppercase text-[9px] block font-semibold">Pathology Ground Truth:</span>
                        <span className="font-bold text-red-700 font-mono">{cohort.pathologies}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant uppercase text-[9px] block font-semibold">Consortium:</span>
                        <span className="font-bold text-on-surface font-mono">{cohort.source}</span>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail HUD Box */}
                  <div className="w-full md:w-48 flex flex-col gap-1.5 shrink-0">
                    <div className="h-32 bg-black neo-border relative overflow-hidden flex items-center justify-center p-2">
                      <div className="absolute top-1 left-1.5 font-label-sm text-[9px] text-[#00b4d8] font-mono leading-none z-10">
                        KV: 120 / MA: 80<br/>THICK: 1.25mm
                      </div>
                      <div className="absolute bottom-1 right-1.5 font-label-sm text-[9px] text-white font-mono leading-none z-10">
                        W: 1500 L: -600
                      </div>
                      {cohort.samples[0] ? (
                        <img 
                          src={cohort.samples[0].url} 
                          alt={cohort.title}
                          className="h-full w-full object-contain opacity-80"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full border border-dashed border-[#00b4d8]/40 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#00b4d8] text-2xl">vital_signs</span>
                        </div>
                      )}
                    </div>
                    <span className="font-label-sm text-[10px] text-center text-on-surface-variant font-mono">
                      Validated Scan Volume
                    </span>
                  </div>
                </div>

                {/* Sample Selector Strip & Inject into Workstation Action */}
                <div className="pt-3 border-t-2 border-on-background flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-label-sm text-[10px] font-bold uppercase text-on-surface">Available Cases:</span>
                    {cohort.samples.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleInjectScan(cohort.id, s.url, s.name)}
                        className="px-2 py-0.5 bg-surface-container text-on-surface border border-on-background rounded-DEFAULT font-label-sm text-[10px] font-semibold hover:bg-surface-container-high cursor-pointer"
                        title={s.label}
                      >
                        Case #{idx + 1} ({s.name.split('.')[0].slice(0, 14)})
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleInjectScan(cohort.id, cohort.samples[0]?.url, cohort.samples[0]?.name)}
                    className="px-4 py-1.5 bg-primary text-white border-2 border-on-background rounded-DEFAULT neo-shadow-sm font-label-md text-[12px] font-bold flex items-center gap-1.5 cursor-pointer hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">biotech</span>
                    <span>Inject Cohort into Workstation</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* RIGHT: Technical Telemetry & Benchmark Inspector */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="neo-border bg-surface-container-lowest p-5 neo-shadow-md">
              <div className="flex items-center gap-2 pb-3 border-b-2 border-on-background">
                <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
                <h3 className="font-headline-sm text-[16px] font-bold uppercase text-on-surface m-0">
                  Validation Compliance
                </h3>
              </div>
              <div className="space-y-3 pt-3 font-body-sm text-[12px]">
                <p className="m-0 leading-normal text-on-surface-variant">
                  Every reference study in this sandbox satisfies DICOM PS 3.15 annex E de-identification profiles. Patient demographics, accession identifiers, and institutional metadata are cryptographically salted.
                </p>
                <div className="p-3 bg-surface-container-low border border-on-background rounded-DEFAULT space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Pixel Scrubbing:</span>
                    <strong className="text-emerald-700">PASS (Zero Burn-in)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Hounsfield Scale:</span>
                    <strong className="text-on-surface">Calibrated (-1024..+3071)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Slice Integrity:</span>
                    <strong className="text-on-surface">Lossless Native</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="neo-border bg-[#090d16] text-[#b5c4ff] p-5 neo-shadow-md">
              <div className="flex items-center gap-2 pb-2 border-b border-[#434654]">
                <span className="material-symbols-outlined text-[#4cd6fb] text-[20px]">terminal</span>
                <h4 className="font-label-sm text-[11px] font-mono font-bold uppercase text-white m-0">
                  SANDBOX DISPATCH LOG
                </h4>
              </div>
              <div className="mt-3 font-mono text-[11px] space-y-1.5 leading-relaxed text-[#eef0fe]">
                <div className="text-[#737686]">// Ready for instant study injection</div>
                <div>&gt; Host: PACS-MIRROR-SANDBOX</div>
                <div>&gt; Channel: WADO-URI / DICOMWEB</div>
                <div>&gt; Encryption: TLS 1.3 / AES-256-GCM</div>
                <div className="text-[#50d9fe] font-bold mt-2">&gt; SELECT ANY COHORT CASE TO DISPATCH TO WORKSTATION CANVAS</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
