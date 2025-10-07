import { BOOKCLOSURE_CONSTANTS } from "@/utils/constants/bookclosure";

export default function ClientInfoCard({ client }) {
  if (!client) return null;
  return (
    <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-blue-900">
          {client.name} ({client.company})
        </span>
      </div>
      <div className="mt-1 text-sm text-blue-700">
        {BOOKCLOSURE_CONSTANTS.CLIENT_INFO.STATUS_LABEL} {client.status} |{" "}
        {BOOKCLOSURE_CONSTANTS.CLIENT_INFO.LAST_SUBMISSION_LABEL}{" "}
        {client.lastBookkeeping}
      </div>
    </div>
  );
}
