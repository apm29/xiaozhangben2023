// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const users = db.collection("users")

  //添加访问日志
  await users.where({
    openid: wxContext.OPENID
  }).update({
    data:{
      avatar_url: event.payload.avatar_url,
      nickname: event.payload.nickname,
    }
  });

  
  return {
    success: true,
    msg: "更新用户信息成功"
  }
}