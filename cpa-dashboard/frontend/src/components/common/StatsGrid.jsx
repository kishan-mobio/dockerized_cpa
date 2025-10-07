import React from "react";
import StatsCard from "./StatsCard";

export default function StatsGrid({
  stats = [],
  className = "",
  columns = { sm: 1, md: 2, lg: 4 },
  loading = false,
}) {
  if (!stats || stats.length === 0) {
    return null;
  }

  // Use flexbox for a single row, cards take all available width
  const gridClasses = `flex flex-row gap-4 mb-5 w-full`;

  return (
    <div className={`${gridClasses} ${className}`} style={{ minWidth: 0 }}>
      {stats.map((stat, index) => (
        <div key={stat.id || index} style={{ flex: "1 1 0%", minWidth: 0 }}>
          <StatsCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
            iconColor={stat.iconColor}
            onClick={stat.onClick}
            loading={loading}
          />
        </div>
      ))}
    </div>
  );
}
