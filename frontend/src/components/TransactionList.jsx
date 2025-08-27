import TransactionRow from './TransactionRow';

function TransactionList({ transactions }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
      <table className="min-w-full table-auto border-collapse text-sm">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 uppercase tracking-wide">
          <tr>
            <th className="px-6 py-3 text-left">Date</th>
            <th className="px-6 py-3 text-left">Type</th>
            <th className="px-6 py-3 text-right">Amount</th>
            <th className="px-6 py-3 text-left">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.length > 0 ? (
            transactions.map(tx => (
              <TransactionRow key={`${tx.type}-${tx.id}`} tx={tx} />
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">
                No transactions found for this period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
