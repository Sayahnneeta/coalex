if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// Imports
require('dotenv').config();
const express = require("express");
const app = express();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const PORT = process.env.PORT || 3000;
const expressLayouts = require("express-ejs-layouts");


const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)
// users array
const users = []

// Static files
app.use(expressLayouts);
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// Set views
app.set("layout", "./layouts/boilerPlate"); //default layout
app.set("views", "./views");
app.set("view engine", "ejs");

//All get requests
app.get("/", checkAuthenticated,(req, res) => {
  res.render("home", {
    name: req.user.name,
    title: "Home | Coalex",
    cssFileName: "home",
  });
});
app.get("/employersProfile", (req, res) => {
  res.render("employersProfile", {
    layout: "./layouts/boilerPlate", // to choose specific layout
    title: "Employer's Profile | Coalex",
    cssFileName: "employersProfile",
  });
});
app.get("/riskZone", (req, res) => {
  res.render("riskZone", {
    layout: "./layouts/boilerPlate", // to choose specific layout
    title: "RiskZone | Coalex",
    cssFileName: "Risk Zone",
  });
});
app.get("/publicApi", (req, res) => {
  res.render("publicAPI", {
    layout: "./layouts/boilerPlate", // to choose specific layout
    title: "Public API | Coalex",
    cssFileName: "Risk Zone",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "./layouts/boilerPlate", // to choose specific layout
    title: "About Us | Coalex",
    cssFileName: "about",
  });
});

// Login/register routes
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render("login",{
    title:"Login|Coalex",
    cssFileName:"login",
  })
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render("register",
  {
    title: "Register|Coalex",
    cssFileName: "register",
  })
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect("login")
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

// Login/Register routes end

// Listening to PORT ...
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
