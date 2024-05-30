const catchAsync = require("../utils/catchAsync");
const constant = require("../updateUtils/constant");
const { addRecord, getRecordAndSort, findAndModifyRecord, removeRecord } = require("../updateServices/commonOperation");
const modelName = "Category";

const addCategory = catchAsync(async (req, res) => {
  const {name} = req.body;
  // Need to implement Global Validation Utils ==> pending
  const catecory = await addRecord(modelName, {name});

  res.status(constant.STATUS_OK).json({
    message: "Category created successfull",
    Record: catecory
  });

});

const updateCategory = catchAsync(async (req, res, next) => {
  const {id, name} = req.body;
  const categoryRecord = await findAndModifyRecord(
    modelName,
    { _id: id },
    {name}
  );

  res.status(200).send({
    status: constant.SUCCESS,
    message: "Category updated successfull",
    Record: categoryRecord,
  });
});

const getCategory = catchAsync(async (req, res) => {
  // const user = req.user; // use when JWT auth active
  // const {id} = req.params;
 const condition = {}
  //   { $match: { _id: id } },
  //   {
  //     $project: {
  //       fullName: 1,
  //       userName: 1,
  //       email: 1,
  //       phoneNumber: 1,
  //       status: 1,
  //       role: 1,
  //     },
  //   },
  // ];
  // let Record = await generalService.getRecordAggregate(modelName, aggregateArr);
  const Record = await getRecordAndSort(modelName, condition)

  res.send({
    status: constant.SUCCESS,
    message: "Record fetch Successfully",
    Record
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const {id} = req.body;

  const Record = await removeRecord(modelName, {
    _id: id,
  });

  res.send({
    status: constant.SUCCESS,
    message: constant.DELETE_RECORD,
    Record,
  });
});

module.exports = {
  addCategory,
  updateCategory,
  getCategory,
  deleteCategory,
};
