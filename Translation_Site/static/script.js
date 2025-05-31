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
const copySourceBtn = document.getElementById('copySourceBtn');
const copyTargetBtn = document.getElementById('copyTargetBtn');
const listenSourceBtn = document.getElementById('listenSourceBtn');
const listenTargetBtn = document.getElementById('listenTargetBtn');

const themeToggleBtn = document.getElementById('themeToggleBtn');
function getApiKey() {
    return localStorage.getItem('openrouter_api_key') || '';
}
function setApiKey(key) {
    localStorage.setItem('openrouter_api_key', key);
}

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

swapBtn.onclick = () => {
    if (sourceLang.value === 'auto') {
        showToast('Cannot swap with auto-detect. Please select a specific source language.', true);
        return;
    }
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp;
    const tempText = sourceText.value;
    sourceText.value = translatedText.value;
    translatedText.value = tempText;
};
translateBtn.onclick = async () => {                      //Translation logic here.
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
let speakingSource = false;
let speakingTarget = false;

listenSourceBtn.onclick = () => {
    if (!speakingSource) {
        if (!sourceText.value.trim()) return;
        speakingSource = true;
        listenSourceBtn.textContent = 'Stop';
        const utter = new window.SpeechSynthesisUtterance(sourceText.value);
        if (sourceLang.value && sourceLang.value !== 'auto') utter.lang = sourceLang.value;
        utter.onend = utter.onerror = () => {
            speakingSource = false;
            listenSourceBtn.textContent = 'Speak';
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
    } else {
        window.speechSynthesis.cancel();
        speakingSource = false;
        listenSourceBtn.textContent = 'Speak';
    }
};

listenTargetBtn.onclick = () => {
    if (!speakingTarget) {
        if (!translatedText.value.trim()) return;
        speakingTarget = true;
        listenTargetBtn.textContent = 'Stop';
        const utter = new window.SpeechSynthesisUtterance(translatedText.value);
        if (targetLang.value && targetLang.value !== 'auto') utter.lang = targetLang.value;
        utter.onend = utter.onerror = () => {
            speakingTarget = false;
            listenTargetBtn.textContent = 'Speak';
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
    } else {
        window.speechSynthesis.cancel();
        speakingTarget = false;
        listenTargetBtn.textContent = 'Speak';
    }
};
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
setTheme(getPreferredTheme() === 'dark'); 