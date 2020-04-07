const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));
app.set("view engine", "ejs");

var items = [];

app.get("/", (req, res) => {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  var currentDay = today.toLocaleDateString("en-US", options);
  res.render("list", {
    currentDay: currentDay,
    items: items,
  });
});

app.post("/", (req, res) => {
  var new_item = req.body.New_Item;
  items.push(new_item);
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
