const mongoose = require("mongoose");

const dbUtility = function () {
  mongoose.connect(process.env.DB_HOST + process.env.DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  const itemsSchema = {
    name: String,
  };

  const Item = mongoose.model("item", itemsSchema);

  const item1 = new Item({
    name: "Welcome to your todoList!",
  });
  const item2 = new Item({
    name: "Hit the + button to add a new item.",
  });
  const item3 = new Item({
    name: "<-- Hit this to delete an item.",
  });

  const defaultItems = [item1, item2, item3];

  const listSchema = {
    name: String,
    items: [itemsSchema],
  };

  const List = mongoose.model("list", listSchema);

  const findAllTasks = async function () {
    try {
      return await Item.find({});
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  const addDefaultTasks = async function () {
    return await Item.insertMany(defaultItems);
  };
  const findList = async function (listName) {
    return await List.findOne({ name: listName });
  };
  const addNewList = function (listName) {
    const newList = new List({
      name: listName,
      items: defaultItems,
    });
    newList.save();
  };
  const findItemByIdAndRemove = async function (id) {
    return await Item.findByIdAndRemove(id, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfuly removed!");
      }
    });
  };

  const findListAndRemoveItem = async function (listName, itemId) {
    try {
      const foundList = await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: itemId } } }
      );
      return foundList;
    } catch (e) {
      console.log(e);
    }
  };
  const saveTask = function () {
    const item = new Item({
      name: newItem,
    });
    item.save();
  };
  const findListAndSaveTask = async function (listName, newItem) {
    const item = new Item({
      name: newItem,
    });
    const foundList = await List.findOne({ name: listName });
    foundList.items.push(item);
    foundList.save();
    return foundList;
  };

  return {
    findAllTasks: findAllTasks,
    addDefaultTasks: addDefaultTasks,
    findList: findList,
    addNewList: addNewList,
    saveTask: saveTask,
    findListAndSaveTask: findListAndSaveTask,
    findItemByIdAndRemove: findItemByIdAndRemove,
    findListAndRemoveItem: findListAndRemoveItem,
  };
};

module.exports = dbUtility();
