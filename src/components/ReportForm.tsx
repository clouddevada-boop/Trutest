import React, {useState} from 'react';
import {Check, ChevronDown, ChevronUp, Download, Printer, RotateCcw} from 'lucide-react';
import {
  DateTimeParts,
  ReportFormData,
  Salutation,
  SerologyResult,
} from '../types/report';

interface ReportFormProps {
  data: ReportFormData;
  onChange: (next: ReportFormData) => void;
  onReset: () => void;
  onDownloadPdf: () => void;
  onPrint: () => void;
  isGenerating: boolean;
}

function getFastingClinicalNote(raw: string): string {
  const num = Number.parseFloat(raw);
  if (Number.isNaN(num)) return 'Reference: Normal 70–100 mg/dL';
  if (num < 70) return 'Below normal reference (< 70 mg/dL)';
  if (num <= 100) return 'Within normal range (70–100 mg/dL)';
  if (num <= 125) return 'Impaired fasting glucose range (101–125 mg/dL)';
  return 'Diabetes mellitus range (≥ 126 mg/dL)';
}

function getPostprandialClinicalNote(raw: string): string {
  const num = Number.parseFloat(raw);
  if (Number.isNaN(num)) return 'Reference: 70–140 mg/dL';
  if (num < 70) return 'Below reference range (< 70 mg/dL)';
  if (num <= 140) return 'Within reference range (70–140 mg/dL)';
  return 'Above reference range (> 140 mg/dL)';
}

export function ReportForm({
  data,
  onChange,
  onReset,
  onDownloadPdf,
  onPrint,
  isGenerating,
}: ReportFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateField = <K extends keyof ReportFormData>(
    key: K,
    value: ReportFormData[K]
  ) => {
    onChange({...data, [key]: value});
  };

  const updateDateTime = (
    key: 'collected' | 'received' | 'reported',
    part: keyof DateTimeParts,
    value: string
  ) => {
    onChange({
      ...data,
      [key]: {
        ...data[key],
        [part]: value,
      },
    });
  };

  const renderSerologyControl = (
    label: string,
    sublabel: string,
    field: 'hepatitisB' | 'hiv' | 'hepatitisC'
  ) => {
    const current = data[field];
    const options: SerologyResult[] = ['Non-Reactive', 'Reactive'];

    return (
      <div className="py-3.5 first:pt-0 last:pb-0">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">{label}</div>
            <div className="text-xs text-slate-500">{sublabel}</div>
          </div>
          <div
            className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0"
            role="group"
            aria-label={label}
          >
            {options.map((opt) => {
              const active = current === opt;
              const isReactive = opt === 'Reactive';
              const activeClass = active
                ? isReactive
                  ? 'option-btn-active-reactive'
                  : 'option-btn-active'
                : '';

              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={active}
                  onClick={() => updateField(field, opt)}
                  className={`option-btn ${activeClass}`}
                >
                  {active && <Check className="mr-1.5 h-3.5 w-3.5 shrink-0" />}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDateTimeRow = (
    label: string,
    field: 'collected' | 'received' | 'reported'
  ) => {
    const value = data[field];
    return (
      <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[96px_1fr] sm:items-center sm:gap-3">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            type="date"
            aria-label={`${label} Date`}
            value={value.date}
            onChange={(e) => updateDateTime(field, 'date', e.target.value)}
            className="field-input font-mono-tabular"
          />
          <input
            type="time"
            step="1"
            aria-label={`${label} Time`}
            value={value.time}
            onChange={(e) => updateDateTime(field, 'time', e.target.value)}
            className="field-input font-mono-tabular"
          />
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onDownloadPdf();
      }}
      className="flex flex-col gap-5"
    >
      {/* Section 1: Patient Details */}
      <section id="patient-section" className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            01. Patient Identification
          </h2>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Sample
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Prefix / Gender Selector */}
          <div>
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">
              Title &amp; Gender
            </span>
            <div
              className="grid grid-cols-2 gap-2.5"
              role="group"
              aria-label="Title and Gender"
            >
              {(
                [
                  {salutation: 'MR.' as Salutation, label: 'Mr. · Male'},
                  {salutation: 'MRS.' as Salutation, label: 'Mrs. · Female'},
                ] as const
              ).map((item) => {
                const active = data.salutation === item.salutation;
                return (
                  <button
                    key={item.salutation}
                    type="button"
                    aria-pressed={active}
                    onClick={() => updateField('salutation', item.salutation)}
                    className={`option-btn w-full ${active ? 'option-btn-active' : ''}`}
                  >
                    {active && <Check className="mr-1.5 h-3.5 w-3.5 shrink-0" />}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patient Name + Age */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[1fr_120px]">
            <div>
              <label
                htmlFor="patient-name"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Patient Full Name
              </label>
              <input
                id="patient-name"
                type="text"
                required
                placeholder="e.g. GHASNIN KURRE"
                value={data.patientName}
                onChange={(e) => updateField('patientName', e.target.value)}
                className="field-input"
              />
            </div>

            <div>
              <label
                htmlFor="patient-age"
                className="mb-1.5 block text-xs font-semibold text-slate-700"
              >
                Age (Yrs)
              </label>
              <input
                id="patient-age"
                type="number"
                min="0"
                max="130"
                required
                placeholder="77"
                value={data.age}
                onChange={(e) => updateField('age', e.target.value)}
                className="field-input font-mono-tabular"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Sample & Reporting Timestamps */}
      <section id="timestamps-section" className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            02. Collection &amp; Reporting Timestamps
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Formatted as DD/MM/YYYY HH:mm:ss on all 3 report pages.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {renderDateTimeRow('Collected', 'collected')}
          {renderDateTimeRow('Received', 'received')}
          {renderDateTimeRow('Reported', 'reported')}
        </div>
      </section>

      {/* Section 3: Immunology / Serology */}
      <section id="serology-section" className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-3 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            03. Immunology / Serology Panel
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Page 1 rapid screening results (Serum).
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {renderSerologyControl(
            'Hepatitis B (HBsAg)',
            'Immunochromatography · Ref: Non Reactive',
            'hepatitisB'
          )}
          {renderSerologyControl(
            'HIV 1 & 2 Antibody',
            'Immunochromatography · Rapid Screen',
            'hiv'
          )}
          {renderSerologyControl(
            'Hepatitis C Virus (HCV)',
            'Rapid Serum Screening',
            'hepatitisC'
          )}
        </div>
      </section>

      {/* Section 4: Clinical Biochemistry */}
      <section id="biochemistry-section" className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            04. Clinical Biochemistry (Glucose)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Pages 2 &amp; 3 plasma glucose values in mg/dL.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <label
                htmlFor="glucose-fasting"
                className="text-xs font-semibold text-slate-700"
              >
                Glucose - Fasting
              </label>
              <span className="font-mono-tabular text-[11px] text-slate-500">
                mg/dL
              </span>
            </div>
            <input
              id="glucose-fasting"
              type="text"
              inputMode="decimal"
              required
              placeholder="62.3"
              value={data.glucoseFasting}
              onChange={(e) => updateField('glucoseFasting', e.target.value)}
              className="field-input font-mono-tabular font-medium"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              {getFastingClinicalNote(data.glucoseFasting)}
            </p>
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <label
                htmlFor="glucose-pp"
                className="text-xs font-semibold text-slate-700"
              >
                Glucose - Postprandial
              </label>
              <span className="font-mono-tabular text-[11px] text-slate-500">
                mg/dL
              </span>
            </div>
            <input
              id="glucose-pp"
              type="text"
              inputMode="decimal"
              required
              placeholder="89.7"
              value={data.glucosePostprandial}
              onChange={(e) => updateField('glucosePostprandial', e.target.value)}
              className="field-input font-mono-tabular font-medium"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              {getPostprandialClinicalNote(data.glucosePostprandial)}
            </p>
          </div>
        </div>
      </section>

      {/* Optional Report Identifiers (Collapsed by default so template values remain unchanged) */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex min-h-[44px] w-full items-center justify-between px-4 py-3 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 rounded-xl sm:px-5"
        >
          <span>Report Reference Identifiers (Optional)</span>
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 gap-3 border-t border-slate-100 p-4 sm:grid-cols-2 sm:p-5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Sample ID (Pg 1 &amp; 2)
              </label>
              <input
                type="text"
                value={data.sampleIdMain}
                onChange={(e) => updateField('sampleIdMain', e.target.value)}
                className="field-input font-mono-tabular"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Sample ID (Pg 3 PP)
              </label>
              <input
                type="text"
                value={data.sampleIdPostprandial}
                onChange={(e) =>
                  updateField('sampleIdPostprandial', e.target.value)
                }
                className="field-input font-mono-tabular"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Client Name
              </label>
              <input
                type="text"
                value={data.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                className="field-input font-mono-tabular"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Ref. Doctor
              </label>
              <input
                type="text"
                value={data.refDoctor}
                onChange={(e) => updateField('refDoctor', e.target.value)}
                className="field-input font-mono-tabular"
              />
            </div>
          </div>
        )}
      </section>

      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isGenerating}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#1E4C9A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#173D7D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4 shrink-0" />
          {isGenerating ? 'Generating 3-Page A4 PDF...' : 'Generate & Download PDF'}
        </button>

        <button
          type="button"
          onClick={onPrint}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
        >
          <Printer className="h-4 w-4 shrink-0" />
          Print Report
        </button>
      </div>
    </form>
  );
}
