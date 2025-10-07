"use client";

import { useRouter, useParams } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { tenantFields, tenantsData } from "@/utils/data/tenants";
import { TENANT_CONSTANTS } from "@/utils/constants/tenant";

export default function ViewTenantPage() {
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

  const handleEdit = () => {
    router.push(`/masters/tenant/edit/${tenantId}`);
  };

  return (
    <AddForm
      heading={TENANT_CONSTANTS.VIEW_PAGE.HEADING}
      subTitle={TENANT_CONSTANTS.VIEW_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/tenant")}
      backLabel={TENANT_CONSTANTS.VIEW_PAGE.BACK_LABEL}
      title={TENANT_CONSTANTS.VIEW_PAGE.TITLE}
      fields={tenantFields}
      initialValues={tenant}
      mode="view"
      onEdit={handleEdit}
    />
  );
}
