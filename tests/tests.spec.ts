import { test, expect, Page, Locator } from '@playwright/test';
import testCases from '../test-cases.json';

test.beforeEach(async ({ page }) => {
  // Each test begins on the dashboard page
  await page.goto('https://animated-gingersnap-8cf7f2.netlify.app');
  await expect(page.getByRole('banner').getByText('Main web application')).toBeVisible();
});

test('Test Case 1', async ({ page }) => {
  // Find test case with id of 1 from imported JSON, then destructure to initialize and set variables
  const testCase = testCases.find(tc => tc.id === 1);
  if (!testCase) throw new Error('Test case with id 1 not found');
  const { column, title, tags } = testCase!;

  // Verify the presence of the given ticket
  const ticketDiv = await findTicket(page, column, title, tags);
  // Verify the presence of the given tags
  await findTags(ticketDiv, tags);
});

test('Test Case 2', async ({ page }) => {
  // Find test case with id of 2 from imported JSON, then destructure to initialize and set variables
  const testCase = testCases.find(tc => tc.id === 2);
  if (!testCase) throw new Error('Test case with id 2 not found');
  const { column, title, tags } = testCase!;

  // Verify the presence of the given ticket
  const ticketDiv = await findTicket(page, column, title, tags);
  // Verify the presence of the given tags
  await findTags(ticketDiv, tags);
});

test('Test Case 3', async ({ page }) => {
  // Find test case with id of 3 from imported JSON, then destructure to initialize and set variables
  const testCase = testCases.find(tc => tc.id === 3);
  if (!testCase) throw new Error('Test case with id 3 not found');
  const { column, title, tags } = testCase!;

  // Verify the presence of the given ticket
  const ticketDiv = await findTicket(page, column, title, tags);
  // Verify the presence of the given tags
  await findTags(ticketDiv, tags);
});

test('Test Case 4', async ({ page }) => {
  // Navigate to Mobile Application
  await navMobileApplication(page);

  // Find test case with id of 4 from imported JSON, then destructure to initialize and set variables
  const testCase = testCases.find(tc => tc.id === 4);
  if (!testCase) throw new Error('Test case with id 4 not found');
  const { column, title, tags } = testCase!;

  // Verify the presence of the given ticket
  const ticketDiv = await findTicket(page, column, title, tags);
  // Verify the presence of the given tags
  await findTags(ticketDiv, tags);
});

test('Test Case 5', async ({ page }) => {
  // Navigate to Mobile Application
  await navMobileApplication(page);

  // Find test case with id of 5 from imported JSON, then destructure to initialize and set variables
  const testCase = testCases.find(tc => tc.id === 5);
  if (!testCase) throw new Error('Test case with id 5 not found');
  const { column, title, tags } = testCase!;

  // Verify the presence of the given ticket
  const ticketDiv = await findTicket(page, column, title, tags);
  // Verify the presence of the given tags
  await findTags(ticketDiv, tags);
});

test('Test Case 6', async ({ page }) => {
  // Navigate to Mobile Application
  await navMobileApplication(page);

  // Find test case with id of 6 from imported JSON, then destructure to initialize and set variables
  const testCase = testCases.find(tc => tc.id === 6);
  if (!testCase) throw new Error('Test case with id 6 not found');
  const { column, title, tags } = testCase!;

  // Verify the presence of the given ticket
  const ticketDiv = await findTicket(page, column, title, tags);
  // Verify the presence of the given tags
  await findTags(ticketDiv, tags);
});

// ============================================================================
// FUNCTIONS ==================================================================
// ============================================================================

async function navMobileApplication(page: Page) {
  const heading = page.locator('h2', { hasText: 'Mobile Application' });
  await expect(heading).toBeVisible();
  heading.click();
  await expect(page.getByRole('banner').getByText('Native mobile app')).toBeVisible();
}

async function findTicket(page: Page, column: string, title: string, tags: string[]) {
  // Target column
  const col = page.getByRole('heading', { level: 2, name: column});
  // Get sibling div of col
  const colSibling = col.locator('xpath=following-sibling::div');
  // Get child divs within sibling
  const colItems = colSibling.locator('> div');

  // Count how many child divs there are
  const count = await colItems.count();
  console.log("Found " + count + " item(s) under column: " + column);

  // Initialize variables for below iteration
  let ticketDiv: Locator | undefined;
  let titleFoundFlag = false;

  // Find the ticket which has the given title by looping through items until found
  for (let i = 0; i < count; i++) {
    const h3 = colItems.nth(i).locator('h3');
    if (await h3.isVisible()) {
      const text = await h3.textContent();
      if (text?.includes(title)) {
        console.log(`Found ticket with title: "${title}"`);
        ticketDiv = colItems.nth(i);
        titleFoundFlag = true;
        break;
      }
    }
  }
  expect(titleFoundFlag).toBe(true);

  if (typeof ticketDiv === 'undefined') {
    throw new Error('ticketDiv undefined');
  }

  return (ticketDiv);
}

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