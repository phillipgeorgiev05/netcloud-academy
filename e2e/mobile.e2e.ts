// Prüft bei 375 px Breite, dass keine Seite horizontal überläuft. Läuft im Testmodus (alle Level offen, eigener Speicher).
import { expect, test, type Page } from '@playwright/test';

const DEV = '/?dev=unlock-all#';

async function overflow(page: Page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const wide = [...document.querySelectorAll('main *')]
      .filter((e) => e.getBoundingClientRect().right > vw + 1 && !e.closest('.overflow-x-auto, pre'))
      .map((e) => `${e.tagName}: ${(e.textContent ?? '').slice(0, 40)}`);
    return { scroll: document.documentElement.scrollWidth, vw, wide: wide.slice(0, 3) };
  });
}

test('Werkzeug-Seiten passen auf 375 px', async ({ page }) => {
  for (const path of ['/', '/review', '/profile', '/tools', '/trainer', '/exam', '/glossary', '/decide', '/desk', '/sheet/net-04', '/sheet/cloud-03']) {
    await page.goto(DEV + path);
    await page.waitForSelector('main');
    const o = await overflow(page);
    expect(o.scroll, `${path}: ${o.wide.join(' | ')}`).toBeLessThanOrEqual(o.vw);
  }
});

test('alle Lektionen passen auf 375 px', async ({ page }) => {
  test.setTimeout(600_000);
  await page.goto(DEV + '/');
  const hrefs = [...new Set(await page.locator('a[href^="#/level/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!)))];
  expect(hrefs.length).toBeGreaterThan(5);
  for (const href of hrefs) {
    await page.goto('/?dev=unlock-all' + href);
    await page.getByRole('button', { name: /1\. Lektion/ }).click();
    await page.waitForSelector('main section');
    const o = await overflow(page);
    expect(o.scroll, `${href}: ${o.wide.join(' | ')}`).toBeLessThanOrEqual(o.vw);
  }
});
