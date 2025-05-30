
import { Button } from "@/components/ui/button";

interface SwapButtonProps {
  onClick: () => void;
}

export const SwapButton = ({ onClick }: SwapButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="p-2 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110"
      title="Swap languages"
    >
      <svg 
        className="w-4 h-4 text-blue-600" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
        />
      </svg>
    </Button>
  );
};
