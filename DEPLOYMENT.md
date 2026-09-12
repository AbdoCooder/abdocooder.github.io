# Deployment Guide — abdocooder.github.io

Step-by-step instructions to deploy this portfolio to GitHub Pages under your personal domain.

---

## Prerequisites

- Git installed locally (`git --version` to verify)
- A GitHub account with username **AbdoCooder**
- The unzipped portfolio folder on your machine

---

## Step 1 — Create the GitHub Pages repository

GitHub Pages serves your personal portfolio from a repository named exactly `<username>.github.io`.

1. Go to [https://github.com/new](https://github.com/new)
2. Set **Repository name** to: `AbdoCooder.github.io`
3. Set visibility to **Public**
4. Do **not** initialize with a README (leave all checkboxes unchecked)
5. Click **Create repository**

---

## Step 2 — Initialize and push the portfolio

Open a terminal in the unzipped `portfolio/` folder and run:

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "feat: initial portfolio"

# Set branch to main
git branch -M main

# Add the remote (replace AbdoCooder with your GitHub username if different)
git remote add origin https://github.com/AbdoCooder/AbdoCooder.github.io.git

# Push
git push -u origin main
```

---

## Step 3 — Enable GitHub Pages

1. Go to your repository: `https://github.com/AbdoCooder/AbdoCooder.github.io`
2. Click **Settings** (top tab)
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

GitHub will display a green banner:

> Your site is published at **https://abdocooder.github.io/**

It typically goes live within 1–3 minutes.

---

## Step 4 — Verify

Visit [https://abdocooder.github.io](https://abdocooder.github.io) in your browser.

If the page doesn't appear immediately, wait 2 minutes and do a hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`).

---

## Updating the portfolio

Whenever you make changes locally:

```bash
git add .
git commit -m "update: <describe your change>"
git push
```

GitHub Actions will automatically redeploy. Changes are live within ~30 seconds.

---

## Project Structure

```
portfolio/
├── index.html              ← Main HTML (single page)
├── DEPLOYMENT.md           ← This file
└── assets/
    ├── css/
    │   └── style.css       ← All styles (design tokens, layout, components)
    └── js/
        └── script.js       ← Vanilla JS (nav, scroll reveal, banner)
```

---

## Optional: Custom Domain

If you want to use a custom domain (e.g. `benajiba.dev`):

1. Buy your domain from any registrar (Namecheap, Cloudflare, etc.)
2. In your repo's **Settings → Pages**, enter your custom domain
3. Create a file named `CNAME` in the repo root containing just your domain:
   ```
   benajiba.dev
   ```
4. At your DNS registrar, add a CNAME record:
   - **Name:** `www`
   - **Value:** `abdocooder.github.io`
5. For the apex domain, add four A records pointing to GitHub's IPs:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
6. Enable **Enforce HTTPS** in GitHub Pages settings after DNS propagates (~24h)

---

## Troubleshooting

| Problem | Solution |
|---|---|
| 404 after pushing | Check the Pages source is set to `main` / `root` |
| Fonts not loading | Ensure you have an internet connection; fonts load from Google Fonts CDN |
| Styles not updating | Hard refresh: `Ctrl+Shift+R` or clear browser cache |
| Push rejected | Run `git pull origin main --rebase` then push again |
