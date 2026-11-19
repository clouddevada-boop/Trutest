import {jsPDF} from 'jspdf';
import {
  ReportFormData,
  formatFullPatientName,
  formatReportDateTime,
  getGenderLabel,
} from '../types/report';

const PAGE_W = 210;
const MARGIN_L = 10.6;
const MARGIN_R = 199.4;
const CONTENT_W = MARGIN_R - MARGIN_L;

const COLOR_BLUE = '#1E4C9A';
const COLOR_TEAL = '#14B5A4';
const COLOR_BLACK = '#000000';

function createGradientPillDataUrl(
  c0: string,
  c1: string,
  c2: string,
  c3: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 440;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const radius = 12;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(canvas.width - radius, 0);
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
  ctx.lineTo(canvas.width, canvas.height - radius);
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
  ctx.lineTo(radius, canvas.height);
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, c0);
  grad.addColorStop(0.35, c1);
  grad.addColorStop(0.7, c2);
  grad.addColorStop(1, c3);
  ctx.fillStyle = grad;
  ctx.fill();

  return canvas.toDataURL('image/png');
}

function createPinIconDataUrl(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 56;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.save();
  ctx.scale(2, 2);
  ctx.beginPath();
  ctx.moveTo(12, 2);
  ctx.bezierCurveTo(8.13, 2, 5, 5.13, 5, 9);
  ctx.bezierCurveTo(5, 14.25, 12, 22, 12, 22);
  ctx.bezierCurveTo(12, 22, 19, 14.25, 19, 9);
  ctx.bezierCurveTo(19, 5.13, 15.87, 2, 12, 2);
  ctx.closePath();
  ctx.fillStyle = '#E6F7F5';
  ctx.fill();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = '#19B0A0';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(12, 9, 2.6, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = '#1E4C9A';
  ctx.stroke();
  ctx.restore();

  return canvas.toDataURL('image/png');
}

async function loadCroppedSignatureDataUrl(): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = 3;
        // Crop off the bottom 4px text sliver from the 128x87 source image
        const cropW = img.naturalWidth || 128;
        const cropH = Math.max(1, (img.naturalHeight || 87) - 5);
        const canvas = document.createElement('canvas');
        canvas.width = cropW * scale;
        canvas.height = cropH * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, cropW, cropH, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = '/assets/aistudio/image_56bd29ca.png';
  });
}

function drawSpacedText(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  charSpacingMm: number
) {
  let cursorX = x;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    pdf.text(ch, cursorX, y);
    cursorX += pdf.getTextWidth(ch) + charSpacingMm;
  }
}

function measureSpacedText(pdf: jsPDF, text: string, charSpacingMm: number): number {
  let total = 0;
  for (let i = 0; i < text.length; i++) {
    total += pdf.getTextWidth(text[i]);
    if (i < text.length - 1) total += charSpacingMm;
  }
  return total;
}

function drawHeader(pdf: jsPDF, data: ReportFormData, sampleId: string) {
  const fullName = formatFullPatientName(data.salutation, data.patientName);
  const genderLabel = getGenderLabel(data.salutation);
  const ageText = data.age.trim() ? `${data.age.trim()} Yrs` : '- Yrs';

  // Top-left blue banner
  pdf.setFillColor(COLOR_BLUE);
  pdf.rect(MARGIN_L, 6.2, 54.5, 6.4, 'F');
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor('#FFFFFF');
  pdf.text('LABORATORY TEST REPORT', MARGIN_L + 3.0, 10.6);

  // Top-right TRUtest DIAGNOSTICS logo (matches original ~62mm width / 48pt size)
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(48);
  const testWidth = pdf.getTextWidth('test');
  const truWidth = pdf.getTextWidth('TRU');
  const logoRight = MARGIN_R;
  const testX = logoRight - testWidth;
  const truX = testX - truWidth;

  pdf.setTextColor(COLOR_TEAL);
  pdf.text('TRU', truX, 17.5);
  pdf.setTextColor(COLOR_BLUE);
  pdf.text('test', testX, 17.5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12.2);
  pdf.setTextColor(COLOR_BLACK);
  const diagLabel = 'DIAGNOSTICS';
  const diagW = measureSpacedText(pdf, diagLabel, 2.35);
  const logoCenter = truX + (truWidth + testWidth) / 2;
  drawSpacedText(pdf, diagLabel, logoCenter - diagW / 2, 23.6, 2.35);

  // Metadata Left Column
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(COLOR_BLACK);

  pdf.text('Name', MARGIN_L, 28.8);
  pdf.text(fullName, MARGIN_L + 23.8, 28.8);

  pdf.text('Age/Gender', MARGIN_L, 35.6);
  pdf.text(`: ${ageText} / ${genderLabel}`, MARGIN_L + 23.8, 35.6);

  pdf.text('Sample ID', MARGIN_L, 41.0);
  pdf.text(`: ${sampleId}`, MARGIN_L + 23.8, 41.0);

  pdf.text('Client Name', MARGIN_L, 46.4);
  pdf.text(`: ${data.clientName}`, MARGIN_L + 23.8, 46.4);

  // Metadata Right Column
  const rightLabelX = 120.2;
  const rightValX = 140.4;

  pdf.text('Ref. Doctor', rightLabelX, 30.8);
  pdf.text(`: ${data.refDoctor}`, rightValX, 30.8);

  pdf.text('Collected', rightLabelX, 36.2);
  pdf.text(`: ${formatReportDateTime(data.collected)}`, rightValX, 36.2);

  pdf.text('Received', rightLabelX, 41.6);
  pdf.text(`: ${formatReportDateTime(data.received)}`, rightValX, 41.6);

  pdf.text('Reported', rightLabelX, 47.0);
  pdf.text(`: ${formatReportDateTime(data.reported)}`, rightValX, 47.0);

  // Department Banner
  pdf.setDrawColor(COLOR_BLACK);
  pdf.setLineWidth(0.35);
  pdf.line(MARGIN_L, 51.4, MARGIN_R, 51.4);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(COLOR_BLACK);
  pdf.text('DEPARTMENT OF IMMUNOLOGY / SEROLOGY', MARGIN_L, 55.6);

  pdf.line(MARGIN_L, 57.6, MARGIN_R, 57.6);
}

function drawFooter(
  pdf: jsPDF,
  pageNumber: 1 | 2 | 3,
  signatureDataUrl: string | null,
  pinIconDataUrl: string
) {
  // Signature image
  if (signatureDataUrl) {
    pdf.addImage(signatureDataUrl, 'PNG', 160.5, 250.5, 24.5, 16.0, undefined, 'NONE');
  }

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.2);
  pdf.setTextColor(COLOR_BLACK);
  pdf.text('Dr. Raju Bhaisare', 163.0, 269.6);
  pdf.text('MD Pathology', 163.0, 273.6);

  // Page Number
  pdf.setFontSize(8.5);
  pdf.text(`Page ${pageNumber} of 3`, PAGE_W / 2, 272.6, {align: 'center'});

  // Split Teal / Blue Horizontal Accent Bar
  pdf.setFillColor('#19B8A5');
  pdf.rect(0, 276.2, 64.0, 1.35, 'F');
  pdf.setFillColor(COLOR_BLUE);
  pdf.rect(64.0, 276.2, PAGE_W - 64.0, 1.35, 'F');

  // Pin Icon + Clinic Address
  const address =
    'Shop No. 7B/189, Ground Floor Smriti Nagar, Durg, Bhilai, Durg \u2013 491001, Chhattisgarh';
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10.8);
  pdf.setTextColor(COLOR_BLACK);

  const addrWidth = pdf.getTextWidth(address);
  const iconW = 4.0;
  const iconGap = 1.6;
  const totalW = iconW + iconGap + addrWidth;
  const startX = (PAGE_W - totalW) / 2;

  if (pinIconDataUrl) {
    pdf.addImage(pinIconDataUrl, 'PNG', startX, 280.4, iconW, 4.7, undefined, 'NONE');
  }
  pdf.text(address, startX + iconW + iconGap, 284.0);
}

function drawTestTableHeader(pdf: jsPDF, y: number) {
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(COLOR_BLACK);
  pdf.text('TEST DESCRIPTION', MARGIN_L, y);
  pdf.text('RESULT', 80.5, y);
  pdf.text('UNITS', 119.5, y);
  pdf.text('BIOLOGICAL REFERENCE INTERVAL', 142.0, y);
}

function drawSectionHeading(
  pdf: jsPDF,
  title: string,
  specimen: string,
  y: number
) {
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10.5);
  pdf.setTextColor(COLOR_BLACK);
  pdf.text(title, MARGIN_L, y);
  const titleW = pdf.getTextWidth(title);

  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(9.5);
  pdf.text(` ${specimen}`, MARGIN_L + titleW, y);
}

function drawBulletList(
  pdf: jsPDF,
  items: string[],
  startY: number,
  x: number,
  maxWidth: number,
  fontSize: number,
  lineStep: number,
  itemGap: number,
  bulletChar = '\u2022'
): number {
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(fontSize);
  pdf.setTextColor(COLOR_BLACK);

  let y = startY;
  for (const item of items) {
    const lines = pdf.splitTextToSize(item, maxWidth - 4.0) as string[];
    pdf.text(bulletChar, x, y);
    for (let i = 0; i < lines.length; i++) {
      pdf.text(lines[i], x + 3.8, y);
      y += lineStep;
    }
    y += itemGap;
  }
  return y;
}

function drawGreaterEqualSymbol(pdf: jsPDF, x: number, y: number) {
  pdf.setDrawColor(COLOR_BLACK);
  pdf.setLineWidth(0.24);
  // '>' chevron
  pdf.line(x, y - 2.1, x + 1.5, y - 1.35);
  pdf.line(x + 1.5, y - 1.35, x, y - 0.6);
  // bottom bar of '>='
  pdf.line(x, y - 0.1, x + 1.5, y - 0.1);
}

function drawTwoColTable(
  pdf: jsPDF,
  x: number,
  startY: number,
  col1W: number,
  col2W: number,
  headers: [string, string],
  rows: [string, string][],
  borderColor: string,
  fontSize: number,
  centerBody: boolean
): number {
  pdf.setDrawColor(borderColor);
  pdf.setLineWidth(0.25);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(fontSize);
  pdf.setTextColor(COLOR_BLACK);

  const rowH = 6.3;
  let y = startY;

  // Header Row
  pdf.rect(x, y, col1W, rowH, 'S');
  pdf.rect(x + col1W, y, col2W, rowH, 'S');
  pdf.text(headers[0], x + col1W / 2, y + 4.3, {align: 'center'});
  pdf.text(headers[1], x + col1W + col2W / 2, y + 4.3, {align: 'center'});
  y += rowH;

  // Body Rows
  for (const [leftText, rightText] of rows) {
    const leftLines = pdf.splitTextToSize(leftText, col1W - 4.0) as string[];
    const rightLines = pdf.splitTextToSize(rightText, col2W - 4.0) as string[];
    const maxLines = Math.max(leftLines.length, rightLines.length);
    const cellH = Math.max(rowH, maxLines * 3.8 + 2.8);

    pdf.rect(x, y, col1W, cellH, 'S');
    pdf.rect(x + col1W, y, col2W, cellH, 'S');

    if (centerBody) {
      for (let i = 0; i < leftLines.length; i++) {
        pdf.text(leftLines[i], x + col1W / 2, y + 4.2 + i * 3.8, {align: 'center'});
      }
      for (let i = 0; i < rightLines.length; i++) {
        pdf.text(rightLines[i], x + col1W + col2W / 2, y + 4.2 + i * 3.8, {align: 'center'});
      }
    } else {
      for (let i = 0; i < leftLines.length; i++) {
        pdf.text(leftLines[i], x + 1.8, y + 4.2 + i * 3.8);
      }
      for (let i = 0; i < rightLines.length; i++) {
        pdf.text(rightLines[i], x + col1W + 1.8, y + 4.2 + i * 3.8);
      }
    }

    y += cellH;
  }

  return y;
}

export async function generateReportPdf(
  data: ReportFormData,
  filename: string
): Promise<void> {
  const [signatureDataUrl, pinIconDataUrl] = await Promise.all([
    loadCroppedSignatureDataUrl(),
    Promise.resolve(createPinIconDataUrl()),
  ]);

  const greenPill = createGradientPillDataUrl('#85E07F', '#5BC55D', '#32A432', '#1B931B');
  const amberPill = createGradientPillDataUrl('#FFD175', '#FFC24D', '#FFB42A', '#FFAE18');
  const redPill = createGradientPillDataUrl('#FFB7B4', '#FF8585', '#FE5655', '#FE3535');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // =========================================================================
  // PAGE 1: IMMUNOLOGY / SEROLOGY
  // =========================================================================
  drawHeader(pdf, data, data.sampleIdMain);

  // Hepatitis B
  drawSectionHeading(
    pdf,
    'Hepatitis B Surface antigen (HBsAg )Rapid',
    '(Serum)',
    63.2
  );
  drawTestTableHeader(pdf, 69.5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(COLOR_BLACK);
  pdf.text('Hepatitis B Surface antigen (HBsAg)', MARGIN_L, 75.6);
  pdf.text('Rapid', MARGIN_L, 79.8);
  pdf.setFontSize(7);
  pdf.text('Method :- Immunochromatography', MARGIN_L, 83.2);

  pdf.setFontSize(9);
  pdf.text(':', 73.5, 75.6);
  pdf.text(data.hepatitisB, 80.5, 75.6);
  pdf.text('Non Reactive', 142.0, 75.6);

  // HIV 1 & 2
  drawSectionHeading(pdf, 'HIV 1 & 2 ANTIBODY (RAPID)', '(Serum)', 95.8);
  drawTestTableHeader(pdf, 102.0);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(COLOR_BLACK);
  pdf.text('HIV 1 & 2 Antibody (Rapid)', MARGIN_L, 108.2);
  pdf.setFontSize(7);
  pdf.text('Method :- Immunochromatography', MARGIN_L, 111.6);

  pdf.setFontSize(9);
  pdf.text(':', 73.5, 108.2);
  pdf.text(data.hiv, 80.5, 108.2);

  // Interpretation & Remarks
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.8);
  pdf.text('Interpretation :', MARGIN_L, 118.2);
  const interpW = pdf.getTextWidth('Interpretation :');
  pdf.setLineWidth(0.2);
  pdf.line(MARGIN_L, 118.8, MARGIN_L + interpW, 118.8);

  pdf.text('Interpretation & Remarks:', MARGIN_L, 123.5);

  let nextY = drawBulletList(
    pdf,
    [
      'Kindly confirm all reactive results by ELISA and Western Blot method or virus detection by PCR.',
      'Non-reactive result does not rule out the possibility of exposure to or infection with HIV.',
      'This is a single screening test with limitations and instances of false positivity or false negativity cannot be ruled out.',
      'In case of reactive results, final diagnosis of HIV to be done by following WHO strategy III.',
      'It is beyond the scope of this laboratory to follow the strategy unless patient co-operates economically and with more number of samples.',
      'The patient is advised to go to his/her referring doctor for counselling with test results.',
      'The patient is also advised to go to NACO/MDAC counselling centers.',
    ],
    128.4,
    MARGIN_L + 1.5,
    CONTENT_W - 2.0,
    7.8,
    3.6,
    1.5
  );

  pdf.text('Interfering Substances:', MARGIN_L, nextY + 0.8);

  drawBulletList(
    pdf,
    [
      'False positive can occur in patient who have autoimmune disease, lymphoproliferative disease, leukemia, lymphoma, syphilis, or alcoholism.',
      'False positive results can occur in non-infected pregnant woman.',
      'HIV-2 infection can cause positive HIV-1/ HIV-2 screening antibody test and an indeterminate WB HIV-1 confirmatory test.',
      'False negative results can occur in the early incubation stage or final stage of AIDS.',
    ],
    nextY + 5.6,
    MARGIN_L + 1.5,
    CONTENT_W - 2.0,
    7.8,
    3.6,
    1.5
  );

  // Hepatitis C
  drawSectionHeading(pdf, 'Hepatitis C Virus (Rapid)', '(Serum)', 216.2);
  drawTestTableHeader(pdf, 222.5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(COLOR_BLACK);
  pdf.text('Hepatitis C Virus (Rapid)', MARGIN_L, 228.8);
  pdf.text(':', 73.5, 228.8);
  pdf.text(data.hepatitisC, 80.5, 228.8);

  drawFooter(pdf, 1, signatureDataUrl, pinIconDataUrl);

  // =========================================================================
  // PAGE 2: CLINICAL BIOCHEMISTRY - GLUCOSE FASTING
  // =========================================================================
  pdf.addPage('a4', 'portrait');
  drawHeader(pdf, data, data.sampleIdMain);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(COLOR_BLACK);
  pdf.text('DEPARTMENT OF CLINICAL BIOCHEMISTRY', PAGE_W / 2, 63.2, {
    align: 'center',
  });
  pdf.setLineWidth(0.35);
  pdf.line(MARGIN_L, 65.2, MARGIN_R, 65.2);

  drawSectionHeading(pdf, 'Glucose Fasting', '(Plasma Na [F])', 70.6);
  drawTestTableHeader(pdf, 76.8);

  const fastingValue = data.glucoseFasting.trim() || '-';
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('Glucose - Fasting', MARGIN_L, 83.0);
  pdf.setFont('helvetica', 'normal');
  pdf.text(':', 71.0, 83.0);
  pdf.setFont('helvetica', 'bold');
  pdf.text(fastingValue, 80.5, 83.0);
  pdf.text('mg/dL', 119.5, 83.0);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('Normal : 70-100', 142.0, 83.0);
  pdf.text('Impaired fasting glucose : 101-125', 142.0, 87.2);
  const dmLabel = 'Diabetes Mellitus : ';
  pdf.text(dmLabel, 142.0, 91.4);
  const dmW = pdf.getTextWidth(dmLabel);
  drawGreaterEqualSymbol(pdf, 142.0 + dmW + 0.3, 91.4);
  pdf.text('126', 142.0 + dmW + 2.4, 91.4);

  // Interpretation & Gradient Pills
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('Interpretation', MARGIN_L, 97.6);

  const pillW = 55.0;
  const pillH = 7.6;
  const pillGap = 8.8;
  const pillX1 = MARGIN_L + 3.0;
  const pillX2 = pillX1 + pillW + pillGap;
  const pillX3 = pillX2 + pillW + pillGap;

  // Row 1
  if (greenPill) pdf.addImage(greenPill, 'PNG', pillX1, 102.0, pillW, pillH, undefined, 'NONE');
  if (amberPill) pdf.addImage(amberPill, 'PNG', pillX2, 102.0, pillW, pillH, undefined, 'NONE');
  if (redPill) pdf.addImage(redPill, 'PNG', pillX3, 102.0, pillW, pillH, undefined, 'NONE');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.8);
  pdf.setTextColor(COLOR_BLACK);
  pdf.text('Normal Glucose', pillX1 + 4.2, 106.9);
  pdf.text('Impaired fasting glucose', pillX2 + 4.2, 106.9);
  pdf.text('Diabetes Mellitus', pillX3 + 4.2, 106.9);

  // Row 2
  if (greenPill) pdf.addImage(greenPill, 'PNG', pillX1, 117.6, pillW, pillH, undefined, 'NONE');
  if (amberPill) pdf.addImage(amberPill, 'PNG', pillX2, 117.6, pillW, pillH, undefined, 'NONE');
  if (redPill) pdf.addImage(redPill, 'PNG', pillX3, 117.6, pillW, pillH, undefined, 'NONE');

  pdf.text('70 - 100', pillX1 + 4.2, 122.5);
  pdf.text('101 - 125', pillX2 + 4.2, 122.5);
  pdf.text('>= 126', pillX3 + 4.2, 122.5);

  // Explanatory paragraph
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.6);
  const p2Intro = pdf.splitTextToSize(
    'Glucose is a primary cellular energy source. Fasting plasma glucose concentration and tolerance to a dose of glucose are used to establish the diagnosis of diabetes mellitus and disorders of carbohydrate metabolism.',
    CONTENT_W
  ) as string[];
  let p2Y = 135.2;
  for (const line of p2Intro) {
    pdf.text(line, MARGIN_L, p2Y);
    p2Y += 3.8;
  }

  const p2TableEndY = drawTwoColTable(
    pdf,
    MARGIN_L,
    p2Y + 0.8,
    92.5,
    89.0,
    ['Increased in', 'Decreased In'],
    [
      ['Diabetes Mellitus', 'Pancreatic disorders'],
      ['Stress (e.g.: emotion, burns ,shock, anesthesia)', 'Extra pancreatic tumors'],
      ['Acute Pancreatitis', 'Endocrine disorders'],
      ['Chronic Pancreatitis', 'Malnutrition'],
      ['Wernicke encephalopathy (Vitamin B1 deficiency)', 'Hypothalamic lesions'],
      ['Effect of Drugs (e.g.: Corticosteroids, estrogens,alcohol, phenytoin, thiazides)', 'Alcoholism'],
    ],
    '#888888',
    7.6,
    false
  );

  // Limitations & Associated Tests
  let p2NotesY = p2TableEndY + 7.5;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.6);
  pdf.text('Limitations', MARGIN_L, p2NotesY);
  p2NotesY = drawBulletList(
    pdf,
    [
      'Glucose levels may be affected by recent food intake, fasting duration, stress, exercise, acute illness, or certain medications such as steroids and antidiabetic drugs.',
      'Delayed sample processing may lead to falsely low glucose values due to ongoing glucose consumption by blood cells.',
      'Hemolysis, improper sample handling, or incorrect patient preparation may influence test accuracy.',
    ],
    p2NotesY + 4.2,
    MARGIN_L,
    CONTENT_W,
    7.6,
    3.7,
    0.8,
    '\u00B7'
  );

  p2NotesY += 1.5;
  pdf.text('Associated Tests', MARGIN_L, p2NotesY);
  drawBulletList(
    pdf,
    [
      'Additional tests such as HbA1c, Oral Glucose Tolerance Test (OGTT), Insulin Levels, C-Peptide, and Urine Glucose may help in further evaluation of glucose',
    ],
    p2NotesY + 4.2,
    MARGIN_L,
    CONTENT_W,
    7.6,
    3.7,
    0.8,
    '\u00B7'
  );

  drawFooter(pdf, 2, signatureDataUrl, pinIconDataUrl);

  // =========================================================================
  // PAGE 3: GLUCOSE - POSTPRANDIAL
  // =========================================================================
  pdf.addPage('a4', 'portrait');
  drawHeader(pdf, data, data.sampleIdPostprandial);

  drawSectionHeading(pdf, 'Glucose - Postprandial', '(Plasma Na [PP])', 63.4);
  drawTestTableHeader(pdf, 69.8);

  const ppValue = data.glucosePostprandial.trim() || '-';
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('Glucose - Postprandial', MARGIN_L, 76.0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.text('Method :- GOD-POD', MARGIN_L, 79.8);

  pdf.setFontSize(9);
  pdf.text(':', 71.0, 76.0);
  pdf.setFont('helvetica', 'bold');
  pdf.text(ppValue, 80.5, 76.0);
  pdf.text('mg/dL', 119.5, 76.0);
  pdf.text('70-140', 142.0, 76.0);

  // Interpretation
  let p3Y = 88.2;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.3);
  pdf.text('Interpretation', MARGIN_L, p3Y);
  p3Y = drawBulletList(
    pdf,
    [
      'Blood glucose testing helps detect hyperglycemia and hypoglycemia, screen individuals at risk for diabetes before symptoms appear, aid in the diagnosis of diabetes, prediabetes, and gestational diabetes, and monitor glucose levels in patients already diagnosed with diabetes.',
    ],
    p3Y + 3.8,
    MARGIN_L + 3.5,
    CONTENT_W - 4.0,
    7.3,
    3.5,
    1.0,
    '\u00B7'
  );

  const p3TableEndY = drawTwoColTable(
    pdf,
    MARGIN_L + 3.2,
    p3Y + 0.5,
    92.0,
    88.5,
    ['Increased In', 'Decreased In'],
    [
      ['Diabetes Mellitus', 'Pancreatic Disorders'],
      ['Stress (E.G.: Emotion, Burns, Shock, Anesthesia)', 'Extra Pancreatic Tumors'],
      ['Acute Pancreatitis', 'Endocrine Disorders'],
      ['Chronic Pancreatitis', 'Malnutrition'],
      ['Wernicke Encephalopathy (Vitamin B1 Deficiency)', 'Hypothalamic Lesions'],
      ['Effect Of Drugs (E.G.: Corticosteroids, Estrogens, Alcohol, Phenytoin, Thiazides)', 'Alcoholism'],
    ],
    '#000000',
    7.1,
    true
  );

  let p3NotesY = p3TableEndY + 6.5;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.3);

  pdf.text('Limitations', MARGIN_L, p3NotesY);
  p3NotesY = drawBulletList(
    pdf,
    [
      'Glucose levels may be affected by recent food intake, fasting duration, stress, exercise, acute illness, or certain medications such as steroids and antidiabetic drugs.',
      'Delayed sample processing may lead to falsely low glucose values due to ongoing glucose consumption by blood cells.',
      'Hemolysis, improper sample handling, or incorrect patient preparation may influence test accuracy.',
    ],
    p3NotesY + 3.8,
    MARGIN_L + 3.5,
    CONTENT_W - 4.0,
    7.3,
    3.5,
    0.5,
    '\u00B7'
  );

  p3NotesY += 1.2;
  pdf.text('Associated Tests', MARGIN_L, p3NotesY);
  p3NotesY = drawBulletList(
    pdf,
    [
      'Additional tests such as HbA1c, Oral Glucose Tolerance Test (OGTT), Insulin Levels, C-Peptide, and Urine Glucose may help in further evaluation of glucose metabolism and diabetes status.',
    ],
    p3NotesY + 3.8,
    MARGIN_L + 3.5,
    CONTENT_W - 4.0,
    7.3,
    3.5,
    0.5,
    '\u00B7'
  );

  p3NotesY += 1.2;
  pdf.text('Note', MARGIN_L, p3NotesY);
  p3NotesY = drawBulletList(
    pdf,
    [
      'Fasting status and sample collection timing should be considered while interpreting Glucose Plasma Test results, as reference ranges differ for Fasting, Postprandial (PP), and Random glucose testing.',
      'Repeat testing with a fresh sample is recommended if the glucose results do not correlate with the patient\u2019s clinical condition.',
    ],
    p3NotesY + 3.8,
    MARGIN_L + 3.5,
    CONTENT_W - 4.0,
    7.3,
    3.5,
    0.5,
    '\u00B7'
  );

  p3NotesY += 1.2;
  pdf.text('Reference', MARGIN_L, p3NotesY);
  p3NotesY = drawBulletList(
    pdf,
    ['ADA Guidelines 2025 & Pack Insert'],
    p3NotesY + 3.8,
    MARGIN_L + 3.5,
    CONTENT_W - 4.0,
    7.3,
    3.5,
    0.5,
    '\u00B7'
  );

  pdf.setFontSize(7.6);
  pdf.text(
    '---------------------- End Of Report ----------------------',
    PAGE_W / 2,
    p3NotesY + 5.5,
    {align: 'center'}
  );

  drawFooter(pdf, 3, signatureDataUrl, pinIconDataUrl);

  pdf.save(filename);
}
