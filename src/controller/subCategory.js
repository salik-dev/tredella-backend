const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { incrementField } = require("../utils/commonFunctions");
const { default: mongoose } = require("mongoose");
const TableName = "SubCategory";

const fetchSubCategoryList = async (condition) => {
  const aggregateArray = [
    { $match: condition },
    {
      $lookup: {
        from: "categories",
        let: { categoryId: "$parentId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$categoryId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: "categoryDetail",
      },
    },
    {
      $lookup: {
        from: "formtemplates",
        let: { templateId: "$templateId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$templateId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
              formStructure:1,
            },
          },
        ],
        as: "formtemplate",
      },
    },
    {
      $project: {
        _id: 1,
        categoryId: 1,
        parentId:1,
        templateId:1,
        categoryName: { $arrayElemAt: ["$categoryDetail.name", 0] },
        templateName: { $arrayElemAt: ["$formtemplate.name", 0] },
        formStructure: { $arrayElemAt: ["$formtemplate.formStructure", 0] },
        name: "$name",
        imageUrl: 1,
        createdAt: 1,
      },
    },
    {
      $sort: { name: 1 },
    },
  ];

  return await generalService.getRecordAggregate(TableName, aggregateArray);
};

const getRecord = catchAsync(async (req, res) => {
  //const data = JSON.parse(req.params.query);
  const data = req.body;
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

  const Record = await fetchSubCategoryList(condition);

  res.send({
    status: constant.SUCCESS,
    message: "activity fetch Successfully",
    Record,
  });
});
const getSubCategoryByCategory = catchAsync(async (req, res) => {
  const data = JSON.parse(req.params.query);
  let condition = {parentId: new mongoose.Types.ObjectId(data.parentId)};
  const Record = await fetchSubCategoryList(condition);

  res.send({
    status: constant.SUCCESS,
    message: "activity fetch Successfully",
    Record,
  });
});

const addRecord = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;

  data.createdBy = user._id;
  const categoryId = await incrementField(TableName, "categoryId", {});
  data.categoryId = categoryId;

  const Record = await generalService.addRecord(TableName, data);
  const RecordObj = await fetchSubCategoryList({ _id: Record._id });
  res.send({
    status: constant.SUCCESS,
    message: "add Record Successfully",
    Record: RecordObj[0],
  });
});

const editRecord = catchAsync(async (req, res) => {
  const data = req.body;

  const Record = await generalService.findAndModifyRecord(TableName, { _id: data._id }, data);
  const RecordObj = await fetchSubCategoryList({ _id: Record._id });
 
  res.send({
    status: constant.SUCCESS,
    message: "update Record Successfully",
    Record: RecordObj[0],
  });
});

const deleteRecord = catchAsync(async (req, res) => {
  const data = req.body;
  const Record = await generalService.deleteRecord(TableName, {
    _id: data._id,
  });

  res.send({
    status: constant.SUCCESS,
    message: "Record Deleted Successfully",
    Record: { _id: data._id },
  });
});

module.exports = {
  getRecord,
  addRecord,
  editRecord,
  deleteRecord,
  getSubCategoryByCategory
};
