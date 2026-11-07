# SkillPath AI

A responsive, installable learning app that works on GitHub Pages and Live Server in browser-only mode, or with the optional Node.js backend.

## Included
- Responsive dashboard, learning roadmap, 16 written lessons across HTML, CSS, JavaScript and Python, practice quiz, demo tutor, projects and analytics.
- Each lesson includes an explanation, readable code examples, a practice task, and course navigation.
- Installable PWA manifest, service worker and app icons.
- Node/Express API with JWT authentication, password hashing, rate limiting and JSON-file persistence.
- Optional AI tutor integration through an OpenAI-compatible API.
- Demo mode works without an AI key: the tutor uses a built-in learning assistant fallback.
- Starter learning content for HTML, CSS, JavaScript and Python.

## Requirements
- Node.js 18 or newer
- npm
- VS Code (recommended)

## Run with Live Server
1. Open the project in VS Code.
2. In the file explorer, right-click `public/index.html` and choose **Open with Live Server**. Do not open the HTML using a `file://` URL.

Live Server uses browser-only mode: the dashboard, courses, quiz and demo tutor work, and project progress is saved in that browser. Browser-only mode does not provide accounts or the optional hosted AI tutor.

## Run with the Node.js backend
1. Open the project folder in VS Code.
2. Open Terminal > New Terminal.
3. Run:

   ```powershell
   npm install
   ```

4. Copy `.env.example` to `.env`. You can leave the AI key empty to use demo tutor mode.
5. Start the app:

   ```powershell
   npm start
   ```

6. Open `http://localhost:3000`.

## Publish on GitHub Pages and install on a phone
Create a GitHub repository and upload the **contents** of this `SkillPath-AI` project folder to the repository root, including `.github` and `public` (do not upload the enclosing folder as an extra nested directory). Push to `main` or `master`. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source. The included workflow publishes the `public` folder. GitHub Pages provides HTTPS, which is required for phone installation.

- **Android:** Open your GitHub Pages URL in Chrome, then choose **Install app** from the browser menu.
- **iPhone/iPad:** Open your GitHub Pages URL in Safari, tap **Share**, then choose **Add to Home Screen**.

GitHub Pages is static hosting, so it uses browser-only mode: progress stays in that browser on that device, and the tutor uses its built-in demo responses. To enable shared account data or a hosted AI tutor, run the Node backend on a Node.js host instead.

- The app shell and course library are cached for offline viewing after the first successful visit.

## AI tutor setup (optional)
1. Open `.env`.
2. Add your API key to `OPENAI_API_KEY`.
3. Keep `OPENAI_BASE_URL` as the default for OpenAI, or change it to your compatible provider endpoint.
4. Restart the server.

Never put API keys in frontend JavaScript. The server reads the key from `.env`.

## Demo account
The app starts in local demo mode without requiring an account. Use the profile menu to see the demo learner profile. Authentication endpoints are available for account creation and login; the starter UI is designed for local evaluation.

## Project structure
```text
SkillPath-AI/
├── .github/
│   └── workflows/
│       └── pages.yml
├── server.js
├── package.json
├── .env.example
├── data/
│   └── db.example.json
└── public/
    ├── index.html
    ├── styles.css
    ├── app.js
    ├── lessons.js
    ├── lesson.css
    ├── manifest.webmanifest
    ├── sw.js
    └── assets/
        ├── icon-192.png
        ├── icon-192.svg
        ├── icon-512.png
        └── icon-512.svg
```

## Important production notes
This is a runnable MVP foundation, not a finished commercial SaaS. Before public launch, add a production database (PostgreSQL), email verification, password reset, account deletion/export workflows, CSRF protection where applicable, robust audit logging, backups, automated tests, and deployment secrets. JSON-file storage is suitable for local prototyping only. AI responses can be incorrect; learners should verify important technical guidance.
