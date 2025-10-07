"use client";

import { useRouter, useParams } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { permissionsData, permissionFields } from "@/utils/data/permissions";
import { PERMISSION_CONSTANTS } from "@/utils/constants/permission";

export default function EditPermissionPage() {
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

  const handleSubmit = (values) => {
    console.log("Updated permission data:", values);
    // Here you would typically send the data to your API
    router.push("/masters/permission");
  };

  return (
    <AddForm
      heading={PERMISSION_CONSTANTS.EDIT_PAGE.HEADING}
      subTitle={PERMISSION_CONSTANTS.EDIT_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/permission")}
      backLabel={PERMISSION_CONSTANTS.EDIT_PAGE.BACK_LABEL}
      title={PERMISSION_CONSTANTS.EDIT_PAGE.TITLE}
      fields={permissionFields}
      initialValues={permission}
      onSubmit={handleSubmit}
      mode="edit"
      submitLabel={PERMISSION_CONSTANTS.EDIT_PAGE.SUBMIT_LABEL}
    />
  );
}
