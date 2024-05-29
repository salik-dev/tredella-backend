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
const { welCome, signUp, signIn } = require("./updateController/auth");
const buyerController = require("./updateController/buyer");
const { addRetailer, updateProfile, getProfile, deleteRecord,} = require("./updateController/retailer");
const wholeSellerController = require("./updateController/wholeSeller");

//==================== Validators =============================
// const authValidator = require("./validation/auth");
const authValidator = require("./updateValidators/buyer");

//================== signIn/signOut Routing ==========================//
// router.post("/signUp", authValidator.signUp, buyerController.signUp);
// router.post("/signUp", authValidator.signUp, buyerController.signUp);
router.post("/signUp", signUp);
router.post("/login", signIn);

// BUYER ROUTING
router.post("/add-buyer", buyerController.signUp);
router.get("/get-buyer", buyerController.getProfile);
router.put("/update-buyer", buyerController.updateProfile);
router.delete("/delete-buyer", buyerController.deleteRecord);

// RETAILER ROUTING
router.get("/get-retailer", getProfile);
router.post("/add-retailer", addRetailer);
router.put("/update-retailer", updateProfile);
router.delete("/delete-retailer", deleteRecord);

// WHOLE-SELLER ROUTING
router.post("/add-wholeSeller", wholeSellerController.addWholeSeller);
router.get("/get-wholeSeller", wholeSellerController.getProfile);
router.put("/update-wholeSeller", wholeSellerController.updateProfile);
router.delete("/delete-wholeSeller", wholeSellerController.deleteRecord);

router.get("/test-salik", wholeSellerController.testSalik);


module.exports = router;
