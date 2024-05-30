const Router = require("express").Router;
const router = new Router();
const { authenticate, isAdmin } = require("./middleware/authenticate");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
AWS.config.update({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: "eu-west-2",
  apiVersion: "latest",
});

// ===================      All Controllers   ==================//
const { signUp, signIn, protect } = require("./updateController/auth");
const buyerController = require("./updateController/buyer");
const {
  addRetailer,
  updateProfile,
  getProfile,
  deleteRecord,
} = require("./updateController/retailer");
const wholeSellerController = require("./updateController/wholeSeller");
const {
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("./updateController/category");
const {
  addSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCateory,
} = require("./updateController//subCategory");

//==================== Validators =============================
const authValidator = require("./updateValidators/buyer");
const { addStore, getStore, updateStore, deleteStore } = require("./updateController/store");

//================== signIn/signOut Routing ==========================//
router.post("/signUp", signUp);
router.post("/login", signIn);

// BUYER ROUTING
router.post("/add-buyer", buyerController.signUp);
router.get("/get-buyer", protect, buyerController.getProfile);
router.put("/update-buyer", protect, buyerController.updateProfile);
router.delete("/delete-buyer", protect, buyerController.deleteRecord);

// RETAILER ROUTING
router.get("/get-retailer", protect, getProfile);
router.post("/add-retailer", protect, addRetailer);
router.put("/update-retailer", protect, updateProfile);
router.delete("/delete-retailer", protect, deleteRecord);

// WHOLE-SELLER ROUTING
router.post("/add-wholeSeller", protect, wholeSellerController.addWholeSeller);
router.get("/get-wholeSeller", protect, wholeSellerController.getProfile);
router.put("/update-wholeSeller", protect, wholeSellerController.updateProfile);
router.delete("/delete-wholeSeller", wholeSellerController.deleteRecord);

// CATEGORY ROUTING
router.post("/add-category", protect, addCategory);
router.get("/get-category", protect, getCategory);
router.put("/update-category", protect, updateCategory);
router.delete("/delete-category", protect, deleteCategory);

// SUB-CATEGORY ROUTING
router.post("/add-subcategory", protect, addSubCategory);
router.get("/get-subcategory", protect, getSubCategory);
router.put("/update-subcategory", protect, updateSubCategory);
router.delete("/delete-subcategory", protect, deleteSubCateory);

// STORE ROUTING
router.post("/add-store", protect, addStore);
router.get("/get-store", protect, getStore);
router.put("/update-store", protect, updateStore);
router.delete("/delete-store", protect, deleteStore);

router.get("/test-salik", wholeSellerController.testSalik);

module.exports = router;
