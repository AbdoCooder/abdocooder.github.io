# Deployment — abdocooder.github.io

## 1. Create the repository

Go to [github.com/new](https://github.com/new) and create a repo named exactly:
```
AbdoCooder.github.io
```
Set it to **Public**. Leave all checkboxes unchecked.

---

## 2. Push the code

Open a terminal in the unzipped `portfolio2/` folder:

```bash
git init
git add .
git commit -m "feat: portfolio v2 — glassmorphism"
git branch -M main
git remote add origin https://github.com/AbdoCooder/AbdoCooder.github.io.git
git push -u origin main
```

---

## 3. Enable GitHub Pages

1. Go to the repo → **Settings** → **Pages**
2. Source: `main` branch, `/ (root)` folder
3. Click **Save**

Your site is live at **https://abdocooder.github.io** within 1–3 minutes.

---

## Updating

```bash
git add .
git commit -m "update: <description>"
git push
```

Auto-redeploys in ~30 seconds.

---

## Note on GitHub API rate limits

The "All repositories" accordion uses the public GitHub API (`api.github.com`).
- Unauthenticated: 60 requests/hour per IP — more than enough for visitors.
- If a visitor hits the limit, the dropdown shows a friendly error with a direct GitHub link.
- No API key or token is needed.

---

## Project structure

```
portfolio2/
├── index.html
├── DEPLOYMENT.md
└── assets/
    ├── css/style.css
    └── js/script.js
```
