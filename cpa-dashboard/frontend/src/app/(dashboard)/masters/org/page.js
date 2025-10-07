"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import {
  renderStatusBadge,
  renderActionButtons,
} from "@/components/common/TableRenderers";
import DeleteModal from "@/components/common/DeleteModal";
import { ORGANIZATION_CONSTANTS } from "@/utils/constants/organization";
import { organizationsData } from "@/utils/data/organizations";
import { stats } from "@/utils/data/configuration";

export default function OrganizationPage() {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  // Action handlers
  const handleView = (item) => {
    console.log("View organization:", item);
    router.push(`/masters/org/view/${item.id}`);
  };

  const handleEdit = (item) => {
    console.log("Edit organization:", item);
    router.push(`/masters/org/edit/${item.id}`);
  };

  const handleDelete = (item) => {
    console.log("Delete organization:", item);
    setDeleteModal({ isOpen: true, item });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Deleted organization:", deleteModal.item);
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      console.error("Error deleting organization:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: "name",
      title: "Organization Name",
      width: "20%",
    },
    {
      key: "type",
      title: "Type",
      width: "15%",
      render: (value) => renderStatusBadge(value),
    },
    {
      key: "parent",
      title: "Parent",
      width: "15%",
    },
    {
      key: "members",
      title: "Members",
      width: "10%",
    },
    {
      key: "location",
      title: "Location",
      width: "15%",
    },
    {
      key: "status",
      title: "Status",
      width: "10%",
      render: (value) => renderStatusBadge(value),
    },
    {
      key: "createdAt",
      title: "Created",
      width: "10%",
    },
    {
      key: "actions",
      title: "Actions",
      width: "15%",
      sortable: false,
      render: (_, item) =>
        renderActionButtons(item, handleView, handleEdit, handleDelete),
    },
  ];

  // Filters configuration
  const filters = [
    {
      key: "type",
      value: typeFilter,
      onChange: setTypeFilter,
      options: Object.values(ORGANIZATION_CONSTANTS.TYPES),
    },
  ];

  return (
    <>
      <PageWrapper
        title={ORGANIZATION_CONSTANTS.PAGE_TITLE}
        subtitle={ORGANIZATION_CONSTANTS.PAGE_SUBTITLE}
        searchPlaceholder={ORGANIZATION_CONSTANTS.SEARCH_PLACEHOLDER}
        addButtonText={ORGANIZATION_CONSTANTS.ADD_BUTTON_TEXT}
        addButtonPath={ORGANIZATION_CONSTANTS.ADD_BUTTON_PATH}
        stats={stats}
        data={organizationsData}
        columns={columns}
        filters={filters}
        itemsPerPage={10}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={confirmDelete}
        title={ORGANIZATION_CONSTANTS.DELETE_MODAL.TITLE}
        description={ORGANIZATION_CONSTANTS.DELETE_MODAL.DESCRIPTION}
        itemName={deleteModal.item?.name}
        isLoading={isDeleting}
      />
    </>
  );
}
