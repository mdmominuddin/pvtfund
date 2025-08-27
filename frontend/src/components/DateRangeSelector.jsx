function DateRangeSelector({ onChange }) {
  return (
    <div className="flex gap-4 mb-6 items-center justify-center">
      <div>
        <label className="text-sm">Start Date</label>
        <input
          type="date"
          className="border rounded px-2 py-1"
          onChange={e => onChange('start', e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm">End Date</label>
        <input
          type="date"
          className="border rounded px-2 py-1"
          onChange={e => onChange('end', e.target.value)}
        />
      </div>
    </div>
  );
}

export default DateRangeSelector;
