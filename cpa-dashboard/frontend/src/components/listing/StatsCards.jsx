import React from "react";
import StatsGrid from "../common/StatsGrid";
import { defaultClientStats } from "@/utils/data/stats";

export default function StatsCards({
  stats = defaultClientStats,
  loading = false,
  className = "",
}) {
  return <StatsGrid stats={stats} loading={loading} className={className} />;
}
