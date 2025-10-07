import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BOOKCLOSURE_CONSTANTS } from "@/utils/constants/bookclosure";

export default function Heading({ onBack }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-1">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-0.5">
          {BOOKCLOSURE_CONSTANTS.PAGE_TITLE}
        </h1>
        <p className="text-gray-600 text-base">
          {BOOKCLOSURE_CONSTANTS.PAGE_SUBTITLE}
        </p>
      </div>
      <Button
        variant="ghost"
        onClick={onBack}
        leftIcon={<ArrowLeft className="w-5 h-5" />}
        className="space-x-2 text-gray-600 hover:text-gray-800 md:mt-0 mt-1"
      >
        {BOOKCLOSURE_CONSTANTS.BACK_BUTTON_TEXT}
      </Button>
    </div>
  );
}
