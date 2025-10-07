"use client";

import { useRouter, useParams } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { organizationsData, organizationFields } from "@/utils/data/organizations";
import { ORGANIZATION_CONSTANTS } from "@/utils/constants/organization";

export default function EditOrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = parseInt(params.id);
  
  // Find the organization data
  const organization = organizationsData.find(o => o.id === orgId);
  
  if (!organization) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">{ORGANIZATION_CONSTANTS.ERROR_MESSAGES.NOT_FOUND_TITLE}</h2>
          <p className="text-gray-600 mt-2">{ORGANIZATION_CONSTANTS.ERROR_MESSAGES.NOT_FOUND_MESSAGE}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (values) => {
    console.log("Updated organization data:", values);
    // Here you would typically send the data to your API
    router.push("/masters/org");
  };

  return (
    <AddForm
      heading={ORGANIZATION_CONSTANTS.EDIT_PAGE.HEADING}
      subTitle={ORGANIZATION_CONSTANTS.EDIT_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/org")}
      backLabel={ORGANIZATION_CONSTANTS.EDIT_PAGE.BACK_LABEL}
      title={ORGANIZATION_CONSTANTS.EDIT_PAGE.TITLE}
      fields={organizationFields}
      initialValues={organization}
      onSubmit={handleSubmit}
      mode="edit"
      submitLabel={ORGANIZATION_CONSTANTS.EDIT_PAGE.SUBMIT_LABEL}
    />
  );
}
