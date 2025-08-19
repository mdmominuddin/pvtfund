import React, { useEffect, useState } from 'react'

function Fundstate() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Calculate total deposited amount
  const totalAmount = funds.reduce((sum, fund) => sum + parseFloat(fund.deposit_amount || 0), 0);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Fund State</h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full table border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Serial</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund, index) => (
              <tr key={fund.id || index} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{fund.deposit_date}</td>
                <td className="p-2">{fund.fund_description}</td>
                <td className="p-2">{fund.deposit_amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold">
              <td colSpan="3" className="p-2 text-right">Total</td>
              <td className="p-2">{totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Fundstate
