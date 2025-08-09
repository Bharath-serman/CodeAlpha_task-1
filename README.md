# FluentFlow Translation App

## Description

FluentFlow is a modern, user-friendly web application for effortless language translation. It features a clean, responsive UI, light/dark theme toggle, text-to-speech, and clipboard support. The backend is powered by Python (Flask) and uses the OpenRouter API with the DeepSeek-R1 model for high-quality translations.

## Features

- Translate text between multiple languages using OpenRouter API
- Light and dark theme toggle
- Copy and speak (text-to-speech) for both input and output
- Responsive, accessible, and modern UI
- API key management via settings popup

## Requirements

- Python 3.8+
- [Flask](https://flask.palletsprojects.com/) (`pip install flask`)
- [requests](https://docs.python-requests.org/) (`pip install requests`)
- An OpenRouter API key ([get one here](https://openrouter.ai/))

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Bharath-serman/CodeAlpha_task-1.git
   cd CodeAlpha_task-1
   ```
2. **Install dependencies:**
   ```sh
   pip install flask requests
   ```
3. **Run the app:**
   ```sh
   python app.py
   ```
4. **Open your browser:**
   Visit [http://localhost:5000](http://localhost:5000)

## Usage

- Click the settings (⚙️) button to enter your OpenRouter API key.
- Enter text, select source and target languages, and click **Translate**.
- Use **Copy** to copy text, and **Speak** to listen to the text aloud. You can stop speech at any time.
- Toggle between light and dark themes using the theme button (🌙/☀️).

## Technologies Used

- **Python (Flask)** – Backend server and API integration
- **HTML5 & CSS3** – Responsive, modern UI
- **JavaScript (ES6+)** – UI interactivity, AJAX, theme, and speech features
- **OpenRouter API** – Language translation (DeepSeek-R1 model)

---

Feel free to customize, extend, or deploy this project as you wish!
