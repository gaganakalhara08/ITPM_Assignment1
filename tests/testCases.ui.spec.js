const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const csvFilePath = path.resolve(__dirname, 'IT23685284.csv');
const csvData = fs.readFileSync(csvFilePath, 'utf8');

const parsed = Papa.parse(csvData, {
  header: false,
  skipEmptyLines: true
});

const rows = parsed.data;

rows.slice(1).forEach((cols, index) => {
  const tcId = cols[0];
  const name = cols[1];
  const input = cols[3];

  if (!tcId || !tcId.toLowerCase().includes('ui')) return;

  test(`${tcId} - ${name || 'UI Test ' + index}`, async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/');

    const inputBox = page.getByRole('textbox', {
      name: 'Input Your Singlish Text Here.'
    });

    if (input) {
      await inputBox.fill(input);
    }

    const sinhalaLabel = page.getByText('Sinhala', { exact: true });
    await expect(sinhalaLabel).toBeVisible();

    await expect(inputBox).toBeVisible();
  });
});
