import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoiceData {
  invoiceNumber: string;
  contractNumber: string;
  date: string;
  clientName: string;
  type: 'offer' | 'service' | 'custom';
  serviceDescription: string;
  unit: string; // "Доб." or "Посл."
  amount: number;
  amountInWords: string;
}

const COMPANY = {
  name: 'Товариство з обмеженою відповідальністю "ВОГЕЛ ТРЕВЕЛ"',
  nameShort: 'ТОВ "ВОГЕЛ ТРЕВЕЛ"',
  iban: 'UA223348510000000026002231785',
  ibanFormatted: 'UA22 3348 5100 0000 0026 0023 1785',
  bank: 'Банк АТ «ПУМБ»',
  edrpou: '45227005',
  address: '01033, м. Київ, вул. Руставелі Шота б. 20В, офіс 26/2',
};

async function loadFonts(doc: jsPDF) {
  const [{ robotoNormal }, { robotoBold }] = await Promise.all([
    import('./fonts/roboto-normal'),
    import('./fonts/roboto-bold'),
  ]);
  doc.addFileToVFS('Roboto-Regular.ttf', robotoNormal);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.addFileToVFS('Roboto-Bold.ttf', robotoBold);
  doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  await loadFonts(doc);
  doc.setFont('Roboto', 'normal');

  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 12;

  // === 1. Warning text (top) ===
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  const warningText = 'Увага! Оплата цього рахунку означає погодження з умовами поставки товарів. Повідомлення про оплату є обов\'язковим, в іншому випадку не гарантується наявність товарів на складі. Товар відпускається за фактом надходження коштів на п/р Постачальника, самовивозом, за наявності довіренності та паспорта.';
  const warningLines = doc.splitTextToSize(warningText, contentWidth);
  doc.text(warningLines, pageWidth / 2, y, { align: 'center' });
  y += warningLines.length * 3 + 4;

  // === 2. Payment order sample box ===
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont('Roboto', 'bold');
  doc.text('Зразок заповнення платіжного доручення', pageWidth / 2, y, { align: 'center' });
  y += 5;

  const boxY = y;
  const boxH = 32;
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(margin, boxY, contentWidth, boxH);

  doc.setFontSize(8);
  doc.setFont('Roboto', 'normal');
  y = boxY + 5;

  // Row: Отримувач
  doc.text('Отримувач', margin + 3, y);
  doc.setFont('Roboto', 'bold');
  doc.text(COMPANY.name, margin + 28, y);
  doc.setFont('Roboto', 'normal');
  y += 5;

  // Row: Код
  doc.text('Код', margin + 3, y);
  doc.setFont('Roboto', 'bold');
  doc.text(COMPANY.edrpou, margin + 28, y);
  // Draw box around code
  doc.setLineWidth(0.2);
  doc.rect(margin + 26, y - 3.5, 22, 5);
  doc.setFont('Roboto', 'normal');
  y += 5;

  // Row: Банк отримувача
  doc.text('Банк отримувача', margin + 3, y);
  doc.text('КРЕДИТ рах. №', margin + contentWidth - 60, y);
  y += 5;

  doc.setFont('Roboto', 'bold');
  doc.text(COMPANY.bank, margin + 3, y);
  doc.text(COMPANY.iban, margin + contentWidth - 60, y);
  // Draw box around IBAN
  doc.rect(margin + contentWidth - 62, y - 3.5, 60, 5);
  doc.setFont('Roboto', 'normal');

  y = boxY + boxH + 8;

  // === 3. Invoice title ===
  doc.setFontSize(13);
  doc.setFont('Roboto', 'bold');
  doc.text(`Рахунок на оплату № ${data.invoiceNumber} від ${data.date} р.`, margin, y);
  y += 8;

  // === 4. Supplier info ===
  doc.setFontSize(9);
  doc.setFont('Roboto', 'normal');
  doc.text('Постачальник:', margin, y);
  doc.setFont('Roboto', 'bold');
  const supplierInfo = `${COMPANY.name}\nп/р ${COMPANY.iban} у банку ${COMPANY.bank},\n${COMPANY.address},\nкод за ЄДРПОУ ${COMPANY.edrpou}`;
  const supplierLines = doc.splitTextToSize(supplierInfo, contentWidth - 30);
  doc.text(supplierLines, margin + 30, y);
  y += supplierLines.length * 4 + 4;

  // === 5. Buyer ===
  doc.setFont('Roboto', 'normal');
  doc.text('Покупець:', margin, y);
  doc.setFont('Roboto', 'bold');
  doc.text(data.clientName, margin + 30, y);
  y += 6;

  // === 6. Contract ===
  doc.setFont('Roboto', 'normal');
  doc.text('Договір:', margin, y);
  doc.setFont('Roboto', 'bold');
  doc.text(data.contractNumber, margin + 30, y);
  y += 8;

  // === 7. Table ===
  const formattedAmount = data.amount.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['№', 'Товари (роботи, послуги)', 'Кіл-сть', 'Од.', 'Ціна', 'Сума']],
    body: [
      ['1', data.serviceDescription, '1', data.unit, formattedAmount, formattedAmount],
    ],
    foot: [
      [{ content: '', colSpan: 4 }, { content: 'Всього:', styles: { halign: 'right', fontStyle: 'bold' } }, { content: formattedAmount, styles: { fontStyle: 'bold' } }],
    ],
    styles: {
      font: 'Roboto',
      fontSize: 8,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      textColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 'auto' },
      2: { halign: 'center', cellWidth: 18 },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'right', cellWidth: 25 },
      5: { halign: 'right', cellWidth: 25 },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 6;

  // === 8. Summary ===
  doc.setFontSize(9);
  doc.setFont('Roboto', 'normal');
  doc.text(`Всього найменувань 1, на суму ${formattedAmount} UAH.`, margin, y);
  y += 5;

  doc.setFont('Roboto', 'bold');
  doc.text(data.amountInWords, margin, y);
  y += 10;

  // === 9. Signature line ===
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  doc.setFont('Roboto', 'normal');
  doc.setFontSize(9);
  doc.text('Виписав(ла):', pageWidth / 2 - 10, y);
  doc.line(pageWidth / 2 + 15, y, pageWidth / 2 + 60, y);

  return doc.output('blob');
}
