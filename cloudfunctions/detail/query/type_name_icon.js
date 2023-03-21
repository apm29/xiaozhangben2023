const types = require("../dict/types")
function processIconAndName(
  detail,
  expenditure_types,
  income_types,
  unincluded_types
){
  detail.type_item = types.find(it=>it.id === detail.type)
  const typeDict = {
    [1]: expenditure_types,
    [2]: income_types,
    [3]: unincluded_types
  };
  const subDict = typeDict[detail.type] || []
  detail.sub_type_item = subDict.find(it=> it.id === detail.sub_type)
  return detail;
}
module.exports = {
  processIconAndName,
}