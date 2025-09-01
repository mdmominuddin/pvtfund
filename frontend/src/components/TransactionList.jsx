import TransactionRow from './TransactionRow';

function TransactionList({ transactions }) {
  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
          <tr>
            <th className="px-4 py-2 border text-left">Date</th>
            <th className="px-4 py-2 border text-left">Type</th>
            <th className="px-4 py-2 border text-right">Amount</th>
            <th className="px-4 py-2 border text-left">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx, index) => (
              <TransactionRow
                key={`${tx.type}-${tx.id}`}
                tx={tx}
              />
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
