import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { BOOKCLOSURE_CONSTANTS } from "@/utils/constants/bookclosure";

export default function MonthSelector({ selectedMonth, onChange, months }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {BOOKCLOSURE_CONSTANTS.MONTH_SELECTOR.TITLE}
      </h2>
      <DropdownMenu
        label={selectedMonth}
        options={months.map((month) => ({ label: month, value: month }))}
        selected={selectedMonth}
        onSelect={onChange}
        buttonClassName="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 flex justify-between items-center"
        menuClassName="w-full"
      />
    </div>
  );
}
