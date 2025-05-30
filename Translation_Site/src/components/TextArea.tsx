import { Textarea } from "@/components/ui/textarea";

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isSource: boolean;
  readOnly?: boolean;
}

export const TextArea = ({ value, onChange, placeholder, isSource, readOnly = false }: TextAreaProps) => {
  return (
    <div className="relative h-full flex-1">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`min-h-32 md:min-h-40 h-full flex-1 resize-none border-2 transition-colors duration-200
          ${isSource 
            ? "border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-500" 
            : "border-green-200 dark:border-green-800 focus:border-green-400 dark:focus:border-green-500 bg-gray-50 dark:bg-gray-900"}
          ${readOnly ? "cursor-default" : ""}`}
        readOnly={readOnly}
      />
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        {value.length} characters
      </div>
    </div>
  );
};
