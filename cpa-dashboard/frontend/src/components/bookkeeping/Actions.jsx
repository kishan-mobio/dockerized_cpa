import { Button } from "@/components/ui/button";
import { Save, X, Send } from "lucide-react";
import { BOOKCLOSURE_CONSTANTS } from "@/utils/constants/bookclosure";

export default function ActionButtons({
  isSubmitting,
  isDrafting = false,
  onSaveAsDraft,
  onCancel,
  onSubmit,
}) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onSaveAsDraft}
        disabled={isDrafting}
        leftIcon={<Save className="w-4 h-4" />}
        className="space-x-2"
      >
        {isDrafting
          ? BOOKCLOSURE_CONSTANTS.ACTION_BUTTONS.SAVING
          : BOOKCLOSURE_CONSTANTS.ACTION_BUTTONS.SAVE_AS_DRAFT}
      </Button>
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          onClick={onCancel}
          leftIcon={<X className="w-4 h-4" />}
          className="px-6"
        >
          {BOOKCLOSURE_CONSTANTS.ACTION_BUTTONS.CANCEL}
        </Button>
        <Button
          variant="default"
          onClick={onSubmit}
          disabled={isSubmitting}
          rightIcon={
            isSubmitting ? (
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            ) : (
              <Send className="w-4 h-4" />
            )
          }
          className="px-6"
        >
          {isSubmitting
            ? BOOKCLOSURE_CONSTANTS.ACTION_BUTTONS.SUBMITTING
            : BOOKCLOSURE_CONSTANTS.ACTION_BUTTONS.SUBMIT}
        </Button>
      </div>
    </div>
  );
}
