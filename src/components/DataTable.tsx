import { ArrowUpDown } from "lucide-react";
import type { DataRow } from "../types/data";

interface DataTableProps {
  data: DataRow[];
  headers: string[];
  onSort: (key: string) => void;
}

export function DataTable({ data, headers, onSort }: DataTableProps) {
  const renderCellValue = (header: string, value: string | number | boolean | null | undefined) => {
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

    if (isSexeColumn) {
      return (
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
      );
    } else if (isSalaireColumn && typeof value === "number") {
      return (
        <span className="font-semibold text-green-700">
          {value.toLocaleString("fr-FR")} €
        </span>
      );
    } else if (isMatriculeColumn) {
      return (
        <span className="font-mono font-semibold text-slate-700">
          {value || "-"}
        </span>
      );
    } else {
      return (
        <span className="text-slate-700">
          {value || "-"}
        </span>
      );
    }
  };

  const getRowClasses = (row: DataRow) => {
    const sexe = row["Sexe"] || row["sexe"] || row["SEXE"];
    const isFemale = sexe === "F";
    const isMale = sexe === "M";

    const baseClasses = "border-b border-slate-200 transition-all duration-200";
    const conditionalClasses = isFemale
      ? "bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100"
      : isMale
        ? "bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100"
        : "bg-white hover:bg-slate-50";

    return `${baseClasses} ${conditionalClasses} hover:shadow-md`;
  };

  return (
    <div className="overflow-x-auto print-area">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-slate-700 to-slate-800">
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider border-r border-slate-600 last:border-r-0 cursor-pointer hover:bg-slate-600 transition-colors"
                onClick={() => onSort(header)}
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
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className={getRowClasses(row)}>
                {headers.map((header) => {
                  const value = row[header];
                  const isSexeColumn =
                    header === "Sexe" ||
                    header === "sexe" ||
                    header === "SEXE";

                  return (
                    <td
                      key={header}
                      className={`px-6 py-4 text-sm border-r border-slate-200 last:border-r-0 ${
                        isSexeColumn ? "text-center" : ""
                      }`}
                    >
                      {renderCellValue(header, value)}
                    </td>
                  );
                })}
              </tr>
            ))
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
  );
}