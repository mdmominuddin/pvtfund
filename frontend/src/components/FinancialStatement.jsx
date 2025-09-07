import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaPrint, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FinancialStatement = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fundsUrl = 'http://127.0.0.1:8000/api/funds/';
    const expensesUrl = 'http://127.0.0.1:8000/api/expenses/';

    Promise.all([axios.get(fundsUrl), axios.get(expensesUrl)])
      .then(([fundsRes, expensesRes]) => {
        const funds = fundsRes.data.map(item => ({
          id: item.id,
          date: item.deposit_date,
          description: item.fund_description,
          amount: Number(item.deposit_amount) || 0,
          type: 'fund'
        }));

        const expenses = expensesRes.data.map(item => ({
          id: item.id,
          date: item.expense_date,
          description: item.head_name,
          amount: Number(item.expense_amount) || 0,
          type: 'expense'
        }));

        const combined = [...funds, ...expenses].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        let balance = 0;
        const withBalance = combined.map(item => {
          balance += item.type === 'fund' ? item.amount : -item.amount;
          return { ...item, balance };
        });

        setTransactions(withBalance);
        setFiltered(withBalance);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Unable to fetch financial data. Please verify your API and server status.');
        setLoading(false);
      });
  }, []);

  const handleFilter = () => {
    if (!startDate || !endDate) return setFiltered(transactions);

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredTx = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= start && txDate <= end;
    });

    const previousBalance = transactions.find(tx => new Date(tx.date) < start)?.balance || 0;
    let currentBalance = previousBalance;
    const withFilteredBalance = filteredTx.map(tx => {
      currentBalance += tx.type === 'fund' ? tx.amount : -tx.amount;
      return { ...tx, balance: currentBalance };
    });

    setFiltered(withFilteredBalance);
  };

  const handlePrint = () => window.print();

  const handleExportPDF = () => {
    const element = document.getElementById('statement-content');
    if (!element) {
      console.error('Element not found for PDF export');
      return;
    }

    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = canvas.height * pageWidth / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
      pdf.save('Financial_Statement.pdf');
    }).catch(err => {
      console.error('PDF export failed:', err);
    });
  };

  const previousBalance = filtered.length > 0
    ? transactions.find(tx => new Date(tx.date) < new Date(filtered[0].date))?.balance || 0
    : 0;

  const finalBalance = filtered.length > 0
    ? filtered[filtered.length - 1].balance
    : previousBalance;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Loading financial data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen font-sans">
      <div id="statement-content" className="w-full max-w-6xl p-6 bg-white rounded-xl shadow-md print:shadow-none print:p-4 print:text-sm">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Military Dental Center, Bogura</h2>
          <h3 className="text-xl text-gray-700 mt-1">Financial Statement</h3>
          <h5> statement from {startDate} to {endDate} </h5>
          <p className="text-sm text-gray-500 mt-2 max-w-3xl mx-auto">
            This financial statement is prepared in accordance with international public sector accounting standards. It reflects all fund movements, including deposits and expenditures, for the selected reporting period.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex justify-end mb-4 print:hidden text-sm">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border px-2 py-1 rounded mr-2" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border px-2 py-1 rounded mr-2" />
          <button onClick={handleFilter} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Filter
          </button>
        </div>

        {/* Summary */}
        <div className="mb-4 text-sm text-gray-700 print:text-xs">
          <p><strong>Previous Balance:</strong> ৳{previousBalance.toFixed(2)}</p>
          <p><strong>Final Balance:</strong> ৳{finalBalance.toFixed(2)}</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 text-sm print:text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Description</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Type</th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">Amount</th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(tx => (
                <tr key={`${tx.type}-${tx.id}`}>
                  <td className="px-4 py-2 whitespace-nowrap">{tx.date}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{tx.description}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      tx.type === 'fund' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tx.type === 'fund' ? <FaArrowUp /> : <FaArrowDown />}
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right font-medium">
                    <span className={tx.type === 'fund' ? 'text-green-600' : 'text-red-600'}>
                      {tx.type === 'fund' ? '+' : '-'} ৳{tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right text-gray-800">
                    ৳{tx.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export Buttons */}
        <div className="mt-6 flex justify-end gap-2 print:hidden">
                    <button onClick={handleExportPDF} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            <FaFilePdf /> Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatement;
