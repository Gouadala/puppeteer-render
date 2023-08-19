const express = require("express");
const { scrapeLogic, checker,captureScreenshot } = require("./scrapeLogic"); 
const app = express();

const PORT = process.env.PORT || 4000;
// Add the body parsing middleware here
app.use(express.json());

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.post("/check", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await checker(email, password);
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while checking credentials.' });
  }
});

app.post("/capture", async (req, res) => {
  const { url } = req.body;

  try {
    const screenshotData = await captureScreenshot(url);
    const htmlResponse = `
      <html>
      <body>
        <h1>Screenshot</h1>
        <img src="data:image/png;base64,${screenshotData}" />
      </body>
      </html>
    `;
    res.send(htmlResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while capturing the screenshot.' });
  }
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
