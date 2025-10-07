"use client";

import { useRouter, useParams } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { usersData, userFields } from "@/utils/data/users";
import { USER_CONSTANTS } from "@/utils/constants/user";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.id);
  
  // Find the user data
  const user = usersData.find(u => u.id === userId);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">{USER_CONSTANTS.ERROR_MESSAGES.NOT_FOUND_TITLE}</h2>
          <p className="text-gray-600 mt-2">{USER_CONSTANTS.ERROR_MESSAGES.NOT_FOUND_MESSAGE}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (values) => {
    console.log("Updated user data:", values);
    // Here you would typically send the data to your API
    router.push("/masters/user");
  };

  return (
    <AddForm
      heading={USER_CONSTANTS.EDIT_PAGE.HEADING}
      subTitle={USER_CONSTANTS.EDIT_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/user")}
      backLabel={USER_CONSTANTS.EDIT_PAGE.BACK_LABEL}
      title={USER_CONSTANTS.EDIT_PAGE.TITLE}
      fields={userFields}
      initialValues={user}
      onSubmit={handleSubmit}
      mode="edit"
      submitLabel={USER_CONSTANTS.EDIT_PAGE.SUBMIT_LABEL}
    />
  );
}
