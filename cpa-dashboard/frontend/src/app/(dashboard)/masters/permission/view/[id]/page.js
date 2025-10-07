"use client";

import { useRouter, useParams } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { permissionsData, permissionFields } from "@/utils/data/permissions";
import { PERMISSION_CONSTANTS } from "@/utils/constants/permission";

export default function ViewPermissionPage() {
  const router = useRouter();
  const params = useParams();
  const permissionId = parseInt(params.id);
  
  // Find the permission data
  const permission = permissionsData.find(p => p.id === permissionId);
  
  if (!permission) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">{PERMISSION_CONSTANTS.ERROR_MESSAGES.NOT_FOUND_TITLE}</h2>
          <p className="text-gray-600 mt-2">{PERMISSION_CONSTANTS.ERROR_MESSAGES.NOT_FOUND_MESSAGE}</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/masters/permission/edit/${permissionId}`);
  };

  return (
    <AddForm
      heading={PERMISSION_CONSTANTS.VIEW_PAGE.HEADING}
      subTitle={PERMISSION_CONSTANTS.VIEW_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/permission")}
      backLabel={PERMISSION_CONSTANTS.VIEW_PAGE.BACK_LABEL}
      title={PERMISSION_CONSTANTS.VIEW_PAGE.TITLE}
      fields={permissionFields}
      initialValues={permission}
      mode="view"
      onEdit={handleEdit}
    />
  );
}
