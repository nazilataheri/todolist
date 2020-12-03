const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const dbUtility = require("./dbUtility");
const serverRender = require("./serverRender");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async function (req, res) {
  const initialContent = serverRender();
  const allTasks = await dbUtility.findAllTasks();

  if (allTasks.length === 0) {
    await dbUtitlity.addDefaultTasks();
    res.redirect("/");
  } else {
    res.render("list", {
      listTitle: "Today",
      newListItems: allTasks,
      initialContent,
    });
  }
});

app.get("/:customListName", async function (req, res) {
  const initialContent = serverRender();
  const customListName = _.capitalize(req.params.customListName);
  const foundList = await dbUtility.findList(customListName);
  if (!foundList) {
    dbUtility.addNewList(customListName);
    res.redirect("/" + customListName);
  } else {
    //console.log("List Exists!");
    res.render("list", {
      listTitle: foundList.name,
      newListItems: foundList.items,
      initialContent,
    });
  }
});

app.post("/", async function (req, res) {
  const newItem = req.body.newItem;
  const listName = req.body.list;

  if (listName === "Today") {
    dbUtility.saveTask(newItem);

    res.redirect("/");
  } else {
    const foundList = await dbUtility.findListAndSaveTask(listName, newItem);
    res.redirect("/" + foundList.name);
  }
});

app.post("/delete", async function (req, res) {
  const checkedItemId = req.body.doneItem;
  const listName = req.body.listName;
  // console.log(req.body.listName);
  if (listName === "Today") {
    await dbUtility.findItemByIdAndRemove(checkedItemId);
    res.redirect("/");
  } else {
    const foundList = await dbUtility.findListAndRemoveItem(
      listName,
      checkedItemId
    );
    res.redirect("/" + foundList.name);
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
