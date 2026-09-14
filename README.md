# Abdelkader Benajiba — Software Engineer Portfolio

A complete React + TypeScript portfolio rebuilt from
[AbdoCooder/abdocooder.github.io](https://github.com/AbdoCooder/abdocooder.github.io)
and its featured project READMEs.

Warm ivory, forest green, precise typography, original vector diagrams, and
case studies explaining real engineering decisions and individual contributions.

## Start locally

Install Node.js **22.12 or newer**, then run in this folder:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Do not open `index.html` with `file://`.

```sh
npm run build      # Type-check and build production files into dist/
npm run preview    # Preview the production build
```

The ZIP includes the editable source, locked dependencies, a ready-built `dist/`
folder, and desktop/mobile screenshots in `preview/`. `node_modules/` is intentionally
excluded; `npm ci` installs the exact dependencies.

## Features

- Responsive light and dark themes with a saved preference.
- Interactive engineering-layer illustration and original project diagrams.
- Four project case studies with filters, source links, and clear team roles.
- Native-dialog project details with keyboard focus containment, Escape support,
  focus restoration, and shareable links such as `/#project/webserv`.
- Profile, capabilities, education, additional projects, and internship availability.
- Contact form with name, email, subject, and message; validation; a honeypot;
  duplicate-submit protection; timeout handling; success/error states; and an email
  fallback. Failure retains the visitor's draft.
- Self-hosted fonts, favicon, social image, metadata, robots, and sitemap.
- GitHub Pages deployment workflow and 14 automated browser tests.

## Activate email delivery — required once

The form submits to the real [FormSubmit AJAX endpoint](https://formsubmit.co/documentation)
for **abdocooder@gmail.com**. GitHub Pages hosts static files; FormSubmit handles
email delivery.

1. Deploy the site, following [DEPLOYMENT.md](DEPLOYMENT.md).
2. Submit one message through the deployed contact form.
3. Open FormSubmit's activation email in **abdocooder@gmail.com** and confirm it.
   Check Spam if needed. This step requires access to your inbox.
4. Send another message and confirm it arrives. Reply should address the email
   entered by the visitor.

**Activation and real inbox delivery have not been performed or verified.**
Automated tests intercept the endpoint and never send actual email. The success
view means the service accepted the request, not proof of inbox delivery.

Optional: copy `.env.example` to `.env.local` and set `VITE_FORMSUBMIT_RECIPIENT`
to the opaque recipient identifier FormSubmit provides after activation. Rebuild.
For Actions, set a repository variable with the same name. These are public
build-time values; never put passwords or private API keys in the frontend.
The form links FormSubmit's privacy policy beside the submit button.

## Customize

| File | Purpose |
| --- | --- |
| `src/data.ts` | Identity, projects, skills, education, source links |
| `src/App.tsx` | Sections, navigation, theme, filters, project state |
| `src/styles.css` | Design tokens, palette, responsive layouts |
| `src/components/Architecture.tsx` | Interactive stack and project diagrams |
| `src/components/ProjectDialog.tsx` | Accessible project details |
| `src/components/ContactForm.tsx` | Contact form and request states |
| `src/contact.ts` | Validation and delivery integration |
| `index.html`, `public/` | Metadata, icon, social image, crawl metadata |
| `.github/workflows/deploy.yml` | Build, test, deploy to GitHub Pages |

The source portfolio repository contains no CV PDF or portrait, so no fabricated
CV link or placeholder headshot is included. Add your real files to `public/` if
needed. See [docs/CONTENT-SOURCES.md](docs/CONTENT-SOURCES.md) for content provenance.

## Verify

```sh
npx playwright install chromium
npm run build
npm test
```

Tests cover rendering, theme persistence, filters, architecture controls, direct
project links, keyboard focus, contact validation/pending/accepted/rejected/network
failure, mobile navigation, horizontal overflow, and automated WCAG AA checks in
both themes and the project dialog. All form submissions are intercepted.

On Linux CI, install browser dependencies with
`npx playwright install --with-deps chromium`. An existing Chromium binary can be
used with the optional `CHROMIUM_EXECUTABLE_PATH` environment variable.

Fonts: Manrope and IBM Plex Mono (SIL Open Font License). Interface icons: Lucide
(ISC). GitHub and LinkedIn marks belong to their respective owners and were
retained from the original portfolio. License copies are in `docs/licenses/`.
