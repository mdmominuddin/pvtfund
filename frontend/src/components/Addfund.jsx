import React, { useEffect, useState } from 'react';

const Addfund = ({ className }) => {
  const [funds, setFunds] = useState([]);
  const [newFund, setNewFund] = useState({
    deposit_amount: '',
    deposit_date: '',
    deposited_by: '',
    fund_description: '',
  });

  useEffect(() => {
    fetch('/api/funds/')
      .then(res => res.json())
      .then(data => setFunds(data))
      .catch(err => console.error('Error fetching funds:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/funds/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFund),
    });

    if (res.ok) {
      const created = await res.json();
      setFunds([created, ...funds]);
      setNewFund({
        deposit_amount: '',
        deposit_date: '',
        deposited_by: '',
        fund_description: '',
      });
    } else {
      console.error('Failed to create fund');
    }
  };

  return (
    <div className={`p-4 rounded shadow-md ${className}`}>
      <h3 className="text-lg font-bold mb-2">Add Fund</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Deposited by"
          value={newFund.deposited_by}
          onChange={(e) => setNewFund({ ...newFund, deposited_by: e.target.value })}
          className="w-full p-2 border border-solid border-blue-800 p-2 rounded"
          required
        />
        <input
          type="date"
          value={newFund.deposit_date}
          onChange={(e) => setNewFund({ ...newFund, deposit_date: e.target.value })}
          className="w-full p-2 border border-solid border-blue-800 p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Fund description"
          value={newFund.fund_description}
          onChange={(e) => setNewFund({ ...newFund, fund_description: e.target.value })}
          className="w-full p-2 border border-solid border-blue-800 p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="deposit_amount"
          value={newFund.deposit_amount}
          onChange={(e) => setNewFund({ ...newFund, deposit_amount: e.target.value })}
          className="w-full p-2 border border-solid border-blue-800 p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>

      <div className="mt-4">
        <h4 className="font-semibold">Recent Funds:</h4>
        <ul className="text-sm mt-2 space-y-1">
          {funds.map((fund) => (
            <li key={fund.id}>
              💰 <strong>Tk. {fund.deposit_amount} </strong> by {fund.deposited_by} on  — 📅 {fund.deposit_date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Addfund;
