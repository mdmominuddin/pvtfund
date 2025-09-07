import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import StatementHeader from './StatementHeader';
import TransactionList from './TransactionList';
import DateRangeSelector from './DateRangeSelector';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function FundStatement() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [balances, setBalances] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'FundStatement',
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  });

  const handleDateChange = (type, value) => {
    if (type === 'start') setStartDate(value);
    if (type === 'end') setEndDate(value);
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError('');

    axios
      .get(`/api/fundstatement?start_date=${startDate}&end_date=${endDate}`)
      .then((res) => {
        const tx = res.data.transactions || [];

        // Calculate running balance
        let currentBalance = res.data.opening_balance || 0;
        const withBalance = tx.map(item => {
          currentBalance += item.type === 'fund' ? item.amount : -item.amount;
          return { ...item, balance: currentBalance };
        });

        setBalances({
          opening: res.data.opening_balance,
          closing: res.data.closing_balance,
          present: currentBalance,
        });
        setTransactions(withBalance);
      })
      .catch(() => {
        setError('Failed to fetch statement. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  const handleExcelExport = () => {
    const wb = XLSX.utils.book_new();

    const balanceSheet = XLSX.utils.json_to_sheet([
      { Type: 'Opening Balance', Amount: balances.opening },
      { Type: 'Closing Balance', Amount: balances.closing },
      { Type: 'Present Balance', Amount: balances.present },
    ]);
    XLSX.utils.book_append_sheet(wb, balanceSheet, 'Balances');

    const transactionData = transactions.map((t) => ({
      Date: t.date || t.transaction_date,
      Description: t.description,
      Amount: t.amount,
      Type: t.type,
      Balance: t.balance,
    }));
    const transactionSheet = XLSX.utils.json_to_sheet(transactionData);
    XLSX.utils.book_append_sheet(wb, transactionSheet, 'Transactions');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'FundStatement.xlsx');
  };

  return (
    <div className="relative">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none print:hidden z-0">
        <p className="text-6xl font-bold text-gray-300 opacity-10 rotate-[-30deg] select-none">
          Military Dental Center
        </p>
      </div>

      {/* Printable Content */}
      <div
        ref={printRef}
        className="relative z-10 max-w-7xl mx-auto px-6 py-8 bg-white shadow-lg rounded-lg border border-gray-200 print:border-none print:shadow-none print:p-0"
      >
        {/* Header */}
        <header className="mb-6 text-center">
          <img
            src="/assets/logo.png"
            alt="Military Dental Center Logo"
            className="mx-auto h-16 mb-2 print:h-12"
          />
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-1 print:text-2xl">
            🏦 Fund Statement
          </h1>
          <p className="text-gray-500 text-sm print:text-xs">
            {startDate && endDate
              ? `Statement from ${startDate} to ${endDate}`
              : 'Select a date range to view your account summary'}
          </p>
        </header>

        {/* Date Selector */}
        <DateRangeSelector onChange={handleDateChange} />

        {/* Loading / Error */}
        {loading && <div className="text-center text-gray-500 py-4">Loading statement...</div>}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {/* Statement Content */}
        {startDate && endDate && !loading && !error && (
          <div className="space-y-6 mt-6">
            <StatementHeader {...balances} />
            <TransactionList transactions={transactions} />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {transactions.length > 0 && (
        <div className="mt-8 flex justify-center gap-4 print:hidden">
          <button
            onClick={handleExcelExport}
            className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
          >
            📊 Export as Excel
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            🖨️ Print / Save PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default FundStatement;
