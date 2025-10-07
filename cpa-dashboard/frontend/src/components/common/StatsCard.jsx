import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Shield,
  Key,
  Settings,
  Building,
  Building2,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";

// Icon mapping for different stat types
const iconMap = {
  users: <Users className="w-6 h-6" />,
  "user-check": <UserCheck className="w-6 h-6" />,
  "user-x": <UserX className="w-6 h-6" />,
  clock: <Clock className="w-6 h-6" />,
  "trending-up": <TrendingUp className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  key: <Key className="w-6 h-6" />,
  settings: <Settings className="w-6 h-6" />,
  building: <Building className="w-6 h-6" />,
  "building-2": <Building2 className="w-6 h-6" />,
  "map-pin": <MapPin className="w-6 h-6" />,
  calendar: <Calendar className="w-6 h-6" />,
  "check-circle": <CheckCircle className="w-6 h-6" />,
};

export default function StatsCard({
  title,
  value,
  icon,
  bgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  className = "",
  onClick,
  loading = false,
}) {
  const cardClasses = `
    ${bgColor} rounded-xl p-4 shadow-md border border-transparent 
    transition-all duration-300 hover:shadow-2xl hover:scale-102 
    ${onClick ? "cursor-pointer" : ""} 
    ${className}
  `;

  const content = (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        {loading ? (
          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900 leading-tight">
            {value}
          </p>
        )}
      </div>
      <div
        className={`p-2 rounded-full bg-transparent ${iconColor} ml-3 flex-shrink-0`}
      >
        {loading ? (
          <div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full"></div>
        ) : (
          iconMap[icon] || <Users className="w-6 h-6" />
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={cardClasses}>
        {content}
      </button>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}
