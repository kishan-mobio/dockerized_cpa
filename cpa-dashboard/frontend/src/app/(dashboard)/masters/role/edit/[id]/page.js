"use client";

import { useRouter, useParams } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { rolesData, roleFields } from "@/utils/data/roles";
import { ROLE_CONSTANTS } from "@/utils/constants/role";

export default function EditRolePage() {
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

  const handleSubmit = (values) => {
    console.log("Updated role data:", values);
    // Here you would typically send the data to your API
    router.push("/masters/role");
  };

  return (
    <AddForm
      heading={ROLE_CONSTANTS.EDIT_PAGE.HEADING}
      subTitle={ROLE_CONSTANTS.EDIT_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/role")}
      backLabel={ROLE_CONSTANTS.EDIT_PAGE.BACK_LABEL}
      title={ROLE_CONSTANTS.EDIT_PAGE.TITLE}
      fields={roleFields}
      initialValues={role}
      onSubmit={handleSubmit}
      mode="edit"
      submitLabel={ROLE_CONSTANTS.EDIT_PAGE.SUBMIT_LABEL}
    />
  );
}
