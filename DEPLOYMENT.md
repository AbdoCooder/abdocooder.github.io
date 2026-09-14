# Deploy to your existing GitHub Pages repository

Repository: **https://github.com/AbdoCooder/abdocooder.github.io**

This is a source ZIP delivery. It has not been pushed to GitHub or deployed over
your existing portfolio.

## Preview

With Node.js 22.12+ installed, run in the unzipped project:

```sh
npm ci
npm run dev
```

## Update your existing checkout

1. Create a branch in your local repository, such as `redesign/react-portfolio`.
2. Copy this project's contents into it, including `.github/`, `.gitignore`, and
   `.env.example`. Preserve the checkout's `.git/` directory.
3. Replace the old root `index.html`. The old `assets/css/style.css` and
   `assets/js/script.js` are superseded by React and can be removed.
4. Review and commit the changes. Push your branch, and merge into `main` when ready.

Do not commit `node_modules/`, `.env.local`, `dist/`, or test results. The included
`.gitignore` excludes them. The workflow builds production files itself.

## Configure Pages

Before merging, go to repository **Settings → Pages → Source** and select
**GitHub Actions**. The original branch/root method does not compile React source.

The included workflow installs locked dependencies, type-checks, builds, runs
browser tests, uploads `dist/`, and deploys it using the official Pages actions.
Actions and Pages must be enabled for your repository. You can also start it
manually from the Actions tab.

After the workflow succeeds, open **https://abdocooder.github.io/**.

## Activate contact delivery

Follow the four activation steps in README.md. The owner must confirm FormSubmit's
email before normal delivery is active, then verify a real test message arrives.

To change the recipient identifier used by the workflow, create repository variable
`VITE_FORMSUBMIT_RECIPIENT` in **Settings → Secrets and variables → Actions → Variables**.
Re-run deployment to bake the new public value into the build.

## Final verification

- Check the page on desktop and a real phone, in both themes.
- Filter projects; open a case study; close with Escape; open its source link.
- Enter an invalid email and check validation.
- After activation, send one real message and verify it reaches your inbox.
- Check GitHub, LinkedIn, Dev.to, telephone, and email links.
- Confirm internship dates still reflect your availability.

## Other static hosts

Run `npm run build` and upload the **contents of `dist/`**. Relative assets and
hash-based case-study links avoid server-side route rewrites. If changing the
public URL, update the canonical and social URLs in `index.html`, plus `robots.txt`
and `sitemap.xml`.

| Problem | Solution |
| --- | --- |
| Blank page after source upload | Publish `dist/`, or use the included Actions workflow. |
| File opened with `file://` fails | Use `npm run dev` or `npm run preview`. |
| No contact email | Activate FormSubmit, check Spam and recipient, then send a fresh test. |
| Service unavailable | Draft remains; retry or use the visible email link. |
| Playwright browser missing | Run `npx playwright install chromium`. |
| Restricted environment network interface error | Use `npm run dev -- --host 127.0.0.1`. |

Reference: [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
