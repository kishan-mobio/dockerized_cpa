// Organization Management Page Constants
export const ORGANIZATION_CONSTANTS = {
  // Page Information
  PAGE_TITLE: "Organization Management",
  PAGE_SUBTITLE: "Manage organizational structure and departments",
  
  // Buttons
  ADD_BUTTON_TEXT: "Add Organization",
  ADD_BUTTON_PATH: "/masters/org/add",
  
  // Search and Filters
  SEARCH_PLACEHOLDER: "Search organizations...",
  
  // Filter Options
  FILTERS: {
    TYPE: {
      ALL: "All",
      DEPARTMENT: "Department",
      TEAM: "Team", 
      DIVISION: "Division"
    }
  },
  
  // Stats Cards
  STATS: {
    TOTAL_ORGANIZATIONS: {
      TITLE: "Total Organizations",
      ICON: "building",
      BG_COLOR: "bg-blue-100",
      ICON_COLOR: "text-blue-600"
    },
    TOTAL_MEMBERS: {
      TITLE: "Total Members",
      ICON: "users",
      BG_COLOR: "bg-green-100",
      ICON_COLOR: "text-green-600"
    },
    LOCATIONS: {
      TITLE: "Locations",
      ICON: "map-pin",
      BG_COLOR: "bg-purple-100",
      ICON_COLOR: "text-purple-600"
    },
    THIS_MONTH: {
      TITLE: "This Month",
      VALUE: "2",
      ICON: "calendar",
      BG_COLOR: "bg-yellow-100",
      ICON_COLOR: "text-yellow-600"
    }
  },
  
  // Table Headers
  TABLE_HEADERS: {
    ORGANIZATION_NAME: "Organization Name",
    TYPE: "Type",
    PARENT: "Parent",
    MEMBERS: "Members",
    LOCATION: "Location",
    STATUS: "Status",
    CREATED: "Created",
    ACTIONS: "Actions"
  },
  
  // Action Labels
  ACTIONS: {
    EDIT: "Edit",
    VIEW: "View",
    DELETE: "Delete",
    MANAGE_MEMBERS: "Manage Members"
  },
  
  // Status Values
  STATUS: {
    ACTIVE: "Active",
    INACTIVE: "Inactive"
  },
  
  // Organization Types
  TYPES: {
    ALL: "All",
    DEPARTMENT: "Department",
    TEAM: "Team",
    DIVISION: "Division",
    BRANCH: "Branch"
  },
  
  // Sample Locations
  LOCATIONS: {
    NEW_YORK: "New York",
    SAN_FRANCISCO: "San Francisco", 
    REMOTE: "Remote",
    CHICAGO: "Chicago",
    LOS_ANGELES: "Los Angeles"
  },
  
  // Add Page
  ADD_PAGE: {
    HEADING: "Add New Organization",
    SUBTITLE: "Create a new organizational unit",
    BACK_LABEL: "Back to Organizations",
    TITLE: "Organization Information",
    SUBMIT_LABEL: "Create Organization"
  },
  
  // Edit Page
  EDIT_PAGE: {
    HEADING: "Edit Organization",
    SUBTITLE: "Update organization information",
    BACK_LABEL: "Back to Organizations",
    TITLE: "Organization Information",
    SUBMIT_LABEL: "Update Organization"
  },
  
  // View Page
  VIEW_PAGE: {
    HEADING: "View Organization",
    SUBTITLE: "Organization details and information",
    BACK_LABEL: "Back to Organizations",
    TITLE: "Organization Information"
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    NOT_FOUND_TITLE: "Organization Not Found",
    NOT_FOUND_MESSAGE: "The requested organization could not be found."
  },
  
  // Delete Modal
  DELETE_MODAL: {
    TITLE: "Delete Organization",
    DESCRIPTION: "Are you sure you want to delete this organization? This action cannot be undone and will affect all members of this organization."
  }
};

// Form Field Constants
export const ORGANIZATION_FIELD_CONSTANTS = {
  NAME: {
    LABEL: "Organization Name",
    PLACEHOLDER: "Enter organization name",
    VALIDATION: "Organization name is required"
  },
  TYPE: {
    LABEL: "Organization Type",
    VALIDATION: "Organization type is required"
  },
  PARENT: {
    LABEL: "Parent Organization",
    PLACEHOLDER: "Enter parent organization",
    VALIDATION: "Parent organization is required"
  },
  MANAGER: {
    LABEL: "Manager",
    PLACEHOLDER: "Enter manager name",
    VALIDATION: "Manager is required"
  },
  EMAIL: {
    LABEL: "Email",
    PLACEHOLDER: "org@example.com"
  },
  PHONE: {
    LABEL: "Phone",
    PLACEHOLDER: "+1-555-XXXX",
    VALIDATION: "Phone number is required"
  },
  LOCATION: {
    LABEL: "Location",
    PLACEHOLDER: "Enter location",
    VALIDATION: "Location is required"
  },
  STATUS: {
    LABEL: "Status",
    VALIDATION: "Status is required"
  },
  MEMBERS: {
    LABEL: "Number of Members",
    PLACEHOLDER: "Enter number of members",
    VALIDATION: "Member count is required"
  },
  DESCRIPTION: {
    LABEL: "Description",
    PLACEHOLDER: "Enter organization description",
    VALIDATION: "Description is required"
  }
};
