# Verification

13 September 2026

- Production build: passed (`tsc -b && vite build`).
- Browser suite: **14 tests passed**, Chromium 153, against production output.
- Responsive widths: 320, 390, 768, 1024, 1440px; no page-level horizontal overflow.
- Axe WCAG 2 A/AA and WCAG 2.1 AA automated checks: no violations in light theme,
  dark theme, or the open Webserv dialog. This is an automated check, not a claim
  of a comprehensive accessibility certification.
- Checked desktop light/dark and mobile screenshots. Corrected diagram-label
  contrast and explicitly contained Tab/Shift-Tab focus in project dialogs.
- Form tests used intercepted network responses only; no real emails were sent.
  Validated field errors, pending state, expected payload, accepted request,
  provider rejection, network failure, retry availability, and retained drafts.
- Email activation, inbox delivery, and a live GitHub Pages deployment remain
  owner-side checks. This ZIP was not pushed or deployed to the live repository.

Tests can be reproduced with the commands in README.md. Source and application
artifacts contain no credentials, tracking scripts, or remote font dependencies.
