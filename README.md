# Mini AI Tech Consultant

A small, beginner-friendly prototype using Node.js, Express, HTML, CSS, JavaScript, and the Google Gemini API.

It demonstrates three AI-assisted workflows:

1. **Knowledge Brain:** Answer a question using text supplied by the user.
2. **Inbox Agent:** Draft a context-aware reply to a customer email.
3. **Meeting-to-Scope:** Extract requirements, suggested tasks, rough estimates, risks, and next steps from meeting notes.

This is a prototype, not a production-ready agent system. It does not scrape websites, use a vector database or RAG pipeline, connect to an actual inbox, store a database, or send emails automatically. The model's estimates and outputs must be reviewed by a person.

## Requirements

- Node.js (Node 18 or newer recommended; use a currently supported LTS version)
- Internet connection for Gemini API calls
- A Gemini API key from Google AI Studio

## Setup

1. Extract the ZIP file.
2. Open a terminal inside the `mini_ai_tech_consultant_gemini` folder.
3. Install the packages:

   ```bash
   npm install
   ```

4. Copy `.env.example` and name the copy `.env`.
5. Open `.env` and replace the example value with your own key:

   ```env
   GEMINI_API_KEY=your_real_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   PORT=3000
   ```

   Do not share your API key or commit `.env` to GitHub. The `.gitignore` file excludes it.

6. Start the application:

   ```bash
   npm start
   ```

7. Open [http://localhost:3000](http://localhost:3000).

The page shows whether a Gemini key is configured. If you change `.env`, stop the server with `Ctrl+C` and run `npm start` again.

## How the code is organized

- `server.js` — starts Express, serves the frontend, validates requests, and defines the three API endpoints.
- `services/gemini.js` — contains the Gemini client and one small function for each AI workflow.
- `public/index.html` — page structure and the three feature forms.
- `public/styles.css` — all styling, with shared color variables and responsive layout rules.
- `public/app.js` — switches tabs, sends form data to the backend, and displays results.
- `.env.example` — names of the environment variables required by the app.
- `.gitignore` — keeps secrets and installed dependencies out of source control.

## What happens when you click a button?

The browser sends the text to an Express endpoint. The endpoint calls a function in `services/gemini.js`, which sends a prompt to Gemini using the official `@google/genai` JavaScript SDK. The result is returned to the browser and displayed.

- `POST /api/knowledge` — supplied text plus a question.
- `POST /api/inbox` — customer email plus optional support context.
- `POST /api/scope` — meeting notes, asking for structured JSON output.
- `GET /api/health` — reports whether the server has a key configured. It does not test whether the key is valid.

## Common issues

- **“API key needed”** — check that the file is named `.env`, not `.env.example`, and that `GEMINI_API_KEY` has your actual key.
- **Authentication or API-key error** — confirm the key is valid and that Gemini API access is enabled for it.
- **Quota or rate-limit error** — check your API usage and limits.
- **Model not found or unavailable** — update `GEMINI_MODEL` in `.env` to a model available to your account.
- **Port already in use** — change `PORT=3001` in `.env`, restart the server, and open `http://localhost:3001`.
- **Meeting scope displayed as text with a note** — the model returned invalid JSON. The app displays the original response instead of crashing.

## Limitations and safe use

- Model responses may be wrong or incomplete.
- The knowledge answer is instructed to use only the supplied text, but it can still make mistakes.
- Email drafts are suggestions and are not sent automatically.
- Task estimates are rough suggestions, not commitments.
- Text submitted in the forms is sent to the Gemini API for processing. Do not paste confidential customer or company information.
- Keep the API key private and on the server. Never put it in `public/app.js` or `public/index.html`.
