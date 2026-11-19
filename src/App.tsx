import React, {useState} from 'react';
import {Download} from 'lucide-react';
import {ReportForm} from './components/ReportForm';
import {
  Page1Serology,
  Page2FastingGlucose,
  Page3PostprandialGlucose,
} from './components/ReportPages';
import {
  DEFAULT_REPORT_DATA,
  ReportFormData,
  buildPdfFilename,
} from './types/report';
import {generateReportPdf} from './utils/pdfExport';

export default function App() {
  const [formData, setFormData] = useState<ReportFormData>(DEFAULT_REPORT_DATA);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    setExportError(null);
    setIsGenerating(true);
    try {
      const filename = buildPdfFilename(formData.salutation, formData.patientName);
      await generateReportPdf(formData, filename);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to generate PDF document.';
      setExportError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setFormData(DEFAULT_REPORT_DATA);
    setExportError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Top Bar: 3-Zone Contract */}
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a
            href="#top"
            className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            TRUtest Report Studio
          </a>

          <nav className="hidden sm:flex items-center gap-5 text-sm font-medium text-slate-600">
            <a
              href="#patient-section"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Patient
            </a>
            <a
              href="#timestamps-section"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Timestamps
            </a>
            <a
              href="#serology-section"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Serology
            </a>
            <a
              href="#biochemistry-section"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Biochemistry
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#1E4C9A] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#173D7D] disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4 shrink-0" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Mobile-Friendly Single-Column Form Workspace */}
      <main id="top" className="no-print mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
        <div className="mb-5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 text-balance sm:text-2xl">
            Laboratory Report PDF Generator
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Fill in patient details, collection timestamps, serology outcomes, and glucose values to download the 3-page A4 report PDF.
          </p>
        </div>

        {exportError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800"
          >
            PDF export failed: {exportError}
          </div>
        )}

        <ReportForm
          data={formData}
          onChange={setFormData}
          onReset={handleReset}
          onDownloadPdf={handleDownloadPdf}
          onPrint={handlePrint}
          isGenerating={isGenerating}
        />
      </main>

      {/* Native Print Container (Exact A4 Template) */}
      <div
        className="print-only-container"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -50,
        }}
      >
        <Page1Serology data={formData} />
        <Page2FastingGlucose data={formData} />
        <Page3PostprandialGlucose data={formData} />
      </div>
    </div>
  );
}
