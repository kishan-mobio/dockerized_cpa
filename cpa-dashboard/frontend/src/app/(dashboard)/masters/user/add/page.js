"use client";

import { useRouter } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { userFields } from "@/utils/data/users";
import { USER_CONSTANTS } from "@/utils/constants/user";

export default function AddUserPage() {
  const router = useRouter();

  const handleSubmit = (values) => {
    console.log("New user data:", values);
    // Here you would typically send the data to your API
    router.push("/masters/user");
  };

  return (
    <AddForm
      heading={USER_CONSTANTS.ADD_PAGE.HEADING}
      subTitle={USER_CONSTANTS.ADD_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/user")}
      backLabel={USER_CONSTANTS.ADD_PAGE.BACK_LABEL}
      title={USER_CONSTANTS.ADD_PAGE.TITLE}
      fields={userFields}
      onSubmit={handleSubmit}
      submitLabel={USER_CONSTANTS.ADD_PAGE.SUBMIT_LABEL}
    />
  );
}
