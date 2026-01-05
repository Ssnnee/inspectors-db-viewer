import { useState, useMemo } from "react";
import type { DataRow, SortConfig, UseDataFilteringReturn } from "../types/data";

export function useDataFiltering(data: DataRow[]): UseDataFilteringReturn {
  const [filtering, setFiltering] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = useMemo(() => {
    return () => {
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
  }, [data, sortConfig]);

  const getFilteredData = useMemo(() => {
    return () => {
      const sorted = getSortedData();

      if (!filtering) return sorted;

      return sorted.filter((row) => {
        return Object.values(row).some((value) =>
          String(value).toLowerCase().includes(filtering.toLowerCase()),
        );
      });
    };
  }, [getSortedData, filtering]);

  const getPaginatedData = useMemo(() => {
    return () => {
      const filtered = getFilteredData();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filtered.slice(startIndex, endIndex);
    };
  }, [getFilteredData, currentPage]);

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

  // Reset to page 1 when filtering changes
  const handleFilteringChange = (value: string) => {
    setFiltering(value);
    setCurrentPage(1);
  };

  return {
    filtering,
    setFiltering: handleFilteringChange,
    sortConfig,
    handleSort,
    currentPage,
    setCurrentPage,
    getFilteredData: getFilteredData,
    getPaginatedData: getPaginatedData,
    clearAllFilters,
    getActiveFiltersCount,
  };
}