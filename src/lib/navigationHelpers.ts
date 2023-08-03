/**
 * Useful for clicking a link and following the navigation.
 * Runs a promise chain the simultaneously clicks the link
 * and waits for the page to load.
 *
 * - Resolves with the page upon success.
 * @param page The puppeteer page to use.
 * @param linkElementHandle The puppeteer element handle to click.
 *
 * @throws LinkNotFoundError If the link does not exist.
 * @throws LinkNotClickableError If the link is not clickable.
 * @throws PageNotLoadedError If the page does not load.
 */
import { ElementHandle, Page } from 'puppeteer';

export async function followLink(
  page: Page,
  linkElementHandle: ElementHandle | null,
) {
  // Run the promise chain
  if (!linkElementHandle || linkElementHandle === null) {
    throw new LinkNotFoundError();
  }
  linkElementHandle = linkElementHandle as ElementHandle;

  const href = await linkElementHandle.evaluate((node) => node.getAttribute('href'));
  if (!href) {
    throw new LinkNotFoundError();
  }

  // Delay for a bit
  await page.waitForTimeout(Math.random() * 2000);

  await Promise.all([
    // Wait for the page to load
    page.waitForNavigation({
      waitUntil: 'load',
    }).catch(() => {
      throw new PageNotLoadedError();
    }),
    // Click the link
    linkElementHandle.click({
      delay: 200 + Math.random() * 200,
    }).catch(() => {
      throw new LinkNotClickableError();
    }),
  ]);

  // Delay for a bit
  await page.waitForTimeout(Math.random() * 2000);

  return page;
}

export class LinkNotFoundError extends Error {
  constructor() {
    super('Link not found');
  }
}

export class LinkNotClickableError extends Error {
  constructor() {
    super('Link not clickable');
  }
}

export class PageNotLoadedError extends Error {
  constructor() {
    super('Page not loaded');
  }
}
