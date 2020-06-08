const express = require("express");
const bodyParser = require("body-parser");

// local date module to get the date 
const date = require(__dirname + "/date.js");


//-----------------------     MONGO DB   --------------------------------------------

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todolist", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
    name: String
});

const item = mongoose.model('item', itemSchema);

const workItem = mongoose.model('workItem', itemSchema);

const item1 = new item({
    name: "Welcome to to-do-list"
});

const item2 = new item({
    name: "use + to add items"
});


//-----------------------     MONGO DB   --------------------------------------------


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));





app.get("/", function (req, res) {

    item.find({}, function (err, items) {
        if (items.length === 0) {
            item.insertMany([item1, item2], function (err) {
                if (err) {
                    console.log("error");
                }
                else {
                    console.log("success")
                }
            });
            res.redirect("/");
        }
        else {
            const day = date.getDate();
            res.render("index", { day: day, add: items })
        }


    });


    ;
});

app.post("/", function (req, res) {

    if (req.body.type === "work") {
        const newItem = req.body.listAdd;

        const newData = new workItem({
            name: newItem
        });

        newData.save();

        res.redirect("/work")
    }
    else {
        const add = req.body.listAdd;

        const newitem = new item({
            name: add
        })

        newitem.save();

        res.redirect("/");
    }

});


app.post("/delete", function (req, res) {
    const itemId = req.body.checkbox;

    item.findByIdAndDelete(itemId, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Deleted");
        }
    });
res.redirect("/");
});

app.get("/work", function (req, res) {
    workItem.find({}, function (err, workitems) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(workitems);
            res.render("index", { day: "work", add: workitems });
        }
    })

});

app.get("/about", function (req, res) {
    res.render("about")
});
app.listen(5000, function () {
    console.log("app is running");
});
