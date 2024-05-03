const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { incrementField } = require("../utils/commonFunctions");
const { default: mongoose } = require("mongoose");
const TableName = "WholeSellerCategory";

const fetchCategoryList = async (condition) => {
  const aggregateArray = [
    { $match: condition },
    {
      $project: {
        _id: 1,
        categoryId: 1,
        name: "$name",
        categoryImage: 1,
        createdAt: 1,
      },
    },

    {
      $sort: { _id: -1 },
    },
  ];

  return await generalService.getRecordAggregate(TableName, aggregateArray);
};
const getCategory = catchAsync(async (req, res) => {
  const data = JSON.parse(req.params.query);
  //const data = req.body;
  let condition = {};

  if (data.name) {
    condition = {
      $expr: {
        $regexMatch: {
          input: {
            $concat: ["$name", { $toString: "$categoryId" }],
          },
          regex: `.*${data.name}.*`, //Your text search here
          options: "i",
        },
      },
    };
  }

  const Record = await fetchCategoryList(condition);

  res.send({
    status: constant.SUCCESS,
    message: "activity fetch Successfully",
    Record,
  });
});
const addCategory = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;
  data.createdBy = user._id;
  const categoryId = await incrementField(TableName, "categoryId", "wc", {});
  data.categoryId = categoryId;

  const Record = await generalService.addRecord(TableName, data);
  const RecordAll = await fetchCategoryList({ _id: Record._id });
  res.send({
    status: constant.SUCCESS,
    message: "add Record Successfully",
    Record: RecordAll[0],
  });
});
const editCategory = catchAsync(async (req, res) => {
  const data = req.body;

  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: data._id },
    data
  );
  const RecordAll = await fetchCategoryList({ _id: Record._id });

  res.send({
    status: constant.SUCCESS,
    message: "update Record Successfully",
    Record: RecordAll[0],
  });
});
const deleteCategory = catchAsync(async (req, res) => {
  const data = req.body;

  let checkSubCategoryLink = await generalService.getRecord("SubCategory", {
    parentId: data._id,
  });
  if (checkSubCategoryLink && checkSubCategoryLink.length > 0) {
    res.send({
      status: constant.ERROR,
      message:
        "Some SubCategory link with this category. kindly unlink and try again",
    });
  } else {
    const Record = await generalService.deleteRecord(TableName, {
      _id: data._id,
    });

    res.send({
      status: constant.SUCCESS,
      message: "Record Deleted Successfully",
      Record: { _id: data._id },
    });
  }
});
const getCategoryById = catchAsync(async (req, res) => {
  const data = JSON.parse(req.params.query);
  console.log(data);
  const Record = await fetchCategoryList({
    _id: mongoose.Types.ObjectId(data.id),
  });
  console.log(Record);
  res.send({
    status: constant.SUCCESS,
    message: "activity fetch Successfully",
    Record,
  });
});
module.exports = {
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
  getCategoryById,
};
