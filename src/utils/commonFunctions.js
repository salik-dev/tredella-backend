const generalOperation = require("../services/generalOperation");

const incrementField = async (tableName, filedName, condition, startFrom=1) => {
  let currentId = startFrom;
  const Record = await generalOperation.getLimitedAndSortedRecord(tableName, condition, { [filedName]: -1 }, 1);
  if (Record && Record.length > 0) {
    currentId = Record[0][filedName] + 1;
  }

  return currentId;
};

module.exports = {
  incrementField,
};
