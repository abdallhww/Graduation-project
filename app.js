const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { pool } = require("./utils/db");
const PORT = 3000;

const { usersRouter } = require("./routes/users");
const { homeRouter } = require("./routes/home");
//const { productsRouter } = require("./routes/products");



const app = express();

app.use((req, res, next) => {
  console.log(`Method: ${req.method} | URL: ${req.url}`);
  next(); 
});


// when deals with templating pages should definde 3 things :
// 1 - set view path
//app.set("views", path.join(__dirname, "./views"));
app.set('views', path.join(__dirname, 'views'));
// 2- set view engin type
app.set("view engine", "ejs");
// 3- use express.static method style عشان اقدر اوصل لا ملفات الي جوا  
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/views")));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// users , carts , products
app.use("/", usersRouter);

app.use("/", homeRouter);

//app.use("/", productsRouter);

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => console.log("Server is running on : " + PORT));
