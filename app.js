const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));
app.set("view engine", "ejs");

// Generating The current day

var today = new Date();
var options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
var currentDay = today.toLocaleDateString("en-US", options);

// Mongo Db Connection Established
mongoose.connect("mongodb+srv://admin-ritwik:qxZGWsWABjSEwyiZ@cluster0-ffzsg.gcp.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Creating Database Schema
const itemSchema = {
  name: {
    type: String,
    required: true,
  },
};

const listSchema = {
  name: String,
  items: [itemSchema],
};

// Creating Database Model
const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
  Item.find({}, function (err, items) {
    res.render("list", {
      pageTitle: "Main List",
      currentDay: currentDay,
      items: items,
    });
  });
});

// Creating Dynamic Route

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: [
          {
            name: "buy food",
          },
          {
            name: "cook food",
          },
          {
            name: "eat food",
          },
        ],
      });
      list.save();
      res.redirect("/" + customListName);
    } else {
      res.render("list", {
        pageTitle: customListName,
        currentDay: currentDay,
        items: foundList.items,
      });
    }
  });
});

app.post("/", (req, res) => {
  var new_item = req.body.New_Item;
  var new_list = req.body.list;

  const item = new Item({
    name: new_item,
  });

  if (new_list === "Main List") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: new_list }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + new_list);
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Main List") {
    Item.findByIdAndRemove({ _id: checkedItem }, function (err) {
      if (!err) {
        res.redirect("/");
      } else {
        console.log(err);
        res.redirect("/");
      }
    });
  } else {

    List.findOneAndUpdate({name: listName},{$pull:{items: {_id: checkedItem}}},function (err, foundList) { 

      if (!err) {
        res.redirect('/'+ listName);
      } else {
        console.log(err);
        
      }

     })
    
  }

});

let port = process.env.PORT;
if (port == nul || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log(`Server started on port ${port}.`);
});
