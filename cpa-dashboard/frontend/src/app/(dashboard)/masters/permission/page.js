"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import {
  renderStatusBadge,
  renderActionButtons,
} from "@/components/common/TableRenderers";
import DeleteModal from "@/components/common/DeleteModal";
import { PERMISSION_CONSTANTS } from "@/utils/constants/permission";
import { permissionsData } from "@/utils/data/permissions";

export default function PermissionPage() {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const modules = [...new Set(permissionsData.map((p) => p.module))];
  const types = [...new Set(permissionsData.map((p) => p.type))];

  // Action handlers
  const handleView = (item) => {
    console.log("View permission:", item);
    router.push(`/masters/permission/view/${item.id}`);
  };

  const handleEdit = (item) => {
    console.log("Edit permission:", item);
    router.push(`/masters/permission/edit/${item.id}`);
  };

  const handleDelete = (item) => {
    console.log("Delete permission:", item);
    setDeleteModal({ isOpen: true, item });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Deleted permission:", deleteModal.item);
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      console.error("Error deleting permission:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats configuration
  const stats = [
    {
      title: "Total Permissions",
      value: permissionsData.length.toString(),
      icon: "key",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Permissions",
      value: permissionsData
        .filter((p) => p.status === "Active")
        .length.toString(),
      icon: "shield",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Modules",
      value: modules.length.toString(),
      icon: "settings",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Permission Types",
      value: types.length.toString(),
      icon: "lock",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  // Table columns configuration
  const columns = [
    {
      key: "name",
      title: "Permission Name",
      width: "20%",
    },
    {
      key: "description",
      title: "Description",
      width: "25%",
    },
    {
      key: "module",
      title: "Module",
      width: "15%",
    },
    {
      key: "type",
      title: "Type",
      width: "10%",
      render: (value) => renderStatusBadge(value),
    },
    {
      key: "roles",
      title: "Roles",
      width: "15%",
      render: (value) => value.join(", "),
    },
    {
      key: "status",
      title: "Status",
      width: "10%",
      render: (value) => renderStatusBadge(value),
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
      options: ["All", ...types],
    },
  ];

  return (
    <>
      <PageWrapper
        title={PERMISSION_CONSTANTS.PAGE_TITLE}
        subtitle={PERMISSION_CONSTANTS.PAGE_SUBTITLE}
        searchPlaceholder={PERMISSION_CONSTANTS.SEARCH_PLACEHOLDER}
        addButtonText={PERMISSION_CONSTANTS.ADD_BUTTON_TEXT}
        addButtonPath={PERMISSION_CONSTANTS.ADD_BUTTON_PATH}
        stats={stats}
        data={permissionsData}
        columns={columns}
        filters={filters}
        itemsPerPage={10}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={confirmDelete}
        title={PERMISSION_CONSTANTS.DELETE_MODAL.TITLE}
        description={PERMISSION_CONSTANTS.DELETE_MODAL.DESCRIPTION}
        itemName={deleteModal.item?.name}
        isLoading={isDeleting}
      />
    </>
  );
}
