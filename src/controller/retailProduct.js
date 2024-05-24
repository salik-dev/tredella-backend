const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { incrementField } = require("../utils/commonFunctions");
const { default: mongoose } = require("mongoose");
const TableName = "RetailerProducts";

const getRecord = catchAsync(async (req, res) => {
  const condition = {};
  const aggregateArray = [
    { $match: condition },
    {
      $lookup: {
        from: "retailcategories",
        let: { categoryId: "$category" },
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
        from: "retailsubcategories",
        let: { subCategoryId: "$subCategory" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$subCategoryId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: "subCategoryDetail",
      },
    },
    {
      $lookup: {
        from: "retailerstores",
        let: { storeId: "$storeId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$storeId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: "storeDetail",
      },
    },
    {
      $project: {
        _id: 1,
        productImages: 1,
        category: 1,
        subCategory: 1,
        subCategoryName: { $arrayElemAt: ["$subCategoryDetail.name", 0] },
        categoryName: { $arrayElemAt: ["$categoryDetail.name", 0] },
        storeName: { $arrayElemAt: ["$storeDetail.name", 0] },
        storeId: 1,
        title: 1,
        price: 1,
        productId: 1,
        quantity: 1,
        deliveryFee: 1,
        minimumDeliveryTime: 1,
        maximumDeliveryTime: 1,
        salePrice: 1,
        categoryFee: 1,
        productColors: 1,
        productSizes: 1,
        createdBy: 1,
        createdAt: 1,
        saleDuration: 1,
        deliveryWeight: 1,
        deliveryService: 1,
        brand: 1,
        childCategory: 1,
        description: 1,
      },
    },
    {
      $sort: { name: 1 },
    },
  ];
  const Record = await generalService.getRecordAggregate(
    TableName,
    aggregateArray
  );
  res.send({
    status: constant.SUCCESS,
    message: "Activity fetch Successfully",
    Record,
  });
});
const getProductByUser = catchAsync(async (req, res) => {
  const user = req.user;
  let condition = { createdBy: user._id };
  const aggregateArray = [
    { $match: condition },
    {
      $lookup: {
        from: "retailcategories",
        let: { categoryId: "$category" },
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
        from: "retailsubcategories",
        let: { subCategoryId: "$subCategory" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$subCategoryId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: "subCategoryDetail",
      },
    },
    {
      $lookup: {
        from: "retailerstores",
        let: { storeId: "$storeId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$storeId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: "storeDetail",
      },
    },
    {
      $project: {
        _id: 1,
        category: 1,
        subCategory: 1,
        subCategoryName: { $arrayElemAt: ["$subCategoryDetail.name", 0] },
        categoryName: { $arrayElemAt: ["$categoryDetail.name", 0] },
        storeName: { $arrayElemAt: ["$storeDetail.name", 0] },
        storeId: 1,
        title: 1,
        price: 1,
        productId: 1,
        quantity: 1,
        deliveryFee: 1,
        minimumDeliveryTime: 1,
        maximumDeliveryTime: 1,
        salePrice: 1,
        categoryFee: 1,
        productColors: 1,
        productSizes: 1,
        createdBy: 1,
        createdAt: 1,
        saleDuration: 1,
        deliveryWeight: 1,
        deliveryService: 1,
        brand: 1,
        childCategory: 1,
        description: 1,
        productImages: 1,
      },
    },
    {
      $sort: { name: 1 },
    },
  ];
  const Record = await generalService.getRecordAggregate(
    TableName,
    aggregateArray
  );
  res.send({
    status: constant.SUCCESS,
    message: "Activity fetch Successfully",
    Record,
  });
});
const addRecord = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;
  const productId = await incrementField(TableName, "productId", "rp", {});
  data.productId = productId;
  data.createdBy = user._id;
  const Record = await generalService.addRecord(TableName, data);
  res.send({
    status: constant.SUCCESS,
    message: "Add Record Successfully",
    Record,
  });
});
const editRecord = catchAsync(async (req, res) => {
  const data = req.body;

  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: data._id },
    data
  );

  res.send({
    status: constant.SUCCESS,
    message: "Update Record Successfully",
    Record,
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
const testSalik = catchAsync(async (req, res) => {
  res.send({
    status: constant.SUCCESS,
    message: "salik api testing done...",
    // Record: { _id: data._id },
  });
});

module.exports = {
  getRecord,
  addRecord,
  editRecord,
  deleteRecord,
  getProductByUser,
  testSalik,
};
