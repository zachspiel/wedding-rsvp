import { expect, test } from "@playwright/test";

test("Page is loaded", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Spielberger Wedding 2024/);
});

test("RSVP search does not return any guests for invalid name", async ({ page }) => {
  await page.goto("/");

  const rsvpSearchbar = page.getByPlaceholder("Enter your first and last name");

  const requestPromise = page.waitForRequest("/api/searchResult*");

  await rsvpSearchbar.fill("First Last");
  await rsvpSearchbar.press("Enter");

  await requestPromise;

  await expect(page.getByTestId("search-error-text")).toHaveText(
    "Hm... we can't find your name. Make sure you enter your name exactly as it appears on your invitation."
  );
});

test("RSVP search returns groups for valid name", async ({ page }) => {
  await page.goto("/");

  const rsvpSearchbar = page.getByPlaceholder("Enter your first and last name");

  const requestPromise = page.waitForRequest("/api/searchResult*");

  await rsvpSearchbar.fill("Test Last");
  await rsvpSearchbar.press("Enter");

  await requestPromise;

  expect(page.getByTestId("search-error-text")).toHaveCount(0);
  expect(page.getByTestId("search-result-row")).toHaveCount(1);
  expect(page.getByTestId("search-result-row")).toHaveText("Test Last");
});
