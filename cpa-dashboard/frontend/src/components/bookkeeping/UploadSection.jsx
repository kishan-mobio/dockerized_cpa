import UploadCard from "@/components/bookkeeping/UploadCard";
import { cardConfigs } from "@/utils/data/bookkeeping";
import { BOOKCLOSURE_CONSTANTS } from "@/utils/constants/bookclosure";

export default function UploadSection({ uploadStates, onSync }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {BOOKCLOSURE_CONSTANTS.UPLOAD_SECTION.TITLE}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardConfigs.map((card) => (
          <UploadCard
            key={card.key}
            title={card.title}
            description={card.description}
            icon={card.icon}
            onSync={(files) => onSync(card.key, files)}
            isLoading={uploadStates[card.key]}
            lastSync={card.lastSync}
          />
        ))}
      </div>
    </div>
  );
}
