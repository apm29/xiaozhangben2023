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
        nickname: "记小猿",
        avatar_url: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0"
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

  const { data:newUserRes } = await users.where({
    openid: wxContext.OPENID
  }).get()

  return {
    success: true,
    msg: "获取用户信息成功",
    data: {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
      avatar_url: newUserRes[0].avatar_url,
      nickname: newUserRes[0].nickname
    }
  }
}