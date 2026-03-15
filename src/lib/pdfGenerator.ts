import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Quote, CompanySettings, Category } from '../data';
import { CATEGORY_CONFIG, formatCurrency } from '../data';

// ─── Colour palette ──────────────────────────────────────────────────────────
const BRAND = {
  blue:      [26, 54, 93]  as [number, number, number],
  blue2:     [44, 82, 130] as [number, number, number],
  orange:    [237, 137, 54] as [number, number, number],
  orangeL:   [246, 173, 85] as [number, number, number],
  slate:     [71, 85, 105] as [number, number, number],
  slateL:    [148, 163, 184] as [number, number, number],
  dark:      [30, 41, 59]  as [number, number, number],
  bg:        [248, 250, 252] as [number, number, number],
  bgBlue:    [235, 244, 255] as [number, number, number],
  bgOrange:  [255, 250, 240] as [number, number, number],
  white:     [255, 255, 255] as [number, number, number],
  border:    [226, 232, 240] as [number, number, number],
};

const CAT_COLORS: Record<Category, [number,number,number]> = {
  tubes:       [44, 82, 130],
  raccords:    [39, 103, 73],
  vannes:      [116, 66, 16],
  ventilation: [85, 60, 154],
};

// ─── Helper: safe text (no crash on undefined) ────────────────────────────────
function safe(v: string | number | undefined | null, fallback = '—'): string {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
}

// ─── Helper: check if a new page is needed ────────────────────────────────────
function ensureSpace(doc: jsPDF, y: number, needed: number, pageH: number, margin: number): number {
  if (y + needed > pageH - 28) {
    doc.addPage();
    return margin + 4;
  }
  return y;
}

// ─── Helper: draw a filled rounded rect safely ───────────────────────────────
function fillRect(doc: jsPDF, x: number, y: number, w: number, h: number,
                  color: [number,number,number], rounded = false): void {
  doc.setFillColor(color[0], color[1], color[2]);
  if (rounded) {
    doc.roundedRect(x, y, w, h, 2, 2, 'F');
  } else {
    doc.rect(x, y, w, h, 'F');
  }
}

// ─── Helper: draw a horizontal rule ──────────────────────────────────────────
function hRule(doc: jsPDF, y: number, margin: number, pageW: number,
               color: [number,number,number] = BRAND.border): void {
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
}

// ─── Main export function ─────────────────────────────────────────────────────
export function generateQuotePDF(quote: Quote, company: CompanySettings): void {
  const doc    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW  = 210;
  const pageH  = 297;
  const margin = 16;
  const iW     = pageW - margin * 2; // inner width
  let y        = 0;

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 1 — HEADER
  // ══════════════════════════════════════════════════════════════════════════════

  // Background strip
  fillRect(doc, 0, 0, pageW, 48, BRAND.blue);

  // Diagonal accent
  doc.setFillColor(BRAND.orange[0], BRAND.orange[1], BRAND.orange[2]);
  doc.triangle(pageW - 60, 0, pageW, 0, pageW, 48, 'F');

  // Company name
  doc.setTextColor(BRAND.orange[0], BRAND.orange[1], BRAND.orange[2]);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(safe(company.name, 'Mon Entreprise'), margin, 16);

  // Company sub-info
  doc.setTextColor(200, 220, 240);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  const addr = `${safe(company.address)}, ${safe(company.postal_code)} ${safe(company.city)}`;
  doc.text(addr, margin, 22);
  doc.text(`Tél: ${safe(company.phone)}   |   ${safe(company.email)}`, margin, 27);
  if (company.siret) doc.text(`SIRET: ${safe(company.siret)}`, margin, 32);
  if (company.website) doc.text(safe(company.website), margin, 37);

  // DEVIS block (right)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('DEVIS', pageW - margin, 15, { align: 'right' });

  doc.setTextColor(BRAND.orange[0], BRAND.orange[1], BRAND.orange[2]);
  doc.setFontSize(11);
  doc.text(safe(quote.quote_number, 'DEV-N/A'), pageW - margin, 22, { align: 'right' });

  doc.setTextColor(200, 220, 240);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  const dateStr  = new Intl.DateTimeFormat('fr-FR').format(new Date(quote.created_at));
  const validStr = new Intl.DateTimeFormat('fr-FR').format(new Date(quote.valid_until));
  doc.text(`Date: ${dateStr}`, pageW - margin, 28, { align: 'right' });
  doc.text(`Validité: ${validStr}`, pageW - margin, 33, { align: 'right' });
  doc.text(`Statut: ${quote.status === 'draft' ? 'Brouillon' : quote.status === 'sent' ? 'Envoyé' : quote.status === 'accepted' ? 'Accepté' : quote.status}`, pageW - margin, 38, { align: 'right' });

  y = 55;

  // ─── Client + Project info boxes ─────────────────────────────────────────
  const boxW = (iW - 8) / 2;

  // Client box
  fillRect(doc, margin, y, boxW, 38, BRAND.bg, true);
  doc.setDrawColor(BRAND.border[0], BRAND.border[1], BRAND.border[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, boxW, 38, 2, 2, 'S');
  doc.setTextColor(BRAND.blue2[0], BRAND.blue2[1], BRAND.blue2[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT / MAÎTRE D\'OUVRAGE', margin + 4, y + 7);
  doc.setTextColor(BRAND.dark[0], BRAND.dark[1], BRAND.dark[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(safe(quote.client_name), margin + 4, y + 14, { maxWidth: boxW - 8 });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(BRAND.slate[0], BRAND.slate[1], BRAND.slate[2]);
  let cy = y + 20;
  if (quote.client_address) { doc.text(quote.client_address, margin + 4, cy, { maxWidth: boxW - 8 }); cy += 5; }
  if (quote.client_phone)   { doc.text(`Tél: ${quote.client_phone}`, margin + 4, cy); cy += 5; }
  if (quote.client_email)   { doc.text(quote.client_email, margin + 4, cy); }

  // Project box
  const px = margin + boxW + 8;
  fillRect(doc, px, y, boxW, 38, BRAND.bgBlue, true);
  doc.setDrawColor(BRAND.border[0], BRAND.border[1], BRAND.border[2]);
  doc.roundedRect(px, y, boxW, 38, 2, 2, 'S');
  doc.setTextColor(BRAND.blue2[0], BRAND.blue2[1], BRAND.blue2[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('CHANTIER / PROJET', px + 4, y + 7);
  doc.setTextColor(BRAND.dark[0], BRAND.dark[1], BRAND.dark[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(safe(quote.project_name), px + 4, y + 14, { maxWidth: boxW - 8 });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(BRAND.slate[0], BRAND.slate[1], BRAND.slate[2]);
  doc.text(`Marge appliquée : ${safe(quote.margin_rate)}%`, px + 4, y + 22);
  doc.text(`Taux horaire M.O. : ${safe(quote.labor_rate)} DT/h`, px + 4, y + 27);
  doc.text(`Heures M.O. estimées : ${safe(quote.labor_hours)} h`, px + 4, y + 32);
  doc.text(`TVA : ${safe(company.tva_rate, '19')}%`, px + 4, y + 37);

  y += 46;

  // ──────────────────────────────────────────────────────────────────────────
  // ITEMS — grouped by category
  // ──────────────────────────────────────────────────────────────────────────
  const grouped: Partial<Record<Category, typeof quote.items>> = {};
  const itemsArray = Array.isArray(quote.items) ? quote.items : [];
  itemsArray.forEach(item => {
    if (!item?.catalog_item) return;
    const cat = item.catalog_item.category as Category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat]!.push(item);
  });

  let grandMaterialsHT = 0;

  (Object.keys(grouped) as Category[]).forEach(cat => {
    const catItems = grouped[cat]!;
    if (!catItems.length) return;
    const config  = CATEGORY_CONFIG[cat];
    const [r, g, b] = CAT_COLORS[cat];
    const catTotal = catItems.reduce((s, i) =>
      s + (i.unit_price || 0) * (i.quantity || 0) * (1 - ((i.discount || 0) / 100)), 0);
    grandMaterialsHT += catTotal;

    // Category header bar
    y = ensureSpace(doc, y, 14, pageH, margin);
    fillRect(doc, margin, y, iW, 7, [r, g, b]);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${config.label.toUpperCase()}  —  ${catItems.length} article${catItems.length > 1 ? 's' : ''}`, margin + 3, y + 5);
    doc.text(`Sous-total : ${formatCurrency(catTotal)}`, pageW - margin - 3, y + 5, { align: 'right' });
    y += 7;

    // Table
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      tableWidth: iW,
      head: [['Désignation', 'Réf.', 'Qté', 'Unité', 'P.U. HT', 'Remise', 'Total HT']],
      body: catItems.map(item => [
        safe(item.catalog_item?.name),
        safe(item.catalog_item?.reference),
        String(item.quantity ?? 1),
        safe(item.catalog_item?.unit, 'pce'),
        formatCurrency(item.unit_price ?? 0),
        item.discount ? `${item.discount}%` : '—',
        formatCurrency((item.unit_price ?? 0) * (item.quantity ?? 1) * (1 - ((item.discount || 0) / 100))),
      ]),
      headStyles: {
        fillColor: [r + 30 <= 255 ? r + 30 : 235, g + 30 <= 255 ? g + 30 : 235, b + 30 <= 255 ? b + 30 : 255],
        textColor: [r, g, b],
        fontStyle: 'bold',
        fontSize: 7,
        lineWidth: 0.15,
        lineColor: BRAND.border,
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: BRAND.dark,
        lineWidth: 0.1,
        lineColor: [241, 245, 249],
        cellPadding: { top: 2.5, bottom: 2.5, left: 2, right: 2 },
      },
      alternateRowStyles: { fillColor: BRAND.bg },
      columnStyles: {
        0: { cellWidth: 58 },
        1: { cellWidth: 22, fontStyle: 'normal', font: 'courier', fontSize: 6.5 },
        2: { cellWidth: 11, halign: 'center' },
        3: { cellWidth: 11, halign: 'center' },
        4: { cellWidth: 22, halign: 'right' },
        5: { cellWidth: 14, halign: 'center' },
        6: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
      },
      tableLineColor: BRAND.border,
      tableLineWidth: 0.15,
      didDrawPage: (data) => {
        // Redraw page number on each new page
        const pg = (doc as any).internal.getCurrentPageInfo().pageNumber;
        doc.setFontSize(7);
        doc.setTextColor(BRAND.slateL[0], BRAND.slateL[1], BRAND.slateL[2]);
        doc.text(`${safe(company.name)} — ${safe(quote.quote_number)} — Page ${pg}`, pageW / 2, pageH - 7, { align: 'center' });
        // Reset fill after page break
        doc.setFillColor(BRAND.bg[0], BRAND.bg[1], BRAND.bg[2]);
        if (data.pageNumber > 1) {
          y = data.cursor?.y ?? margin + 4;
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 5;
  });

  // ──────────────────────────────────────────────────────────────────────────
  // FINANCIAL SUMMARY
  // ──────────────────────────────────────────────────────────────────────────
  const summaryW = 95;
  const summaryX = pageW - margin - summaryW;

  // Make sure there's room for the summary (approx 65mm needed)
  y = ensureSpace(doc, y, 68, pageH, margin);
  y += 4;

  // Notes box (left of summary)
  if (quote.notes) {
    const notesW = summaryX - margin - 6;
    fillRect(doc, margin, y, notesW, 28, BRAND.bgOrange, true);
    doc.setDrawColor(BRAND.orange[0], BRAND.orange[1], BRAND.orange[2]);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, y, notesW, 28, 2, 2, 'S');
    doc.setTextColor(BRAND.blue2[0], BRAND.blue2[1], BRAND.blue2[2]);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTES & OBSERVATIONS', margin + 3, y + 6);
    doc.setTextColor(BRAND.slate[0], BRAND.slate[1], BRAND.slate[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(quote.notes, margin + 3, y + 12, { maxWidth: notesW - 6 });
  }

  // Summary rows
  const rows: { label: string; value: string; bold?: boolean; accent?: boolean }[] = [
    { label: `Matériaux HT`,                                             value: formatCurrency(quote.subtotal_ht ?? 0) },
    { label: `Main d'œuvre (${safe(quote.labor_hours)}h × ${safe(quote.labor_rate)} DT/h)`, value: formatCurrency(quote.labor_total ?? 0) },
    { label: `Marge (${safe(quote.margin_rate)}%)`,                      value: formatCurrency(quote.margin_amount ?? 0) },
    { label: `Total HT`,                                                 value: formatCurrency(quote.total_ht ?? 0), bold: true },
    { label: `TVA (${safe(company.tva_rate, '19')}%)`,                   value: formatCurrency(quote.tva_amount ?? 0) },
  ];

  const rowH = 7;
  const boxH = rows.length * rowH + 16; // +16 for padding + TTC row

  fillRect(doc, summaryX, y, summaryW, boxH, BRAND.bg);
  doc.setDrawColor(BRAND.border[0], BRAND.border[1], BRAND.border[2]);
  doc.setLineWidth(0.3);
  doc.rect(summaryX, y, summaryW, boxH, 'S');

  rows.forEach((row, i) => {
    const ry = y + 6 + i * rowH;
    if (row.bold) {
      hRule(doc, ry - 2, summaryX + 2, summaryX + summaryW - 2);
    }
    doc.setFontSize(7.5);
    doc.setFont('helvetica', row.bold ? 'bold' : 'normal');
    doc.setTextColor(row.bold ? BRAND.dark[0] : BRAND.slate[0],
                     row.bold ? BRAND.dark[1] : BRAND.slate[1],
                     row.bold ? BRAND.dark[2] : BRAND.slate[2]);
    doc.text(row.label, summaryX + 4, ry);
    doc.text(row.value, summaryX + summaryW - 4, ry, { align: 'right' });
  });

  // TTC highlight row
  const ttcY = y + rows.length * rowH + 8;
  fillRect(doc, summaryX, ttcY - 4, summaryW, 12, BRAND.blue);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL TTC', summaryX + 4, ttcY + 3.5);
  doc.setTextColor(BRAND.orange[0], BRAND.orange[1], BRAND.orange[2]);
  doc.setFontSize(11);
  doc.text(formatCurrency(quote.total_ttc ?? 0), summaryX + summaryW - 4, ttcY + 4, { align: 'right' });

  y = ttcY + 14;

  // ──────────────────────────────────────────────────────────────────────────
  // PAYMENT TERMS BLOCK
  // ──────────────────────────────────────────────────────────────────────────
  y = ensureSpace(doc, y, 28, pageH, margin);
  y += 4;

  const paymentTerms = safe(quote.payment_terms || company.payment_terms, 'Paiement à 30 jours');
  fillRect(doc, margin, y, iW, 22, BRAND.bg, true);
  doc.setDrawColor(BRAND.border[0], BRAND.border[1], BRAND.border[2]);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, y, iW, 22, 2, 2, 'S');

  doc.setTextColor(BRAND.blue2[0], BRAND.blue2[1], BRAND.blue2[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('CONDITIONS DE RÈGLEMENT', margin + 4, y + 6);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(BRAND.slate[0], BRAND.slate[1], BRAND.slate[2]);

  const cols: string[] = [];
  cols.push(paymentTerms);
  if (company.rib) cols.push(`RIB : ${company.rib}`);
  if (company.insurance_number) cols.push(`Assurance : ${safe(company.insurance_company)} — N° ${safe(company.insurance_number)}`);

  const colW = iW / cols.length;
  cols.forEach((text, i) => {
    doc.text(text, margin + 4 + i * colW, y + 13, { maxWidth: colW - 8 });
  });

  y += 26;

  // ──────────────────────────────────────────────────────────────────────────
  // SIGNATURE BLOCK
  // ──────────────────────────────────────────────────────────────────────────
  y = ensureSpace(doc, y, 32, pageH, margin);
  y += 2;

  const sigW = (iW - 8) / 2;
  ['Bon pour accord — Client', 'Signature & cachet — Entreprise'].forEach((label, i) => {
    const sx = margin + i * (sigW + 8);
    fillRect(doc, sx, y, sigW, 28, BRAND.bg, true);
    doc.setDrawColor(BRAND.border[0], BRAND.border[1], BRAND.border[2]);
    doc.roundedRect(sx, y, sigW, 28, 2, 2, 'S');
    doc.setTextColor(BRAND.slate[0], BRAND.slate[1], BRAND.slate[2]);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(label, sx + sigW / 2, y + 6, { align: 'center' });
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Date et signature :', sx + 4, y + 14);
    doc.setDrawColor(BRAND.slateL[0], BRAND.slateL[1], BRAND.slateL[2]);
    doc.setLineWidth(0.3);
    doc.line(sx + 4, y + 25, sx + sigW - 4, y + 25);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // FOOTER — drawn on every page
  // ──────────────────────────────────────────────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let pg = 1; pg <= totalPages; pg++) {
    doc.setPage(pg);
    fillRect(doc, 0, pageH - 14, pageW, 14, [15, 23, 42]);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(BRAND.slateL[0], BRAND.slateL[1], BRAND.slateL[2]);
    doc.text(`${safe(company.name)} — ${safe(company.address)}, ${safe(company.postal_code)} ${safe(company.city)} — ${safe(company.phone)} — ${safe(company.email)}`,
      pageW / 2, pageH - 8.5, { align: 'center' });
    doc.text(`Devis valable 30 jours. Document généré par GazNet Pro — Page ${pg}/${totalPages}`,
      pageW / 2, pageH - 4, { align: 'center' });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // OUTPUT — download directly (most reliable cross-browser method)
  // ──────────────────────────────────────────────────────────────────────────
  const filename = `${safe(quote.quote_number, 'devis')}_${safe(quote.project_name, 'projet').replace(/[^a-z0-9]/gi, '_')}.pdf`;

  try {
    doc.save(filename);
  } catch (err) {
    // Fallback: open in new tab
    console.warn('doc.save failed, falling back to blob URL:', err);
    const blob   = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 1500);
  }
}
