import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function FormHeader({ title, subtitle, onBack, backLabel }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div>
        <h1 className="text-2xl font-bold text-[#23235F]">{title}</h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {backLabel || "Back"}
      </Button>
    </div>
  );
}
