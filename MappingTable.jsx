export default function MappingTable({ pdfFields, csvHeaders, mapping, onMappingChange }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-6 pb-3 border-b border-gray-800">
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Template Field</div>
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">CSV Column</div>
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Preview</div>
      </div>
      
      {pdfFields.map((field) => (
        <div key={field} className="grid grid-cols-3 gap-6 items-center py-2">
          <div className="text-white font-medium capitalize">{field.replace(/_/g, ' ')}</div>
          <select
            className="w-full bg-black border-2 border-gray-700 focus:border-emerald-500 rounded-lg px-4 py-3 text-white outline-none transition-all"
            value={mapping[field] || ''}
            onChange={(e) => onMappingChange(field, e.target.value)}
          >
            <option value="">Select column</option>
            {csvHeaders.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
          <div className="text-emerald-400 font-mono text-sm">
            {mapping[field] || 'Not mapped'}
          </div>
        </div>
      ))}
    </div>
  );
}