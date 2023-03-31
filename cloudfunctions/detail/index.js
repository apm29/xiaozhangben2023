// 云函数入口文件
const cloud = require('wx-server-sdk')
const create = require("./create")
const edit = require("./edit")
const query = require("./query")
const deleteModule = require("./delete")
const queryMonthTotal = require("./query-month-total")
const queryMonthComposition = require("./query-month-composition")
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.topic) {
    case 'create':
      return await create.main(event, context);
    case 'edit':
      return await edit.main(event, context);
    case 'query':
      return await query.main(event, context);
    case 'delete':
      return await deleteModule.main(event, context);
    case 'query-month-total':
      return await queryMonthTotal.main(event, context);
      case 'query-month-composition':
        return await queryMonthComposition.main(event, context);
  }
}