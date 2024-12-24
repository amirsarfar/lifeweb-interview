const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
  })
);

app.get("/api/blog_posts", (_, res) => {
  const data = fs.readFileSync(path.join(__dirname, "data.json"), "utf8");
  const parsedData = JSON.parse(data);
  res.send(parsedData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
