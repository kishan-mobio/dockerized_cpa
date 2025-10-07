"use client";

import { useState } from "react";
import PageHeader from "./PageHeader";
import StatsGrid from "./StatsGrid";
import DataTable from "./DataTable";

export default function PageWrapper({
  // Page configuration
  title,
  subtitle,
  
  // Header configuration
  searchPlaceholder = "Search...",
  addButtonText,
  addButtonPath,
  showAddButton = true,
  showSearch = true,
  showFilters = true,
  
  // Stats configuration
  stats = [],
  showStats = true,
  
  // Table configuration
  data = [],
  columns = [],
  itemsPerPage = 10,
  onRowClick,
  showPagination = true,
  sortable = true,
  hoverable = true,
  
  // Filter configuration
  filters = [],
  
  // Custom content
  children,
  customContent,
  
  // Layout options
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState(
    filters.reduce((acc, filter) => {
      acc[filter.key] = filter.defaultValue || (filter.options && filter.options[0]) || "";
      return acc;
    }, {})
  );

  // Prepare filters for PageHeader
  const headerFilters = filters.map(filter => ({
    value: filterValues[filter.key],
    onChange: (value) => setFilterValues(prev => ({ ...prev, [filter.key]: value })),
    options: filter.options || []
  }));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page Header with Search and Filters */}
      <PageHeader
        title={title}
        subtitle={subtitle}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder={searchPlaceholder}
        filters={headerFilters}
        addButtonText={addButtonText}
        addButtonPath={addButtonPath}
        showAddButton={showAddButton}
        showSearch={showSearch}
        showFilters={showFilters}
      />

      {/* Stats Grid */}
      {showStats && stats.length > 0 && (
        <StatsGrid stats={stats} />
      )}

      {/* Custom Content */}
      {customContent && (
        <div className="mb-6">
          {customContent}
        </div>
      )}

      {/* Data Table */}
      {data.length > 0 && columns.length > 0 && (
        <DataTable
          data={data}
          columns={columns}
          searchTerm={searchTerm}
          filters={filterValues}
          itemsPerPage={itemsPerPage}
          onRowClick={onRowClick}
          showPagination={showPagination}
          sortable={sortable}
          hoverable={hoverable}
        />
      )}

      {/* Children for additional custom content */}
      {children}
    </div>
  );
}
