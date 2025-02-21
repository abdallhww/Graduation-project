const { pool } = require("../utils/db");
const multer = require("multer");
const path = require("path");

const addproduct = async (req, res, next) => {
    const { name, description, price, stock_quantity, category } = req.body;
                  description
    let errors = {};
    const id = req.session.userId;

    if (!name || !description || !price || !stock_quantity) {
      errors.general = "جميع الحقول مطلوبة";
    }
  
    if (isNaN(price) || price <= 0) {
      errors.price = "السعر يجب أن يكون رقماً صحيحاً أكبر من 0";
    }
    if (isNaN(stock_quantity) || stock_quantity < 0) {
      errors.stock_quantity = "كمية المخزون يجب أن تكون رقماً صحيحاً أكبر من أو يساوي 0";
    }
  
    if (Object.keys(errors).length > 0) {
      return res.render("404", { errors, message: null });
    }

    const [existingProducts] = await pool.promise().query(
        "SELECT * FROM products WHERE name = ?",
        [name]
      );
  
      if (existingProducts.length > 0) {
        errors.existingProduct = "اسم المنتج مسجل مسبقًا";
        return res.render("404", { errors, message: null });
      }
  
    try {
      const seler_id = req.session.userId;
  
      await pool.promise().query(
        "INSERT INTO products (seler_id, name, description, price, stock_quantity, category) VALUES (?, ?, ?, ?, ?, ?)",
        [seler_id, name, description, price, stock_quantity, category]
      );

      const [userData] = await pool.promise().query("SELECT * FROM users WHERE id = ?", [id]);

      if (userData.length === 0) {
        return res.render("404", {
          errors: { general: "حدث خطأ أثناء جلب بيانات المستخدم" },
          message: null,
        });
      }

      res.render("Profileselers", {user: userData[0], message: "The product has been added successfully" });
      console.log("The product has been added successfully")
  
    } catch (err) {
      console.error("Error during adding product:", err);
      res.render("404", { errors: { general: "حدث خطأ أثناء إضافة المنتج" }, message: null });
    }
  };
  const updateProduct = async (req, res, next) => {
    const { id, name, description, price, stock_quantity, category } = req.body;
    let errors = {};

    // التحقق من إدخال جميع الحقول المطلوبة
    if (!id || !name || !description || !price || !stock_quantity) {
        errors.general = "جميع الحقول مطلوبة";
    }

    // التحقق من صحة السعر والكمية
    if (isNaN(price) || price <= 0) {
        errors.price = "السعر يجب أن يكون رقماً صحيحاً أكبر من 0";
    }
    if (isNaN(stock_quantity) || stock_quantity < 0) {
        errors.stock_quantity = "كمية المخزون يجب أن تكون رقماً صحيحاً أكبر من أو يساوي 0";
    }

    if (Object.keys(errors).length > 0) {
        return res.render("404", { errors, message: null });
    }

    try {
        const seler_id = req.session.userId; // الحصول على معرف البائع من الجلسة

        // التحقق من أن المنتج موجود ويعود إلى هذا البائع
        const [product] = await pool.promise().query(
            "SELECT * FROM products WHERE id = ? AND seler_id = ?",
            [id, seler_id]
        );

        if (product.length === 0) {
            return res.render("Profileselers", {products: rows, m: "هذا المنتج غير موجود أو لا تملكه!" });
        }

        // تحديث بيانات المنتج
        await pool.promise().query(
            "UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, category = ? WHERE id = ? AND seler_id = ?",
            [name, description, price, stock_quantity, category, id, seler_id]
        );

        pool.query("SELECT * FROM products WHERE seler_id = ?", [seler_id], (err, rows) => {
          if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: "Error fetching products" });
          }
        
        res.render("productsellerid", {products: rows,m: "تم تعديل المنتج بنجاح!" });
        console.log("edit product sucses")
        });

    } catch (err) {
        console.error("Error updating product:", err);
        res.render("404", { errors: { general: "حدث خطأ أثناء تعديل المنتج" }, message: null });
    }
};

const productsellerid = (req, res, next) => {
  //const sellerId = req.session.user_id;
  const id = req.session.userId;

  console.log(id);

  pool.query("SELECT * FROM products WHERE seler_id = ?", [id], (err, rows) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Error fetching products" });
    }

    // عرض المنتجات الخاصة بالبائع
    res.render("productsellerid", { products: rows,m:null});
  });
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.body; // استلام معرف المنتج فقط
  let errors = {};

  // التحقق من إدخال المعرف
  if (!id) {
      errors.general = "يجب إدخال معرف المنتج";
      return res.render("404", { errors, message: null });
  }

  try {
      const seller_id = req.session.userId; // الحصول على معرف البائع من الجلسة

      // التحقق مما إذا كان المنتج موجودًا ويعود إلى هذا البائع
      const [product] = await pool.promise().query(
          "SELECT * FROM products WHERE id = ? AND seler_id = ?",
          [id, seller_id]
      );

      if (product.length === 0) {
          return res.render("Profileselers", { products: [], m: "هذا المنتج غير موجود أو لا تملكه!" });
      }

      // حذف المنتج من قاعدة البيانات
      await pool.promise().query("DELETE FROM products WHERE id = ? AND seler_id = ?", [id, seller_id]);

      // جلب المنتجات المحدثة بعد الحذف
      pool.query("SELECT * FROM products WHERE seler_id = ?", [seller_id], (err, rows) => {
          if (err) {
              console.error("Error fetching products:", err);
              return res.status(500).json({ error: "Error fetching products" });
          }
          res.render("productsellerid", { products: rows, m: "تم حذف المنتج بنجاح!" });
          console.log("Product deleted successfully");
      });
  } catch (err) {
      console.error("Error deleting product:", err);
      res.render("404", { errors: { general: "حدث خطأ أثناء حذف المنتج" }, message: null });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "public/uploads/"); // حفظ الصور في مجلد `public/uploads`
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // اسم فريد للملف
  }
});

const upload = multer({ storage: storage });

const uploadProductImage = async (req, res) => {
  const { id } = req.body;

  if (!id || !req.file) {
      return res.render("productsellerid", { m: "يجب إدخال ID المنتج وتحميل صورة!" });
  }

  try {
      const seler_id = req.session.userId; // الحصول على ID البائع من الجلسة
      const imagePath = "/uploads/" + req.file.filename; // مسار الصورة

      // التحقق من أن المنتج موجود ويعود للبائع
      const [product] = await pool.promise().query(
          "SELECT * FROM products WHERE id = ? AND seler_id = ?",
          [id, seler_id]
      );

      if (product.length === 0) {
          return res.render("productsellerid", { m: "هذا المنتج غير موجود أو لا تملكه!" });
      }

      // تحديث الصورة في قاعدة البيانات
      await pool.promise().query(
          "UPDATE products SET image = ? WHERE id = ? AND seler_id = ?",
          [imagePath, id, seler_id]
      );
      pool.query("SELECT * FROM products WHERE seler_id = ?", [seler_id], (err, rows) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: "Error fetching products" });
        }
        res.render("productsellerid", { products: rows, m: "تم اضافة صوره للمنتج بنجاح" });
        console.log("Product add image successfully");
    });
  } catch (err) {
      console.error("Error uploading product image:", err);
      res.render("productsellerid", { m: "حدث خطأ أثناء رفع الصورة" });
  }
};
 
module.exports = {addproduct,updateProduct,productsellerid,deleteProduct,uploadProductImage,upload};