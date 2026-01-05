import type { StatsFooterProps } from "../types/data";

export function StatsFooter({ total, female, male }: StatsFooterProps) {
  return (
    <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 no-print">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200">
          <div className="text-sm text-slate-600 font-medium">
            Total Inspecteurs
          </div>
          <div className="text-3xl font-bold text-indigo-600 mt-1">
            {total}
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-4 shadow-md border border-pink-200">
          <div className="text-sm text-pink-700 font-medium">Femmes</div>
          <div className="text-3xl font-bold text-pink-600 mt-1">
            {female}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 shadow-md border border-blue-200">
          <div className="text-sm text-blue-700 font-medium">Hommes</div>
          <div className="text-3xl font-bold text-blue-600 mt-1">
            {male}
          </div>
        </div>
      </div>
    </div>
  );
}