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


const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model('List', listSchema);

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

const day = date.getDate();

const _ = require('lodash');


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
            
            res.render("index", { day: day, add: items })
        }

    });


    ;
});

app.post("/", function (req, res) {

    const add = req.body.listAdd;
    const type = req.body.type;

    const newitem = new item({
        name: add
    });

    if(type===day)
    {
        newitem.save();

        res.redirect("/");
    }
    else
    {
        List.findOne({name:type},function(err,found) {
         found.items.push(newitem);
         found.save();

         res.redirect("/"+type);
        });
    }

   
});

app.get("/:custom",function (req,res) {
    const customName = _.capitalize(req.params.custom);
    
    List.findOne({name:customName},function(err,foundItem) {
          if(!err)
          {
              if(!foundItem){
                const list = new List({
                    name: customName,
                    items: [item1,item2]
                });
                list.save();
                res.redirect("/"+customName);
              }
           else
           {
               console.log("Exists");
               res.render("index", { day: foundItem.name, add: foundItem.items })
           }
          }
          else
          {
              console.log("error");
          }
    });
   
});

app.post("/delete", function (req, res) {
    const itemId = req.body.checkbox;
    const listName = req.body.list;

    if(listName===day)
    {
        item.findByIdAndDelete(itemId, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Deleted");

        }
    });
    res.redirect("/");
}
else
{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemId}}}, function (err) {
        if(!err)
        {
            res.redirect("/"+listName);
        }
    });     
}

    
});



app.get("/about", function (req, res) {
    res.render("about")
});
app.listen(5000, function () {
    console.log("app is running");
});
