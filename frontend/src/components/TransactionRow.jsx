function TransactionRow({ tx }) {
  const isIncome = tx.type === 'income';
  const rowColor = isIncome ? 'bg-green-50' : 'bg-red-50';

  return (
    <tr className={`${rowColor} font-mono`}>
      <td className="px-4 py-2 border text-sm">{tx.date}</td>
      <td className="px-4 py-2 border text-sm">{isIncome ? 'Income' : 'Expense'}</td>
      <td className="px-4 py-2 border text-right text-sm">৳ {tx.amount}</td>
      <td className="px-4 py-2 border text-sm">{tx.remarks || tx.head_name || '—'}</td>
    </tr>
  );
}

export default TransactionRow;
