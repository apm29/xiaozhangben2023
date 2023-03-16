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
  const userRes = await users.where({
    openid: wxContext.OPENID
  }).get()
  if (!userRes.data.length) {
    //初始化
    await users.add({
      data: {
        openid: wxContext.OPENID,
        last_visit: new Date(),
        nickname: "记小猿"
      }
    })
    //创建默认账本
    await cloud.callFunction({
      name: "accountBook",
      data: {
        topic: "create",
        payload: {
          name: "默认账本",
          creator_openid: wxContext.OPENID
        }
      }
    })
  } else {
    await users
      .doc(userRes.data[0]._id)
      .update({
        data: {
          last_visit: new Date()
        }
      })
  }

  return {
    success: true,
    msg: "获取用户信息成功",
    data: {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
  }
}