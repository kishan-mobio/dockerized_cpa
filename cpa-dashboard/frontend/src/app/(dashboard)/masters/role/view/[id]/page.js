"use client";

import { useRouter, useParams } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { rolesData, roleFields } from "@/utils/data/roles";
import { ROLE_CONSTANTS } from "@/utils/constants/role";

export default function ViewRolePage() {
  const router = useRouter();
  const params = useParams();
  const roleId = parseInt(params.id);
  
  // Find the role data
  const role = rolesData.find(r => r.id === roleId);
  
  if (!role) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">{ROLE_CONSTANTS.ERROR_MESSAGES.NOT_FOUND_TITLE}</h2>
          <p className="text-gray-600 mt-2">{ROLE_CONSTANTS.ERROR_MESSAGES.NOT_FOUND_MESSAGE}</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/masters/role/edit/${roleId}`);
  };

  return (
    <AddForm
      heading={ROLE_CONSTANTS.VIEW_PAGE.HEADING}
      subTitle={ROLE_CONSTANTS.VIEW_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/role")}
      backLabel={ROLE_CONSTANTS.VIEW_PAGE.BACK_LABEL}
      title={ROLE_CONSTANTS.VIEW_PAGE.TITLE}
      fields={roleFields}
      initialValues={role}
      mode="view"
      onEdit={handleEdit}
    />
  );
}
