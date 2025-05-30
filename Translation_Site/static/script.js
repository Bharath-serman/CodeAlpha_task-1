// UI Elements
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const sourceText = document.getElementById('sourceText');
const translatedText = document.getElementById('translatedText');
const swapBtn = document.getElementById('swapBtn');
const translateBtn = document.getElementById('translateBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPopup = document.getElementById('settingsPopup');
const closeSettings = document.getElementById('closeSettings');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKey = document.getElementById('saveApiKey');
const toast = document.getElementById('toast');

// Copy and Listen buttons
const copySourceBtn = document.getElementById('copySourceBtn');
const copyTargetBtn = document.getElementById('copyTargetBtn');
const listenSourceBtn = document.getElementById('listenSourceBtn');
const listenTargetBtn = document.getElementById('listenTargetBtn');

// Theme toggle logic
const themeToggleBtn = document.getElementById('themeToggleBtn');

// API Key storage (localStorage)
function getApiKey() {
    return localStorage.getItem('openrouter_api_key') || '';
}
function setApiKey(key) {
    localStorage.setItem('openrouter_api_key', key);
}

// Settings popup logic
settingsBtn.onclick = () => {
    apiKeyInput.value = getApiKey();
    settingsPopup.classList.remove('hidden');
};
closeSettings.onclick = () => {
    settingsPopup.classList.add('hidden');
};
saveApiKey.onclick = () => {
    setApiKey(apiKeyInput.value.trim());
    showToast('API key saved!');
    settingsPopup.classList.add('hidden');
};

// Swap languages
swapBtn.onclick = () => {
    if (sourceLang.value === 'auto') {
        showToast('Cannot swap with auto-detect. Please select a specific source language.', true);
        return;
    }
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp;
    // Optionally swap text
    const tempText = sourceText.value;
    sourceText.value = translatedText.value;
    translatedText.value = tempText;
};

// Translate button
translateBtn.onclick = async () => {
    const text = sourceText.value.trim();
    if (!text) {
        showToast('Please enter some text to translate.', true);
        return;
    }
    const apiKey = getApiKey();
    if (!apiKey) {
        showToast('Please set your OpenRouter API key in settings.', true);
        return;
    }
    translateBtn.disabled = true;
    translateBtn.textContent = 'Translating...';
    try {
        const res = await fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                source_lang: sourceLang.value,
                target_lang: targetLang.value,
                api_key: apiKey
            })
        });
        const data = await res.json();
        if (res.ok && data.translatedText) {
            translatedText.value = data.translatedText;
            showToast('Translation completed!');
        } else {
            showToast(data.error || 'Translation failed.', true);
        }
    } catch (err) {
        showToast('Network or server error.', true);
    } finally {
        translateBtn.disabled = false;
        translateBtn.textContent = 'Translate';
    }
};

// Copy and Listen buttons
copySourceBtn.onclick = () => {
    if (sourceText.value.trim()) {
        navigator.clipboard.writeText(sourceText.value)
            .then(() => showToast('Copied to clipboard!'));
    }
};
copyTargetBtn.onclick = () => {
    if (translatedText.value.trim()) {
        navigator.clipboard.writeText(translatedText.value)
            .then(() => showToast('Copied to clipboard!'));
    }
};

listenSourceBtn.onclick = () => {
    speakText(sourceText.value, sourceLang.value);
};
listenTargetBtn.onclick = () => {
    speakText(translatedText.value, targetLang.value);
};

function speakText(text, lang) {
    if (!text.trim()) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    // Try to set language if available
    if (lang && lang !== 'auto') utter.lang = lang;
    window.speechSynthesis.cancel(); // Stop any current speech
    window.speechSynthesis.speak(utter);
}

// Toast notification
function showToast(message, isError = false) {
    toast.textContent = message;
    const isDark = document.body.classList.contains('dark');
    if (isError) {
        toast.style.background = isDark ? '#e63946' : '#dc2626';
        toast.style.color = isDark ? '#232946' : '#fff';
    } else {
        toast.style.background = '';
        toast.style.color = '';
    }
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
}

// Theme toggle logic
function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeToggleBtn.textContent = dark ? '☀️' : '🌙';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}
function getPreferredTheme() {
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}
themeToggleBtn.onclick = () => {
    setTheme(!document.body.classList.contains('dark'));
};
// On load, set theme
setTheme(getPreferredTheme() === 'dark'); 