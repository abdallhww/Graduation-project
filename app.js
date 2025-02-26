const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./utils/db");
const { getPool } = require('./utils/db');

const app = express();
const PORT = 3000;

const { likesRoutes } = require('./routes/likes');
const { usersRouter } = require("./routes/users");
const { homeRouter } = require("./routes/home");
const { ProfileRouter } = require("./routes/Profile");
const { productsRouter } = require("./routes/products");
const { cartRoutes } = require("./routes/cart");
const { reviewsRoutes} = require("./routes/reviews");
const { productfilter } = require("./routes/productfilter");


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

//--------------------------
app.locals.pool = getPool();// استخدام الدالة للحصول على pool

app.use("/", usersRouter);

app.use("/", homeRouter);

app.use("/", ProfileRouter);

app.use("/", productsRouter);

app.use("/", cartRoutes);

app.use("/",reviewsRoutes);

app.use("/",productfilter); 

app.use('/', likesRoutes);
//app.use('/api/likes', likesRoutes);


app.use((err, req, res, next) => {
  console.error("🚨 ERROR:", err.stack); // طباعة الخطأ مع التفاصيل
  res.status(500).render("404", { errors: { general: "حدث خطأ غير متوقع" } });
});

app.listen(PORT, () => console.log("Server is running on : " + PORT));