const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = 3000;

const { usersRouter } = require("./routes/users");
//const { cartsRouter } = require("./routes/carts");
//const { productsRouter } = require("./routes/products");

const app = express();

// Middleware لطباعة 
app.use((req, res, next) => {
  console.log(`Method: ${req.method} | URL: ${req.url}`);
  next(); 
});


// when deals with templating pages should definde 3 things :
// 1 - set view path
app.set("views", path.join(__dirname, "./views"));
// 2- set view engin type
app.set("view engine", "ejs");
// 3- use express.static method style عشان اقدر اوصل لا ملفات الي جوا  
app.use(express.static(path.join(__dirname, "/public")));

app.use(bodyParser.json());

// users , carts , products
app.use("/users", usersRouter);

//app.use("/carts", cartsRouter);

//app.use("/products", productsRouter);

app.use((req, res) => {
  //console.log("404 Error NOT FOUND PAGE");
  res.status(404).render("404" , {title: "404 Error Page"})
});

app.listen(PORT, () => console.log("Server is running on : " + PORT));
