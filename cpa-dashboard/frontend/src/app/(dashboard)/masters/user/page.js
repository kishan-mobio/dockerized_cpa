"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import {
  renderStatusBadge,
  renderActionButtons,
  renderRoleBadge,
} from "@/components/common/TableRenderers";
import DeleteModal from "@/components/common/DeleteModal";
import { USER_CONSTANTS } from "@/utils/constants/user";
import { usersData } from "@/utils/data/users";

export default function UserPage() {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Action handlers
  const handleView = (item) => {
    console.log("View user:", item);
    router.push(`/masters/user/view/${item.id}`);
  };

  const handleEdit = (item) => {
    console.log("Edit user:", item);
    router.push(`/masters/user/edit/${item.id}`);
  };

  const handleDelete = (item) => {
    console.log("Delete user:", item);
    setDeleteModal({ isOpen: true, item });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Deleted user:", deleteModal.item);
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  // Stats configuration
  const stats = [
    {
      title: USER_CONSTANTS.STATS.TOTAL_USERS.TITLE,
      value: usersData.length.toString(),
      icon: USER_CONSTANTS.STATS.TOTAL_USERS.ICON,
      bgColor: USER_CONSTANTS.STATS.TOTAL_USERS.BG_COLOR,
      iconColor: USER_CONSTANTS.STATS.TOTAL_USERS.ICON_COLOR,
    },
    {
      title: USER_CONSTANTS.STATS.ACTIVE_USERS.TITLE,
      value: usersData
        .filter((u) => u.status === USER_CONSTANTS.STATUS.ACTIVE)
        .length.toString(),
      icon: USER_CONSTANTS.STATS.ACTIVE_USERS.ICON,
      bgColor: USER_CONSTANTS.STATS.ACTIVE_USERS.BG_COLOR,
      iconColor: USER_CONSTANTS.STATS.ACTIVE_USERS.ICON_COLOR,
    },
    {
      title: USER_CONSTANTS.STATS.INACTIVE_USERS.TITLE,
      value: usersData
        .filter((u) => u.status === USER_CONSTANTS.STATUS.INACTIVE)
        .length.toString(),
      icon: USER_CONSTANTS.STATS.INACTIVE_USERS.ICON,
      bgColor: USER_CONSTANTS.STATS.INACTIVE_USERS.BG_COLOR,
      iconColor: USER_CONSTANTS.STATS.INACTIVE_USERS.ICON_COLOR,
    },
    {
      title: USER_CONSTANTS.STATS.ADMINS.TITLE,
      value: usersData
        .filter((u) => u.role === USER_CONSTANTS.ROLES.ADMIN)
        .length.toString(),
      icon: USER_CONSTANTS.STATS.ADMINS.ICON,
      bgColor: USER_CONSTANTS.STATS.ADMINS.BG_COLOR,
      iconColor: USER_CONSTANTS.STATS.ADMINS.ICON_COLOR,
    },
  ];

  // Table columns configuration
  const columns = [
    {
      key: "name",
      title: USER_CONSTANTS.TABLE_HEADERS.NAME,
      width: "20%",
    },
    {
      key: "email",
      title: USER_CONSTANTS.TABLE_HEADERS.EMAIL,
      width: "20%",
    },
    {
      key: "role",
      title: USER_CONSTANTS.TABLE_HEADERS.ROLE,
      width: "15%",
      render: (value) => renderRoleBadge(value),
    },
    {
      key: "status",
      title: USER_CONSTANTS.TABLE_HEADERS.STATUS,
      width: "10%",
      render: (value) => renderStatusBadge(value),
    },
    {
      key: "tenant",
      title: USER_CONSTANTS.TABLE_HEADERS.TENANT,
      width: "15%",
    },
    {
      key: "lastLogin",
      title: USER_CONSTANTS.TABLE_HEADERS.LAST_LOGIN,
      width: "10%",
    },
    {
      key: "actions",
      title: USER_CONSTANTS.TABLE_HEADERS.ACTIONS,
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
      options: [
        USER_CONSTANTS.FILTERS.STATUS.ALL,
        USER_CONSTANTS.FILTERS.STATUS.ACTIVE,
        USER_CONSTANTS.FILTERS.STATUS.INACTIVE,
      ],
      defaultValue: USER_CONSTANTS.FILTERS.STATUS.ALL,
    },
    {
      key: "role",
      options: [
        USER_CONSTANTS.FILTERS.ROLE.ALL,
        USER_CONSTANTS.FILTERS.ROLE.ADMIN,
        USER_CONSTANTS.FILTERS.ROLE.MANAGER,
        USER_CONSTANTS.FILTERS.ROLE.USER,
      ],
      defaultValue: USER_CONSTANTS.FILTERS.ROLE.ALL,
    },
  ];

  return (
    <>
      <PageWrapper
        title={USER_CONSTANTS.PAGE_TITLE}
        subtitle={USER_CONSTANTS.PAGE_SUBTITLE}
        searchPlaceholder={USER_CONSTANTS.SEARCH_PLACEHOLDER}
        addButtonText={USER_CONSTANTS.ADD_BUTTON_TEXT}
        addButtonPath={USER_CONSTANTS.ADD_BUTTON_PATH}
        stats={stats}
        data={usersData}
        columns={columns}
        filters={filters}
        itemsPerPage={6}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={confirmDelete}
        title={USER_CONSTANTS.DELETE_MODAL.TITLE}
        description={USER_CONSTANTS.DELETE_MODAL.DESCRIPTION}
        itemName={deleteModal.item?.name}
        isLoading={isDeleting}
      />
    </>
  );
}
