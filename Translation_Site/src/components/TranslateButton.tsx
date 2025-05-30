
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TranslateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const TranslateButton = ({ onClick, isLoading, disabled }: TranslateButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Translating...
        </>
      ) : (
        "Translate"
      )}
    </Button>
  );
};
