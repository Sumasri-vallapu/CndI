const puppeteer = require('puppeteer');
const path = require('path');

async function takeScreenshot() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });
  
  try {
    const page = await browser.newPage();
    
    // Set iPhone 12/13+ Pro dimensions
    await page.setViewport({
      width: 428,
      height: 926,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true
    });
    
    // Load the test HTML file
    const htmlPath = path.join(__dirname, 'test-home-styling.html');
    await page.goto(`file://${htmlPath}`, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Take screenshot
    const screenshotPath = path.join(__dirname, 'home-mobile-test.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    
    console.log(`Screenshot saved to: ${screenshotPath}`);
    
    // Check button styling
    const buttonAnalysis = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => {
        const computedStyle = window.getComputedStyle(btn);
        const rect = btn.getBoundingClientRect();
        return {
          index,
          text: btn.textContent.trim(),
          border: computedStyle.border,
          borderWidth: computedStyle.borderWidth,
          borderStyle: computedStyle.borderStyle,
          borderColor: computedStyle.borderColor,
          padding: computedStyle.padding,
          borderRadius: computedStyle.borderRadius,
          width: rect.width,
          height: rect.height,
          backgroundColor: computedStyle.backgroundColor
        };
      });
    });
    
    console.log('Button Analysis:');
    buttonAnalysis.forEach((btn, i) => {
      console.log(`\nButton ${i + 1} (${btn.text}):`);
      console.log(`  Border: ${btn.border}`);
      console.log(`  Border Width: ${btn.borderWidth}`);
      console.log(`  Border Style: ${btn.borderStyle}`);
      console.log(`  Border Color: ${btn.borderColor}`);
      console.log(`  Padding: ${btn.padding}`);
      console.log(`  Border Radius: ${btn.borderRadius}`);
      console.log(`  Dimensions: ${btn.width}x${btn.height}`);
      console.log(`  Background: ${btn.backgroundColor}`);
    });
    
    // Wait a moment to see the page
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshot();