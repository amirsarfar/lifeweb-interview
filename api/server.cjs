const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { isBefore, isAfter, subDays, addDays } = require("date-fns");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
  })
);

app.get("/api/blog_posts", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "data.json"), "utf8");
  if (req.query.error) throw new Error("Unexpected Error!");
  const parsedData = JSON.parse(data).filter(
    (item) =>
      (!req.query.q?.trim() ||
        item.title.includes(req.query.q.trim()) ||
        item.content.includes(req.query.q.trim())) &&
      (!req.query.fromDate ||
        isBefore(
          subDays(new Date(req.query.fromDate), 1),
          new Date(item.published_at)
        )) &&
      (!req.query.toDate ||
        isAfter(
          addDays(new Date(req.query.toDate), 1),
          new Date(item.published_at)
        ))
  );
  res.send(parsedData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
