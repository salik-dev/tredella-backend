const generalOperation = require("../services/generalOperation");

const incrementField = (() => {
  let currentIdMap = new Map(); // Map to store the currentId for each tableName and fieldName

  return async (
    tableName,
    fieldName,
    addSerialNumber = 'rc',
    condition = {},
    startFrom = 1
  ) => {
    const key = `${tableName}:${fieldName}`;
    let currentId = currentIdMap.get(key) || startFrom; // Retrieve the currentId from the map or use startFrom
    const Record = await generalOperation.getLimitedAndSortedRecord(
      tableName,
      condition,
      { [fieldName]: -1 },
      1
    );
    if (Record && Record.length > 0) {
      const lastId = Record[0][fieldName];
      const lastSerialNumber = lastId.slice(addSerialNumber.length + 1); // Extract the serial number part
      const lastIdNumeric = parseInt(lastSerialNumber);
      if (!isNaN(lastIdNumeric) && lastId.startsWith(addSerialNumber)) {
        // If lastId already starts with addSerialNumber and is a numeric value
        currentId = lastIdNumeric + 1;
      }
    }
    const newId = `${addSerialNumber}-${currentId}`;
    currentIdMap.set(key, currentId + 1); // Increment currentId for next use
    return newId;
  };
})();


module.exports = {
  incrementField,
};
