const catchAsync = require("../utils/catchAsync");
const constant = require("../updateUtils/constant");
const { addRecord, getRecordAndSort, findAndModifyRecord, removeRecord } = require("../updateServices/commonOperation");
const modelName = "subCategory";

const addSubCategory = catchAsync(async (req, res) => {
  const { name, categoryId, percentage, brands, childCategories } = req.body;
  // Need to implement Global Validation Utils ==> pending
  const subCategory = await addRecord(modelName, { name, categoryId, percentage, brands, childCategories });

  res.status(constant.STATUS_OK).json({
    message: "Sub Category created successfully",
    Record: subCategory
  });
});

const updateSubCategory = catchAsync(async (req, res, next) => {
  const { id, name, categoryId, percentage, brands, childCategories } = req.body;
  const subCategoryRecord = await findAndModifyRecord(
    modelName,
    { _id: id },
    { name, categoryId, percentage, brands, childCategories }
  );

  res.status(constant.STATUS_OK).send({
    status: constant.SUCCESS,
    message: "Retailer subCategory updated successfully",
    Record: subCategoryRecord,
  });
});

const getSubCategory = catchAsync(async (req, res) => {
  const condition = {}; // Add any condition if needed
  const Record = await getRecordAndSort(modelName, condition);

  res.status(constant.STATUS_OK).send({
    status: constant.SUCCESS,
    message: "Record fetched successfully",
    Record
  });
});

const deleteSubCateory = catchAsync(async (req, res) => {
  const { id } = req.body;
  const Record = await removeRecord(modelName, {
    _id: id,
  });

  res.status(constant.STATUS_OK).send({
    status: constant.SUCCESS,
    message: constant.DELETE_RECORD,
    Record,
  });
});

module.exports = {
  addSubCategory,
  updateSubCategory,
  getSubCategory,
  deleteSubCateory,
};
