export default function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
      <div
        className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}