const express = require("express");
const bodyParser = require("body-parser");

// local date module to get the date 
const date = require(__dirname +"/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

const items = ["bake", "cook"];
const workItems=[];

app.get("/", function (req, res) {
 const day = date.getDate();
  res.render("index", { day: day, add: items });
});

app.post("/", function (req, res) {

if(req.body.type === "work")
{
    const newItem = req.body.listAdd;
    workItems.push(newItem);
    res.redirect("/work")
}
else
{
    console.log(req.body);
    const add = req.body.listAdd;
    items.push(add);
  
    res.redirect("/");
}
 
});

app.get("/work",function (req,res){
    res.render("index", {day:"work", add:workItems});
});

app.get("/about",function (req,res){
    res.render("about")
});
app.listen(5000, function () {
  console.log("app is running");
});
