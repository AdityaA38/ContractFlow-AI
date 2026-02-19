import { useCallback } from 'react';

export default function FileUpload({ onFileSelect, label, accept, icon }) {
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="group relative border-2 border-dashed border-gray-700 hover:border-emerald-500 rounded-xl p-16 text-center transition-all duration-300 cursor-pointer bg-black/30 hover:bg-black/50">
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id={`upload-${label}`}
      />
      <label htmlFor={`upload-${label}`} className="cursor-pointer">
        <div className="text-2xl font-bold text-white mb-3">{label}</div>
        <div className="text-base text-gray-400">Click to upload</div>
      </label>
    </div>
  );
}