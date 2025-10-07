"use client";

import { useRouter } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { initialValues, tenantFields } from "@/utils/data/tenants";
import { TENANT_CONSTANTS } from "@/utils/constants/tenant";

export default function AddTenantPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <AddForm
        heading={TENANT_CONSTANTS.ADD_PAGE.HEADING}
        subTitle={TENANT_CONSTANTS.ADD_PAGE.SUBTITLE}
        onBack={() => router.push("/masters/tenant")}
        backLabel={TENANT_CONSTANTS.ADD_PAGE.BACK_LABEL}
        title={TENANT_CONSTANTS.ADD_PAGE.TITLE}
        fields={tenantFields}
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log("Tenant data:", values);
          router.push("/masters/tenant");
        }}
        onCancel={() => router.push("/masters/tenant")}
        submitLabel={TENANT_CONSTANTS.ADD_PAGE.SUBMIT_LABEL}
      />
    </div>
  );
}
