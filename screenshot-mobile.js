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
    
    // Navigate to the development server
    await page.goto('http://localhost:5173', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Take screenshot
    const screenshotPath = path.join(__dirname, 'home-mobile-screenshot.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    
    console.log(`Screenshot saved to: ${screenshotPath}`);
    
    // Check for button elements and their styles
    const buttonStyles = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, index) => {
        const computedStyle = window.getComputedStyle(btn);
        return {
          index,
          text: btn.textContent.trim(),
          border: computedStyle.border,
          borderWidth: computedStyle.borderWidth,
          borderStyle: computedStyle.borderStyle,
          borderColor: computedStyle.borderColor,
          padding: computedStyle.padding,
          borderRadius: computedStyle.borderRadius
        };
      });
    });
    
    console.log('Button styles:', JSON.stringify(buttonStyles, null, 2));
    
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshot();