const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const csvFilePath = path.resolve(__dirname, 'IT23685284.csv');
const csvData = fs.readFileSync(csvFilePath, 'utf8');

// 🔴 IMPORTANT: header = false
const parsed = Papa.parse(csvData, {
  header: false,
  skipEmptyLines: true
});

const rows = parsed.data;

// Skip header rows manually
rows.slice(1).forEach((cols, index) => {
  const tcId = cols[0];
  const name = cols[1];
  const input = cols[3];
  const expected = cols[4];

  if (!tcId || !tcId.toLowerCase().includes('fun')) return;

  test(`${tcId} - ${name || 'Functional Test ' + index}`, async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/');

    const inputBox = page.getByRole('textbox', {
      name: 'Input Your Singlish Text Here.'
    });

    await inputBox.fill(input);

    const sinhalaOutput = page
      .getByText('Sinhala', { exact: true })
      .locator('xpath=following-sibling::div[1]');

    await expect(sinhalaOutput).not.toBeEmpty({ timeout: 20000 });

    const actual = (await sinhalaOutput.textContent())
      .replace(/\s+/g, ' ')
      .trim();

    const expectedClean = expected
      .replace(/\s+/g, ' ')
      .trim();

    expect(actual).toBe(expectedClean);
  });
});
