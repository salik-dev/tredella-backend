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
const authController = require("./controller/auth");
const retailCategoryController = require("./controller/retailCategory");
const retailSubCategoryController = require("./controller/retailSubCategory");
const wholeSellerCategoryController = require("./controller/wholeSellerCategory");
const wholeSellerSubCategoryController = require("./controller/wholeSellerSubCategory");
const retailerStoreController = require("./controller/retailerStore");
const wholeSellerStoreController = require("./controller/wholeSellerStore");
const packagesController = require("./controller/packages");
const deliveryServiceController = require("./controller/deliveryServices");
const retailerProductController = require("./controller/retailProduct");

const favoriteController = require("./controller/favorite");
const settingController = require("./controller/setting");

//==================== Validators =============================
const authValidator = require("./validation/auth");
const categoryValidator = require("./validation/category");

//================== AUTH ==========================//
router.post("/login", authValidator.logIn, authController.signIn);
router.post("/signUp", authValidator.signUp, authController.signUp);

//================== Add Users ==========================//
router.post("/add-retailer", authenticate, authController.addRetailerUser);
// router.get("/get-retailer", authValidator.logIn, authController.signIn);
router.post(
  "/add-wholeSeller",
  authValidator.logIn,
  authController.addWholeSellerUser
);
// router.get("/get-wholeSeller", authValidator.logIn, authController.signIn);

//================== Category ==========================//
router.post(
  "/add-retailCategory",
  authenticate,
  categoryValidator.addCategory,
  retailCategoryController.addCategory
);
router.put(
  "/edit-retailCategory",
  authenticate,
  categoryValidator.editCategory,
  retailCategoryController.editCategory
);
router.get(
  "/get-retailCategory/:query",
  authenticate,
  retailCategoryController.getCategory
);
router.post(
  "/add-wholeSellerCategory",
  authenticate,
  categoryValidator.addCategory,
  wholeSellerCategoryController.addCategory
);
router.put(
  "/edit-wholeSellerCategory",
  authenticate,
  categoryValidator.editCategory,
  wholeSellerCategoryController.editCategory
);
router.get(
  "/get-wholeSellerCategory/:query",
  authenticate,
  wholeSellerCategoryController.getCategory
);

//================== Sub Category ==========================//

router.post(
  "/add-retailSubCategory",
  authenticate,
  retailSubCategoryController.addRecord
);
router.put(
  "/edit-retailSubCategory",
  authenticate,
  retailSubCategoryController.editRecord
);
router.get(
  "/get-retailSubCategory/:query",
  authenticate,
  retailSubCategoryController.getRecord
);
router.post(
  "/add-wholeSellerSubCategory",
  authenticate,
  wholeSellerSubCategoryController.addRecord
);
router.put(
  "/edit-wholeSellerSubCategory",
  authenticate,
  wholeSellerSubCategoryController.editRecord
);
router.get(
  "/get-wholeSellerSubCategory/:query",
  authenticate,
  wholeSellerSubCategoryController.getRecord
);

//================== Packages ==========================//
router.get("/get-package/:query", authenticate, packagesController.getRecord);
router.post("/add-package", authenticate, packagesController.addRecord);
router.put("/edit-package", authenticate, packagesController.editRecord);
router.get("/get-signup-package", packagesController.getPublicPackage);

//================== Delivery Service ==========================//
router.get(
  "/get-deliveryService/:query",
  authenticate,
  deliveryServiceController.getRecord
);
router.post(
  "/add-deliveryService",
  authenticate,
  deliveryServiceController.addRecord
);
router.put(
  "/edit-deliveryService",
  authenticate,
  deliveryServiceController.editRecord
);

//================== Store ==========================//

router.get(
  "/get-myretailerStore/:query",
  authenticate,
  retailerStoreController.getStoreByUser
);
router.get(
  "/get-myRetailerStore/:query",
  authenticate,
  retailerStoreController.getStoreByUser
);

router.get(
  "/get-retailerStore/:query",
  authenticate,
  retailerStoreController.getRecord
);
router.post(
  "/add-retailerStore",
  authenticate,
  retailerStoreController.addRecord
);
router.put(
  "/edit-retailerStore",
  authenticate,
  retailerStoreController.editRecord
);

router.get(
  "/get-wholeSellerStore/:query",
  authenticate,
  wholeSellerStoreController.getRecord
);
router.get(
  "/get-myWholeSellerStore/:query",
  authenticate,
  wholeSellerStoreController.getStoreByUser
);
router.post(
  "/add-wholeSellerStore",
  authenticate,
  wholeSellerStoreController.addRecord
);
router.put(
  "/edit-wholeSellerStore",
  authenticate,
  wholeSellerStoreController.editRecord
);
//=================== Retail Product ==============//

router.post(
  "/add-retailerProduct",
  authenticate,
  retailerProductController.addRecord
);
router.put(
  "/edit-retailerProduct",
  authenticate,
  // retailerStoreController.testsa
);
router.get(
  "/get-retailerProduct/:query",
  authenticate,
  retailerProductController.getRecord
);
router.get(
  "/get-myRetailerProduct/:query",
  authenticate,
  retailerProductController.getProductByUser
);

//===================       Setting Route       ==============//
// router.put(
//   "/updateSetting",
//   authenticate,
//   isAdmin,
//   settingController.addRecord
// );
// router.get("/getSetting", authenticate, isAdmin, settingController.getRecord);

// //===================       Auth Route       ==============//
// router.post("/signUp", authController.signUp);
// router.post("/login", authValidator.logIn, authController.signIn);

// router.post("/resetForgetPassword", authController.resetPassword);

// router.put(
//   "/updateProfile",
//   authValidator.updateProfile,
//   authenticate,
//   authController.updateProfile
// );
// router.get("/getProfile", authenticate, authController.getProfile);
// router.post(
//   "/forgetPassword",
//   authValidator.forgetPassword,
//   authController.forgetPassword
// );
// router.post(
//   "/changePassword",
//   authValidator.changePassword,
//   authController.changePassword
// );
// // for admin
// router.post(
//   "/changeAdminPassword",
//   authenticate,
//   authValidator.changePassword,
//   authController.changePassword
// );
// router.post("/setNewPassword", authController.setNewPassword);

// //===================       Users Route       ==============//
// router.get("/getUsers/:query", authenticate, isAdmin, authController.getUsers);
// router.post(
//   "/addUser",
//   authValidator.addUser,
//   authenticate,
//   isAdmin,
//   authController.addUser
// );
// router.put(
//   "/editUser",
//   authValidator.editUser,
//   authenticate,
//   isAdmin,
//   authController.editUser
// );
// router.put(
//   "/updateStatus",
//   authValidator.updateStatus,
//   authenticate,
//   isAdmin,
//   authController.updateStatus
// );
// router.put(
//   "/resetPassword",
//   authValidator.resetPassword,
//   authenticate,
//   isAdmin,
//   authController.resetPassword
// );
// router.get("/getCountriesList", authController.getCountriesList);
// router.get(
//   "/getUsersDropDown",
//   authenticate,
//   isAdmin,
//   authController.getUsersDropDown
// );
// router.delete(
//   "/deleteUser",
//   authenticate,
//   isAdmin,
//   authController.deleteRecord
// );
// router.put("/addFavourite", authenticate, authController.addFavourite);
// router.put("/removeFavourite", authenticate, authController.removeFavourite);
// router.get("/getFavourite", authenticate, authController.getFavourite);
// //===================       category Route       ==============//

// router.put(
//   "/edit-sellerCategory",
//   categoryValidator.editCategory,
//   authenticate,
//   retailCategoryController.editCategory
// );
// router.delete(
//   "/delete-sellerCategory",
//   authenticate,
//   retailCategoryController.deleteCategory
// );

// router.get("/getCategoryById/:query", retailCategoryController.getCategoryById);

// router.get(
//   "/getSubCategoryByCategory/:query",
//   retailSubCategoryController.getSubCategoryByCategory
// );
// router.put(
//   "/editSubCategory",
//   authenticate,
//   retailSubCategoryController.editRecord
// );
// router.delete(
//   "/deleteSubCategory",
//   authenticate,
//   retailSubCategoryController.deleteRecord
// );

// //===================       Favorite Auction Route       ==============//
// router.post("/addFavorite", authenticate, favoriteController.addFavorite);
const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    ACL: "public-read",
    bucket: `${process.env.BUCKET_NAME}/${process.env.BUCKET_FOLDER_NAME}`,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

router.post("/uploadImage", uploadS3.single("file"), (req, res, next) => {
  console.log("==== body ====", req.body);
  let fieldName = req.body ? req.body.fieldName : "";
  const url = req.file.location;
  try {
    res.status(200).send({
      status: "SUCCESS",
      message: "file uploaded Successfully",
      fieldName: fieldName,
      url,
    });
  } catch (error) {
    console.log("========= error =======", error);
    res.status(404).send({
      status: "ERROR",
      message: "Image uploading fail",
    });
  }
});

// testing api
router.get("/test-salik", retailerProductController.testSalik);
module.exports = router;
