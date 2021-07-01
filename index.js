const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const users = require("./users");
const admin = require("./admin");
let tollbooth_current_user = null;
let tollbooth_current_admin = null;

const server = http.createServer(function (req, res) {
  switch (req.url) {
    case "/":
      tollbooth_current_user = null;
      fs.readFile(
        path.join(__dirname, "public", "index.html"),
        function (err, page) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(page);
        }
      );
      break;

    case "/css/style.css":
      fs.readFile(
        path.join(__dirname, "public", "css", "style.css"),
        function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/css" });
          res.end(data);
        }
      );
      break;

    case "/IMG/cars.jpg":
      fs.readFile(
        path.join(__dirname, "public", "IMG", "cars.jpg"),
        function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "image/jpg" });
          res.end(data);
        }
      );
      break;

    case "/api/users/login":
      if (req.method == "POST") {
        let body = "";
        req.on("data", function (data) {
          body += data;
        });
        req.on("end", function () {
          const formData = qs.parse(body);

          if (
            !users.some(function (user) {
              return (
                user.email == formData.email &&
                user.password == formData.password
              );
            })
          ) {
            res.statusCode = 302;
            res.setHeader("Location", "/");
            return res.end();
          } else {
            users.forEach(function (user) {
              if (
                user.email == formData.email &&
                user.password == formData.password
              ) {
                tollbooth_current_user = user;
                res.statusCode = 302;
                res.setHeader("Location", "/home");
                return res.end();
              }
            });
          }
        });
      }
      break;

    case "/home":
      if (tollbooth_current_user == null) {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      }
      fs.readFile(
        path.join(__dirname, "public", "home", "index.html"),
        function (err, page) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(page);
        }
      );
      break;

    case "/css/userhome.css":
      fs.readFile(
        path.join(__dirname, "public", "home", "css", "userhome.css"),
        function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/css" });
          res.end(data);
        }
      );
      break;

    case "/js/main.js":
      fs.readFile(
        path.join(__dirname, "public", "home", "js", "main.js"),
        function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/javascript" });
          res.end(data);
        }
      );
      break;

    case "/tollbooth_current_user":
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(tollbooth_current_user));
      break;

    case "/admin":
      tollbooth_current_admin = null;
      fs.readFile(
        path.join(__dirname, "public", "admin", "index.html"),
        (err, page) => {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(page);
        }
      );
      break;

    case "/api/admin/login":
      if (req.method == "POST") {
        let body = "";
        req.on("data", function (data) {
          body += data;
        });
        req.on("end", function () {
          const formData = qs.parse(body);

          if (
            admin.username != formData.username &&
            admin.password != formData.password
          ) {
            res.statusCode = 302;
            res.setHeader("Location", "/admin");
            return res.end();
          } else {
            tollbooth_current_admin = admin;
            res.statusCode = 302;
            res.setHeader("Location", "/admin/home");
            return res.end();
          }
        });
      }
      break;

    case "/admin/home":
      if (tollbooth_current_admin == null) {
        res.statusCode = 302;
        res.setHeader("Location", "/admin");
        return res.end();
      }
      fs.readFile(
        path.join(__dirname, "public", "admin", "home", "index.html"),
        function (err, page) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(page);
        }
      );
      break;

    case "/admin/css/home.css":
      fs.readFile(
        path.join(__dirname, "public", "admin", "home", "css", "home.css"),
        function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/css" });
          res.end(data);
        }
      );
      break;

    case "/admin/js/adminmain.js":
      fs.readFile(
        path.join(__dirname, "public", "admin", "home", "js", "adminmain.js"),
        function (err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, { "Content-Type": "text/javascript" });
          res.end(data);
        }
      );
      break;

    case "/tollbooth_current_admin":
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(tollbooth_current_admin));
      break;

    case "/tollbooth_users":
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
      break;

    default:
      res.writeHead(404);
      res.end("404 not found");
      break;
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, function () {
  console.log("server started at port " + PORT);
});
