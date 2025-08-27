import React, { useEffect, useState } from 'react';

function Fundstate() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState('deposit_date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetch('/api/funds/')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setFunds(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load funds');
        setLoading(false);
      });
  }, []);

  const sortedFunds = [...funds].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    else return valA < valB ? 1 : -1;
  });

  const toggleSort = key => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const totalAmount = sortedFunds.reduce((sum, fund) => sum + parseFloat(fund.deposit_amount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center tracking-wide">💰 Fund Ledger</h2>

      {loading && <p className="text-gray-500 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Serial</th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => toggleSort('deposit_date')}>
                  Date {sortKey === 'deposit_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => toggleSort('fund_description')}>
                  Description {sortKey === 'fund_description' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-right cursor-pointer" onClick={() => toggleSort('deposit_amount')}>
                  Amount {sortKey === 'deposit_amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedFunds.map((fund, index) => (
                <tr key={fund.id || index} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{fund.deposit_date}</td>
                  <td className="px-4 py-2">{fund.fund_description}</td>
                  <td className="px-4 py-2 text-right text-blue-700 font-medium">
                    ৳ {parseFloat(fund.deposit_amount).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan="3" className="px-4 py-3 text-right">Total</td>
                <td className="px-4 py-3 text-right text-green-700">৳ {totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Fundstate;
