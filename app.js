const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3000;

const { usersRouter } = require("./routes/users");
const { homeRouter } = require("./routes/home");
const { ProfileRouter}=require("./routes/Profile");
//const { productsRouter } = require("./routes/products");


app.use((req, res, next) => {
  console.log(`Method: ${req.method} | URL: ${req.url}`);
  next(); 
});

// إعداد EJS كـ View Engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// إعداد المجلدات العامة 
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/views")));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// إعداد الجلسات
app.use(session({
  secret: "Abdallh2002*",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

// users , home , products
app.use("/", usersRouter);

app.use("/", homeRouter);

app.use("/", ProfileRouter);

//app.use("/", productsRouter);

app.use((req, res) => {
  res.status(404).render("404",{ereors:"not found"});
});

app.listen(PORT, () => console.log("Server is running on : " + PORT));
