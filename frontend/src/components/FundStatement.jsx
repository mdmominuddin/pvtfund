import { useEffect, useState } from 'react';
import axios from 'axios';
import StatementHeader from './StatementHeader';
import TransactionList from './TransactionList';
import DateRangeSelector from './DateRangeSelector';

function FundStatement() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [balances, setBalances] = useState({});
  const [transactions, setTransactions] = useState([]);

  const handleDateChange = (type, value) => {
    if (type === 'start') setStartDate(value);
    if (type === 'end') setEndDate(value);
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    axios.get(`/api/fundstatement?start_date=${startDate}&end_date=${endDate}`)
      .then(res => {
        setBalances({
          opening: res.data.opening_balance,
          closing: res.data.closing_balance,
          present: res.data.present_balance
        });
        setTransactions(res.data.transactions);
      })
      .catch(err => console.error('Error fetching statement:', err));
  }, [startDate, endDate]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 bg-gradient-to-br from-gray-50 to-white shadow-xl rounded-xl border border-gray-200">
      <header className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">💼 Fund Statement</h2>
        <p className="text-sm text-gray-500">Select a date range to view your financial activity</p>
      </header>

      <DateRangeSelector onChange={handleDateChange} />

      {startDate && endDate && (
        <div className="mt-6 space-y-6">
          <StatementHeader {...balances} />
          <TransactionList transactions={transactions} />
        </div>
      )}
    </div>
  );
}

export default FundStatement;
