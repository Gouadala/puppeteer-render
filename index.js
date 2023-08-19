const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const { checker } = require("./checker");
const app = express();

const PORT = process.env.PORT || 4000;

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

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
