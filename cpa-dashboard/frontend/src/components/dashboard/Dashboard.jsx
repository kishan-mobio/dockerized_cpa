import React, { useState } from "react";
import PdfViewer from "@/components/dashboard/PDFViewer";
import FinChatPage from "@/components/dashboard/GenAIPage";
import { FinancePath, monthToFile } from "@/utils/data/dashboard";
import Sidebar from "./Sidebar";
import { DASHBOARD_CONSTANTS } from "@/utils/constants/dashboard";
import { downloadFile } from "@/utils/methods";

export default function Dashboard() {
  const [months, setMonths] = useState(DASHBOARD_CONSTANTS.SIDEBAR.MONTHS.at(-1));
  const [pageToView, setPageToView] = useState(1);
  const [isFinancialSelected, setIsFinancialSelected] = useState(false);
  const [showFinChat, setShowFinChat] = useState(false);
  const pdfPath = isFinancialSelected ? FinancePath : monthToFile[months] || "";
  const page = isFinancialSelected ? pageToView : 1;

  if (!pdfPath && !showFinChat) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        {DASHBOARD_CONSTANTS.NO_PDF_MESSAGE}
      </div>
    );
  }

  const handleDownload = async () => {
    if (!pdfPath) return;
    try {
      await downloadFile(pdfPath, DASHBOARD_CONSTANTS.DEFAULT_DOWNLOAD_FILENAME);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleGenAIClick = () => setShowFinChat(true);
  const handleBackFromFinChat = () => setShowFinChat(false);

  const sidebarProps = {
    months,
    setMonths,
    pageToView,
    setPageToView,
    isFinancialSelected,
    setIsFinancialSelected,
    onDownload: handleDownload,
    onGenAIClick: handleGenAIClick
  };

  if (showFinChat) {
    return (
      <div className="flex w-full h-full min-h-0" style={{ height: "100vh" }}>
        <Sidebar {...sidebarProps} />
        <div className="flex-1 h-full overflow-hidden">
          <FinChatPage 
            onBack={handleBackFromFinChat} 
            selectedMonth={months}
            selectedMonthKey={months}
            selectedPage={pageToView}
            isFinancialSelected={isFinancialSelected}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full min-h-0" style={{ height: "100vh" }}>
      <Sidebar {...sidebarProps} />
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden flex items-start justify-center bg-gray-50 min-w-0">
        <PdfViewer url={pdfPath} pageToView={page} />
      </div>
    </div>
  );
}
