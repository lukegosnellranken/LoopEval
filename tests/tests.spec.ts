import { test, expect, Page, Locator } from '@playwright/test';
import testCases from '../test-cases.json';

/**
 * -----------------------------------------------------------------------------
 * CONFIG & SETUP
 * -----------------------------------------------------------------------------
 */

// Separate test cases for different application views
const mainAppTestCases = testCases.filter(tc => tc.id <= 3);
const mobileAppTestCases = testCases.filter(tc => tc.id > 3);

test.beforeEach(async ({ page }) => {
  // Each test begins on the dashboard page
  await page.goto('https://animated-gingersnap-8cf7f2.netlify.app');
  await expect(page.getByRole('banner').getByText('Main web application')).toBeVisible();
});

/**
 * -----------------------------------------------------------------------------
 * TEST SUITES
 * -----------------------------------------------------------------------------
 */

// Test suite for the main web application
test.describe('Main Web Application', () => {
  for (const testCase of mainAppTestCases) {
    test(`should find "${testCase.title}" in the "${testCase.column}" column`, async ({ page }) => {
      const { column, title, tags } = testCase;
      const ticketDiv = await findTicket(page, column, title);
      await findTags(ticketDiv, tags);
    });
  }
});

// Test suite for the mobile application view
test.describe('Mobile Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the mobile application view before each test in this suite
    await navMobileApplication(page);
  });

  for (const testCase of mobileAppTestCases) {
    test(`should find "${testCase.title}" in the "${testCase.column}" column`, async ({ page }) => {
      const { column, title, tags } = testCase;
      const ticketDiv = await findTicket(page, column, title);
      await findTags(ticketDiv, tags);
    });
  }
});

/**
 * -----------------------------------------------------------------------------
 * HELPER FUNCTIONS
 * -----------------------------------------------------------------------------
 */

/**
 * Navigates to the Mobile Application view.
 * @param page - The Playwright Page object.
 */
async function navMobileApplication(page: Page) {
  const heading = page.getByRole('heading', { name: 'Mobile Application' });
  await expect(heading).toBeVisible();
  await heading.click();
  await expect(page.getByRole('banner').getByText('Native mobile app')).toBeVisible();
}

/**
 * Finds a ticket element based on its column and title using a robust locator
 * strategy that mirrors the original logic without manual looping.
 * @param page - The Playwright Page object.
 * @param column - The name of the column the ticket is in (e.g., "To Do").
 * @param title - The title of the ticket.
 * @returns A Playwright Locator for the ticket's container div.
 */
async function findTicket(page: Page, column: string, title: string): Promise<Locator> {
  // Locate the column heading to anchor our search
  const columnHeading = page.getByRole('heading', { name: column, level: 2 });

  // Get the column's container (the following sibling div)
  const columnContainer = columnHeading.locator('xpath=following-sibling::div');
  
  // Within that container, find the specific ticket by its title.
  // We assume the title is in an `h3` element.
  const ticketLocator = columnContainer.locator('div', { has: page.locator('h3', { hasText: title }) });

  // Let Playwright's auto-waiting handle the assertion.
  await expect(ticketLocator).toBeVisible();
  console.log(`Found ticket with title: "${title}" in column: "${column}"`);

  return ticketLocator;
}

/**
 * Verifies that all expected tags are visible within a given ticket locator.
 * @param ticketDiv - The Playwright Locator for the ticket's container.
 * @param tags - An array of strings representing the tags to find.
 */
async function findTags(ticketDiv: Locator, tags: string[]) {
  // Target the tags div
  const tagsDiv = ticketDiv!.locator('> div:has(span)');
  // Target the children (span elements) of tagsDiv
  const tagsDivChildren = tagsDiv.locator('> span');
  // Count how many child spans there are
  const numberOfTags = await tagsDivChildren.count();
  console.log("Number of tags: " + numberOfTags);

  // Initialize variables for below iteration
  let tagsFound = 0;

  // Verify the existence of all given tags
  for (const tag of tags) {
    const tagLocator = tagsDivChildren.getByText(tag);
    if (!(await tagLocator.isVisible())) {
      console.log(`Could not find tag "${tag}".`);
    } else {
      tagsFound++;
      console.log(`Found tag: ${tag}`);
    }
  }
  console.log(`Number of tags expected: ${numberOfTags}, number of tags found: ${tagsFound}`);
  expect(tagsFound).toBe(numberOfTags);
}
