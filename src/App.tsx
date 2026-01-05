import {
  FileUpload,
  DataHeader,
  DataControls,
  DataTable,
  Pagination,
  StatsFooter,
} from "./components";
import { useExcelData } from "./hooks/useExcelData";
import { useDataFiltering } from "./hooks/useDataFiltering";
import { useDataStats } from "./hooks/useDataStats";

const StyledExcelViewer = () => {
  // Custom hooks handle all logic
  const { data, fileName, hasData, loadFile, exportData, resetData } =
    useExcelData();
  const {
    filtering,
    setFiltering,
    handleSort,
    currentPage,
    setCurrentPage,
    getFilteredData,
    getPaginatedData,
    clearAllFilters,
    getActiveFiltersCount,
  } = useDataFiltering(data);
  const { femaleCount, maleCount } = useDataStats(data);

  // Show upload screen if no data loaded
  if (!hasData) {
    return <FileUpload onFileUpload={loadFile} />;
  }

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <DataHeader
            fileName={fileName}
            femaleCount={femaleCount}
            maleCount={maleCount}
          />

          <DataControls
            filtering={filtering}
            onFilteringChange={setFiltering}
            onClearFilters={clearAllFilters}
            activeFiltersCount={getActiveFiltersCount()}
            onExport={exportData}
            onPrint={() => window.print()}
            onNewFile={resetData}
          />

          <DataTable
            data={getPaginatedData()}
            headers={headers}
            onSort={handleSort}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalResults={filteredData.length}
          />

          <StatsFooter
            total={data.length}
            female={femaleCount}
            male={maleCount}
          />
        </div>
      </div>
    </div>
  );
};

export default StyledExcelViewer;

