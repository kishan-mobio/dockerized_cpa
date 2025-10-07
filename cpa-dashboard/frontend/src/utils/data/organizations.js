import { validationRules } from "@/utils/methods/validation";
import { ORGANIZATION_FIELD_CONSTANTS } from "@/utils/constants/organization";

export const organizationsData = [
  {
    id: 1,
    name: "Finance Department",
    type: "Department",
    parent: "Acme Corporation",
    members: 15,
    location: "New York",
    status: "Active",
    createdAt: "2024-01-15",
    manager: "John Smith",
    email: "finance@acme.com",
    phone: "+1-555-0100",
    description: "Handles all financial operations and accounting.",
  },
  {
    id: 2,
    name: "IT Department",
    type: "Department",
    parent: "TechStart Inc",
    members: 8,
    location: "San Francisco",
    status: "Active",
    createdAt: "2024-02-20",
    manager: "Sarah Johnson",
    email: "it@techstart.com",
    phone: "+1-555-0200",
    description: "Manages technology infrastructure and development.",
  },
  {
    id: 3,
    name: "Marketing Team",
    type: "Team",
    parent: "Global Solutions",
    members: 5,
    location: "Remote",
    status: "Inactive",
    createdAt: "2024-01-10",
    manager: "Mike Davis",
    email: "marketing@globalsol.com",
    phone: "+1-555-0300",
    description: "Responsible for marketing campaigns and brand management.",
  },
  {
    id: 4,
    name: "HR Division",
    type: "Division",
    parent: "Acme Corporation",
    members: 12,
    location: "New York",
    status: "Active",
    createdAt: "2024-01-20",
    manager: "Lisa Wilson",
    email: "hr@acme.com",
    phone: "+1-555-0400",
    description: "Human resources and employee management.",
  },
  {
    id: 5,
    name: "Sales Branch",
    type: "Branch",
    parent: "TechStart Inc",
    members: 20,
    location: "Los Angeles",
    status: "Active",
    createdAt: "2024-02-01",
    manager: "Robert Brown",
    email: "sales@techstart.com",
    phone: "+1-555-0500",
    description: "Sales operations and customer relations.",
  },
];

export const organizationFields = [
  {
    name: "name",
    label: ORGANIZATION_FIELD_CONSTANTS.NAME.LABEL,
    type: "text",
    placeholder: ORGANIZATION_FIELD_CONSTANTS.NAME.PLACEHOLDER,
    validation: { required: ORGANIZATION_FIELD_CONSTANTS.NAME.VALIDATION },
  },
  {
    name: "type",
    label: ORGANIZATION_FIELD_CONSTANTS.TYPE.LABEL,
    type: "select",
    options: [
      { label: "Department", value: "Department" },
      { label: "Team", value: "Team" },
      { label: "Division", value: "Division" },
      { label: "Branch", value: "Branch" },
    ],
    validation: { required: ORGANIZATION_FIELD_CONSTANTS.TYPE.VALIDATION },
  },
  {
    name: "parent",
    label: ORGANIZATION_FIELD_CONSTANTS.PARENT.LABEL,
    type: "text",
    placeholder: ORGANIZATION_FIELD_CONSTANTS.PARENT.PLACEHOLDER,
    validation: { required: ORGANIZATION_FIELD_CONSTANTS.PARENT.VALIDATION },
  },
  {
    name: "manager",
    label: ORGANIZATION_FIELD_CONSTANTS.MANAGER.LABEL,
    type: "text",
    placeholder: ORGANIZATION_FIELD_CONSTANTS.MANAGER.PLACEHOLDER,
    validation: { required: ORGANIZATION_FIELD_CONSTANTS.MANAGER.VALIDATION },
  },
  {
    name: "email",
    label: ORGANIZATION_FIELD_CONSTANTS.EMAIL.LABEL,
    type: "email",
    placeholder: ORGANIZATION_FIELD_CONSTANTS.EMAIL.PLACEHOLDER,
    validation: validationRules.email,
  },
  {
    name: "phone",
    label: ORGANIZATION_FIELD_CONSTANTS.PHONE.LABEL,
    type: "tel",
    placeholder: ORGANIZATION_FIELD_CONSTANTS.PHONE.PLACEHOLDER,
    validation: { required: ORGANIZATION_FIELD_CONSTANTS.PHONE.VALIDATION },
  },
  {
    name: "location",
    label: ORGANIZATION_FIELD_CONSTANTS.LOCATION.LABEL,
    type: "text",
    placeholder: ORGANIZATION_FIELD_CONSTANTS.LOCATION.PLACEHOLDER,
    validation: { required: ORGANIZATION_FIELD_CONSTANTS.LOCATION.VALIDATION },
  },
  {
    name: "status",
    label: ORGANIZATION_FIELD_CONSTANTS.STATUS.LABEL,
    type: "select",
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
    validation: { required: ORGANIZATION_FIELD_CONSTANTS.STATUS.VALIDATION },
  },
  {
    name: "members",
    label: ORGANIZATION_FIELD_CONSTANTS.MEMBERS.LABEL,
    type: "number",
    placeholder: ORGANIZATION_FIELD_CONSTANTS.MEMBERS.PLACEHOLDER,
    validation: {
      required: ORGANIZATION_FIELD_CONSTANTS.MEMBERS.VALIDATION,
      min: 0,
    },
    editable: false, // This field should not be editable in forms
  },
  {
    name: "description",
    label: ORGANIZATION_FIELD_CONSTANTS.DESCRIPTION.LABEL,
    type: "textarea",
    placeholder: ORGANIZATION_FIELD_CONSTANTS.DESCRIPTION.PLACEHOLDER,
    colSpan: 2,
    validation: {
      required: ORGANIZATION_FIELD_CONSTANTS.DESCRIPTION.VALIDATION,
    },
  },
];

export const initialValues = {
  name: "",
  type: "Department", // first option in type select
  parent: "",
  manager: "",
  email: "",
  phone: "",
  location: "",
  status: "Active", // first option in status select
  members: "",
  description: "",
};

export const stats = [
  {
    title: "Total Organizations",
    value: organizationsData.length.toString(),
    icon: "building",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Total Members",
    value: organizationsData
      .reduce((sum, org) => sum + org.members, 0)
      .toString(),
    icon: "users",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Locations",
    value: new Set(
      organizationsData.map((org) => org.location)
    ).size.toString(),
    icon: "map-pin",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "This Month",
    value: "2",
    icon: "calendar",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
];

export const columns = [
  {
    key: "name",
    title: "Organization Name",
    width: "20%",
  },
  {
    key: "type",
    title: "Type",
    width: "15%",
    render: (value) => renderStatusBadge(value),
  },
  {
    key: "parent",
    title: "Parent",
    width: "15%",
  },
  {
    key: "members",
    title: "Members",
    width: "10%",
  },
  {
    key: "location",
    title: "Location",
    width: "15%",
  },
  {
    key: "status",
    title: "Status",
    width: "10%",
    render: (value) => renderStatusBadge(value),
  },
  {
    key: "createdAt",
    title: "Created",
    width: "10%",
  },
  {
    key: "actions",
    title: "Actions",
    width: "15%",
    sortable: false,
    render: (_, item) =>
      renderActionButtons(item, handleView, handleEdit, handleDelete),
  },
];
