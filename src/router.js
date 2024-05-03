const Router = require("express").Router;
const router = new Router();
const { authenticate, isAdmin } = require("./middleware/authenticate");

// ===================      All Controllers   ==================//
const authController = require("./controller/auth");
const retailCategoryController = require("./controller/retailCategory");
const retailSubCategoryController = require("./controller/retailSubCategory");
const wholeSellerCategoryController = require("./controller/wholeSellerCategory");
const wholeSellerSubCategoryController = require("./controller/wholeSellerSubCategory");
const favoriteController = require("./controller/favorite");
const settingController = require("./controller/setting");

//==================== Validators =============================
const authValidator = require("./validation/auth");
const categoryValidator = require("./validation/category");

//================== AUTH ==========================//
router.post("/login", authValidator.logIn, authController.signIn);

//================== Category ==========================//
router.post(
  "/add-retailCategory",
  categoryValidator.addCategory,
  authenticate,
  retailCategoryController.addCategory
);
router.put(
  "/edit-retailCategory",
  categoryValidator.editCategory,
  authenticate,
  retailCategoryController.editCategory
);
router.get("/get-retailCategory/:query", retailCategoryController.getCategory);

router.post(
  "/add-wholeSellerCategory",
  categoryValidator.addCategory,
  authenticate,
  wholeSellerCategoryController.addCategory
);
router.put(
  "/edit-wholeSellerCategory",
  categoryValidator.editCategory,
  authenticate,
  wholeSellerCategoryController.editCategory
);
router.get(
  "/get-wholeSellerCategory/:query",
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
  wholeSellerSubCategoryController.getRecord
);

//===================       Setting Route       ==============//
router.put(
  "/updateSetting",
  authenticate,
  isAdmin,
  settingController.addRecord
);
router.get("/getSetting", authenticate, isAdmin, settingController.getRecord);

//===================       Auth Route       ==============//
router.post("/signUp", authController.signUp);
router.post("/login", authValidator.logIn, authController.signIn);

router.post("/resetForgetPassword", authController.resetPassword);

router.put(
  "/updateProfile",
  authValidator.updateProfile,
  authenticate,
  authController.updateProfile
);
router.get("/getProfile", authenticate, authController.getProfile);
router.post(
  "/forgetPassword",
  authValidator.forgetPassword,
  authController.forgetPassword
);
router.post(
  "/changePassword",
  authValidator.changePassword,
  authController.changePassword
);
// for admin
router.post(
  "/changeAdminPassword",
  authenticate,
  authValidator.changePassword,
  authController.changePassword
);
router.post("/setNewPassword", authController.setNewPassword);

//===================       Users Route       ==============//
router.get("/getUsers/:query", authenticate, isAdmin, authController.getUsers);
router.post(
  "/addUser",
  authValidator.addUser,
  authenticate,
  isAdmin,
  authController.addUser
);
router.put(
  "/editUser",
  authValidator.editUser,
  authenticate,
  isAdmin,
  authController.editUser
);
router.put(
  "/updateStatus",
  authValidator.updateStatus,
  authenticate,
  isAdmin,
  authController.updateStatus
);
router.put(
  "/resetPassword",
  authValidator.resetPassword,
  authenticate,
  isAdmin,
  authController.resetPassword
);
router.get("/getCountriesList", authController.getCountriesList);
router.get(
  "/getUsersDropDown",
  authenticate,
  isAdmin,
  authController.getUsersDropDown
);
router.delete(
  "/deleteUser",
  authenticate,
  isAdmin,
  authController.deleteRecord
);
router.put("/addFavourite", authenticate, authController.addFavourite);
router.put("/removeFavourite", authenticate, authController.removeFavourite);
router.get("/getFavourite", authenticate, authController.getFavourite);
//===================       category Route       ==============//

router.put(
  "/edit-sellerCategory",
  categoryValidator.editCategory,
  authenticate,
  retailCategoryController.editCategory
);
router.delete(
  "/delete-sellerCategory",
  authenticate,
  retailCategoryController.deleteCategory
);

router.get("/getCategoryById/:query", retailCategoryController.getCategoryById);

router.get(
  "/getSubCategoryByCategory/:query",
  retailSubCategoryController.getSubCategoryByCategory
);
router.put(
  "/editSubCategory",
  authenticate,
  retailSubCategoryController.editRecord
);
router.delete(
  "/deleteSubCategory",
  authenticate,
  retailSubCategoryController.deleteRecord
);

//===================       Favorite Auction Route       ==============//
router.post("/addFavorite", authenticate, favoriteController.addFavorite);

module.exports = router;
