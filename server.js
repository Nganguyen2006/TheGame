const express = require("express");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const authenticateUser = require("./passport-config");

const User = require("./models/User");

authenticateUser(passport, User.findByEmail, User.findById);

const app = express();

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(express.static("public"));
app.use(
  session({
    secret: "super secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb+srv://admin:tech@cluster0.wek6c.mongodb.net/TheGame", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = req.body.password;
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

app.get("/achievements", checkAuthenticated, (req, res) => {
  res.render("achievements.ejs");
});

app.get("/sprig", checkAuthenticated, (req, res) => {
  res.render("sprig.ejs");
});

app.get("/cowboy", checkAuthenticated, (req, res) => {
  res.render("cowboy.ejs");
});

app.get("/hoodie", checkAuthenticated, (req, res) => {
  res.render("hoodie.ejs");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3000);
