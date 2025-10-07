export const rolesData = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full system access and control",
    permissions: 25,
    users: 2,
    status: "Active",
    createdAt: "2024-01-15",
    level: "System",
    department: "IT",
  },
  {
    id: 2,
    name: "Admin",
    description: "Administrative access to tenant resources",
    permissions: 18,
    users: 5,
    status: "Active",
    createdAt: "2024-01-20",
    level: "Organization",
    department: "Management",
  },
  {
    id: 3,
    name: "Manager",
    description: "Management level access",
    permissions: 12,
    users: 8,
    status: "Active",
    createdAt: "2024-02-01",
    level: "Department",
    department: "Operations",
  },
  {
    id: 4,
    name: "User",
    description: "Basic user access",
    permissions: 6,
    users: 15,
    status: "Active",
    createdAt: "2024-02-05",
    level: "Individual",
    department: "General",
  },
  {
    id: 5,
    name: "Viewer",
    description: "Read-only access to system",
    permissions: 3,
    users: 20,
    status: "Active",
    createdAt: "2024-02-10",
    level: "Individual",
    department: "General",
  },
];

export const roleFields = [
  {
    name: "name",
    label: "Role Name",
    type: "text",
    placeholder: "Enter role name",
    validation: { required: "Role name is required" },
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter role description",
    validation: { required: "Description is required" },
    colSpan: 2,
  },
  {
    name: "level",
    label: "Access Level",
    type: "select",
    options: [
      { label: "System", value: "System" },
      { label: "Organization", value: "Organization" },
      { label: "Department", value: "Department" },
      { label: "Individual", value: "Individual" },
    ],
    validation: { required: "Access level is required" },
  },
  {
    name: "department",
    label: "Department",
    type: "select",
    options: [
      { label: "IT", value: "IT" },
      { label: "Management", value: "Management" },
      { label: "Operations", value: "Operations" },
      { label: "Finance", value: "Finance" },
      { label: "HR", value: "HR" },
      { label: "General", value: "General" },
    ],
    validation: { required: "Department is required" },
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
    validation: { required: "Status is required" },
  },
  {
    name: "permissions",
    label: "Number of Permissions",
    type: "number",
    placeholder: "Enter number of permissions",
    validation: { required: "Permission count is required", min: 0 },
    editable: false, // This field should not be editable in forms
  },
];

export const initialValues = {
  name: "",
  description: "",
  level: "System", // first option in level select
  department: "IT", // first option in department select
  status: "Active", // first option in status select
  permissions: "",
};
