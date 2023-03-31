const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
const formidable = require("formidable");
const app = express();
var mysql = require("mysql");
const path = require("path");
var session = require("express-session");
const cookieParser = require("cookie-parser");

// var msg = require('./session.js');

// console.log(msg);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(cookieParser());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({ 
  secret: "Cryptovers",
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7,httpOnly: false, },
  httpOnly: false,
  resave: true,
  proxy   : 'true'
}));



var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "loginpage",
});

app.post("/", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields) => {
    var username = fields.UserName;
    var user_email = fields.UserEmail;
    var password = fields.UserPass;

    con.connect(function (err) {
      var sql =
        "INSERT INTO registration(username,user_email,password) VALUES (?,?,?)";
      con.query(sql, [username, user_email, password], function (err, result) {
        if (err) {
          throw err;
        } else {
          res.send(" Register Successfull" + result.insertId);
        }
      });
    });
  });
});

// Login Pages-->



app.get("/", function (req, res) {
  console.log(req.session);
  res.send();
});

// var sessionData
// app.get('/set_session',function(req,res){
//   sessionData = req.session;
//   sessionData.data = {};
// })

// app.get('/get_session',function(req,res){
//   sessionData = req.session;
//   let userObj = {};
//   console.log(sessionData)
// })

app.post("/login", function (req, res) {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields) => {
    var email = fields.email;
    var password = fields.loginpass;

    if (email && password) {
      var sql = `select * from registration where user_email = "${email}" AND password = "${password}"`;
      con.query(sql, function (err, result) {
        if (result.length > 0) {
          req.session.loggedin = true;
          req.session.email = email;
          // console.log(req.session)

          res.json("You are logIn Successfully");
        } else {
          res.send("Incorrect email or password");
        }
      });
    } else {
      res.send("Enter email or password");
    }
  });
});

app.listen(4000, () => {
  console.log("listing at port 4000");
});
