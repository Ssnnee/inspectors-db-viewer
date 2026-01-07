import type { DataHeaderProps } from "../types/data";

export function DataHeader({
  fileName,
  femaleCount,
  maleCount,
}: DataHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 print-area">
      <h1 className="text-4xl font-bold text-white mb-2">
        Base de données IGEPSA
      </h1>
      <p className="text-indigo-100 text-lg mb-2">{fileName}</p>
      <div className="mt-4 flex gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
          <div className="w-4 h-4 bg-pink-400 rounded"></div>
          <span className="text-white text-sm font-medium">
            Femme ({femaleCount})
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
          <div className="w-4 h-4 bg-blue-400 rounded"></div>
          <span className="text-white text-sm font-medium">
            Homme ({maleCount})
          </span>
        </div>
      </div>
    </div>
  );
}

