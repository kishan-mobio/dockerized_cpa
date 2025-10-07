"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import {
  renderStatusBadge,
  renderActionButtons,
} from "@/components/common/TableRenderers";
import DeleteModal from "@/components/common/DeleteModal";
import { TENANT_CONSTANTS } from "@/utils/constants/tenant";
import { tenantsData } from "@/utils/data/tenants";

export default function TenantPage() {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);
  // Stats configuration
  const stats = [
    {
      title: "Total Tenants",
      value: tenantsData.length.toString(),
      icon: "building-2",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active",
      value: tenantsData.filter((t) => t.status === "Active").length.toString(),
      icon: "check-circle",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Inactive",
      value: tenantsData
        .filter((t) => t.status === "Inactive")
        .length.toString(),
      icon: "clock",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Total Users",
      value: tenantsData.reduce((sum, t) => sum + t.users, 0).toString(),
      icon: "users",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  // Action handlers
  const handleView = (item) => {
    console.log("View tenant:", item);
    router.push(`/masters/tenant/view/${item.id}`);
  };

  const handleEdit = (item) => {
    console.log("Edit tenant:", item);
    router.push(`/masters/tenant/edit/${item.id}`);
  };

  const handleDelete = (item) => {
    console.log("Delete tenant:", item);
    setDeleteModal({ isOpen: true, item });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Deleted tenant:", deleteModal.item);
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      console.error("Error deleting tenant:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: "name",
      title: "Tenant Name",
      width: "20%",
    },
    {
      key: "domain",
      title: "Domain",
      width: "15%",
    },
    {
      key: "status",
      title: "Status",
      width: "10%",
      render: (value) => renderStatusBadge(value),
    },
    {
      key: "users",
      title: "Users",
      width: "10%",
    },
    {
      key: "plan",
      title: "Plan",
      width: "10%",
    },
    {
      key: "createdAt",
      title: "Created",
      width: "15%",
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
      key: "status",
      options: ["All Status", "Active", "Inactive"],
      defaultValue: "All Status",
    },
  ];

  return (
    <>
      <PageWrapper
        title={TENANT_CONSTANTS.PAGE_TITLE}
        subtitle={TENANT_CONSTANTS.PAGE_SUBTITLE}
        searchPlaceholder={TENANT_CONSTANTS.SEARCH_PLACEHOLDER}
        addButtonText={TENANT_CONSTANTS.ADD_BUTTON_TEXT}
        addButtonPath={TENANT_CONSTANTS.ADD_BUTTON_PATH}
        stats={stats}
        data={tenantsData}
        columns={columns}
        filters={filters}
        itemsPerPage={6}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={confirmDelete}
        title={TENANT_CONSTANTS.DELETE_MODAL.TITLE}
        description={TENANT_CONSTANTS.DELETE_MODAL.DESCRIPTION}
        itemName={deleteModal.item?.name}
        isLoading={isDeleting}
      />
    </>
  );
}
