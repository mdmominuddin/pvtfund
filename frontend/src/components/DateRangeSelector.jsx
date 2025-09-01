function DateRangeSelector({ onChange }) {
  return (
    <div className="flex flex-wrap gap-6 items-center justify-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
      <div>
        <label className="block text-sm text-gray-600 mb-1">📅 Start Date</label>
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 text-sm shadow-sm"
          onChange={e => onChange('start', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">📅 End Date</label>
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 text-sm shadow-sm"
          onChange={e => onChange('end', e.target.value)}
        />
      </div>
    </div>
  );
}

export default DateRangeSelector;
