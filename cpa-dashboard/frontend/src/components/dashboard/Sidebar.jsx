import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import LogoutButton from "../ui/logout-button";
import { useRouter } from "next/navigation";
import tokenStorage from "@/lib/tokenStorage";
import { DropdownMenu } from "../ui/dropdown-menu";
import { DASHBOARD_CONSTANTS } from "@/utils/constants/dashboard";

export default function Sidebar({
  months,
  setMonths,
  pageToView,
  setPageToView,
  isFinancialSelected,
  setIsFinancialSelected,
  onDownload,
  onGenAIClick = () => {},
}) {
  const router = useRouter();
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const userData = tokenStorage.getUserData();
    setIsUserAdmin(userData?.role?.name === "admin");
  }, []);

  const handleBack = () => {
    router.push("/listing");
  };

  const handleFinChatClick = () => {
    if (onGenAIClick) {
      onGenAIClick();
    }
  };

  return (
    <>
      <div
        className="flex flex-col gap-4 w-[260px] p-8 shadow-md h-full overflow-auto border-r border-gray-200"
        style={{ backgroundColor: DASHBOARD_CONSTANTS.COLORS.PRIMARY }}
      >
        <DropdownMenu
          selected={months}
          onSelect={setMonths}
          options={DASHBOARD_CONSTANTS.SIDEBAR.MONTHS}
          disabled={isFinancialSelected}
          buttonClassName="w-full px-3 py-2 rounded-md flex justify-between items-center bg-white text-[#3843A4] shadow-sm focus:outline-none focus:bg-[#E0E7FF] transition-colors"
          menuClassName="w-full bg-white rounded-b-md shadow-lg border-t-0 border border-[#C7D2FE] mt-1 py-1 text-[#3843A4]"
        />
        {isUserAdmin && (
          <Button
            variant="default"
            leftIcon={<ArrowLeft />}
            onClick={() => handleBack()}
            className={`w-full border-none focus:outline-none focus:ring-2 focus:ring-white/40`}
          >
            {DASHBOARD_CONSTANTS.SIDEBAR.BACK_BUTTON_TEXT}
          </Button>
        )}

        <Button
          variant="default"
          onClick={() => onDownload()}
          className={`w-full border-none focus:outline-none focus:ring-2 focus:ring-white/40`}
        >
          {DASHBOARD_CONSTANTS.SIDEBAR.DOWNLOAD_BUTTON_TEXT}
        </Button>

        <div className="w-full flex flex-col gap-2">
          <Button
            type="button"
            aria-pressed={!isFinancialSelected}
            onClick={() => setIsFinancialSelected(false)}
            className={`w-full px-3 py-2 rounded-md font-semibold flex items-center justify-between transition-colors duration-200 focus:outline-none border-none
              ${
                !isFinancialSelected
                  ? `shadow-sm`
                  : `bg-transparent hover:bg-[${DASHBOARD_CONSTANTS.COLORS.HOVER}]`
              }`}
          >
            <span>{DASHBOARD_CONSTANTS.SIDEBAR.OPERATIONS_TAB}</span>
          </Button>

          <Button
            type="button"
            aria-expanded={isFinancialSelected}
            onClick={() => setIsFinancialSelected(true)}
            className={`w-full px-3 py-2 rounded-md font-semibold flex items-center justify-between transition-colors duration-200 focus:outline-none border-none
              ${
                isFinancialSelected
                  ? `shadow-sm`
                  : `bg-transparent hover:bg-[${DASHBOARD_CONSTANTS.COLORS.HOVER}]`
              }`}
          >
            <span>{DASHBOARD_CONSTANTS.SIDEBAR.FINANCIAL_TAB}</span>
            <span
              className={`ml-2 text-xs transition-transform duration-200 ${
                isFinancialSelected
                  ? "text-white rotate-180"
                  : "text-white/70 rotate-0"
              }`}
              style={{ display: "inline-block" }}
            >
              ▲
            </span>
          </Button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isFinancialSelected
                ? "max-h-60 opacity-100"
                : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <ul className="pl-6 py-2 space-y-1">
              {DASHBOARD_CONSTANTS.SIDEBAR.FINANCIAL_PAGES.map((page) => (
                <li key={page}>
                  <Button
                    variant={pageToView === page ? "secondary" : "ghost"}
                    className={`w-full justify-start text-white ${
                      pageToView === page
                        ? `font-bold bg-[${DASHBOARD_CONSTANTS.COLORS.SECONDARY}]`
                        : "hover:bg-[${DASHBOARD_CONSTANTS.COLORS.HOVER}]"
                    }`}
                    onClick={() => setPageToView(page)}
                  >
                    {DASHBOARD_CONSTANTS.SIDEBAR.PAGE_PREFIX} {page}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            onClick={handleFinChatClick}
            variant="outline"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            FinChat
          </Button>
        </div>

        <div className="p-4 border-t border-white/20 w-full">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}
