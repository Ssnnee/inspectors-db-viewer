import { useState } from "react";
import * as XLSX from "xlsx";
import type { DataRow, UseExcelDataReturn } from "../types/data";

export function useExcelData(): UseExcelDataReturn {
  const [data, setData] = useState<DataRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [hasData, setHasData] = useState(false);

  const loadFile = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
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
          resolve();
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          alert("Erreur lors de la lecture du fichier: " + errorMessage);
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const exportData = () => {
    const headers = Object.keys(data[0] || {});
    const rows = data.map((row) => headers.map((header) => row[header] || ""));
    const sheetData = [headers, ...rows];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    ws["!cols"] = headers.map(() => ({ wch: 20 }));

    XLSX.utils.book_append_sheet(wb, ws, "Inspecteurs");
    XLSX.writeFile(wb, "Inspecteurs_Styled.xlsx");
  };

  const resetData = () => {
    setData([]);
    setHasData(false);
    setFileName("");
  };

  return {
    data,
    fileName,
    hasData,
    loadFile,
    exportData,
    resetData,
  };
}