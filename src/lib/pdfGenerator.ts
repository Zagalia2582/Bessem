import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Quote, CompanySettings, Category } from '../data';
import { CATEGORY_CONFIG, formatCurrency } from '../data';

export function generateQuotePDF(quote: Quote, company: CompanySettings) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const margin = 18;
  let y = margin;

  // ── Header background
  doc.setFillColor(26, 54, 93);
  doc.rect(0, 0, pageW, 42, 'F');

  // ── Company name
  doc.setTextColor(237, 137, 54);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name, margin, 15);

  // ── Company details
  doc.setTextColor(200, 220, 240);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const companyDetails = [
    `${company.address}, ${company.postal_code} ${company.city}`,
    `Tél: ${company.phone}  |  ${company.email}`,
    `SIRET: ${company.siret}`,
  ];
  companyDetails.forEach((line, i) => doc.text(line, margin, 22 + i * 5));

  // ── DEVIS label (right)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('DEVIS', pageW - margin, 14, { align: 'right' });

  doc.setTextColor(237, 137, 54);
  doc.setFontSize(11);
  doc.text(quote.quote_number, pageW - margin, 20, { align: 'right' });

  doc.setTextColor(200, 220, 240);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const dateStr = new Intl.DateTimeFormat('fr-FR').format(new Date(quote.created_at));
  const validStr = new Intl.DateTimeFormat('fr-FR').format(new Date(quote.valid_until));
  doc.text(`Date: ${dateStr}`, pageW - margin, 27, { align: 'right' });
  doc.text(`Validité: ${validStr}`, pageW - margin, 32, { align: 'right' });

  y = 50;

  // ── Client block + Project block side by side
  // Client
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, 80, 34, 2, 2, 'F');
  doc.setTextColor(44, 82, 130);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', margin + 4, y + 7);
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(quote.client_name || '—', margin + 4, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  if (quote.client_address) doc.text(quote.client_address, margin + 4, y + 20, { maxWidth: 70 });
  if (quote.client_phone) doc.text(`Tél: ${quote.client_phone}`, margin + 4, y + 27);
  if (quote.client_email) doc.text(quote.client_email, margin + 4, y + 32);

  // Project
  doc.setFillColor(235, 244, 255);
  doc.roundedRect(pageW - margin - 80, y, 80, 34, 2, 2, 'F');
  doc.setTextColor(44, 82, 130);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJET', pageW - margin - 76, y + 7);
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(quote.project_name, pageW - margin - 76, y + 14, { maxWidth: 70 });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Marge: ${quote.margin_rate}%  |  M.O.: ${quote.labor_rate} DT/h`, pageW - margin - 76, y + 22);
  doc.text(`Heures M.O.: ${quote.labor_hours}h`, pageW - margin - 76, y + 28);

  y += 42;

  // ── Items by category
  const grouped: Partial<Record<Category, typeof quote.items>> = {};
  quote.items.forEach(item => {
    const cat = item.catalog_item.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat]!.push(item);
  });

  const categoryColors: Record<Category, [number, number, number]> = {
    tubes: [44, 82, 130],
    raccords: [39, 103, 73],
    vannes: [116, 66, 16],
    ventilation: [85, 60, 154],
  };

  (Object.keys(grouped) as Category[]).forEach(cat => {
    const catItems = grouped[cat]!;
    const config = CATEGORY_CONFIG[cat];
    const [r, g, b] = categoryColors[cat];
    const catTotal = catItems.reduce((s, i) => s + i.unit_price * i.quantity * (1 - (i.discount || 0) / 100), 0);

    // Category header
    doc.setFillColor(r, g, b);
    doc.rect(margin, y, pageW - margin * 2, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(config.label.toUpperCase(), margin + 3, y + 4.2);
    doc.text(`Sous-total: ${formatCurrency(catTotal)}`, pageW - margin - 3, y + 4.2, { align: 'right' });
    y += 6;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Désignation', 'Réf.', 'Qté', 'Unité', 'P.U. HT', 'Remise', 'Total HT']],
      body: catItems.map(item => [
        item.catalog_item.name,
        item.catalog_item.reference,
        item.quantity.toString(),
        item.catalog_item.unit,
        formatCurrency(item.unit_price),
        item.discount ? `${item.discount}%` : '—',
        formatCurrency(item.unit_price * item.quantity * (1 - (item.discount || 0) / 100)),
      ]),
      headStyles: {
        fillColor: [248, 250, 252],
        textColor: [r, g, b],
        fontStyle: 'bold',
        fontSize: 7.5,
        lineWidth: 0.1,
        lineColor: [226, 232, 240],
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
        lineWidth: 0.1,
        lineColor: [241, 245, 249],
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 62 },
        1: { cellWidth: 22 },
        2: { cellWidth: 12, halign: 'center' },
        3: { cellWidth: 12, halign: 'center' },
        4: { cellWidth: 22, halign: 'right' },
        5: { cellWidth: 14, halign: 'center' },
        6: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
      },
      tableLineColor: [226, 232, 240],
      tableLineWidth: 0.1,
      didParseCell: (data) => {
        if (data.section === 'head') {
          data.cell.styles.fillColor = [r + 40 > 255 ? 255 : r + 40, g + 40 > 255 ? 255 : g + 40, b + 40 > 255 ? 255 : b + 40];
          data.cell.styles.fillColor = [235, 248, 255];
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + 4;
  });

  // ── Financial summary box
  y += 4;
  const summaryX = pageW - margin - 90;
  const summaryW = 90;

  const summaryRows = [
    { label: 'Sous-total matériaux HT', value: formatCurrency(quote.subtotal_ht), bold: false },
    { label: `Main d'œuvre (${quote.labor_hours}h × ${quote.labor_rate} DT/h)`, value: formatCurrency(quote.labor_total), bold: false },
    { label: `Marge (${quote.margin_rate}%)`, value: formatCurrency(quote.margin_amount), bold: false },
    { label: 'Total HT', value: formatCurrency(quote.total_ht), bold: true },
    { label: `TVA (${company.tva_rate}%)`, value: formatCurrency(quote.tva_amount), bold: false },
  ];

  doc.setFillColor(248, 250, 252);
  doc.rect(summaryX, y, summaryW, summaryRows.length * 7 + 14, 'F');

  summaryRows.forEach((row, i) => {
    const rowY = y + 6 + i * 7;
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', row.bold ? 'bold' : 'normal');
    doc.text(row.label, summaryX + 3, rowY);
    doc.setFont('helvetica', row.bold ? 'bold' : 'normal');
    doc.setTextColor(row.bold ? 26 : 71, row.bold ? 54 : 85, row.bold ? 93 : 105);
    doc.text(row.value, summaryX + summaryW - 3, rowY, { align: 'right' });
  });

  // Total TTC row
  const ttcY = y + summaryRows.length * 7 + 7;
  doc.setFillColor(26, 54, 93);
  doc.rect(summaryX, ttcY - 4, summaryW, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL TTC', summaryX + 3, ttcY + 2);
  doc.setTextColor(237, 137, 54);
  doc.setFontSize(11);
  doc.text(formatCurrency(quote.total_ttc), summaryX + summaryW - 3, ttcY + 2.5, { align: 'right' });

  // ── Notes
  if (quote.notes) {
    y += 4;
    doc.setFillColor(255, 250, 240);
    doc.roundedRect(margin, y, summaryX - margin - 4, 24, 2, 2, 'F');
    doc.setTextColor(44, 82, 130);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTES', margin + 3, y + 6);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text(quote.notes, margin + 3, y + 12, { maxWidth: summaryX - margin - 10 });
  }

  // ── Footer
  const footerY = pageH - 20;
  doc.setFillColor(241, 245, 249);
  doc.rect(0, footerY - 2, pageW, 22, 'F');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);

  const paymentTerms = quote.payment_terms || company.payment_terms;
  doc.text(`Conditions: ${paymentTerms}`, margin, footerY + 3);
  if (company.rib) doc.text(`RIB: ${company.rib}`, margin, footerY + 8);
  if (company.insurance_number) doc.text(`Assurance: ${company.insurance_company} — Police N° ${company.insurance_number}`, margin, footerY + 13);

  doc.setTextColor(44, 82, 130);
  doc.text(`Devis valable 30 jours — ${company.name} — ${company.website || company.email}`, pageW / 2, footerY + 8, { align: 'center' });
  doc.setTextColor(148, 163, 184);
  doc.text(`Page 1 | GazNet Pro — Système de gestion installation gaz`, pageW - margin, footerY + 13, { align: 'right' });

  // Open in new window for printing
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(pdfUrl, '_blank');
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      printWindow.print();
    });
  }

  // Also trigger download
  doc.save(`${quote.quote_number}.pdf`);
}
