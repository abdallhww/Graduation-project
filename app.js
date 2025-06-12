const express = require("express");//استدعاء مكتبه لبناء تطبيق ويب
const session = require("express-session");//استدعاء مكتبه ل دارة جلسات
const MySQLStore = require("express-mysql-session")(session);//استدعاء مكتبه لتخزين جلسات في قاعدة بيانات
const bodyParser = require("body-parser");//لتحيل بيانات نموذج form and json
const path = require("path");//استدعاء مكتبه ل ادارة مسارات في ملفات و مجلدات
const db = require("./utils/db");
const { getPool } = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 3000;

const { likesRoutes } = require('./routes/likes');
const { usersRouter } = require("./routes/users");
const { homeRouter } = require("./routes/home");
const { ProfileRouter } = require("./routes/Profile");
const { productsRouter } = require("./routes/products");
const { cartRoutes } = require("./routes/cart");
const { reviewsRoutes} = require("./routes/reviews");
const { productfilter } = require("./routes/productfilter");
const { admanRouter } = require("./routes/adman");
const { orderRouter } = require("./routes/order");
const { adminorder } = require("./routes/adminorder");
const { adminseller } = require("./routes/adminseller");
const { selesRoutes } = require("./routes/seles");
const { locationrouts } = require("./routes/location");
const { paypalrouts } = require("./routes/paypal");
const { notsrouts } = require("./routes/nots");

//يسجل كل طلب (method + URL) في الكونسول للمراقبة/debugging.
app.use((req, res, next) => {
  console.log(`Method: ${req.method} | URL: ${req.url}`);
  next(); 
});

// إعداد EJS كـ View Engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views')); 

//  إعداد المجلدات العامة التي تحتوي على ملفات ثابته
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/views")));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ⬇️ إعداد الاتصال بقاعدة البيانات لحفظ الجلسات
const sessionStore = new MySQLStore({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
});

// إعداد الجلسات
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // يوم كامل
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

app.use("/",admanRouter);

app.use("/",orderRouter);

app.use("/",adminorder);

app.use("/",adminseller);

app.use("/",selesRoutes); 

app.use("/",locationrouts);

app.use("/",paypalrouts);

app.use("/",notsrouts);

console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLUSER:", process.env.MYSQLUSER);
console.log("MYSQLPORT:", process.env.MYSQLPORT);
console.log("MYSQLPASSWORD:", process.env.MYSQLPASSWORD);
console.log("MYSQLDATABASE:", process.env.MYSQLDATABASE);

app.use((err, req, res, next) => {
  console.error("🚨 ERROR:", err.stack); // طباعة الخطأ مع التفاصيل
  res.status(500).render("404", { errors: { general: "حدث خطأ غير متوقع" } });
});

app.listen(PORT, () => console.log("Server is running on : " + PORT)); 