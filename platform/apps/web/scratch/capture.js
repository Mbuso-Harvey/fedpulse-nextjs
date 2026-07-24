const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const baseUrl = 'http://localhost:3000';
  
  // Array of pages to capture
  const pages = [
    { name: 'landing', url: baseUrl },
    { name: 'login', url: `${baseUrl}/login` },
    { name: 'dashboard', url: `${baseUrl}/dashboard` },
    { name: 'opportunities', url: `${baseUrl}/dashboard/opportunities` }
  ];

  for (const p of pages) {
    console.log(`Capturing ${p.name}...`);
    try {
      await page.goto(p.url, { waitUntil: 'networkidle' });
      // Wait a bit extra for any CSS animations to settle
      await page.waitForTimeout(2000); 
      await page.screenshot({ path: `${p.name}.png`, fullPage: true });
    } catch (e) {
      console.error(`Failed to capture ${p.name}: ${e.message}`);
    }
  }

  await browser.close();
  console.log('Screenshots complete.');
})();
