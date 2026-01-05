import { useMemo } from "react";
import type { DataRow, UseDataStatsReturn } from "../types/data";

export function useDataStats(data: DataRow[]): UseDataStatsReturn {
  const stats = useMemo(() => {
    const femaleCount = data.filter((row) => {
      const sexe = row["Sexe"] || row["sexe"] || row["SEXE"];
      return sexe === "F";
    }).length;

    const maleCount = data.filter((row) => {
      const sexe = row["Sexe"] || row["sexe"] || row["SEXE"];
      return sexe === "M";
    }).length;

    const totalCount = data.length;

    return {
      femaleCount,
      maleCount,
      totalCount,
    };
  }, [data]);

  return stats;
}