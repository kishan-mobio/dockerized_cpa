"use client";

import { useRouter, useParams } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { tenantsData } from "@/utils/data/tenants";
import { tenantFields } from "@/utils/data/tenants";
import { TENANT_CONSTANTS } from "@/utils/constants/tenant";

export default function EditTenantPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = parseInt(params.id);
  
  // Find the tenant data
  const tenant = tenantsData.find(t => t.id === tenantId);
  
  if (!tenant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">{TENANT_CONSTANTS.ERROR_MESSAGES.NOT_FOUND_TITLE}</h2>
          <p className="text-gray-600 mt-2">{TENANT_CONSTANTS.ERROR_MESSAGES.NOT_FOUND_MESSAGE}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (values) => {
    console.log("Updated tenant data:", values);
    // Here you would typically send the data to your API
    router.push("/masters/tenant");
  };

  return (
    <AddForm
      heading={TENANT_CONSTANTS.EDIT_PAGE.HEADING}
      subTitle={TENANT_CONSTANTS.EDIT_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/tenant")}
      backLabel={TENANT_CONSTANTS.EDIT_PAGE.BACK_LABEL}
      title={TENANT_CONSTANTS.EDIT_PAGE.TITLE}
      fields={tenantFields}
      initialValues={tenant}
      onSubmit={handleSubmit}
      mode="edit"
      submitLabel={TENANT_CONSTANTS.EDIT_PAGE.SUBMIT_LABEL}
    />
  );
}
