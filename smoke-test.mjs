import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8765';
const errors = [];
const checks = [];

async function check(name, ok) {
  checks.push([name, ok]);
  if (!ok) console.log(`  (failed: ${name})`);
}

function normalizePhonetic(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function openWord(page, categoryId, ariaLabel) {
  const toggle = page.locator(`button[data-category="${categoryId}"]`);
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
    await toggle.click();
  }
  await page.waitForSelector(`#${categoryId}-grid button`, { timeout: 5000, state: 'visible' });
  await page.locator(`#${categoryId}-grid button[aria-label="${ariaLabel}"]`).click();
  await page.waitForSelector('#result-view:not(.is-hidden)', { timeout: 5000 });
}

async function enPhonetic(page) {
  const row = page.locator('.translation-row').filter({ has: page.locator('.language-font-en') });
  return (await row.locator('.phonetic').textContent())?.trim() ?? '';
}

async function checkEnPhoneticDiffers(page, word) {
  const phonetic = await enPhonetic(page);
  const ok = normalizePhonetic(phonetic) !== normalizePhonetic(word);
  await check(`${word} EN phonetic differs from word (${phonetic})`, ok);
}

async function closeResult(page) {
  await page.click('#close-result-button');
  await page.waitForFunction(() => document.getElementById('result-overlay').classList.contains('is-hidden'));
}

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error' && !/favicon\.ico|404 \(File not found\)/i.test(text)) {
      errors.push(`console: ${text}`);
    }
  });
  page.on('requestfailed', (req) => {
    if (!/favicon\.ico/i.test(req.url())) errors.push(`request failed: ${req.url()}`);
  });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await check('page loads', (await page.title()) === 'Alle Talen Thuis');

  const categoriesRendered = await page.locator('.emoji-category').count();
  await check('emoji categories render', categoriesRendered === 7);

  const wordButtons = await page.locator('.emoji-grid button').count();
  await check('emoji word buttons render', wordButtons > 500);

  const jaRow = page.locator('.translation-row').filter({ has: page.locator('.language-font-ja') });

  await openWord(page, 'emoji-activities', 'wind chime');
  const jaPhonetic = await jaRow.locator('.phonetic').textContent();
  await check('wind chime Japanese phonetic is romaji', jaPhonetic?.trim() === 'fūrin');
  await closeResult(page);

  await openWord(page, 'emoji-travel-places', 'hospital');
  const hospitalPhonetic = await jaRow.locator('.phonetic').textContent();
  await check('hospital Japanese phonetic is romaji', hospitalPhonetic?.trim() === 'byōin');
  await closeResult(page);

  await openWord(page, 'emoji-smileys-emotion', 'person fencing');
  const fencingPhonetic = await jaRow.locator('.phonetic').textContent();
  await check('person fencing Japanese phonetic is romaji', fencingPhonetic?.trim() === 'fenshingu suru hito');
  await closeResult(page);

  await openWord(page, 'emoji-nature', 'fog');
  await checkEnPhoneticDiffers(page, 'fog');
  await closeResult(page);

  await openWord(page, 'emoji-activities', 'drum');
  await checkEnPhoneticDiffers(page, 'drum');
  await closeResult(page);

  await openWord(page, 'emoji-travel-places', 'tent');
  await checkEnPhoneticDiffers(page, 'tent');
  await closeResult(page);

  await openWord(page, 'emoji-objects', 'ring');
  await checkEnPhoneticDiffers(page, 'ring');
  await closeResult(page);

  await openWord(page, 'emoji-smileys-emotion', 'foot');
  await checkEnPhoneticDiffers(page, 'foot');
  await closeResult(page);

  await openWord(page, 'emoji-smileys-emotion', 'leg');
  await checkEnPhoneticDiffers(page, 'leg');
  await closeResult(page);

  const hasTripleQuestion = await page.evaluate(() => document.body.innerText.includes('???'));
  await check('no ??? shown in UI', !hasTripleQuestion);

  await browser.close();

  console.log('\n=== Browser Smoke Test ===\n');
  let failed = 0;
  for (const [name, ok] of checks) {
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
    if (!ok) failed++;
  }
  if (errors.length) {
    console.log('\nJS errors:');
    errors.forEach((e) => console.log(`  - ${e}`));
    failed++;
  } else {
    console.log('\nNo JS errors detected.');
  }
  console.log(failed ? `\n${failed} issue(s) found.` : '\nAll checks passed.');
  process.exit(failed ? 1 : 0);
}

run().catch((err) => {
  console.error('Smoke test crashed:', err);
  process.exit(1);
});