function StatementHeader({ opening, closing, present }) {
  return (
    <div className="grid grid-cols-3 gap-4 bg-slate-100 p-4 rounded mb-6 text-center">
      <div>
        <p className="text-sm text-gray-600">Opening Balance</p>
        <p className="text-lg font-semibold text-blue-700">৳ {opening}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Closing Balance</p>
        <p className="text-lg font-semibold text-green-700">৳ {closing}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Present Balance</p>
        <p className="text-lg font-semibold text-indigo-700">৳ {present}</p>
      </div>
    </div>
  );
}

export default StatementHeader;
