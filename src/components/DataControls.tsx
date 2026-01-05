import { Download, Upload, Printer, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DataControlsProps } from "../types/data";

export function DataControls({
  filtering,
  onFilteringChange,
  onClearFilters,
  activeFiltersCount,
  onExport,
  onPrint,
  onNewFile,
}: DataControlsProps) {
  return (
    <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 space-y-4 no-print">
      <div className="flex gap-4 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap items-center">
          <Input
            placeholder="Rechercher..."
            value={filtering}
            onChange={(e) => onFilteringChange(e.target.value)}
            className="max-w-sm"
          />
          {activeFiltersCount > 0 && (
            <Button
              onClick={onClearFilters}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="mr-1 h-3 w-3" />
              Effacer ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={onExport}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>

          <Button onClick={onPrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>

          <Button onClick={onNewFile} variant="secondary">
            <Upload className="mr-2 h-4 w-4" />
            Nouveau
          </Button>
        </div>
      </div>
    </div>
  );
}