"use client";

import Filters from "@/components/listing/Filters";
import StatsCards from "@/components/listing/StatsCards";
import { useState } from "react";
import ClientTable from "@/components/listing/ClientTable";
import { LISTING_CONSTANTS } from "@/utils/constants";

export default function ListingPage() {
  const [searchTerm, setSearchTerm] = useState(LISTING_CONSTANTS.SEARCH.ALL);
  const [statusFilter, setStatusFilter] = useState(
    LISTING_CONSTANTS.STATUS_FILTER.ALL
  );
  return (
    <div className="min-h-screen">
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <StatsCards />
      <ClientTable searchTerm={searchTerm} statusFilter={statusFilter} />
    </div>
  );
}
