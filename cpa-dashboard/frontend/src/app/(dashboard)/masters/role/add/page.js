"use client";

import { useRouter } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { roleFields } from "@/utils/data/roles";
import { ROLE_CONSTANTS } from "@/utils/constants/role";

export default function AddRolePage() {
  const router = useRouter();

  const handleSubmit = (values) => {
    console.log("New role data:", values);
    // Here you would typically send the data to your API
    router.push("/masters/role");
  };

  return (
    <AddForm
      heading={ROLE_CONSTANTS.ADD_PAGE.HEADING}
      subTitle={ROLE_CONSTANTS.ADD_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/role")}
      backLabel={ROLE_CONSTANTS.ADD_PAGE.BACK_LABEL}
      title={ROLE_CONSTANTS.ADD_PAGE.TITLE}
      fields={roleFields}
      onSubmit={handleSubmit}
      submitLabel={ROLE_CONSTANTS.ADD_PAGE.SUBMIT_LABEL}
    />
  );
}

