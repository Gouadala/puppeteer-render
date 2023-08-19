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
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();

    await page.goto("https://www.netflix.com/ma-en/login");
    await page.type('input[data-uia="login-field"]', email);
    await page.type('input[data-uia="password-field"]', password);

    await page.click('button[data-uia="login-submit-button"]');

    // Wait for potential error messages to appear
    const errorMessageSelector = 'div[data-uia="text"]';
    const loginButtonSelector = 'button[data-uia="login-submit-button"]';
    
    await Promise.race([
      page.waitForSelector(errorMessageSelector),
      page.waitForSelector(loginButtonSelector) // Wait for login button in case login is successful
    ]);

    // Check if an error message element exists
    const errorMessageElement = await page.$(errorMessageSelector);

    if (errorMessageElement) {
      const errorMessage = await errorMessageElement.evaluate(message => message.textContent);
      console.log(`Login failed: ${errorMessage}`);
      return `Login failed: ${errorMessage}`;
    } else {
      console.log("Login successful.");
      return "Login successful.";
    }
  } catch (e) {
    console.error(e);
    throw new Error(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeLogic };


