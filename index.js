// Imports
require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const expressLayouts = require("express-ejs-layouts");

// Static files
app.use(expressLayouts);
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));

// Set views
app.set("layout", "./layouts/boilerPlate"); //default layout
app.set("views", "./views");
app.set("view engine", "ejs");

//All get requests
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home | Coalex",
    cssFileName: "home",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "./layouts/boilerPlate", // to choose specific layout
    title: "About Us | Coalex",
    cssFileName: "about",
  });
});

// Listening to PORT ...
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
