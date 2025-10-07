"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Heading from "@/components/bookkeeping/Heading";
import ClientInfoCard from "@/components/bookkeeping/ClientInfo";
import MonthSelector from "@/components/bookkeeping/MonthSelector";
import UploadSection from "@/components/bookkeeping/UploadSection";
import ActionButtons from "@/components/bookkeeping/Actions";
import { clientsData } from "@/utils/data/clients";
import { bookkeepingMonths } from "@/utils/data/bookkeeping";
import { useToast } from "../ui/toast";
import { BOOKCLOSURE_CONSTANTS } from "@/utils/constants/bookclosure";

export default function SubmitBookkeeping({ clientId }) {
  const router = useRouter();
  const { addToast } = useToast();

  const selectedClientData = clientsData.find((c) => String(c.id) === clientId);
  const [selectedMonth, setSelectedMonth] = useState(bookkeepingMonths[0]);
  const [uploadStates, setUploadStates] = useState({
    financial: false,
    operational: false,
    payroll: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  // Handlers
  const handleMonthChange = (month) => setSelectedMonth(month);

  const handleSync = (type, files) => {
    setUploadStates((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setUploadStates((prev) => ({ ...prev, [type]: false }));
    }, 1000);
  };

  const handleSaveAsDraft = () => {
    setIsDrafting(true);
    setTimeout(() => {
      setIsDrafting(false);
      addToast(BOOKCLOSURE_CONSTANTS.TOAST_MESSAGES.DRAFT_SAVED, "success");
    }, 1500);
  };

  const handleCancel = () => {
    router.push("/listing");
  };

  const handleSubmitData = () => {
    setIsSubmitting(true);
    // Simulate submit
    setTimeout(() => {
      setIsSubmitting(false);
      addToast(BOOKCLOSURE_CONSTANTS.TOAST_MESSAGES.DATA_SUBMITTED, "success");
      router.push("/listing");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto bg-gray-100">
      <Heading onBack={() => router.push("/listing")} />
      <ClientInfoCard client={selectedClientData} />
      <MonthSelector
        selectedMonth={selectedMonth}
        onChange={handleMonthChange}
        months={bookkeepingMonths}
      />
      <UploadSection uploadStates={uploadStates} onSync={handleSync} />
      <ActionButtons
        isSubmitting={isSubmitting}
        isDrafting={isDrafting}
        onSaveAsDraft={handleSaveAsDraft}
        onCancel={handleCancel}
        onSubmit={handleSubmitData}
      />
    </div>
  );
}
