"use client";

import { useParams } from "next/navigation";
import SubmitBookkeeping from "@/components/bookkeeping/SubmitBookkeeping";

export default function BookkeepingPage() {
  const params = useParams();
  const clientId = params?.clientId;
  return (
    <div className="min-h-screen">
      <SubmitBookkeeping clientId={clientId} />
    </div>
  );
}
