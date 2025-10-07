"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import {
  renderStatusBadge,
  renderActionButtons,
} from "@/components/common/TableRenderers";
import DeleteModal from "@/components/common/DeleteModal";
import { ROLE_CONSTANTS } from "@/utils/constants/role";
import { rolesData } from "@/utils/data/roles";

export default function RolePage() {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats configuration
  const stats = [
    {
      title: ROLE_CONSTANTS.STATS.TOTAL_ROLES.TITLE,
      value: rolesData.length.toString(),
      icon: ROLE_CONSTANTS.STATS.TOTAL_ROLES.ICON,
      bgColor: ROLE_CONSTANTS.STATS.TOTAL_ROLES.BG_COLOR,
      iconColor: ROLE_CONSTANTS.STATS.TOTAL_ROLES.ICON_COLOR,
    },
    {
      title: ROLE_CONSTANTS.STATS.TOTAL_USERS.TITLE,
      value: rolesData.reduce((sum, role) => sum + role.users, 0).toString(),
      icon: ROLE_CONSTANTS.STATS.TOTAL_USERS.ICON,
      bgColor: ROLE_CONSTANTS.STATS.TOTAL_USERS.BG_COLOR,
      iconColor: ROLE_CONSTANTS.STATS.TOTAL_USERS.ICON_COLOR,
    },
    {
      title: ROLE_CONSTANTS.STATS.MAX_PERMISSIONS.TITLE,
      value: Math.max(...rolesData.map((role) => role.permissions)).toString(),
      icon: ROLE_CONSTANTS.STATS.MAX_PERMISSIONS.ICON,
      bgColor: ROLE_CONSTANTS.STATS.MAX_PERMISSIONS.BG_COLOR,
      iconColor: ROLE_CONSTANTS.STATS.MAX_PERMISSIONS.ICON_COLOR,
    },
    {
      title: ROLE_CONSTANTS.STATS.ACTIVE_ROLES.TITLE,
      value: rolesData
        .filter((role) => role.status === ROLE_CONSTANTS.STATUS.ACTIVE)
        .length.toString(),
      icon: ROLE_CONSTANTS.STATS.ACTIVE_ROLES.ICON,
      bgColor: ROLE_CONSTANTS.STATS.ACTIVE_ROLES.BG_COLOR,
      iconColor: ROLE_CONSTANTS.STATS.ACTIVE_ROLES.ICON_COLOR,
    },
  ];

  // Action handlers
  const handleView = (item) => {
    console.log("View role:", item);
    router.push(`/masters/role/view/${item.id}`);
  };

  const handleEdit = (item) => {
    console.log("Edit role:", item);
    router.push(`/masters/role/edit/${item.id}`);
  };

  const handleDelete = (item) => {
    console.log("Delete role:", item);
    setDeleteModal({ isOpen: true, item });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Deleted role:", deleteModal.item);
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: "name",
      title: ROLE_CONSTANTS.TABLE_HEADERS.ROLE_NAME,
      width: "20%",
    },
    {
      key: "description",
      title: ROLE_CONSTANTS.TABLE_HEADERS.DESCRIPTION,
      width: "25%",
    },
    {
      key: "permissions",
      title: ROLE_CONSTANTS.TABLE_HEADERS.PERMISSIONS,
      width: "10%",
    },
    {
      key: "users",
      title: ROLE_CONSTANTS.TABLE_HEADERS.USERS,
      width: "10%",
    },
    {
      key: "status",
      title: ROLE_CONSTANTS.TABLE_HEADERS.STATUS,
      width: "10%",
      render: (value) => renderStatusBadge(value),
    },
    {
      key: "createdAt",
      title: ROLE_CONSTANTS.TABLE_HEADERS.CREATED,
      width: "15%",
    },
    {
      key: "actions",
      title: ROLE_CONSTANTS.TABLE_HEADERS.ACTIONS,
      width: "15%",
      sortable: false,
      render: (_, item) =>
        renderActionButtons(item, handleView, handleEdit, handleDelete),
    },
  ];

  return (
    <>
      <PageWrapper
        title={ROLE_CONSTANTS.PAGE_TITLE}
        subtitle={ROLE_CONSTANTS.PAGE_SUBTITLE}
        searchPlaceholder={ROLE_CONSTANTS.SEARCH_PLACEHOLDER}
        addButtonText={ROLE_CONSTANTS.ADD_BUTTON_TEXT}
        addButtonPath={ROLE_CONSTANTS.ADD_BUTTON_PATH}
        stats={stats}
        data={rolesData}
        columns={columns}
        itemsPerPage={6}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={confirmDelete}
        title={ROLE_CONSTANTS.DELETE_MODAL.TITLE}
        description={ROLE_CONSTANTS.DELETE_MODAL.DESCRIPTION}
        itemName={deleteModal.item?.name}
        isLoading={isDeleting}
      />
    </>
  );
}
