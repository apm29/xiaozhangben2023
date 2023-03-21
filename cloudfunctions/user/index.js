// 云函数入口文件
const cloud = require('wx-server-sdk')
const update = require('./update')
const query = require('./query')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.topic) {
    case 'update':
      return await update.main(event, context);
    case 'query':
      return await query.main(event, context);
  }
}