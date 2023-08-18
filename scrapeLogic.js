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

    await page.goto("https://developer.chrome.com/");

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

module.exports = { scrapeLogic };


