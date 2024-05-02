const Router = require("express").Router;
const router = new Router();
const { authenticate, isAdmin } = require("./middleware/authenticate");

// ===================      All Controllers   ==================//

const authController = require("./controller/auth");
const categoryController = require("./controller/category");
const subCategoryController = require("./controller/subCategory");
const settingController = require("./controller/setting");
const favoriteController = require("./controller/favorite");
//==================== Validators =============================

const authValidator = require("./validation/auth");
const categoryValidator = require("./validation/category");

//===================       Setting Route       ==============//

router.put(
  "/updateSetting",
  authenticate,
  isAdmin,
  settingController.addRecord
);

//===================       Auth Route       ==============//
router.post("/signUp", authValidator.signUp, authController.signUp);
router.post("/signIn", authValidator.signInAdmin, authController.signInAdmin); //==== use For admin login through email

/// for check user already register or not in google sign
router.get("/checkUser/:query", authController.checkUser);

router.post("/resetForgetPassword", authController.resetPassword);

router.put(
  "/updateProfile",
  authValidator.updateProfile,
  authenticate,
  authController.updateProfile
);

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
router.post(
  "/addCategory",
  categoryValidator.addCategory,
  authenticate,
  categoryController.addCategory
);
router.get("/getCategory/:query", categoryController.getCategory);
router.put(
  "/editCategory",
  categoryValidator.editCategory,
  authenticate,
  categoryController.editCategory
);
router.delete(
  "/deleteCategory",
  authenticate,
  categoryController.deleteCategory
);

router.get("/getCategoryById/:query", categoryController.getCategoryById);

router.post("/addSubCategory", authenticate, subCategoryController.addRecord);
router.get("/getSubCategory/:query", subCategoryController.getRecord);
router.get(
  "/getSubCategoryByCategory/:query",
  subCategoryController.getSubCategoryByCategory
);
router.put("/editSubCategory", authenticate, subCategoryController.editRecord);
router.delete(
  "/deleteSubCategory",
  authenticate,
  subCategoryController.deleteRecord
);

//===================       biding Route       ==============//

//===================       Favorite Auction Route       ==============//
router.post("/addFavorite", authenticate, favoriteController.addFavorite);

module.exports = router;
