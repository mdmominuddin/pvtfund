function TransactionRow({ tx }) {
  const isIncome = tx.type === 'income';
  const rowStyle = isIncome ? 'bg-green-50' : 'bg-red-50';

  return (
    <tr className={`${rowStyle} border-b`}>
      <td className="px-4 py-2">{tx.date}</td>
      <td className="px-4 py-2">{isIncome ? 'Income' : 'Expense'}</td>
      <td className="px-4 py-2 text-right">৳ {tx.amount}</td>
      <td className="px-4 py-2">{tx.remarks || tx.head_name || '—'}</td>
    </tr>
  );
}

export default TransactionRow;
