// Listing Page Constants
export const LISTING_CONSTANTS = {
  // Page Information
  PAGE_TITLE: "Overview",
  PAGE_SUBTITLE: "Manage all your clients and their bookkeeping data",

  // Buttons
  ADD_BUTTON_TEXT: "Add New Client",

  // Search and Filters
  SEARCH_PLACEHOLDER: "Search by client name or email...",
  STATUS_FILTER: {
    ALL: "All Status",
    ACTIVE: "Active",
    INACTIVE: "Inactive",
  },

  // Stats Cards
  STATS: {
    TOTAL_CLIENTS: {
      TITLE: "Total Clients",
      VALUE: "142",
      ICON: "users",
      BG_COLOR: "bg-[#E7E6FB]",
      ICON_COLOR: "text-[#7D6AEF]",
    },
    ACTIVE_CLIENTS: {
      TITLE: "Active Clients",
      VALUE: "128",
      ICON: "user-check",
      BG_COLOR: "bg-[#DDF6ED]",
      ICON_COLOR: "text-[#4CB993]",
    },
    PENDING_UPDATES: {
      TITLE: "Pending Updates",
      VALUE: "23",
      ICON: "clock",
      BG_COLOR: "bg-[#FFF6E4]",
      ICON_COLOR: "text-[#F6C768]",
    },
    THIS_MONTH: {
      TITLE: "This Month",
      VALUE: "89",
      ICON: "trending-up",
      BG_COLOR: "bg-[#FFE7E6]",
      ICON_COLOR: "text-[#F37E7E]",
    },
  },

  SEARCH: {
    ALL: "",
  },

  // Table Headers
  TABLE_HEADERS: {
    CLIENT_NAME: "Client Name",
    COMPANY_NAME: "Company Name",
    EMAIL: "Email",
    STATUS: "Status",
    LAST_BOOKING: "Last Booking",
    ACTIONS: "Actions",
  },

  // Action Labels
  ACTIONS: {
    VIEW_DETAILS: "View Details",
    SUBMIT_BOOK_CLOSURE: "Submit Book-closure",
    EDIT: "Edit",
    DELETE: "Delete",
  },

  // Messages
  MESSAGES: {
    LAST_UPDATED: "Updated 14 minutes ago",
    CLIENTS_COUNT: "clients",
  },

  // Pagination
  PAGINATION: {
    ITEMS_PER_PAGE: 8,
    DATE_FORMAT: {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  },

  // Table Row Styling
  TABLE_STYLING: {
    ROW_HOVER:
      "bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm",
    AVATAR_HOVER: "transform scale-110 shadow-lg",
    NAME_HOVER: "group-hover:text-blue-600",
    EMAIL_HOVER: "group-hover:text-gray-700",
    ACTION_HOVER: "transform translate-x-1",
  },
};
