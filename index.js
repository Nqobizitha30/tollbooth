const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// Allow env variables to be stored in a .env file
require("dotenv").config();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database URI
const uri = process.env.DB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// Connect database
const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB database connection established successfully\n")
);

//database model
const Admin = require("./model/admin.model");
const User = require("./model/user.model");

let tollbooth_current_user = null;
let tollbooth_current_admin = null;
let tollbooth_new_user_id = null;

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/tollbooth_current_user", (req, res) =>
  res.json(tollbooth_current_user)
);

app.get("/tollbooth_current_admin", (req, res) =>
  res.json(tollbooth_current_admin)
);

app.get("/tollbooth_new_user_id", (req, res) => res.end(tollbooth_new_user_id));

app.post("/api/users/login", (req, res) => {
  tollbooth_current_user = null;
  tollbooth_current_admin = null;

  User.find().then((users) => {
    if (
      !users.some(
        (user) =>
          user.email == req.body.email && user.password == req.body.password
      )
    ) {
      return res.redirect("/");
    } else {
      users.forEach((user) => {
        if (
          user.email == req.body.email &&
          user.password == req.body.password
        ) {
          tollbooth_current_user = user;
          return res.redirect("/home");
        }
      });
    }
  });
});

app.post("/api/admin/login", (req, res) => {
  tollbooth_current_user = null;
  tollbooth_current_admin = null;

  Admin.find().then((admins) => {
    admins.forEach((admin) => {
      if (
        admin.username == req.body.username &&
        admin.password == req.body.password
      ) {
        tollbooth_current_admin = admin;
        res.redirect("/admin/home");
      } else {
        res.redirect("/admin");
      }
    });
  });
});

app.post("/api/logout", (req, res) => {
  tollbooth_current_user = null;
  tollbooth_current_admin = null;
  res.end("logged out");
});

app.post("/api/user/logout", (req, res) => {
  tollbooth_current_user = null;
  res.end("logged out");
});

app.post("/api/admin/logout", (req, res) => {
  tollbooth_current_admin = null;
  res.end("logged out");
});

app.post("/api/users/scan", (req, res) => {
  const id = req.body.id;
  const amount = Number(req.body.amount);

  User.findById(id)
    .then((user) => {
      if (user.balance > amount) {
        user.balance = user.balance - amount;
        Admin.findOne().then((admin) => {
          user.activity.unshift({
            amount,
            boothName: admin.boothName,
          });
          admin.history.push({
            amount,
            user,
          });
          admin
            .save()
            .then(() => {
              user
                .save()
                .then(() => {
                  res.end(String(user.balance));
                })
                .catch((err) => {
                  res.status(400);
                  res.end(`Error: ${err}`);
                });
            })
            .catch((err) => {
              res.status(400);
              res.end(`Error: ${err}`);
            });
        });
      } else {
        res.writeHead(400);
        res.end("Error: Insufficient Funds");
      }
    })
    .catch((err) => {
      res.status(400);
      res.end(`Error: ${err}`);
    });
});

app.post("/api/users/topup", async (req, res) => {
  const id = req.body.id;
  const amount = Number(req.body.amount);

  try {
    const user = await User.findById(id);
    user.balance += amount;
    user.save().then(() => res.end(String(user.balance)));
  } catch (err) {
    res.status(400);
    res.end(`Error: ${err}`);
  }
});

app.get("/api/users/new/:id", (req, res) => {
  tollbooth_new_user_id = req.params.id;
  res.redirect("/api/users/register");
  res.end();
});

app.get("/api/users/register/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "register.css"));
});

app.get("/api/users/register", (req, res) => {
  if (!tollbooth_new_user_id) res.end("Please scan card first");
  res.sendFile(path.join(__dirname, "register.html"));
});

app.post("/api/users/register", (req, res) => {
  const { _id, name, email, userPhone, password, regNumber } = req.body;

  const newUser = new User({
    _id,
    name,
    email,
    userPhone,
    password,
    regNumber,
    balance: 0.0,
    activity: [],
  });

  newUser
    .save()
    .then(() => {
      tollbooth_new_user_id = null;
      console.log("User added");
    })
    .then(() => res.redirect("/"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("server started at port " + PORT));
