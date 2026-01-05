import { useState } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Download,
  Upload,
  Printer,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface DataRow {
  [key: string]: string | number | boolean | null | undefined;
}

const StyledExcelViewer = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [hasData, setHasData] = useState(false);
  const [filtering, setFiltering] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" }>({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (!event.target?.result) return;
        const workbook = XLSX.read(event.target.result, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
          defval: "",
          blankrows: false,
        });

        const headers = (jsonData[0] as string[]) || [];
        const rows = (jsonData.slice(1) as (string | number | boolean | null | undefined)[][]).map((row) => {
          const obj: DataRow = {};
          headers.forEach((header, index) => {
            obj[header] =
              row[index] !== undefined &&
              row[index] !== null &&
              row[index] !== ""
                ? row[index]
                : "";
          });
          return obj;
        });

        setData(rows);
        setHasData(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        alert("Erreur lors de la lecture du fichier: " + errorMessage);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadStyledExcel = () => {
    const headers = Object.keys(data[0] || {});
    const rows = data.map((row) => headers.map((header) => row[header] || ""));
    const sheetData = [headers, ...rows];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    ws["!cols"] = headers.map(() => ({ wch: 20 }));

    XLSX.utils.book_append_sheet(wb, ws, "Inspecteurs");
    XLSX.writeFile(wb, "Inspecteurs_Styled.xlsx");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    const sortedData = [...data];

    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        const aVal = a[sortConfig.key!] || "";
        const bVal = b[sortConfig.key!] || "";

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortedData;
  };

  const getFilteredData = () => {
    const sorted = getSortedData();

    if (!filtering) return sorted;

    return sorted.filter((row) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(filtering.toLowerCase()),
      );
    });
  };

  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filtering.trim()) count++;
    if (sortConfig.key) count++;
    if (currentPage > 1) count++;
    return count;
  };

  const clearAllFilters = () => {
    setFiltering("");
    setSortConfig({ key: null, direction: "asc" });
    setCurrentPage(1);
  };

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full border border-slate-200">
          <div className="text-center">
            <Upload className="w-24 h-24 mx-auto text-indigo-500 mb-6" />
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              📊 Styliseur Excel
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Importez votre fichier Excel pour le visualiser avec un design
              moderne
            </p>

            <label className="block">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Upload className="w-6 h-6" />
                Choisir un fichier Excel
              </label>
            </label>

            <p className="text-sm text-slate-500 mt-6">
              Formats supportés: .xlsx, .xls
            </p>
          </div>
        </div>
      </div>
    );
  }

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const filteredData = getFilteredData();
  const paginatedData = getPaginatedData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const femaleCount = data.filter((row) => {
    const sexe = row["Sexe"] || row["sexe"] || row["SEXE"];
    return sexe === "F";
  }).length;

  const maleCount = data.filter((row) => {
    const sexe = row["Sexe"] || row["sexe"] || row["SEXE"];
    return sexe === "M";
  }).length;

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
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 print-area">
            <h1 className="text-4xl font-bold text-white mb-2">
              Base Inspecteurs
            </h1>
            <p className="text-indigo-100 text-lg mb-2">{fileName}</p>
            <p className="text-indigo-200 text-sm">
              Données stylisées et organisées
            </p>
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

          {/* Controls Section */}
           <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 space-y-4 no-print">
             <div className="flex gap-4 flex-wrap items-center justify-between">
               <div className="flex gap-2 flex-wrap items-center">
                 <Input
                   placeholder="Rechercher..."
                   value={filtering}
                   onChange={(e) => {
                     setFiltering(e.target.value);
                     setCurrentPage(1);
                   }}
                   className="max-w-sm"
                 />
                 {getActiveFiltersCount() > 0 && (
                   <Button
                     onClick={clearAllFilters}
                     variant="outline"
                     size="sm"
                     className="text-red-600 hover:text-red-700 hover:bg-red-50"
                   >
                     <X className="mr-1 h-3 w-3" />
                     Effacer ({getActiveFiltersCount()})
                   </Button>
                 )}
               </div>

               <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={downloadStyledExcel}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>

                <Button onClick={handlePrint} variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </Button>

                <Button
                  onClick={() => {
                    setData([]);
                    setHasData(false);
                    setFileName("");
                    setFiltering("");
                    setCurrentPage(1);
                  }}
                  variant="secondary"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Nouveau
                </Button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto print-area">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-700 to-slate-800">
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider border-r border-slate-600 last:border-r-0 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => handleSort(header)}
                    >
                      <div className="flex items-center gap-2">
                        {header}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIndex) => {
                    const sexe = row["Sexe"] || row["sexe"] || row["SEXE"];
                    const isFemale = sexe === "F";
                    const isMale = sexe === "M";

                    return (
                      <tr
                        key={rowIndex}
                        className={`border-b border-slate-200 transition-all duration-200 hover:shadow-md ${
                          isFemale
                            ? "bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100"
                            : isMale
                              ? "bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100"
                              : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        {headers.map((header) => {
                          const value = row[header];
                          const isSexeColumn =
                            header === "Sexe" ||
                            header === "sexe" ||
                            header === "SEXE";
                          const isSalaireColumn = header
                            .toLowerCase()
                            .includes("salaire");
                          const isMatriculeColumn = header
                            .toLowerCase()
                            .includes("matricule");

                          return (
                            <td
                              key={header}
                              className={`px-6 py-4 text-sm border-r border-slate-200 last:border-r-0 ${
                                isSexeColumn ? "text-center" : ""
                              }`}
                            >
                              {isSexeColumn ? (
                                <span
                                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                                    value === "F"
                                      ? "bg-gradient-to-br from-pink-400 to-pink-600"
                                      : value === "M"
                                        ? "bg-gradient-to-br from-blue-400 to-blue-600"
                                        : "bg-slate-400"
                                  }`}
                                >
                                  {value || "-"}
                                </span>
                              ) : isSalaireColumn &&
                                typeof value === "number" ? (
                                <span className="font-semibold text-green-700">
                                  {value.toLocaleString("fr-FR")} €
                                </span>
                              ) : isMatriculeColumn ? (
                                <span className="font-mono font-semibold text-slate-700">
                                  {value || "-"}
                                </span>
                              ) : (
                                <span className="text-slate-700">
                                  {value || "-"}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={headers.length}
                      className="h-24 text-center text-slate-500"
                    >
                      Aucun résultat trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-slate-200 no-print">
            <div className="text-sm text-slate-600">
              Page {currentPage} sur {totalPages || 1} - {filteredData.length}{" "}
              résultat(s)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 no-print">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200">
                <div className="text-sm text-slate-600 font-medium">
                  Total Inspecteurs
                </div>
                <div className="text-3xl font-bold text-indigo-600 mt-1">
                  {data.length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-4 shadow-md border border-pink-200">
                <div className="text-sm text-pink-700 font-medium">Femmes</div>
                <div className="text-3xl font-bold text-pink-600 mt-1">
                  {femaleCount}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 shadow-md border border-blue-200">
                <div className="text-sm text-blue-700 font-medium">Hommes</div>
                <div className="text-3xl font-bold text-blue-600 mt-1">
                  {maleCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyledExcelViewer;
