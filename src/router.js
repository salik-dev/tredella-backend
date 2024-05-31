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
const { signUp, signIn, protect, storeVerification } = require("./updateController/auth");
const {getBuyer, updateBuyer, deleteBuyer} = require('./updateController/buyer');
const { getRetailer, updateRetailer, deleteRetailer } = require("./updateController/retailer");
const { getWholeSeller, updateWholeSeller, deleteWholeSeller, testSalik } = require("./updateController/wholeSeller")
const { addCategory, getCategory, updateCategory, deleteCategory } = require("./updateController/category");
const { addSubCategory, getSubCategory, updateSubCategory, deleteSubCateory } = require("./updateController//subCategory");
const { addStore, getStore, updateStore, deleteStore } = require("./updateController/store");

//==================== Validators =============================
const authValidator = require("./updateValidators/buyer");

//================== signIn/signOut Routing ==========================//
router.post("/signUp", signUp);
router.post("/login", signIn);

// BUYER ROUTING
router.post("/add-buyer", signUp);
router.get("/get-buyer", protect, getBuyer);
router.put("/update-buyer", protect, updateBuyer);
router.delete("/delete-buyer", protect, deleteBuyer);

// RETAILER ROUTING
router.post("/add-retailer", signUp);
router.get("/get-retailer", protect, getRetailer);
router.put("/update-retailer", protect, updateRetailer);
router.delete("/delete-retailer", protect, deleteRetailer);

// WHOLE-SELLER ROUTING
router.post("/add-wholeSeller", signUp);
router.get("/get-wholeSeller", protect, getWholeSeller);
router.put("/update-wholeSeller", protect, updateWholeSeller);
router.delete("/delete-wholeSeller", deleteWholeSeller);

// CATEGORY ROUTING
router.post("/add-category", protect, storeVerification, addCategory);
router.get("/get-category", protect, storeVerification, getCategory);
router.put("/update-category", protect, storeVerification, updateCategory);
router.delete("/delete-category", protect,storeVerification, deleteCategory);

// SUB-CATEGORY ROUTING
router.post("/add-subcategory", protect, storeVerification, addSubCategory);
router.get("/get-subcategory", protect, storeVerification, getSubCategory);
router.put("/update-subcategory", protect, storeVerification, updateSubCategory);
router.delete("/delete-subcategory", protect, storeVerification, deleteSubCateory);

// STORE ROUTING
router.post("/add-store", protect, addStore);
router.get("/get-store", protect, storeVerification, getStore);
router.put("/update-store", protect, storeVerification, updateStore);
router.delete("/delete-store", protect, storeVerification, deleteStore);

router.get("/test-salik", testSalik);

module.exports = router;
