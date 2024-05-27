const joi = require("joi");
const { ERROR, VALIDATION_ERROR_MESSAGE } = require("../utils/constant");

const baseSchemaAuctionBid = {
  _id: joi.string().required(),
  name: joi.string().required(),
};

const addCategory = async (req, res, next) => {
  const data = req.body;

  const baseSchema = {
    categoryImage: joi.string().required(),
    name: joi.string().required(),
  };

  const updateKeys = Object.keys(data).filter((key) => baseSchema[key]);

  const dynamicSchema = {};
  updateKeys.forEach((key) => {
    dynamicSchema[key] = baseSchema[key];
  });

  const schema = joi.object(dynamicSchema);

  const { error } = schema.validate(data);
  if (error) {
    res.status(400).send({ status: ERROR, message: VALIDATION_ERROR_MESSAGE });
    return;
  }

  next();
};

const editCategory = async (req, res, next) => {
  const data = req.body;

  const baseSchema = {
    _id: joi.string().required(),
    categoryImage: joi.string().required(),
    name: joi.string().required(),
  };

  const updateKeys = Object.keys(data).filter((key) => baseSchema[key]);

  const dynamicSchema = {};
  updateKeys.forEach((key) => {
    dynamicSchema[key] = baseSchema[key];
  });

  const schema = joi.object(dynamicSchema);

  const { error } = schema.validate(data);
  if (error) {
    res.status(400).send({ status: ERROR, message: VALIDATION_ERROR_MESSAGE });
    return;
  }

  next();
};

module.exports = {
  addCategory,
  editCategory,
};
