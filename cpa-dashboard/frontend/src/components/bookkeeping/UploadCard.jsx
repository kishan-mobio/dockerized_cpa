"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import { BOOKCLOSURE_CONSTANTS } from "@/utils/constants/bookclosure";

export default function UploadCard({
  title,
  icon,
  onSync,
  isLoading = false,
  lastSync = null,
}) {
  const [files, setFiles] = useState([]);
  const [synced, setSynced] = useState(false);
  const [lastSyncedDate, setLastSyncedDate] = useState(lastSync);

  const handleSync = () => {
    if (onSync) {
      onSync(files);
    }
    setSynced(true);
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    setLastSyncedDate(formatted);
  };

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-white shadow-sm flex flex-col h-full">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {lastSyncedDate && (
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-xs text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded">
            {BOOKCLOSURE_CONSTANTS.UPLOAD_CARD.LAST_SYNCED_LABEL}{" "}
            {lastSyncedDate}
          </span>
        </div>
      )}
      {/* Sync Button */}
      <Button
        onClick={handleSync}
        disabled={isLoading || synced}
        variant="default"
        className="mt-auto w-full"
        leftIcon={<UploadCloud className="w-4 h-4" />}
      >
        {isLoading
          ? BOOKCLOSURE_CONSTANTS.UPLOAD_CARD.SYNC_BUTTON.SYNCING
          : synced
          ? BOOKCLOSURE_CONSTANTS.UPLOAD_CARD.SYNC_BUTTON.SYNCED
          : BOOKCLOSURE_CONSTANTS.UPLOAD_CARD.SYNC_BUTTON.SYNC}
      </Button>
    </div>
  );
}
