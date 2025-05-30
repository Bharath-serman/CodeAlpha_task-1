
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ApiKeySettingsProps {
  onApiKeyChange: (apiKey: string) => void;
}

export const ApiKeySettings = ({ onApiKeyChange }: ApiKeySettingsProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem("openrouter_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
    }
  }, [onApiKeyChange]);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Please enter an API key",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem("openrouter_api_key", apiKey);
    onApiKeyChange(apiKey);
    toast({
      title: "API key saved!",
      description: "Your OpenRouter API key has been saved locally."
    });
    setIsExpanded(false);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("openrouter_api_key");
    setApiKey("");
    onApiKeyChange("");
    toast({
      title: "API key cleared",
      description: "Your API key has been removed."
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <CardTitle className="text-sm">OpenRouter API Settings</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Hide" : "Configure"}
          </Button>
        </div>
        {!isExpanded && (
          <CardDescription className="text-xs">
            {apiKey ? "✅ API key configured" : "⚠️ No API key set - using mock translations"}
          </CardDescription>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <CardDescription className="text-xs mb-4">
            Get your free API key from{" "}
            <a 
              href="https://openrouter.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              openrouter.ai
            </a>
          </CardDescription>
          
          <div className="space-y-3">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim()}
                size="sm"
              >
                Save API Key
              </Button>
              {apiKey && (
                <Button
                  onClick={handleClearApiKey}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
