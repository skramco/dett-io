import type { jsPDF } from 'jspdf';
import {
  buildExportDocument,
  type CalculatorExportDocument,
  type CalculatorInputs,
} from './calculatorState';

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_X = 15;
const MARGIN_TOP = 16;
const MARGIN_BOTTOM = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

type PdfDoc = jsPDF;

function addFooter(pdf: PdfDoc) {
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      'This is an educational tool. Results are estimates and should not be considered financial advice.',
      MARGIN_X,
      PAGE_HEIGHT - 10
    );
    pdf.text(`Knowe LLC · dett.io | Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 10, {
      align: 'right',
    });
  }
}

function ensureSpace(pdf: PdfDoc, y: number, needed: number): number {
  if (y + needed <= PAGE_HEIGHT - MARGIN_BOTTOM) return y;
  pdf.addPage();
  return MARGIN_TOP;
}

function writeWrapped(pdf: PdfDoc, text: string, y: number, fontSize: number, lineHeight: number): number {
  pdf.setFontSize(fontSize);
  const lines = pdf.splitTextToSize(text, CONTENT_WIDTH) as string[];
  for (const line of lines) {
    y = ensureSpace(pdf, y, lineHeight);
    pdf.text(line, MARGIN_X, y);
    y += lineHeight;
  }
  return y;
}

function writeSectionTitle(pdf: PdfDoc, title: string, y: number): number {
  y = ensureSpace(pdf, y, 12);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(15, 23, 42);
  pdf.text(title, MARGIN_X, y);
  y += 4;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y);
  return y + 8;
}

function writeRows(pdf: PdfDoc, rows: CalculatorExportDocument['inputRows'], y: number): number {
  pdf.setFontSize(10);
  for (const row of rows) {
    y = ensureSpace(pdf, y, 7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text(row.label, MARGIN_X, y);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    const valueLines = pdf.splitTextToSize(row.value, 80) as string[];
    pdf.text(valueLines[0] ?? '', PAGE_WIDTH - MARGIN_X, y, { align: 'right' });
    y += 6;
    for (const extra of valueLines.slice(1)) {
      y = ensureSpace(pdf, y, 6);
      pdf.text(extra, PAGE_WIDTH - MARGIN_X, y, { align: 'right' });
      y += 6;
    }
  }
  return y;
}

export function renderCalculatorPdf(
  pdf: PdfDoc,
  document: CalculatorExportDocument
): void {
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(15, 23, 42);
  pdf.text('Dett', MARGIN_X, 16);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Free Mortgage Calculators | dett.io — a Knowe LLC company', MARGIN_X, 23);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(15, 23, 42);
  let y = writeWrapped(pdf, document.calculatorName, 34, 16, 7);

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 116, 139);
  y = writeWrapped(pdf, `Generated: ${document.generatedAt}`, y + 2, 9, 5);
  y += 6;

  y = writeSectionTitle(pdf, 'Headline Result', y);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(15, 23, 42);
  y = writeWrapped(pdf, document.summary, y, 12, 6);
  y += 6;

  if (document.inputRows.length > 0) {
    y = writeSectionTitle(pdf, 'Your Inputs', y);
    y = writeRows(pdf, document.inputRows, y);
    y += 4;
  }

  if (document.resultRows.length > 0) {
    y = writeSectionTitle(pdf, 'Headline Results', y);
    y = writeRows(pdf, document.resultRows, y);
    y += 4;
  }

  if (document.insights.length > 0) {
    y = writeSectionTitle(pdf, 'Key Insights', y);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);
    for (const insight of document.insights) {
      y = writeWrapped(pdf, `• ${insight}`, y, 10, 5.5);
      y += 2;
    }
  }

  addFooter(pdf);
}

export async function downloadCalculatorPdf(options: {
  calculatorName: string;
  summary: string;
  details: Record<string, number | string>;
  insights: string[];
  inputs: CalculatorInputs;
}): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const document = buildExportDocument(options);
  const pdf = new jsPDF('p', 'mm', 'a4');
  renderCalculatorPdf(pdf, document);
  const filename = `${options.calculatorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-dett.pdf`;
  pdf.save(filename);
}
