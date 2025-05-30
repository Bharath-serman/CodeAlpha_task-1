import { Button } from "@/components/ui/button";
import { Copy, Speech, StopCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRef, useState } from "react";

interface ActionButtonsProps {
  text: string;
  language: string;
  type: "source" | "target";
}

// Helper to split text into chunks for speech synthesis
function splitTextIntoChunks(text: string, maxChunkLength = 200) {
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > maxChunkLength) {
      if (current) chunks.push(current);
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export const ActionButtons = ({ text, language, type }: ActionButtonsProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
  const canceledRef = useRef(false);

  const handleCopy = async () => {
    if (!text.trim()) {
      toast({
        title: "No text to copy",
        description: "Please enter or translate some text first.",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard!",
        description: "Text has been copied successfully."
      });
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        title: "Copy failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleSpeak = () => {
    if (!text.trim()) {
      toast({
        title: "No text to speak",
        description: "Please enter or translate some text first.",
        variant: "destructive"
      });
      return;
    }

    if (!("speechSynthesis" in window)) {
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive"
      });
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    canceledRef.current = false;

    const chunks = splitTextIntoChunks(text, 180);
    utterancesRef.current = chunks.map(chunk => {
      const utterance = new window.SpeechSynthesisUtterance(chunk);
      if (language !== "auto") utterance.lang = language;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      return utterance;
    });

    let current = 0;
    const speakNext = () => {
      if (current >= utterancesRef.current.length) {
        setIsSpeaking(false);
        toast({ title: "Speech finished", description: "All text has been read." });
        return;
      }
      const utterance = utterancesRef.current[current];
      utterance.onend = () => {
        if (!canceledRef.current) {
          current++;
          speakNext();
        } else {
          setIsSpeaking(false);
        }
      };
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        // Only show error if not canceled by user
        if (!canceledRef.current && event.error !== "canceled") {
          toast({
            title: "Speech failed",
            description: "Unable to play text-to-speech.",
            variant: "destructive"
          });
        }
      };
      window.speechSynthesis.speak(utterance);
    };
    speakNext();

    toast({
      title: "Playing text-to-speech",
      description: "Audio is being played."
    });
  };

  const handleStop = () => {
    canceledRef.current = true;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    // No toast for stop
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        disabled={!text.trim()}
        className="flex-1 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900 dark:hover:border-blue-600 transition-colors"
      >
        <Copy className="w-4 h-4 mr-1" />
        Copy
      </Button>
      {isSpeaking ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleStop}
          className="flex-1 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900 dark:hover:border-red-600 transition-colors"
        >
          <StopCircle className="w-4 h-4 mr-1" />
          Stop
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSpeak}
          disabled={!text.trim()}
          className="flex-1 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900 dark:hover:border-green-600 transition-colors"
        >
          <Speech className="w-4 h-4 mr-1" />
          Listen
        </Button>
      )}
    </div>
  );
};
