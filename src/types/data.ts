export interface DataRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface SortConfig {
  key: string | null;
  direction: "asc" | "desc";
}

export interface UseExcelDataReturn {
  data: DataRow[];
  fileName: string;
  hasData: boolean;
  loadFile: (file: File) => Promise<void>;
  exportData: () => void;
  resetData: () => void;
}

export interface UseDataFilteringReturn {
  filtering: string;
  setFiltering: (value: string) => void;
  sortConfig: SortConfig;
  handleSort: (key: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  getFilteredData: () => DataRow[];
  getPaginatedData: () => DataRow[];
  clearAllFilters: () => void;
  getActiveFiltersCount: () => number;
}

export interface UseDataStatsReturn {
  femaleCount: number;
  maleCount: number;
  totalCount: number;
}

export interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
}

export interface DataHeaderProps {
  fileName: string;
  femaleCount: number;
  maleCount: number;
}

export interface DataControlsProps {
  filtering: string;
  onFilteringChange: (value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  onExport: () => void;
  onPrint: () => void;
  onNewFile: () => void;
}

export interface DataTableProps {
  data: DataRow[];
  headers: string[];
  onSort: (key: string) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
}

export interface StatsFooterProps {
  total: number;
  female: number;
  male: number;
}