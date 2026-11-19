export type Salutation = 'MR.' | 'MRS.';
export type SerologyResult = 'Non-Reactive' | 'Reactive';

export interface DateTimeParts {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
}

export interface ReportFormData {
  salutation: Salutation;
  patientName: string;
  age: string;
  collected: DateTimeParts;
  received: DateTimeParts;
  reported: DateTimeParts;
  hepatitisB: SerologyResult;
  hiv: SerologyResult;
  hepatitisC: SerologyResult;
  glucoseFasting: string;
  glucosePostprandial: string;
  sampleIdMain: string;
  sampleIdPostprandial: string;
  clientName: string;
  refDoctor: string;
}

export const DEFAULT_REPORT_DATA: ReportFormData = {
  salutation: 'MRS.',
  patientName: 'GHASNIN KURRE',
  age: '77',
  collected: {
    date: '2026-11-18',
    time: '12:10:01',
  },
  received: {
    date: '2026-11-18',
    time: '12:35:01',
  },
  reported: {
    date: '2026-11-18',
    time: '16:56:42',
  },
  hepatitisB: 'Non-Reactive',
  hiv: 'Non-Reactive',
  hepatitisC: 'Non-Reactive',
  glucoseFasting: '62.3',
  glucosePostprandial: '89.7',
  sampleIdMain: '246324659',
  sampleIdPostprandial: '246324657',
  clientName: '1CGRPR388',
  refDoctor: 'BSP',
};

export function formatReportDateTime(parts: DateTimeParts): string {
  if (!parts.date) return '';
  const [year, month, day] = parts.date.split('-');
  if (!year || !month || !day) return '';
  const rawTime = (parts.time || '00:00:00').trim();
  const timeSegments = rawTime.split(':');
  const hh = (timeSegments[0] || '00').padStart(2, '0');
  const mm = (timeSegments[1] || '00').padStart(2, '0');
  const ss = (timeSegments[2] || '00').padStart(2, '0');
  return `${day}/${month}/${year} ${hh}:${mm}:${ss}`;
}

export function getGenderLabel(salutation: Salutation): 'MALE' | 'FEMALE' {
  return salutation === 'MR.' ? 'MALE' : 'FEMALE';
}

export function formatFullPatientName(salutation: Salutation, rawName: string): string {
  const cleaned = rawName
    .trim()
    .replace(/^(mr\.?|mrs\.?|ms\.?|miss)\s+/i, '')
    .toUpperCase();
  if (!cleaned) {
    return `${salutation} PATIENT NAME`;
  }
  return `${salutation} ${cleaned}`;
}

export function buildPdfFilename(salutation: Salutation, rawName: string): string {
  const cleaned = rawName
    .trim()
    .replace(/^(mr\.?|mrs\.?|ms\.?|miss)\s+/i, '')
    .toUpperCase()
    .replace(/[^A-Z\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const prefix = salutation === 'MR.' ? 'MR' : 'MRS';
  const base = cleaned || 'PATIENT';
  return `${prefix} ${base}.pdf`;
}
