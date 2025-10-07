"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import Pagination from "./Pagination";

export default function DataTable({
  data = [],
  columns = [],
  searchTerm = "",
  filters = {},
  itemsPerPage = 10,
  onRowClick,
  showPagination = true,
  sortable = true,
  hoverable = true,
  className = "",
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Filter data based on search term and filters
  const filteredData = data.filter((item) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Additional filters
    const matchesFilters = Object.entries(filters).every(
      ([key, filterValue]) => {
        if (
          !filterValue ||
          filterValue === "All" ||
          filterValue.includes("All")
        ) {
          return true;
        }
        return item[key] === filterValue;
      }
    );

    return matchesSearch && matchesFilters;
  });

  // Sort functionality
  const sortedData = sortable
    ? [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        // Handle different data types
        if (typeof aVal === "string" && typeof bVal === "string") {
          const aLower = aVal.toLowerCase();
          const bLower = bVal.toLowerCase();
          if (sortConfig.direction === "asc") {
            return aLower < bLower ? -1 : aLower > bLower ? 1 : 0;
          } else {
            return aLower > bLower ? -1 : aLower < bLower ? 1 : 0;
          }
        }

        // Handle numbers
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        // Default string comparison
        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      })
    : filteredData;

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (!sortable || sortConfig.key !== key) {
      return <div className="w-4 h-4" />; // Placeholder for alignment
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null;

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={sortedData.length}
        startIndex={startIndex}
        endIndex={startIndex + itemsPerPage}
      />
    );
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <colgroup>
            {columns.map((column, index) => (
              <col key={index} style={{ width: column.width || "auto" }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-100">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-4 text-left text-md font-semibold text-gray-700 ${
                    sortable && column.sortable !== false
                      ? "cursor-pointer hover:text-blue-600 transition-colors duration-200"
                      : ""
                  }`}
                  onClick={() =>
                    column.sortable !== false && handleSort(column.key)
                  }
                >
                  <div className="flex items-center">
                    {column.title}
                    {sortable &&
                      column.sortable !== false &&
                      getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-4 text-sm">
                  No data found
                </td>
              </tr>
            )}
            {paginatedData.map((item, index) => (
              <tr
                key={item.id || index}
                className={`border-b border-gray-100 transition-all duration-200 ${
                  hoverable ? "hover:bg-gray-50" : ""
                } ${onRowClick ? "cursor-pointer" : ""}`}
                onMouseEnter={() => hoverable && setHoveredRow(index)}
                onMouseLeave={() => hoverable && setHoveredRow(null)}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-4 text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}
