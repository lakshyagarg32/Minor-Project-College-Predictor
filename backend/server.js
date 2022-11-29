const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const csv = require("csv-parser");
const fs = require("fs");

const results = [];

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data));

app.use(bodyParser.json());

app.post("/api/test", (req, res) => {
  const ans = [];
  const rank = req.body.rank;
  const gender = req.body.gender;
  const category = req.body.category;
  const domicile_state = req.body.domicile_state;
  for (let i = 0; i < results.length; i++) {
    if (
      (gender == "Male" || gender == "Other") &&
      results[i].gender == "Gender-Neutral" &&
      results[i].category == category &&
      Number(results[i].closing_rank) >= Number(rank) &&
      (results[i].quota == "OS" || results[i].state == domicile_state)
    ) {
      ans.push(results[i]);
    } else if (
      gender == "Female" &&
      results[i].category == category &&
      Number(results[i].closing_rank) >= Number(rank) &&
      (results[i].quota == "OS" || results[i].state == domicile_state)
    ) {
      ans.push(results[i]);
    }
  }
  ans.sort(function(a,b){return a.closing_rank-b.closing_rank});
  res.json({
    Rank: rank,
    Gender: gender,
    Category: category,
    Domicile_state: domicile_state,
    Result:ans
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
