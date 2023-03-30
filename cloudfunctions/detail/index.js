// 云函数入口文件
const cloud = require('wx-server-sdk')
const create = require("./create")
const query = require("./query")
const queryMonthTotal = require("./query-month-total")

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.topic) {
    case 'create':
      return await create.main(event, context);
    case 'query':
      return await query.main(event, context);
    case 'query-month-total':
      return await queryMonthTotal.main(event, context);
  }
}