"use client";

import { useRouter } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { organizationFields } from "@/utils/data/organizations";
import { ORGANIZATION_CONSTANTS } from "@/utils/constants/organization";

export default function AddOrganizationPage() {
  const router = useRouter();

  const handleSubmit = (values) => {
    console.log("New organization data:", values);
    router.push("/masters/org");
  };

  return (
    <AddForm
      heading={ORGANIZATION_CONSTANTS.ADD_PAGE.HEADING}
      subTitle={ORGANIZATION_CONSTANTS.ADD_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/org")}
      backLabel={ORGANIZATION_CONSTANTS.ADD_PAGE.BACK_LABEL}
      title={ORGANIZATION_CONSTANTS.ADD_PAGE.TITLE}
      fields={organizationFields}
      onSubmit={handleSubmit}
      submitLabel={ORGANIZATION_CONSTANTS.ADD_PAGE.SUBMIT_LABEL}
    />
  );
}
