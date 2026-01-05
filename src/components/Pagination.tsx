import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationProps } from "../types/data";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-t border-slate-200 no-print">
      <div className="text-sm text-slate-600">
        Page {currentPage} sur {totalPages || 1} - {totalResults}{" "}
        résultat(s)
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Suivant
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}