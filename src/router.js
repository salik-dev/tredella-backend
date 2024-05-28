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
// const buyerController = require("./controller/auth");
const buyerController = require("./updateController/buyer");
const {addRetailer, updateProfile, getProfile, deleteRecord} = require("./updateController/retailer");
const wholeSellerController = require("./updateController/wholeSeller");

//==================== Validators =============================
// const authValidator = require("./validation/auth");
const authValidator = require("./updateValidators/buyer");

//================== signIn/signOut Routing ==========================//
router.post("/login", authValidator.logIn, buyerController.signIn);
// router.post("/signUp", authValidator.signUp, buyerController.signUp);
router.post("/signUp", authValidator.signUp, buyerController.signUp);

// BUYER ROUTING
router.put(
    "/buyer/update-profile/?:id", // When JWT use it will remove
    // authValidator.updateProfile,
    // authenticate,
    buyerController.updateProfile
  );
router.delete(
  "/buyer/delete-profile/?:id", // When JWT use it will remove
  // authValidator.updateProfile,
  // authenticate,
  buyerController.deleteRecord
);
router.get("/buyer/get-profile", 
// authenticate, 
buyerController.getProfile);

// RETAILER ROUTING
router.get("/retailer", getProfile);
router.post("/retailer/add", addRetailer);
router.put("/retailer/update/?:id", updateProfile); // It remove when jwt active
router.delete("/retailer/delete/?:id", deleteRecord); 

// WHOLE-SELLER ROUTING
router.get("/wholeSeller", wholeSellerController.getProfile);
router.post("/wholeSeller/add", wholeSellerController.addWholeSeller);
router.put("/wholeSeller/update/?:id", wholeSellerController.updateProfile); // It remove when jwt active
router.delete("/wholeSeller/delete/?:id", wholeSellerController.deleteRecord); 

// testing api
module.exports = router;
