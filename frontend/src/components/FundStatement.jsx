import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import StatementHeader from './StatementHeader';
import TransactionList from './TransactionList';
import DateRangeSelector from './DateRangeSelector';
import { useReactToPrint } from 'react-to-print';

function FundStatement() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [balances, setBalances] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'FundStatement',
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `
  });

  const handleDateChange = (type, value) => {
    if (type === 'start') setStartDate(value);
    if (type === 'end') setEndDate(value);
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError('');

    axios.get(`/api/fundstatement?start_date=${startDate}&end_date=${endDate}`)
      .then(res => {
        setBalances({
          opening: res.data.opening_balance,
          closing: res.data.closing_balance,
          present: res.data.present_balance
        });
        setTransactions(res.data.transactions);
      })
      .catch(() => {
        setError('Failed to fetch statement. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

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
        {/* Logo and Header */}
        <header className="mb-6 text-center">
          <img
            src="/assets/logo.png"
            alt="Military Dental Center Logo"
            className="mx-auto h-16 mb-2 print:h-12"
          />
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-1 print:text-2xl">🏦 Fund Statement</h1>
          <p className="text-gray-500 text-sm print:text-xs">Select a date range to view your account summary</p>
        </header>

        {/* Date Selector */}
        <DateRangeSelector onChange={handleDateChange} />

        {/* Feedback States */}
        {loading && (
          <div className="text-center text-gray-500 py-4">Loading statement...</div>
        )}
        {error && (
          <div className="text-center text-red-500 py-4">{error}</div>
        )}

        {/* Statement Content */}
        {startDate && endDate && !loading && !error && (
          <div className="space-y-6 mt-6">
            <StatementHeader {...balances} />
            <TransactionList transactions={transactions} />
          </div>
        )}
      </div>

      {/* Print Button */}
      {transactions.length > 0 && (
        <div className="mt-8 text-center print:hidden">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            🖨️ Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default FundStatement;
