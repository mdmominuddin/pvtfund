import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

function AccountStatement({ funds, expenses }) {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));

  // Merge and tag transactions
  const allTransactions = useMemo(() => [
    ...funds.map(fund => ({
      type: 'Deposit',
      amount: parseFloat(fund.deposit_amount),
      date: fund.deposit_date,
      description: fund.fund_description || 'Fund deposit',
    })),
    ...expenses.map(expense => ({
      type: 'Expense',
      amount: -parseFloat(expense.expense_amount),
      date: expense.expense_date,
      description: expense.head_name || 'Expense',
    })),
  ], [funds, expenses]);

  // Filter by selected month
  const filteredTransactions = allTransactions.filter(tx =>
    dayjs(tx.date).format('YYYY-MM') === selectedMonth
  );

  // Calculate previous balance
  const previousBalance = allTransactions
    .filter(tx => dayjs(tx.date).isBefore(`${selectedMonth}-01`))
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Running balance
  let runningBalance = previousBalance;
  const statementRows = filteredTransactions.map((tx, index) => {
    runningBalance += tx.amount;
    return {
      ...tx,
      balanceAfter: runningBalance,
      key: index,
    };
  });

  // Summary
  const totalFunds = filteredTransactions
    .filter(tx => tx.type === 'Deposit')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(tx => tx.type === 'Expense')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const finalBalance = runningBalance;

  // Export CSV
  const handleExport = () => {
    const header = ['Date', 'Description', 'Type', 'Amount', 'Balance After'];
    const rows = statementRows.map(tx => [
      dayjs(tx.date).format('YYYY-MM-DD'),
      tx.description,
      tx.type,
      tx.amount,
      tx.balanceAfter,
    ]);
    const csvContent = [header, ...rows]
      .map(row => row.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `AccountStatement-${selectedMonth}.csv`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 col-span-full space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">📄 Account Statement</h2>
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-600">
        <thead>
          <tr className="border-b bg-gray-50">
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount (৳)</th>
            <th>Balance After</th>
          </tr>
        </thead>
        <tbody>
          {statementRows.map(tx => (
            <tr key={tx.key} className="border-b hover:bg-gray-50">
              <td>{dayjs(tx.date).format('YYYY-MM-DD')}</td>
              <td>{tx.description}</td>
              <td>{tx.type}</td>
              <td className={tx.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                {tx.amount.toLocaleString()}
              </td>
              <td>{tx.balanceAfter.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
        <div className="text-green-600 font-medium">💰 Total Fund: ৳ {totalFunds.toLocaleString()}</div>
        <div className="text-red-600 font-medium">📦 Total Expenses: ৳ {totalExpenses.toLocaleString()}</div>
        <div className="text-blue-700 font-medium">💹 Closing Balance: ৳ {finalBalance.toLocaleString()}</div>
      </div>
    </div>
  );
}

export default AccountStatement;
