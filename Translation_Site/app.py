from flask import Flask, render_template, request, jsonify, send_from_directory
import requests
import os
import re

app = Flask(__name__, static_folder='static', template_folder='templates')

# Serve favicon
@app.route('/Logo.ico')
def favicon():
    return send_from_directory(app.static_folder, 'Logo.ico')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text', '')
    source_lang = data.get('source_lang', 'auto')
    target_lang = data.get('target_lang', 'en')
    api_key = data.get('api_key', '')

    if not text or not api_key:
        return jsonify({'error': 'Missing text or API key'}), 400

    # Prepare OpenRouter API request
    url = 'https://openrouter.ai/api/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost',
        'X-Title': 'FluentFlow',
    }
    prompt = f"Translate the following text from {source_lang} to {target_lang}. Only output the translated sentence, with no explanation or extra text: {text}"
    payload = {
        "model": "deepseek/deepseek-r1:free",
        "messages": [
            {"role": "system", "content": "You are a helpful translation assistant."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 1024
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        translated = data['choices'][0]['message']['content']
        # Remove leading context if present
        # Common patterns to remove
        patterns = [
            r"^The translation from .+? is[:：\s]*",
            r"^Translation[:：\s]*",
            r"^Here is the translation[:：\s]*",
            r"^Translated text[:：\s]*",
        ]
        for pat in patterns:
            translated = re.sub(pat, '', translated, flags=re.IGNORECASE)
        translated = translated.strip()
        # Fallback: take only the first non-empty line if extra text remains
        if '\n' in translated:
            lines = [line.strip() for line in translated.split('\n') if line.strip()]
            if lines:
                translated = lines[0]
        return jsonify({'translatedText': translated})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 