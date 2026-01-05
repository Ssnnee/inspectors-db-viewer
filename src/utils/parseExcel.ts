import * as XLSX from "xlsx";

export function parseExcel(file: File): Promise<Record<string, string | number | boolean | null | undefined>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, {
        defval: "", // IMPORTANT: handle empty cells
      }) as Record<string, string | number | boolean | null | undefined>[];

      resolve(json);
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
