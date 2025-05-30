import { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import { TextArea } from "./TextArea";
import { TranslateButton } from "./TranslateButton";
import { ActionButtons } from "./ActionButtons";
import { SwapButton } from "./SwapButton";
import { ApiKeySettings } from "./ApiKeySettings";
import { translateText } from "@/services/translationService";
import { toast } from "@/hooks/use-toast";

export const TranslationTool = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Please enter some text to translate",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await translateText(sourceText, sourceLang, targetLang, apiKey);
      setTranslatedText(result.translatedText);
      
      toast({
        title: "Translation completed!",
        description: apiKey ? "Translated using OpenRouter API" : "Using mock translation (configure API key for real translations)"
      });
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation failed",
        description: "Please try again later or check your API key.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === "auto") {
      toast({
        title: "Cannot swap with auto-detect",
        description: "Please select a specific source language first.",
        variant: "destructive"
      });
      return;
    }

    setSourceLang((prevSourceLang) => {
      setTargetLang(prevSourceLang);
      return targetLang;
    });
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ApiKeySettings onApiKeyChange={setApiKey} />
      <div className="bg-background text-foreground rounded-2xl shadow-xl p-6 md:p-8 transition-colors duration-300">
        <div className="grid md:grid-cols-2 gap-6 h-full">
          {/* Source Section */}
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between h-12">
              <LanguageSelector
                value={sourceLang}
                onChange={setSourceLang}
                label="From"
                includeAuto={true}
              />
              <SwapButton onClick={handleSwapLanguages} />
              <LanguageSelector
                value={targetLang}
                onChange={setTargetLang}
                label="To"
                includeAuto={false}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <TextArea
                value={sourceText}
                onChange={setSourceText}
                placeholder="Enter text to translate..."
                isSource={true}
              />
            </div>
            <ActionButtons
              text={sourceText}
              language={sourceLang}
              type="source"
            />
          </div>
          {/* Target Section */}
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex items-center h-12">
              <span className="text-sm font-medium text-muted-foreground">Translation</span>
            </div>
            <div className="flex-1 flex flex-col">
              <TextArea
                value={translatedText}
                onChange={() => {}}
                placeholder="Translation will appear here..."
                isSource={false}
                readOnly={true}
              />
            </div>
            <ActionButtons
              text={translatedText}
              language={targetLang}
              type="target"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <TranslateButton
            onClick={handleTranslate}
            isLoading={isLoading}
            disabled={!sourceText.trim()}
          />
        </div>
      </div>
    </div>
  );
};
