function StatementHeader({ opening, closing, present }) {
  return (
    <div className="grid grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border border-gray-300 shadow-sm text-center font-mono">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Opening Balance</p>
        <p className="text-xl font-bold text-blue-700">৳ {opening}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Closing Balance</p>
        <p className="text-xl font-bold text-green-700">৳ {closing}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Present Balance</p>
        <p className="text-xl font-bold text-indigo-700">৳ {present}</p>
      </div>
    </div>
  );
}

export default StatementHeader;
