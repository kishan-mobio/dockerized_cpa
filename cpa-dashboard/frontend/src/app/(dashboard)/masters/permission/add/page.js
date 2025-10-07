"use client";

import { useRouter } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { permissionFields } from "@/utils/data/permissions";
import { PERMISSION_CONSTANTS } from "@/utils/constants/permission";

export default function AddPermissionPage() {
  const router = useRouter();

  const handleSubmit = (values) => {
    console.log("New permission data:", values);
    // Here you would typically send the data to your API
    router.push("/masters/permission");
  };

  return (
    <AddForm
      heading={PERMISSION_CONSTANTS.ADD_PAGE.HEADING}
      subTitle={PERMISSION_CONSTANTS.ADD_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/permission")}
      backLabel={PERMISSION_CONSTANTS.ADD_PAGE.BACK_LABEL}
      title={PERMISSION_CONSTANTS.ADD_PAGE.TITLE}
      fields={permissionFields}
      onSubmit={handleSubmit}
      submitLabel={PERMISSION_CONSTANTS.ADD_PAGE.SUBMIT_LABEL}
    />
  );
}
