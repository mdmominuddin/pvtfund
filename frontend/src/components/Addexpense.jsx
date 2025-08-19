import React, { useEffect, useState } from 'react';

const AddExpense = ({ className }) => {
  const [expenses, setExpenses] = useState([]);
  const [heads, setHeads] = useState([]);
  const [newExpense, setNewExpense] = useState({
    expense_date: '',
    expense_head: '', // ✅ This must be the ID
    expense_amount: '',
  });

  // Fetch expense list
  useEffect(() => {
    fetch('/api/expenses/')
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error('Error fetching expenses:', err));
  }, []);

  // Fetch expense head options
  useEffect(() => {
    fetch('/api/expense-heads/')
      .then(res => res.json())
      .then(data => setHeads(data))
      .catch(err => console.error('Error fetching expense heads:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/expenses/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newExpense,
          expense_head: parseInt(newExpense.expense_head), // ✅ Ensure it's an integer
        }),
      });

      if (!res.ok) throw new Error('Failed to submit expense');

      const created = await res.json();
      setExpenses([created, ...expenses]);
      setNewExpense({
        expense_date: '',
        expense_head: '',
        expense_amount: '',
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={`p-4 rounded shadow-md ${className}`}>
      <h3 className="text-lg font-bold mb-2">Add New Expense</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="date"
          value={newExpense.expense_date}
          onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
          className="w-full p-2 border border-blue-800 rounded"
          required
        />

        <select
          value={newExpense.expense_head}
          onChange={(e) => setNewExpense({ ...newExpense, expense_head: e.target.value })}
          className="w-full p-2 border border-blue-800 rounded"
          required
        >
          <option value="">Select Expense Head</option>
          {heads.map((head) => (
            <option key={head.id} value={head.id}>
              {head.head_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={newExpense.expense_amount}
          onChange={(e) => setNewExpense({ ...newExpense, expense_amount: e.target.value })}
          className="w-full p-2 border border-blue-800 rounded"
          required
        />

        <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>

      <div className="mt-6">
        <h4 className="font-semibold">Recent Expenses:</h4>
        <ul className="text-sm mt-2 space-y-1">
          {expenses.map((expense) => (
            <li key={expense.id}>
              💰 <strong>Tk. {expense.expense_amount}</strong> — {expense.head_name || 'Unknown Head'} on 📅 {expense.expense_date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddExpense;
