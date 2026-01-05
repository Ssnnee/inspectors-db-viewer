import { Upload } from "lucide-react";
import type { FileUploadProps } from "../types/data";

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onFileUpload(file);
    }
  };

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
              onChange={handleFileChange}
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