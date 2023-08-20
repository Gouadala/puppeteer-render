const puppeteer = require("puppeteer");

require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.goto("https://www.netflix.com/ma-en/login");

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

   // Take a screenshot and convert to base64
   const screenshotBuffer = await page.screenshot();
   const screenshotBase64 = screenshotBuffer.toString("base64");

   // Create an HTML response with the screenshot image
   const htmlResponse = `
     <html>
     <body>
       <h1>Screenshot</h1>
       <img src="data:image/png;base64,${screenshotBase64}" />
     </body>
     </html>
   `;
    
    res.send(htmlResponse);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};


async function checker(email, password) {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();

    await page.goto("https://www.netflix.com/ma-en/login");
    await page.type('input[data-uia="login-field"]', email);
    await page.type('input[data-uia="password-field"]', password);
    await page.click('button[data-uia="login-submit-button"]');

    await Promise.race([
      page.waitForSelector('div[data-uia="text"]'),
      page.waitForSelector('button[data-uia="login-submit-button"]')
    ]);

    const errorMessageElement = await page.$('div[data-uia="text"]');

    if (errorMessageElement) {
      const errorMessage = await errorMessageElement.evaluate(message => message.textContent);
      return `Login failed: ${errorMessage}`;
    } else {
      return "Login successful.";
    }
  } catch (e) {
    console.error(e);
    throw new Error(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};




async function captureScreenshot(url) {
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
     
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();
    await page.goto(url);

    const screenshotBuffer = await page.screenshot({ fullPage: true });
    const screenshotBase64 = screenshotBuffer.toString("base64");

    return screenshotBase64;
  } catch (e) {
    console.error(e);
    throw new Error(`Something went wrong while capturing the screenshot: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = {
  scrapeLogic,
  checker,
  captureScreenshot
};


