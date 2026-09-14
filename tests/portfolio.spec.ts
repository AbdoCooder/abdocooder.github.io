import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function fillContact(p: Page) {
  await p.getByLabel("Your name", { exact: true }).fill("Portfolio Test");
  await p.getByLabel("Email address", { exact: true }).fill("test@example.com");
  await p.getByLabel("Subject", { exact: true }).fill("Engineering internship");
  await p
    .getByLabel("Your message", { exact: true })
    .fill("This is an intercepted browser test. No email is sent.");
}
test.beforeEach(async ({ page }) => {
  await page.route("https://formsubmit.co/**", (r) =>
    r.fulfill({
      status: 503,
      contentType: "application/json",
      body: '{"success":false}',
    }),
  );
  await page.goto("/");
});
test("renders all sections without JavaScript errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Good software.",
  );
  await expect(page.locator(".project-card")).toHaveCount(4);
  await expect(
    page.getByRole("heading", { name: "Send a message" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("theme persists across reload", async ({ page }) => {
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
test("filters show matching projects", async ({ page }) => {
  await page
    .locator(".filters")
    .getByRole("button", { name: "Systems" })
    .click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await page
    .locator(".filters")
    .getByRole("button", { name: "Infrastructure" })
    .click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card h3")).toHaveText("Inception");
  await page
    .locator(".filters")
    .getByRole("button", { name: "All work" })
    .click();
  await expect(page.locator(".project-card")).toHaveCount(4);
});
test("architecture controls link to matching project", async ({ page }) => {
  await page
    .locator(".architecture-tabs")
    .getByRole("button", { name: "Backend" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Make the pieces work together." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explore backend project" }).click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { level: 2 }),
  ).toHaveText("Distributed Task Manager");
});
test("dialog keyboard focus and Escape", async ({ page }) => {
  const opener = page.getByRole("button", { name: "Read Webserv case study" });
  await opener.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close project details" }),
  ).toBeFocused();
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement?.closest("dialog")),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(opener).toBeFocused();
});
test("direct project link survives reload", async ({ page }) => {
  await page.goto("/#project/minishell");
  await expect(
    page.getByRole("dialog").getByRole("heading", { level: 2 }),
  ).toHaveText("Minishell");
  await page.reload();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close project details" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("invalid contact input never submits", async ({ page }) => {
  let requests = 0;
  page.on("request", (r) => {
    if (r.url().includes("formsubmit.co")) requests++;
  });
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByLabel("Your name", { exact: true })).toBeFocused();
  expect(requests).toBe(0);
});
test("contact pending and accepted states with correct payload", async ({
  page,
}) => {
  let payload: Record<string, string> = {};
  let release: (() => void) | undefined;
  await page.route("https://formsubmit.co/**", async (r) => {
    payload = r.request().postDataJSON();
    await new Promise<void>((resolve) => {
      release = resolve;
    });
    await r.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"success":"true"}',
    });
  });
  await fillContact(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  await expect.poll(() => Boolean(release)).toBe(true);
  release!();
  await expect(
    page.getByRole("heading", { name: "Thanks for reaching out." }),
  ).toBeVisible();
  expect(payload.email).toBe("test@example.com");
  expect(payload._subject).toBe("Portfolio: Engineering internship");
  await page.getByRole("button", { name: "Write another message" }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
});
test("provider rejection retains draft and permits retry", async ({ page }) => {
  await page.route("https://formsubmit.co/**", (r) =>
    r.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"success":"false"}',
    }),
  );
  await fillContact(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("could not be submitted");
  await expect(page.getByLabel("Your message", { exact: true })).toHaveValue(
    /intercepted browser test/,
  );
  await expect(
    page.getByRole("button", { name: "Send message", exact: true }),
  ).toBeEnabled();
});
test("network failure does not report success", async ({ page }) => {
  await page.route("https://formsubmit.co/**", (r) => r.abort());
  await fillContact(page);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Thanks for reaching out." }),
  ).not.toBeVisible();
});
test("mobile menu navigation and Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const button = page.locator(".menu-toggle");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#contact/);
});
test("no horizontal overflow at phone tablet and desktop widths", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}px`,
    ).toBe(true);
  }
});
test("light and dark WCAG AA automated checks", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    if (theme === "dark")
      await page.getByRole("button", { name: "Switch to dark theme" }).click();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
  }
});
test("dialog automated accessibility checks", async ({ page }) => {
  await page.getByRole("button", { name: "Read Webserv case study" }).click();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations,
    JSON.stringify(results.violations, null, 2),
  ).toEqual([]);
});
