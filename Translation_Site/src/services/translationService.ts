
interface TranslationResponse {
  translatedText: string;
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-r1:free";

export const translateText = async (
  text: string, 
  sourceLang: string, 
  targetLang: string,
  apiKey?: string
): Promise<TranslationResponse> => {
  console.log("Translating:", { text, sourceLang, targetLang, hasApiKey: !!apiKey });

  // If no API key, fall back to mock translations
  if (!apiKey) {
    return getMockTranslation(text, sourceLang, targetLang);
  }

  try {
    const languageNames = getLanguageName(sourceLang, targetLang);
    
    const prompt = sourceLang === "auto" 
      ? `Translate the following text to ${languageNames.target}. Only return the translated text, nothing else:\n\n${text}`
      : `Translate the following text from ${languageNames.source} to ${languageNames.target}. Only return the translated text, nothing else:\n\n${text}`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Translation Tool"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim() || text;

    console.log("Translation completed:", { original: text, translated: translatedText });
    return { translatedText };

  } catch (error) {
    console.error("OpenRouter API error:", error);
    // Fall back to mock translation on error
    return getMockTranslation(text, sourceLang, targetLang);
  }
};

const getMockTranslation = (text: string, sourceLang: string, targetLang: string): Promise<TranslationResponse> => {
  const mockTranslations: Record<string, Record<string, string>> = {
    "hello": {
      "es": "hola",
      "fr": "bonjour", 
      "de": "hallo",
      "it": "ciao",
      "pt": "olá",
      "ru": "привет",
      "ja": "こんにちは",
      "ko": "안녕하세요",
      "zh": "你好",
      "ar": "مرحبا",
      "hi": "नमस्ते"
    },
    "good morning": {
      "es": "buenos días",
      "fr": "bonjour",
      "de": "guten morgen", 
      "it": "buongiorno",
      "pt": "bom dia",
      "ru": "доброе утро",
      "ja": "おはよう",
      "ko": "좋은 아침",
      "zh": "早上好",
      "ar": "صباح الخير",
      "hi": "सुप्रभात"
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerText = text.toLowerCase().trim();
      
      if (sourceLang === targetLang && sourceLang !== "auto") {
        resolve({ translatedText: text });
        return;
      }
      
      if (mockTranslations[lowerText] && mockTranslations[lowerText][targetLang]) {
        resolve({ translatedText: mockTranslations[lowerText][targetLang] });
        return;
      }
      
      let translated = text + ` (mock translation to ${getLanguageName("", targetLang).target})`;
      resolve({ translatedText: translated });
    }, 800);
  });
};

const getLanguageName = (sourceLang: string, targetLang: string) => {
  const languageNames: Record<string, string> = {
    "auto": "auto-detect",
    "en": "English",
    "es": "Spanish", 
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese", 
    "ru": "Russian",
    "ja": "Japanese",
    "ko": "Korean",
    "zh": "Chinese",
    "ar": "Arabic",
    "hi": "Hindi",
    "tr": "Turkish",
    "pl": "Polish",
    "nl": "Dutch",
    "sv": "Swedish",
    "da": "Danish",
    "no": "Norwegian",
    "fi": "Finnish",
    "cs": "Czech"
  };

  return {
    source: languageNames[sourceLang] || sourceLang,
    target: languageNames[targetLang] || targetLang
  };
};
