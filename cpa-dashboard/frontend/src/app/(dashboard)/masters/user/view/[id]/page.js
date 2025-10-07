"use client";

import { useRouter, useParams } from "next/navigation";
import AddForm from "@/components/common/AddForm";
import { usersData, userFields } from "@/utils/data/users";
import { USER_CONSTANTS } from "@/utils/constants/user";

export default function ViewUserPage() {
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

  const handleEdit = () => {
    router.push(`/masters/user/edit/${userId}`);
  };

  return (
    <AddForm
      heading={USER_CONSTANTS.VIEW_PAGE.HEADING}
      subTitle={USER_CONSTANTS.VIEW_PAGE.SUBTITLE}
      onBack={() => router.push("/masters/user")}
      backLabel={USER_CONSTANTS.VIEW_PAGE.BACK_LABEL}
      title={USER_CONSTANTS.VIEW_PAGE.TITLE}
      fields={userFields}
      initialValues={user}
      mode="view"
      onEdit={handleEdit}
    />
  );
}
