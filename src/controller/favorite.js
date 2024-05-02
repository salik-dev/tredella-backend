const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const TableName = "favorite";

const addFavorite = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;
  data.favoriteBy = user._id;
  const Record = await generalService.addRecord(TableName, data);

  res.status(200).send({
    status: constant.SUCCESS,
    message: "Added To Favorite successfully",
    Record,
  });
});

const getFavorite = catchAsync(async (req, res) => {
  const data = req.body;
});

module.exports = {
  addFavorite,
  getFavorite,
};
