import { Receipt, RefreshCcw, Users } from "lucide-react";

export const cardConfigs = [
  {
    key: "financial",
    title: "Financial Data",
    description: "Upload bank statements, invoices, receipts",
    icon: (
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
        <Receipt />
      </div>
    ),
    lastSync: "08/04/2025",
  },
  {
    key: "operational",
    title: "Operational Data",
    description: "Sync operational reports, metrics",
    icon: (
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
        <RefreshCcw />
      </div>
    ),
    lastSync: "12/05/2025",
  },
  {
    key: "payroll",
    title: "ADP/Payroll Data",
    description: "Upload payroll reports, ADP data",
    icon: (
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
        <Users />
      </div>
    ),
    lastSync: "24/02/2025",
  },
];

export const bookkeepingMonths = [
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
  "May 2025",
  "June 2025",
  "July 2025"
];
