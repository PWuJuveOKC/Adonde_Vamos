# 🗺️ Donde Vamos

A family activity recommender app — powered by Claude AI.

---

## 🚀 Option A: CodeSandbox (easiest, no install)

1. Go to [codesandbox.io](https://codesandbox.io) → **Create Sandbox** → **Import from GitHub**
   - Or click **Upload** and drag this whole folder in
2. In the sandbox, open the **Secrets** panel (🔒 icon in the left sidebar)
3. Add a secret: `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com)
4. Hit **Run** — your app is live with a shareable URL!

> **Note for CodeSandbox:** The `/api/recommend.js` serverless function works natively in CodeSandbox
> because it supports Vercel-style API routes out of the box.

---

## 🚀 Option B: Vercel (best for permanent hosting)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/donde-vamos.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo
2. In **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key from [console.anthropic.com](https://console.anthropic.com)
3. Click **Deploy** — done! You get a live URL like `donde-vamos.vercel.app`

### Step 3 — Make changes later
```bash
# Edit any file, then:
git add .
git commit -m "my changes"
git push
# Vercel auto-redeploys in ~30 seconds
```

---

## 💻 Option C: Run locally

```bash
npm install
cp .env.example .env.local
# Edit .env.local and paste your ANTHROPIC_API_KEY
npm start
# Opens at http://localhost:3000
```

---

## 📁 Project structure

```
donde-vamos/
├── public/
│   └── index.html          # HTML shell
├── src/
│   └── App.jsx             # ← Main app — edit this to change the UI
├── api/
│   └── recommend.js        # ← API proxy — keeps your key secret
├── .env.example            # Copy to .env.local and add your key
├── vercel.json             # Vercel routing config
└── package.json            # Dependencies
```

---

## ✏️ How to modify the app

All the action is in `src/App.jsx`. Key areas:

| What you want to change | Where in App.jsx |
|---|---|
| Add/remove cities | `PRESET_CITIES` array |
| Add new activities | `ACTIVITY_BANK.outdoor` or `ACTIVITY_BANK.indoor` |
| Change weekend events | `WEEKEND_EVENT_TEMPLATES` array |
| Change colors/theme | `COLORS` object at the top |
| Change AI prompt | Inside `fetchRecs()` function |
| Add age groups | `AGE_GROUPS` array |

---

## 🔑 Getting an Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Navigate to **API Keys** → **Create Key**
4. Copy the key and paste it into your environment variables
