import { Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { InvoiceData } from '../lib/invoice/generateInvoicePDF';

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData;
  pdfBlob: Blob | null;
}

const COMPANY = {
  name: 'Товариство з обмеженою відповідальністю "ВОГЕЛ ТРЕВЕЛ"',
  iban: 'UA223348510000000026002231785',
  bank: 'Банк АТ «ПУМБ»',
  edrpou: '45227005',
  address: '01033, м. Київ, вул. Руставелі Шота б. 20В, офіс 26/2',
};

const InvoicePreviewModal = ({ isOpen, onClose, invoiceData, pdfBlob }: InvoicePreviewModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const formattedAmount = invoiceData.amount.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceData.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />
      <div className="relative bg-zinc-900/50 border border-white/10 rounded-sm max-w-[1000px] w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">

        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
          <h2 className="font-montserrat text-xl font-bold uppercase text-white tracking-[0.3em]">
            {t('contacts.invoice_preview_title')}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={!pdfBlob}
              className="flex items-center gap-2 px-6 py-3 bg-[#5cc8bd] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#4db8ad] transition-all disabled:opacity-30"
            >
              <Download className="w-4 h-4" />
              {t('contacts.invoice_download_btn')}
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full text-white/40 hover:bg-white hover:text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Preview - white background */}
        <div className="flex-1 overflow-auto p-4 md:p-12 bg-zinc-800/50 flex justify-center">
          <div className="bg-white text-black p-[15mm] shadow-2xl w-[210mm] min-h-[297mm] h-fit flex-shrink-0 text-[12px] leading-normal font-sans">

            {/* Warning text */}
            <p className="text-[9px] text-gray-500 text-center mb-4 leading-tight">
              Увага! Оплата цього рахунку означає погодження з умовами поставки товарів. Повідомлення про оплату
              є обов'язковим, в іншому випадку не гарантується наявність товарів на складі. Товар відпускається за фактом
              надходження коштів на п/р Постачальника, самовивозом, за наявності довіренності та паспорта.
            </p>

            {/* Payment order sample */}
            <h3 className="text-center text-[11px] font-bold mb-3 uppercase tracking-wider">Зразок заповнення платіжного доручення</h3>
            <div className="border border-black p-4 mb-8 text-[10px] space-y-2 relative">
              <div className="flex gap-2">
                <span className="text-gray-600 w-28 shrink-0">Отримувач</span>
                <span className="font-bold">{COMPANY.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600 w-28 shrink-0">Код</span>
                <span className="font-bold border border-black px-3 py-0.5">{COMPANY.edrpou}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Банк отримувача</span>
                <span className="text-gray-600">КРЕДИТ рах. №</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-bold">{COMPANY.bank}</span>
                <span className="font-bold border border-black px-3 py-0.5">{COMPANY.iban}</span>
              </div>
            </div>

            {/* Invoice title */}
            <h2 className="text-lg font-bold mb-5">
              Рахунок на оплату № {invoiceData.invoiceNumber} від {invoiceData.date} р.
            </h2>

            {/* Supplier */}
            <div className="mb-3 text-xs">
              <span className="text-gray-600">Постачальник: </span>
              <span className="font-bold">{COMPANY.name}</span>
              <br />
              <span className="ml-[90px]">п/р {COMPANY.iban} у банку {COMPANY.bank},</span>
              <br />
              <span className="ml-[90px]">{COMPANY.address},</span>
              <br />
              <span className="ml-[90px]">код за ЄДРПОУ {COMPANY.edrpou}</span>
            </div>

            {/* Buyer */}
            <div className="mb-2 text-xs">
              <span className="text-gray-600">Покупець: </span>
              <span className="font-bold">{invoiceData.clientName}</span>
            </div>

            {/* Contract */}
            <div className="mb-5 text-xs">
              <span className="text-gray-600">Договір: </span>
              <span>{invoiceData.contractNumber}</span>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-black text-[10px] mb-6">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="border border-black p-2 text-center w-10">№</th>
                  <th className="border border-black p-2 text-center">Товари (роботи, послуги)</th>
                  <th className="border border-black p-2 text-center w-16">Кіл-сть</th>
                  <th className="border border-black p-2 text-center w-14">Од.</th>
                  <th className="border border-black p-2 text-center w-28">Ціна</th>
                  <th className="border border-black p-2 text-center w-28">Сума</th>
                </tr>
              </thead>
              <tbody>
                <tr className="h-10">
                  <td className="border border-black p-2 text-center">1</td>
                  <td className="border border-black p-2">{invoiceData.serviceDescription}</td>
                  <td className="border border-black p-2 text-center">1</td>
                  <td className="border border-black p-2 text-center">{invoiceData.unit}</td>
                  <td className="border border-black p-2 text-right">{formattedAmount}</td>
                  <td className="border border-black p-2 text-right">{formattedAmount}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-black">
                  <td colSpan={4} className="p-2"></td>
                  <td className="p-2 text-right font-bold">Всього:</td>
                  <td className="p-2 text-right font-bold">{formattedAmount}</td>
                </tr>
              </tfoot>
            </table>

            {/* Summary */}
            <p className="text-xs mb-1">
              Всього найменувань 1, на суму {formattedAmount} UAH.
            </p>
            <p className="text-xs font-bold mb-6">
              {invoiceData.amountInWords}
            </p>

            {/* Signature line */}
            <hr className="border-black mb-4" />
            <div className="flex items-center justify-end gap-3 text-[11px] mt-12 mb-4">
              <span className="text-gray-600 italic">Виписав(ла):</span>
              <span className="border-b border-black w-56 inline-block">&nbsp;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
