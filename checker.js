const puppeteer = require("puppeteer");
require("dotenv").config();


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

  // Wait for the error message to appear
  await page.waitForSelector('div[data-uia="text"]');

  // Get the error message content
  const errorMessage = await page.$eval('div[data-uia="text"]', message => message.textContent);

  if (errorMessage.includes('Incorrect password.')) {
    console.log('Login failed. Incorrect password.');
    res.send("Login failed. Incorrect password.");
  } else {
    console.log('Login successful.');
    res.send("Login successful.");
  }


} catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { checker };


