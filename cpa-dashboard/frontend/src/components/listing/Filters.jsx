import React from "react";
import PageTitle from "../common/PageTitle";
import FiltersBar from "../common/FiltersBar";
import { LISTING_CONSTANTS } from "@/utils/constants/listing";

export default function Filters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  title = LISTING_CONSTANTS.PAGE_TITLE,
  subtitle = LISTING_CONSTANTS.PAGE_SUBTITLE,
  addButtonText = LISTING_CONSTANTS.ADD_BUTTON_TEXT,
  addButtonPath,
  onAddClick,
  searchPlaceholder = LISTING_CONSTANTS.SEARCH_PLACEHOLDER,
  statusOptions = Object.values(LISTING_CONSTANTS.STATUS_FILTER),
}) {
  const filters = [
    {
      key: "status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: statusOptions,
    },
  ];

  return (
    <PageTitle
      title={title}
      subtitle={subtitle}
      addButtonText={addButtonText}
      addButtonPath={addButtonPath}
      onAddClick={onAddClick}
    >
      <FiltersBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
      />
    </PageTitle>
  );
}
