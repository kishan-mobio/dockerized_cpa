"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientsData } from "@/utils/data/clients";
import TableHeader from "../common/TableHeader";
import StatusBadge from "../common/StatusBadge";
import Pagination from "../common/Pagination";
import TableActions from "../common/TableActions";
import { LISTING_CONSTANTS } from "@/utils/constants/listing";
import { getInitials } from "@/utils/methods";

export default function ClientTable({
  searchTerm = LISTING_CONSTANTS.SEARCH.ALL,
  statusFilter = LISTING_CONSTANTS.STATUS_FILTER.ALL,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = LISTING_CONSTANTS.PAGINATION.ITEMS_PER_PAGE;

  const router = useRouter();

  const filteredClients = clientsData.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort functionality
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key].toLowerCase();
    const bVal = b[sortConfig.key].toLowerCase();

    if (sortConfig.direction === "asc") {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = sortedClients.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg
          className="w-4 h-4 ml-1 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>
      );
    }

    return sortConfig.direction === "asc" ? (
      <svg
        className="w-4 h-4 ml-1 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 ml-1 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  const renderStatusBadge = (status) => {
    return <StatusBadge status={status} variant="outline" />;
  };

  const handleViewDetails = () => {
    router.push("/dashboard");
  };

  const handleBookkeeping = (clientId) => {
    router.push(`/book-closure/${clientId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <TableHeader
        title={LISTING_CONSTANTS.MESSAGES.CLIENTS_COUNT}
        count={filteredClients.length}
        lastUpdated={LISTING_CONSTANTS.MESSAGES.LAST_UPDATED}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed align-middle">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-100">
              <th
                className="px-4 py-4 text-left text-md font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  {LISTING_CONSTANTS.TABLE_HEADERS.CLIENT_NAME}
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                className="px-4 py-4 text-left text-md font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                onClick={() => handleSort("company")}
              >
                <div className="flex items-center">
                  {LISTING_CONSTANTS.TABLE_HEADERS.COMPANY_NAME}
                  {getSortIcon("company")}
                </div>
              </th>
              <th className="px-2 py-4 text-left text-md font-semibold text-gray-700">
                {LISTING_CONSTANTS.TABLE_HEADERS.STATUS}
              </th>
              <th
                className="px-4 py-4 text-left text-md font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                onClick={() => handleSort("lastBookkeeping")}
              >
                <div className="flex items-center">
                  {LISTING_CONSTANTS.TABLE_HEADERS.LAST_BOOKING}
                  {getSortIcon("lastBookkeeping")}
                </div>
              </th>
              <th className="px-4 py-4 text-left text-md font-semibold text-gray-700">
                {LISTING_CONSTANTS.TABLE_HEADERS.ACTIONS}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedClients.map((client, index) => (
              <tr
                key={client.id}
                className={`align-middle transition-all duration-200 ${
                  LISTING_CONSTANTS.TABLE_STYLING.ROW_HOVER
                } border-b ${
                  index === paginatedClients.length - 1
                    ? "border-b-0"
                    : "border-gray-200"
                }`}
                onMouseEnter={() => setHoveredRow(client.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-3 py-3 min-w-0">
                  <div className="flex items-center group min-w-0">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        hoveredRow === client.id
                          ? LISTING_CONSTANTS.TABLE_STYLING.AVATAR_HOVER
                          : ""
                      }`}
                    >
                      <span className="text-white text-md font-bold">
                        {getInitials(client.name)}
                      </span>
                    </div>
                    <div className="ml-4 min-w-0">
                      <div
                        className={`text-md font-semibold text-gray-900 transition-colors duration-200 truncate ${LISTING_CONSTANTS.TABLE_STYLING.NAME_HOVER}`}
                      >
                        {client.name}
                      </div>
                      <div
                        className={`text-md text-gray-500 transition-colors duration-200 truncate ${LISTING_CONSTANTS.TABLE_STYLING.EMAIL_HOVER}`}
                      >
                        {client.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 min-w-0">
                  <div className="text-md text-green-700">{client.company}</div>
                </td>
                <td className="px-2 py-3">
                  {renderStatusBadge(client.status)}
                </td>
                <td className="px-3 py-3">
                  <div className="text-md text-green-700">
                    {new Date(client.lastBookkeeping).toLocaleDateString(
                      "en-US",
                      LISTING_CONSTANTS.PAGINATION.DATE_FORMAT
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div
                    className={`transition-all duration-300 ${
                      hoveredRow === client.id
                        ? LISTING_CONSTANTS.TABLE_STYLING.ACTION_HOVER
                        : ""
                    }`}
                  >
                    <TableActions
                      item={client}
                      actions={[
                        {
                          label: LISTING_CONSTANTS.ACTIONS.VIEW_DETAILS,
                          variant: "outline",
                          onClick: handleViewDetails,
                        },
                        {
                          label: LISTING_CONSTANTS.ACTIONS.SUBMIT_BOOK_CLOSURE,
                          variant: "default",
                          onClick: () => handleBookkeeping(client.id),
                        },
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredClients.length}
        startIndex={startIndex}
        endIndex={startIndex + itemsPerPage}
      />
    </div>
  );
}
