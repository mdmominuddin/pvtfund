import React, { useEffect, useState } from 'react';
import AccountStatement from './AccountStatement';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    funds: [],
    expenses: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [fundsResponse, expensesResponse] = await Promise.all([
          fetch('/api/funds/'),
          fetch('/api/expenses/'),
        ]);

        if (!fundsResponse.ok || !expensesResponse.ok) {
          throw new Error('Failed to fetch data from the server.');
        }

        const fundsData = await fundsResponse.json();
        const expensesData = await expensesResponse.json();

        setDashboardData({
          funds: fundsData,
          expenses: expensesData,
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalFunds = dashboardData.funds.reduce(
    (sum, fund) => sum + (parseFloat(fund.deposit_amount) || 0),
    0
  );

  const totalExpenses = dashboardData.expenses.reduce(
    (sum, expense) => sum + (parseFloat(expense.expense_amount) || 0),
    0
  );

  const currentBalance = totalFunds - totalExpenses;
  const fundCount = dashboardData.funds.length;
  const expenseCount = dashboardData.expenses.length;

  const chartData = [
    { name: 'Total Funds', amount: totalFunds, color: '#4CAF50' },
    { name: 'Total Expenses', amount: totalExpenses, color: '#F44336' },
    { name: 'Current Balance', amount: currentBalance, color: '#2196F3' },
  ];

  if (isLoading) {
    return <div className="text-center p-10 text-gray-500">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  const cards = [
    {
      title: '💰 Total Funds',
      content: `৳ ${totalFunds.toLocaleString()}`,
      footer: 'From all deposits',
    },
    {
      title: '📦 Total Spent',
      content: `৳ ${totalExpenses.toLocaleString()}`,
      footer: 'From all expenses',
    },
    {
      title: '💹 Current Balance',
      content: `৳ ${currentBalance.toLocaleString()}`,
      footer: 'Total Funds - Total Spent',
    },
    {
      title: '➕ Deposit Count',
      content: `${fundCount} deposits`,
      footer: 'Total deposit entries',
    },
    {
      title: '➖ Expense Count',
      content: `${expenseCount} expenses`,
      footer: 'Total expense entries',
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{card.content}</p>
            <div className="text-xs text-gray-400">{card.footer}</div>
          </div>
        ))}
      </div>

      
      {/* Account Statement */}
      <AccountStatement
        funds={dashboardData.funds}
        expenses={dashboardData.expenses}
        initialBalance={0}
      />
    </div>
  );
}

export default Dashboard;
